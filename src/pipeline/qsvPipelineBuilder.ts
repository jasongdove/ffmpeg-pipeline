import { FFmpegState } from "../ffmpegState";
import { FilterChain } from "../filterChain";
import { VideoFormat } from "../format/videoFormat";
import { FrameState } from "../frameState";
import { HardwareAccelerationMode } from "../hardwareAccelerationMode";
import { PipelineStep } from "../interfaces/pipelineStep";
import { VideoStream } from "../mediaStream";
import { PipelineBuilderBase } from "./pipelineBuilderBase";
import { QsvHardwareAccelerationOption } from "../option/hardwareAcceleration/qsvHardwareAccelerationOption";
import { FrameDataLocation } from "../frameDataLocation";
import { Encoder } from "../interfaces/encoder";
import { EncoderH264Qsv } from "../encoder/qsv/encoderH264Qsv";
import { EncoderHevcQsv } from "../encoder/qsv/encoderHevcQsv";
import { EncoderMpeg2Qsv } from "../encoder/qsv/encoderMpeg2Qsv";
import { DeinterlaceFilter } from "../filter/deinterlaceFilter";
import { BaseFilter } from "../filter/baseFilter";
import { DeinterlaceQsvFilter } from "../filter/qsv/deinterlaceQsvFilter";
import { ScaleFilter } from "../filter/scaleFilter";
import { ScaleQsvFilter } from "../filter/qsv/scaleQsvFilter";
import { PadFilter } from "../filter/padFilter";
import { Decoder } from "../interfaces/decoder";
import { DecoderH264Qsv } from "../decoder/qsv/decoderH264Qsv";
import { DecoderHevcQsv } from "../decoder/qsv/decoderHevcQsv";
import { DecoderMpeg2Qsv } from "../decoder/qsv/decoderMpeg2Qsv";
import { DecoderVc1Qsv } from "../decoder/qsv/decoderVc1Qsv";
import { DecoderVp9Qsv } from "../decoder/qsv/decoderVp9Qsv";

export class QsvPipelineBuilder extends PipelineBuilderBase {
    protected setAccelState(
        videoStream: VideoStream,
        ffmpegState: FFmpegState,
        _desiredState: FrameState,
        pipelineSteps: Array<PipelineStep>
    ): void {
        let canDecode = true;
        const canEncode = true;

        // TODO: vaapi device
        pipelineSteps.push(new QsvHardwareAccelerationOption(ffmpegState.vaapiDevice));

        // TODO: check whether can decode and can encode based on capabilities
        // minimal check for now, h264/hevc have issues with 10-bit
        if (
            (videoStream.codec == VideoFormat.H264 || videoStream.codec == VideoFormat.Hevc) &&
            videoStream.pixelFormat?.bitDepth == 10
        ) {
            canDecode = false;
        }

        ffmpegState.decoderHardwareAccelerationMode = canDecode
            ? HardwareAccelerationMode.Qsv
            : HardwareAccelerationMode.None;
        ffmpegState.encoderHardwareAccelerationMode = canEncode
            ? HardwareAccelerationMode.Qsv
            : HardwareAccelerationMode.None;
    }

    protected setDecoder(
        videoStream: VideoStream,
        ffmpegState: FFmpegState,
        _pipelineSteps: PipelineStep[]
    ): Decoder | null {
        let decoder: Decoder | null = null;
        if (ffmpegState.decoderHardwareAccelerationMode == HardwareAccelerationMode.Qsv) {
            switch (videoStream.codec) {
                case VideoFormat.H264:
                    decoder = new DecoderH264Qsv();
                    break;
                case VideoFormat.Hevc:
                    decoder = new DecoderHevcQsv();
                    break;
                case VideoFormat.Mpeg2Video:
                    decoder = new DecoderMpeg2Qsv();
                    break;
                case VideoFormat.Vc1:
                    decoder = new DecoderVc1Qsv();
                    break;
                case VideoFormat.Vp9:
                    decoder = new DecoderVp9Qsv();
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
        this.setScale(videoStream, ffmpegState, currentState, desiredState);
        this.setPad(currentState, desiredState);

        let encoder: Encoder | null = null;
        if (ffmpegState.encoderHardwareAccelerationMode == HardwareAccelerationMode.Qsv) {
            switch (desiredState.videoFormat) {
                case VideoFormat.Hevc:
                    encoder = new EncoderHevcQsv();
                    break;
                case VideoFormat.H264:
                    encoder = new EncoderH264Qsv();
                    break;
                case VideoFormat.Mpeg2Video:
                    encoder = new EncoderMpeg2Qsv();
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
                filter = new DeinterlaceQsvFilter(currentState);
            }

            filter.nextState(currentState);
            this.videoInputFile.filterSteps.push(filter);
        }
    }

    private setScale(
        videoStream: VideoStream,
        ffmpegState: FFmpegState,
        currentState: FrameState,
        desiredState: FrameState
    ): void {
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
            scaleStep = new ScaleQsvFilter(videoStream, currentState, desiredState.scaledSize);
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
