import { GlobalOption } from "./globalOption";

export class NoStandardInputOption extends GlobalOption {
    globalOptions = new Array<string>("-nostdin");
}
