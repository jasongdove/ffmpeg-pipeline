import { EnvironmentVariable } from "../interfaces/environmentVariable";
import { PipelineStep } from "../interfaces/pipelineStep";

export abstract class GlobalOption implements PipelineStep {
    environmentVariables = new Array<EnvironmentVariable>();
    abstract globalOptions: Array<string>;
    filterOptions = new Array<string>();
    outputOptions = new Array<string>();
}
