import { FrameDataLocation } from "../frameDataLocation";
import { DecoderBase } from "./decoderBase";

export class DecoderMsMpeg4V3 extends DecoderBase {
    name: string = "msmpeg4v3";
    protected outputFrameDataLocation: FrameDataLocation = FrameDataLocation.Software;
}
