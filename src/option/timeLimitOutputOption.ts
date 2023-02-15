import { OutputOption } from "../option/outputOption";

export class TimeLimitOutputOption extends OutputOption {
    constructor(private finish: string) {
        super();
    }

    outputOptions = new Array<string>("-t", this.finish);
}
