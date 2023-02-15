import { StreamKind } from "../streamKind";
import { EncoderBase } from "./encoderBase";

export class AudioEncoder extends EncoderBase {
    constructor(encoder: string) {
        super(encoder, StreamKind.Audio);
    }
}
