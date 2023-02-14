import { OutputOption } from "./outputOption";

export class FastStartOutputOption extends OutputOption {
    outputOptions = new Array<string>("-movflags", "+faststart");
}
