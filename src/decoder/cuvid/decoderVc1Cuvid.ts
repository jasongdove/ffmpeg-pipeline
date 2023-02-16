import { HardwareAccelerationMode } from "../../hardwareAccelerationMode";
import { CuvidDecoder } from "./cuvidDecoder";

export class DecoderVc1Cuvid extends CuvidDecoder {
    constructor(hardwareAccelerationMode: HardwareAccelerationMode) {
        super(hardwareAccelerationMode);
    }

    name: string = "vc1_cuvid";
}
