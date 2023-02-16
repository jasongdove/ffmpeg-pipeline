import { HardwareAccelerationMode } from "../../hardwareAccelerationMode";
import { CuvidDecoder } from "./cuvidDecoder";

export class DecoderVp9Cuvid extends CuvidDecoder {
    constructor(hardwareAccelerationMode: HardwareAccelerationMode) {
        super(hardwareAccelerationMode);
    }

    name: string = "vp9_cuvid";
}
