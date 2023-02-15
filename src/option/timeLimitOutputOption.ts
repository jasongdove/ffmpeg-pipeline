import { InputFile } from "../inputFile";
import { EnvironmentVariable } from "../interfaces/environmentVariable";
import { PipelineStep } from "../interfaces/pipelineStep";

export class TimeLimitOutputOption implements PipelineStep {
    constructor(private finish: string) {}

    environmentVariables = new Array<EnvironmentVariable>();
    globalOptions = new Array<string>();
    filterOptions = new Array<string>();
    outputOptions = new Array<string>("-t", this.finish);
    inputOptions(_inputFile: InputFile): Array<string> {
        return new Array<string>();
    }
}
