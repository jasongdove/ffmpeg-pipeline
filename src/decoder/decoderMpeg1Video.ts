import { FrameDataLocation } from "../frameDataLocation";
import { DecoderBase } from "./decoderBase";

export class DecoderMpeg1Video extends DecoderBase {
    name: string = "mpeg1video";
    protected outputFrameDataLocation: FrameDataLocation = FrameDataLocation.Software;
}
