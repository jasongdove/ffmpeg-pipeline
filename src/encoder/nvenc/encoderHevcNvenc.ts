import { StreamKind } from "../../streamKind";
import { EncoderBase } from "../encoderBase";

export class EncoderHevcNvenc extends EncoderBase {
    constructor() {
        super("hevc_nvenc", StreamKind.Video);
    }
    override outputOptions: Array<string> = new Array<string>("-c:v", "hevc_nvenc", "-b_ref_mode", "0");
}
