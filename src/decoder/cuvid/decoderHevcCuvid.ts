import { HardwareAccelerationMode } from "../../hardwareAccelerationMode";
import { CuvidDecoder } from "./cuvidDecoder";

export class DecoderHevcCuvid extends CuvidDecoder {
    constructor(hardwareAccelerationMode: HardwareAccelerationMode) {
        super(hardwareAccelerationMode);
    }

    name: string = "hevc_cuvid";
}
