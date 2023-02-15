import { EnvironmentVariable } from "./environmentVariable";
import { InputFile } from "../inputFile";

export interface PipelineStep {
    environmentVariables: Array<EnvironmentVariable>;
    globalOptions: Array<string>;
    filterOptions: Array<string>;
    outputOptions: Array<string>;
    inputOptions(inputFile: InputFile): Array<string>;
}
