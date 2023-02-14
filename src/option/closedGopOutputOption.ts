import { OutputOption } from "./outputOption";

export class ClosedGopOutputOption extends OutputOption {
    outputOptions = new Array<string>("-flags", "cgop");
}
