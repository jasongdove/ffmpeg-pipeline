import { FrameDataLocation } from "../../frameDataLocation";
import { DecoderBase } from "../decoderBase";

export class DecoderMpeg2Qsv extends DecoderBase {
    protected outputFrameDataLocation: FrameDataLocation = FrameDataLocation.Hardware;
    name: string = "mpeg2_qsv";
}
