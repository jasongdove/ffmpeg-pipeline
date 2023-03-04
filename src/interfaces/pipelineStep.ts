import { EnvironmentVariable } from "./environmentVariable";
import { InputFile } from "../inputFile";
import { FrameState } from "../frameState";

export interface PipelineStep {
    environmentVariables: Array<EnvironmentVariable>;
    globalOptions: Array<string>;
    filterOptions: Array<string>;
    outputOptions: Array<string>;
    inputOptions(inputFile: InputFile): Array<string>;
    nextState(currentState: FrameState): void;
}
