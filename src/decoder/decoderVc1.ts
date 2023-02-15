import { FrameDataLocation } from "../frameDataLocation";
import { DecoderBase } from "./decoderBase";

export class DecoderVc1 extends DecoderBase {
    name: string = "vc1";
    protected outputFrameDataLocation: FrameDataLocation = FrameDataLocation.Software;
}
