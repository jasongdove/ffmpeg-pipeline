import { Decoder } from "../interfaces/decoder";
import { FrameDataLocation } from "../frameDataLocation";
import { AudioInputFile, VideoInputFile, InputFile } from "../inputFile";
import { EnvironmentVariable } from "../interfaces/environmentVariable";
import { FrameState } from "../frameState";

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

    nextState(currentState: FrameState): void {
        currentState.frameDataLocation = this.outputFrameDataLocation;
    }

    protected inputBitDepth(inputFile: InputFile): number {
        let bitDepth = 8;

        if (inputFile instanceof VideoInputFile) {
            const stream = (inputFile as VideoInputFile).videoStreams[0];
            if (stream.pixelFormat != null) {
                bitDepth = stream.pixelFormat.bitDepth;
            }
        }

        return bitDepth;
    }
}
