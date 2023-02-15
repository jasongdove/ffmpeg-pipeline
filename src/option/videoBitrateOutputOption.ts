import { OutputOption } from "../option/outputOption";

export class VideoBitrateOutputOption extends OutputOption {
    constructor(private bitrate: number) {
        super();
    }

    outputOptions = new Array<string>(
        "-b:v",
        `${this.bitrate.toString(10)}k`,
        "-maxrate:v",
        `${this.bitrate.toString(10)}k`
    );
}
