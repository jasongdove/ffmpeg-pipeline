import { OutputOption } from "../option/outputOption";

export class AudioBufferSizeOutputOption extends OutputOption {
    constructor(private bufferSize: number) {
        super();
    }

    outputOptions = new Array<string>("-bufsize:a", `${this.bufferSize.toString(10)}k`);
}
