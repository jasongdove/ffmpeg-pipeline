import { StreamKind } from "../streamKind";
import { EncoderBase } from "./encoderBase";

export class EncoderImplicitVideo extends EncoderBase {
    constructor() {
        super("", StreamKind.Video);
    }

    // do not specify an encoder
    outputOptions = new Array<string>();
}
