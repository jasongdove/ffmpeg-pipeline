import { OutputOption } from "./outputOption";

export class NoDemuxDecodeDelayOutputOption extends OutputOption {
    outputOptions = new Array<string>("-muxdelay", "0", "-muxpreload", "0");
}
