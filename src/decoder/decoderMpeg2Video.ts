import { FrameDataLocation } from "../frameDataLocation";
import { DecoderBase } from "./decoderBase";

export class DecoderMpeg2Video extends DecoderBase {
    name: string = "mpeg2video";
    protected outputFrameDataLocation: FrameDataLocation = FrameDataLocation.Software;
}
