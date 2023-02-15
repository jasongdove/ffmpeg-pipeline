import { OutputOption } from "./outputOption";

export class OutputFormatMpegTs extends OutputOption {
    outputOptions = new Array<string>("-f", "mpegts", "-mpegts_flags", "+initial_discontinuity");
}
