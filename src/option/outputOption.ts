import { EnvironmentVariable } from "../interfaces/environmentVariable";
import { PipelineStep } from "../interfaces/pipelineStep";
import { InputFile } from "../inputFile";

export abstract class OutputOption implements PipelineStep {
    inputOptions(_inputFile: InputFile): string[] {
        return new Array<string>();
    }
    environmentVariables = new Array<EnvironmentVariable>();
    globalOptions = new Array<string>();
    filterOptions = new Array<string>();
    abstract outputOptions: Array<string>;
}
