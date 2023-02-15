import { Decoder } from "../interfaces/decoder";
import { FrameDataLocation } from "../frameDataLocation";
import { AudioInputFile, VideoInputFile, InputFile } from "../inputFile";
import { EnvironmentVariable } from "../interfaces/environmentVariable";

export abstract class DecoderBase implements Decoder {
    abstract name: string;

    environmentVariables = new Array<EnvironmentVariable>();
    globalOptions = new Array<string>();
    filterOptions = new Array<string>();
    outputOptions = new Array<string>();

    protected abstract outputFrameDataLocation: FrameDataLocation;

    appliesToAudio(_audioInputFile: AudioInputFile): boolean {
        return false;
    }

    appliesToVideo(_videoInputFile: VideoInputFile): boolean {
        return true;
    }

    inputOptions(_inputFile: InputFile): Array<string> {
        return new Array<string>("-c:v", this.name);
    }
}
