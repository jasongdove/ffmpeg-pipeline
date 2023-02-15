import { OutputOption } from "../option/outputOption";

export class FrameRateOutputOption extends OutputOption {
    constructor(private frameRate: number) {
        super();
    }

    outputOptions = new Array<string>("-r", this.frameRate.toString(10), "-vsync", "cfr");
}
