import { InputFile } from "../../inputFile";
import { DecoderBase } from "../decoderBase";
import { HardwareAccelerationMode } from "../../hardwareAccelerationMode";
import { FrameDataLocation } from "../../frameDataLocation";

export abstract class CuvidDecoder extends DecoderBase {
    constructor(private hardwareAccelerationMode: HardwareAccelerationMode) {
        super();

        this.outputFrameDataLocation =
            hardwareAccelerationMode == HardwareAccelerationMode.None
                ? FrameDataLocation.Software
                : FrameDataLocation.Hardware;
    }

    outputFrameDataLocation: FrameDataLocation;

    inputOptions(inputFile: InputFile): Array<string> {
        const result = super.inputOptions(inputFile);

        if (this.hardwareAccelerationMode != HardwareAccelerationMode.None) {
            result.push("-hwaccel_output_format", "cuda");
        } else {
            result.push(super.inputBitDepth(inputFile) == 10 ? "p010le" : "nv12");
        }

        return result;
    }
}
