import { GlobalOption } from "./globalOption";

export class LoglevelErrorOption extends GlobalOption {
    globalOptions = new Array<string>("-loglevel", "error");
}
