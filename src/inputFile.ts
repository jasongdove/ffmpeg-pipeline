import { InputOption } from "./interfaces/inputOption";
import { PipelineFilterStep } from "./interfaces/pipelineFilterStep";
import { AudioStream, VideoStream } from "./mediaStream";
import { AudioState } from "./state/audioState";

export abstract class InputFile {
    public inputOptions = new Array<InputOption>();
    public filterSteps = new Array<PipelineFilterStep>();
}

export class AudioInputFile extends InputFile {
    constructor(public path: string, public audioStreams: Array<AudioStream>, public desiredState: AudioState) {
        super();
    }

    addOption(option: InputOption): void {
        if (option.appliesToAudio(this)) {
            this.inputOptions.push(option);
        }
    }
}

export class VideoInputFile extends InputFile {
    constructor(public path: string, public videoStreams: Array<VideoStream>) {
        super();
    }

    addOption(option: InputOption): void {
        if (option.appliesToVideo(this)) {
            this.inputOptions.push(option);
        }
    }
}
