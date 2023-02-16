import { StreamKind } from "../../streamKind";
import { EncoderBase } from "../encoderBase";

export class EncoderHevcQsv extends EncoderBase {
    constructor() {
        super("hevc_qsv", StreamKind.Video);
    }

    outputOptions = new Array<string>("-c:v", "hevc_qsv", "-low_power", "0", "-look_ahead", "0");
}
