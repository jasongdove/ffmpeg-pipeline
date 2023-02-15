import { StreamKind } from "../streamKind";
import { EncoderBase } from "./encoderBase";

export class EncoderCopyVideo extends EncoderBase {
    constructor() {
        super("copy", StreamKind.Video);
    }
}
