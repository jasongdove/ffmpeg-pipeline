import { FFmpegState } from "../ffmpegState";
import { FilterChain } from "../filterChain";
import { FrameDataLocation } from "../frameDataLocation";
import { FrameState } from "../frameState";
import { HardwareAccelerationMode } from "../hardwareAccelerationMode";
import { PipelineStep } from "../interfaces/pipelineStep";
import { VideoStream } from "../mediaStream";
import { PipelineBuilderBase } from "./pipelineBuilderBase";
import { DeinterlaceFilter } from "../filter/deinterlaceFilter";
import { ScaleFilter } from "../filter/scaleFilter";
import { PadFilter } from "../filter/padFilter";
import { Decoder } from "../interfaces/decoder";

export class SoftwarePipelineBuilder extends PipelineBuilderBase {
    protected setAccelState(
        _videoStream: VideoStream,
        ffmpegState: FFmpegState,
        _desiredState: FrameState,
        _pipelineSteps: Array<PipelineStep>
    ): void {
        ffmpegState.decoderHardwareAccelerationMode = HardwareAccelerationMode.None;
        ffmpegState.encoderHardwareAccelerationMode = HardwareAccelerationMode.None;
    }

    protected setDecoder(
        videoStream: VideoStream,
        _ffmpegState: FFmpegState,
        _pipelineSteps: PipelineStep[]
    ): Decoder | null {
        const decoder = this.getSoftwareDecoder(videoStream);
        this.videoInputFile.addOption(decoder);
        return decoder;
    }

    protected setVideoFilters(
        videoStream: VideoStream,
        _maybeDecoder: Decoder | null,
        ffmpegState: FFmpegState,
        desiredState: FrameState,
        pipelineSteps: PipelineStep[],
        filterChain: FilterChain
    ): void {
        const currentState = { ...desiredState };
        currentState.frameDataLocation = FrameDataLocation.Software;
        currentState.isAnamorphic = videoStream.isAnamorphic;
        currentState.scaledSize = videoStream.frameSize;
        currentState.paddedSize = videoStream.frameSize;

        this.setDeinterlace(ffmpegState, currentState, desiredState);
        this.setScale(videoStream, ffmpegState, currentState, desiredState);
        this.setPad(currentState, desiredState);

        // set watermark

        // apply encoder
        const encoder = this.getEncoder(ffmpegState, currentState, desiredState);
        pipelineSteps.push(encoder);
        this.videoInputFile.filterSteps.push(encoder);

        filterChain.videoFilterSteps.push(...this.videoInputFile.filterSteps);
    }

    private setDeinterlace(ffmpegState: FFmpegState, currentState: FrameState, desiredState: FrameState): void {
        if (desiredState.interlaced) {
            this.videoInputFile.filterSteps.push(new DeinterlaceFilter(ffmpegState, currentState));
        }
    }

    private setScale(
        videoStream: VideoStream,
        ffmpegState: FFmpegState,
        currentState: FrameState,
        desiredState: FrameState
    ): void {
        if (videoStream.frameSize.equals(desiredState.scaledSize) == false) {
            const scaleStep = new ScaleFilter(
                ffmpegState,
                currentState,
                desiredState.scaledSize,
                desiredState.paddedSize
            );

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
}
