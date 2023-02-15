import { OutputOption } from "../option/outputOption";

export class VideoBufferSizeOutputOption extends OutputOption {
    constructor(private bufferSize: number) {
        super();
    }

    outputOptions = new Array<string>("-bufsize:v", `${this.bufferSize.toString(10)}k`);
}
