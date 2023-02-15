import { FrameDataLocation } from "../frameDataLocation";
import { DecoderBase } from "./decoderBase";

export class DecoderHevc extends DecoderBase {
    name: string = "hevc";
    protected outputFrameDataLocation: FrameDataLocation = FrameDataLocation.Software;
}
