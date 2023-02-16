import { FrameDataLocation } from "../../frameDataLocation";
import { DecoderBase } from "../decoderBase";

export class DecoderVp9Qsv extends DecoderBase {
    protected outputFrameDataLocation: FrameDataLocation = FrameDataLocation.Hardware;
    name: string = "vp9_qsv";
}
