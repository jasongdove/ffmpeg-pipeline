import { HardwareAccelerationMode } from "../../hardwareAccelerationMode";
import { CuvidDecoder } from "./cuvidDecoder";

export class DecoderH264Cuvid extends CuvidDecoder {
    constructor(hardwareAccelerationMode: HardwareAccelerationMode) {
        super(hardwareAccelerationMode);
    }

    name: string = "h264_cuvid";
}
