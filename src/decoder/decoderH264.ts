import { FrameDataLocation } from "../frameDataLocation";
import { DecoderBase } from "./decoderBase";

export class DecoderH264 extends DecoderBase {
    name: string = "h264";
    protected outputFrameDataLocation: FrameDataLocation = FrameDataLocation.Software;
}
