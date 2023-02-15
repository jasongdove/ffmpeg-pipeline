import { EnvironmentVariable } from "../interfaces/environmentVariable";
import { PipelineStep } from "../interfaces/pipelineStep";
import { InputFile } from "../inputFile";

export abstract class OutputOption implements PipelineStep {
    environmentVariables = new Array<EnvironmentVariable>();
    globalOptions = new Array<string>();
    filterOptions = new Array<string>();
    abstract outputOptions: Array<string>;
    inputOptions(_inputFile: InputFile): Array<string> {
        return new Array<string>();
    }
}
