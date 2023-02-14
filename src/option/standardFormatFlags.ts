import { GlobalOption } from "./globalOption";

export class StandardFormatFlags extends GlobalOption {
    globalOptions = new Array<string>("-fflags", "+genpts+discardcorrupt+igndts");
}
