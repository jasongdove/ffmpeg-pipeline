import { FrameDataLocation } from "../../frameDataLocation";
import { DecoderBase } from "../decoderBase";

export class DecoderHevcQsv extends DecoderBase {
    protected outputFrameDataLocation: FrameDataLocation = FrameDataLocation.Hardware;
    name: string = "hevc_qsv";
}
