import { StreamKind } from "../streamKind";
import { EncoderBase } from "./encoderBase";

export class EncoderCopyAudio extends EncoderBase {
    constructor() {
        super("copy", StreamKind.Audio);
    }
}
