import { FrameDataLocation } from "../../frameDataLocation";
import { DecoderBase } from "../decoderBase";

export class DecoderVc1Qsv extends DecoderBase {
    protected outputFrameDataLocation: FrameDataLocation = FrameDataLocation.Hardware;
    name: string = "vc1_qsv";
}
