import { PipelineFilterStep } from "./pipelineFilterStep";
import { StreamKind } from "../streamKind";

export interface Encoder extends PipelineFilterStep {
    name: string;
    kind: StreamKind;
}
