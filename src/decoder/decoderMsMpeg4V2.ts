import { FrameDataLocation } from "../frameDataLocation";
import { DecoderBase } from "./decoderBase";

export class DecoderMsMpeg4V2 extends DecoderBase {
    name: string = "msmpeg4v2";
    protected outputFrameDataLocation: FrameDataLocation = FrameDataLocation.Software;
}
