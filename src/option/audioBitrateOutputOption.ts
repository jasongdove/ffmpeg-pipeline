import { OutputOption } from "../option/outputOption";

export class AudioBitrateOutputOption extends OutputOption {
    constructor(private bitrate: number) {
        super();
    }

    outputOptions = new Array<string>(
        "-b:a",
        `${this.bitrate.toString(10)}k`,
        "-maxrate:a",
        `${this.bitrate.toString(10)}k`
    );
}
