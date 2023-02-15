import { FFmpegState } from "../ffmpegState";
import { FilterChain } from "../filterChain";
import { FrameDataLocation } from "../frameDataLocation";
import { FrameState } from "../frameState";
import { HardwareAccelerationMode } from "../hardwareAccelerationMode";
import { PipelineStep } from "../interfaces/pipelineStep";
import { VideoStream } from "../mediaStream";
import { PipelineBuilderBase } from "./pipelineBuilderBase";
import { ScaleFilter } from "../filter/scaleFilter";
import { PadFilter } from "../filter/padFilter";

export class SoftwarePipelineBuilder extends PipelineBuilderBase {
    protected setAccelState(ffmpegState: FFmpegState): void {
        ffmpegState.decoderHardwareAccelerationMode = HardwareAccelerationMode.None;
        ffmpegState.encoderHardwareAccelerationMode = HardwareAccelerationMode.None;
    }

    protected setDecoder(videoStream: VideoStream, _ffmpegState: FFmpegState, _pipelineSteps: PipelineStep[]): void {
        const decoder = this.getSoftwareDecoder(videoStream);
        this.videoInputFile.addOption(decoder);
    }

    protected setVideoFilters(
        videoStream: VideoStream,
        ffmpegState: FFmpegState,
        desiredState: FrameState,
        _pipelineSteps: PipelineStep[],
        filterChain: FilterChain
    ): void {
        const currentState = { ...desiredState };
        currentState.frameDataLocation = FrameDataLocation.Software;

        // set deinterlace

        this.setScale(videoStream, desiredState, currentState);
        this.setPad(currentState, desiredState);

        // set watermark

        // apply encoder
        const encoder = this.getEncoder(ffmpegState, currentState, desiredState);
        _pipelineSteps.push(encoder);
        this.videoInputFile.filterSteps.push(encoder);

        filterChain.videoFilterSteps.push(...this.videoInputFile.filterSteps);
    }

    private setScale(videoStream: VideoStream, desiredState: FrameState, currentState: FrameState): void {
        if (videoStream.frameSize.equals(desiredState.scaledSize) == false) {
            console.log("should scale...");
            const scaleStep = new ScaleFilter(currentState, desiredState.scaledSize, desiredState.paddedSize);

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
