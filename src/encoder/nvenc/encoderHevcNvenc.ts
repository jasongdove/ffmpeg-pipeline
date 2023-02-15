import { StreamKind } from "../../streamKind";
import { EncoderBase } from "../encoderBase";

export class EncoderHevcNvenc extends EncoderBase {
    constructor() {
        super("hevc_nvenc", StreamKind.Video);
    }
}
