import { StreamKind } from "../streamKind";
import { EncoderBase } from "./encoderBase";

export class EncoderLibx264 extends EncoderBase {
    constructor() {
        super("libx264", StreamKind.Video);
    }
}
