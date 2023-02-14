import { PipelineStep } from "./interfaces/pipelineStep";

export class FFmpegPipeline {
    constructor(public pipelineSteps: Array<PipelineStep>) {}
}
