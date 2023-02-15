import { HardwareAccelerationMode } from "../../hardwareAccelerationMode";
import { CuvidDecoder } from "./cuvidDecoder";

export class DecoderMpeg4Cuvid extends CuvidDecoder {
    constructor(hardwareAccelerationMode: HardwareAccelerationMode) {
        super(hardwareAccelerationMode);
    }

    name: string = "mpeg4_cuvid";
}
