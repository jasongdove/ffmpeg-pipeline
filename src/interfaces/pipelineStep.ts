import { EnvironmentVariable } from "./environmentVariable";

export interface PipelineStep {
    environmentVariables: Array<EnvironmentVariable>;
    globalOptions: Array<string>;
    filterOptions: Array<string>;
    outputOptions: Array<string>;
}
