import { FFmpegState } from "../ffmpegState";
import { FilterChain } from "../filterChain";
import { FrameDataLocation } from "../frameDataLocation";
import { FrameState } from "../frameState";
import { HardwareAccelerationMode } from "../hardwareAccelerationMode";
import { PipelineStep } from "../interfaces/pipelineStep";
import { VideoStream } from "../mediaStream";
import { PipelineBuilderBase } from "./pipelineBuilderBase";

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
        _videoStream: VideoStream,
        ffmpegState: FFmpegState,
        desiredState: FrameState,
        _pipelineSteps: PipelineStep[],
        filterChain: FilterChain
    ): void {
        const currentState = { ...desiredState };
        currentState.frameDataLocation = FrameDataLocation.Software;

        // set deinterlace
        // set scale
        // set pad
        // set watermark
        // apply encoder
        const encoder = this.getEncoder(ffmpegState, currentState, desiredState);
        _pipelineSteps.push(encoder);
        this.videoInputFile.filterSteps.push(encoder);

        filterChain.videoFilterSteps.push(...this.videoInputFile.filterSteps);
    }
}
