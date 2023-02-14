import { EnvironmentVariable } from "../interfaces/environmentVariable";
import { PipelineStep } from "../interfaces/pipelineStep";

export abstract class OutputOption implements PipelineStep {
    environmentVariables = new Array<EnvironmentVariable>();
    globalOptions = new Array<string>();
    filterOptions = new Array<string>();
    abstract outputOptions: Array<string>;
}
