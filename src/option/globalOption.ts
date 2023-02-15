import { InputFile } from "../inputFile";
import { EnvironmentVariable } from "../interfaces/environmentVariable";
import { PipelineStep } from "../interfaces/pipelineStep";

export abstract class GlobalOption implements PipelineStep {
    inputOptions(_inputFile: InputFile): string[] {
        return new Array<string>();
    }
    environmentVariables = new Array<EnvironmentVariable>();
    abstract globalOptions: Array<string>;
    filterOptions = new Array<string>();
    outputOptions = new Array<string>();
}
