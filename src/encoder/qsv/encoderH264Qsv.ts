import { StreamKind } from "../../streamKind";
import { EncoderBase } from "../encoderBase";

export class EncoderH264Qsv extends EncoderBase {
    constructor() {
        super("h264_qsv", StreamKind.Video);
    }

    outputOptions = new Array<string>("-c:v", "h264_qsv", "-low_power", "0", "-look_ahead", "0");
}
