import { OutputOption } from "../option/outputOption";

export class AudioSampleRateOutputOption extends OutputOption {
    constructor(private sampleRate: number) {
        super();
    }

    outputOptions = new Array<string>("-ar", `${this.sampleRate.toString(10)}k`);
}
