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
import { Decoder } from "../interfaces/decoder";
import { DecoderH264Cuvid } from "../decoder/cuvid/decoderH264Cuvid";
import { DecoderHevcCuvid } from "../decoder/cuvid/decoderHevcCuvid";
import { DecoderMpeg4Cuvid } from "../decoder/cuvid/decoderMpeg4Cuvid";
import { DecoderVc1Cuvid } from "../decoder/cuvid/decoderVc1Cuvid";
import { DecoderVp9Cuvid } from "../decoder/cuvid/decoderVp9Cuvid";
import { PixelFormatNv12 } from "../format/pixelFormatNv12";
import { PixelFormat } from "../interfaces/pixelFormat";

export class NvidiaPipelineBuilder extends PipelineBuilderBase {
    protected setAccelState(
        videoStream: VideoStream,
        ffmpegState: FFmpegState,
        desiredState: FrameState,
        pipelineSteps: Array<PipelineStep>
    ): void {
        let canDecode = true;
        const canEncode = true;

        // TODO: check whether can decode and can encode based on capabilities
        // minimal check for now, h264_cuvid doesn't support 10-bit
        if (videoStream.codec == VideoFormat.H264 && videoStream.pixelFormat?.bitDepth == 10) {
            canDecode = false;
        }

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

    protected setDecoder(
        videoStream: VideoStream,
        ffmpegState: FFmpegState,
        _pipelineSteps: PipelineStep[]
    ): Decoder | null {
        let decoder: Decoder | null = null;
        if (ffmpegState.decoderHardwareAccelerationMode == HardwareAccelerationMode.Nvenc) {
            switch (videoStream.codec) {
                case VideoFormat.H264:
                    decoder = new DecoderH264Cuvid(HardwareAccelerationMode.Nvenc);
                    break;
                case VideoFormat.Hevc:
                    decoder = new DecoderHevcCuvid(HardwareAccelerationMode.Nvenc);
                    break;
                case VideoFormat.Mpeg4:
                    decoder = new DecoderMpeg4Cuvid(HardwareAccelerationMode.Nvenc);
                    break;
                case VideoFormat.Vc1:
                    decoder = new DecoderVc1Cuvid(HardwareAccelerationMode.Nvenc);
                    break;
                case VideoFormat.Vp9:
                    decoder = new DecoderVp9Cuvid(HardwareAccelerationMode.Nvenc);
                    break;
            }
        }

        if (decoder == null) {
            decoder = this.getSoftwareDecoder(videoStream);
        }

        if (decoder != null) {
            this.videoInputFile.addOption(decoder);
        }

        return decoder;
    }

    protected setVideoFilters(
        videoStream: VideoStream,
        maybeDecoder: Decoder | null,
        ffmpegState: FFmpegState,
        desiredState: FrameState,
        pipelineSteps: PipelineStep[],
        filterChain: FilterChain
    ): void {
        const currentState = { ...desiredState };
        currentState.isAnamorphic = videoStream.isAnamorphic;
        currentState.scaledSize = videoStream.frameSize;
        currentState.paddedSize = videoStream.frameSize;

        if (maybeDecoder != null) {
            maybeDecoder.nextState(currentState);
        }

        this.setDeinterlace(ffmpegState, currentState, desiredState);
        this.setScale(ffmpegState, currentState, desiredState);
        this.setPad(videoStream, currentState, desiredState);

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
        if (!needsToScale) {
            return;
        }

        const decodeToSoftware = ffmpegState.decoderHardwareAccelerationMode == HardwareAccelerationMode.None;
        const softwareEncoder = ffmpegState.encoderHardwareAccelerationMode == HardwareAccelerationMode.None;
        const noHardwareFilters = desiredState.interlaced == false;
        const needsToPad = currentState.paddedSize.equals(desiredState.paddedSize) == false;

        if (decodeToSoftware && (needsToPad || noHardwareFilters) && softwareEncoder) {
            scaleStep = new ScaleFilter(ffmpegState, currentState, desiredState.scaledSize, desiredState.paddedSize);
        } else {
            scaleStep = new ScaleCudaFilter(currentState, desiredState.scaledSize, desiredState.paddedSize);
        }

        if (!this.isNullOrWhitespace(scaleStep.filter)) {
            scaleStep.nextState(currentState);
            this.videoInputFile.filterSteps.push(scaleStep);
        }
    }

    private setPad(videoStream: VideoStream, currentState: FrameState, desiredState: FrameState): void {
        if (currentState.paddedSize.equals(desiredState.paddedSize) == false) {
            // TODO: move this into current/desired state, but see if it works here for now
            const pixelFormat: PixelFormat | null =
                videoStream.pixelFormat != null && videoStream.pixelFormat.bitDepth == 8
                    ? new PixelFormatNv12(videoStream.pixelFormat.name)
                    : videoStream.pixelFormat;

            const padStep = new PadFilter(currentState, desiredState.paddedSize, pixelFormat);

            padStep.nextState(currentState);

            this.videoInputFile.filterSteps.push(padStep);
        }
    }

    private isNullOrWhitespace(val: string): boolean {
        return val == null || val.trim() == "";
    }
}
