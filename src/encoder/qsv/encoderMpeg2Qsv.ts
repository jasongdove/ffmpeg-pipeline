import { StreamKind } from "../../streamKind";
import { EncoderBase } from "../encoderBase";

export class EncoderMpeg2Qsv extends EncoderBase {
    constructor() {
        super("mpeg2_qsv", StreamKind.Video);
    }

    outputOptions = new Array<string>("-c:v", "mpeg2_qsv", "-low_power", "0", "-look_ahead", "0");
}
