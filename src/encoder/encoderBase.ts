import { Encoder } from "../interfaces/encoder";
import { EnvironmentVariable } from "../interfaces/environmentVariable";
import { InputFile } from "../inputFile";
import { StreamKind } from "../streamKind";
import { FrameState } from "../frameState";

export abstract class EncoderBase implements Encoder {
    constructor(public name: string, public kind: StreamKind) {}

    environmentVariables = new Array<EnvironmentVariable>();
    globalOptions = new Array<string>();
    filterOptions = new Array<string>();
    outputOptions = new Array<string>(this.optionForKind(), this.name);
    filter: string = "";
    inputOptions(_inputFile: InputFile): Array<string> {
        return new Array<string>();
    }
    nextState(_currentState: FrameState): void {}
    private optionForKind(): string {
        switch (this.kind) {
            case StreamKind.Video:
                return "-c:v";
            case StreamKind.Audio:
                return "-c:a";
            default:
                // TODO: throw an error?
                return "-c:x";
        }
    }
}
