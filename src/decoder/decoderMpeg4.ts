import { FrameDataLocation } from "../frameDataLocation";
import { DecoderBase } from "./decoderBase";

export class DecoderMpeg4 extends DecoderBase {
    name: string = "mpeg4";
    protected outputFrameDataLocation: FrameDataLocation = FrameDataLocation.Software;
}
