import { StreamKind } from "../../streamKind";
import { EncoderBase } from "../encoderBase";

export class EncoderH264Nvenc extends EncoderBase {
    constructor() {
        super("h264_nvenc", StreamKind.Video);
    }
}
