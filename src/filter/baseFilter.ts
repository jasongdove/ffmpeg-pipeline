import { FrameState } from "../frameState";
import { InputFile } from "../inputFile";
import { EnvironmentVariable } from "../interfaces/environmentVariable";
import { PipelineFilterStep } from "../interfaces/pipelineFilterStep";

export abstract class BaseFilter implements PipelineFilterStep {
    abstract filter: string;

    environmentVariables = new Array<EnvironmentVariable>();
    globalOptions = new Array<string>();
    filterOptions = new Array<string>();
    outputOptions = new Array<string>();

    abstract nextState(currentState: FrameState): void;

    inputOptions(_inputFile: InputFile): Array<string> {
        return new Array<string>();
    }
}
