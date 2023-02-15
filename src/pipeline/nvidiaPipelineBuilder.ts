import { FFmpegState } from "../ffmpegState";
import { FilterChain } from "../filterChain";
import { VideoFormat } from "../format/videoFormat";
import { FrameState } from "../frameState";
import { HardwareAccelerationMode } from "../hardwareAccelerationMode";
import { PipelineStep } from "../interfaces/pipelineStep";
import { VideoStream } from "../mediaStream";
import { PipelineBuilderBase } from "./pipelineBuilderBase";
import { CudaHardwareAccelerationOption } from "../option/hardwareAcceleration/cudaHardwareAccelerationOption";
import { FrameDataLocation } from "../frameDataLocation";
import { Encoder } from "../interfaces/encoder";
import { EncoderH264Nvenc } from "../encoder/nvenc/encoderH264Nvenc";
import { EncoderHevcNvenc } from "../encoder/nvenc/encoderHevcNvenc";
import { DeinterlaceFilter } from "../filter/deinterlaceFilter";
import { BaseFilter } from "../filter/baseFilter";
import { YadifCudaFilter } from "../filter/cuda/yadifCudaFilter";
import { ScaleFilter } from "../filter/scaleFilter";
import { ScaleCudaFilter } from "../filter/cuda/scaleCudaFilter";
import { PadFilter } from "../filter/padFilter";

export class NvidiaPipelineBuilder extends PipelineBuilderBase {
    protected setAccelState(
        videoStream: VideoStream,
        ffmpegState: FFmpegState,
        desiredState: FrameState,
        pipelineSteps: Array<PipelineStep>
    ): void {
        let canDecode = false;
        const canEncode = true;

        // TODO: check whether can decode and can encode based on capabilities

        // mpeg2_cuvid seems to have issues when yadif_cuda is used, so just use software decoding
        if (desiredState.interlaced && videoStream.codec == VideoFormat.Mpeg2Video) {
            canDecode = false;
        }

        if (canDecode || canEncode) {
            pipelineSteps.push(new CudaHardwareAccelerationOption());
        }

        ffmpegState.decoderHardwareAccelerationMode = canDecode
            ? HardwareAccelerationMode.Nvenc
            : HardwareAccelerationMode.None;
        ffmpegState.encoderHardwareAccelerationMode = canEncode
            ? HardwareAccelerationMode.Nvenc
            : HardwareAccelerationMode.None;
    }

    protected setDecoder(videoStream: VideoStream, _ffmpegState: FFmpegState, _pipelineSteps: PipelineStep[]): void {
        const decoder = this.getSoftwareDecoder(videoStream);
        if (decoder != null) {
            this.videoInputFile.addOption(decoder);
        }
    }

    protected setVideoFilters(
        videoStream: VideoStream,
        ffmpegState: FFmpegState,
        desiredState: FrameState,
        pipelineSteps: PipelineStep[],
        filterChain: FilterChain
    ): void {
        const currentState = { ...desiredState };
        currentState.isAnamorphic = videoStream.isAnamorphic;
        currentState.scaledSize = videoStream.frameSize;
        currentState.paddedSize = videoStream.frameSize;
        currentState.frameDataLocation =
            ffmpegState.decoderHardwareAccelerationMode == HardwareAccelerationMode.Nvenc
                ? FrameDataLocation.Hardware
                : FrameDataLocation.Software;

        this.setDeinterlace(ffmpegState, currentState, desiredState);
        this.setScale(ffmpegState, currentState, desiredState);
        this.setPad(currentState, desiredState);

        let encoder: Encoder | null = null;
        if (ffmpegState.encoderHardwareAccelerationMode == HardwareAccelerationMode.Nvenc) {
            switch (desiredState.videoFormat) {
                case VideoFormat.Hevc:
                    encoder = new EncoderHevcNvenc();
                    break;
                case VideoFormat.H264:
                    encoder = new EncoderH264Nvenc();
                    break;
            }
        }

        if (encoder == null) {
            encoder = this.getSoftwareEncoder(currentState, desiredState);
        }

        if (encoder != null) {
            pipelineSteps.push(encoder);
            this.videoInputFile.filterSteps.push(encoder);
        }

        filterChain.videoFilterSteps.push(...this.videoInputFile.filterSteps);
    }

    private setDeinterlace(ffmpegState: FFmpegState, currentState: FrameState, desiredState: FrameState): void {
        if (desiredState.interlaced) {
            let filter: BaseFilter;

            if (currentState.frameDataLocation == FrameDataLocation.Software) {
                filter = new DeinterlaceFilter(ffmpegState, currentState);
            } else {
                filter = new YadifCudaFilter(currentState);
            }

            filter.nextState(currentState);
            this.videoInputFile.filterSteps.push(filter);
        }
    }

    private setScale(ffmpegState: FFmpegState, currentState: FrameState, desiredState: FrameState): void {
        let scaleStep: BaseFilter;

        const needsToScale = currentState.scaledSize.equals(desiredState.scaledSize) == false;
        const onlySoftware =
            ffmpegState.decoderHardwareAccelerationMode == HardwareAccelerationMode.None &&
            ffmpegState.encoderHardwareAccelerationMode == HardwareAccelerationMode.None;

        // probably not worth uploading to immediately download and pad
        const lotsOfSoftware =
            currentState.frameDataLocation == FrameDataLocation.Software &&
            desiredState.scaledSize.equals(desiredState.paddedSize) == false;

        if (needsToScale && (onlySoftware || lotsOfSoftware)) {
            scaleStep = new ScaleFilter(ffmpegState, currentState, desiredState.scaledSize, desiredState.paddedSize);
        } else {
            scaleStep = new ScaleCudaFilter(currentState, desiredState.scaledSize, desiredState.paddedSize);
        }

        if (!this.isNullOrWhitespace(scaleStep.filter)) {
            scaleStep.nextState(currentState);
            this.videoInputFile.filterSteps.push(scaleStep);
        }
    }

    private setPad(currentState: FrameState, desiredState: FrameState): void {
        if (currentState.paddedSize.equals(desiredState.paddedSize) == false) {
            const padStep = new PadFilter(currentState, desiredState.paddedSize);

            padStep.nextState(currentState);

            this.videoInputFile.filterSteps.push(padStep);
        }
    }

    private isNullOrWhitespace(val: string): boolean {
        return val == null || val.trim() == "";
    }
}
