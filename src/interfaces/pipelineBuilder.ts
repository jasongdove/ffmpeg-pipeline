import { FFmpegPipeline } from "../ffmpegPipeline";
import { FFmpegState } from "../ffmpegState";
import { FrameState } from "../frameState";

export interface PipelineBuilder {
    build(ffmpegState: FFmpegState, desiredState: FrameState): FFmpegPipeline;
}
