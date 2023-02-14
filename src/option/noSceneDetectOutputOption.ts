import { OutputOption } from "./outputOption";

export class NoSceneDetectOutputOption extends OutputOption {
    constructor(private value: number) {
        super();
        this.outputOptions.push("-sc_threshold", this.value.toString(10));
    }

    outputOptions = new Array<string>();
}
