import { StreamKind } from "../streamKind";
import { EncoderBase } from "./encoderBase";

export class EncoderMpeg2Video extends EncoderBase {
    constructor() {
        super("mpeg2video", StreamKind.Video);
    }
}
