import { GlobalOption } from "./globalOption";

export class ThreadCountOption extends GlobalOption {
    constructor(private threadCount: number) {
        super();
        this.globalOptions.push("-threads", this.threadCount.toString(10));
    }

    globalOptions = new Array<string>();
}
