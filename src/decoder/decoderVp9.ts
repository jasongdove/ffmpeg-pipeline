import { FrameDataLocation } from "../frameDataLocation";
import { DecoderBase } from "./decoderBase";

export class DecoderVp9 extends DecoderBase {
    name: string = "vp9";
    protected outputFrameDataLocation: FrameDataLocation = FrameDataLocation.Software;
}
