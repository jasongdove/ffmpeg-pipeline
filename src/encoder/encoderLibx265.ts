import { FrameState } from "../frameState";
import { StreamKind } from "../streamKind";
import { EncoderBase } from "./encoderBase";

export class EncoderLibx265 extends EncoderBase {
    constructor(_currentState: FrameState) {
        super("libx265", StreamKind.Video);
    }

    outputOptions = new Array<string>("-c:v", this.name, "-tag:v", "hvc1", "-x265-params", "log-level=error");
}
