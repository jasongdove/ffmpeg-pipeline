import { FrameDataLocation } from "../../frameDataLocation";
import { DecoderBase } from "../decoderBase";

export class DecoderH264Qsv extends DecoderBase {
    protected outputFrameDataLocation: FrameDataLocation = FrameDataLocation.Hardware;
    name: string = "h264_qsv";
}
