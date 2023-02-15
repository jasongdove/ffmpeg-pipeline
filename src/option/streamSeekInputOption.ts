import { AudioInputFile, InputFile, VideoInputFile } from "../inputFile";
import { EnvironmentVariable } from "../interfaces/environmentVariable";
import { InputOption } from "../interfaces/inputOption";

export class StreamSeekInputOption implements InputOption {
    constructor(private start: string) {}

    inputOptions(_inputFile: InputFile): Array<string> {
        return new Array<string>("-ss", this.start);
    }

    appliesToAudio(_audioInputFile: AudioInputFile): boolean {
        return true;
    }

    appliesToVideo(_videoInputFile: VideoInputFile): boolean {
        // TODO: we shouldn't seek into a still image,
        // but unsure whether this lib will deal with still images
        return true;
    }

    environmentVariables = new Array<EnvironmentVariable>();
    globalOptions = new Array<string>();
    filterOptions = new Array<string>();
    outputOptions = new Array<string>();
}
