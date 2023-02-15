import { StreamKind } from "../streamKind";
import { EncoderBase } from "./encoderBase";

export class EncoderAc3 extends EncoderBase {
    constructor() {
        super("ac3", StreamKind.Audio);
    }
}
