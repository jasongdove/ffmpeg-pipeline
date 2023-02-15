import { PipelineStep } from "./pipelineStep";

export interface PipelineFilterStep extends PipelineStep {
    filter: string;
}
