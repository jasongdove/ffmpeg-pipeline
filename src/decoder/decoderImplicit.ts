import { FrameDataLocation } from "../frameDataLocation";
import { InputFile } from "../inputFile";
import { DecoderBase } from "./decoderBase";

export class DecoderImplicit extends DecoderBase {
    name: string = "";

    protected outputFrameDataLocation: FrameDataLocation = FrameDataLocation.Software;

    inputOptions(_inputFile: InputFile): Array<string> {
        return new Array<string>();
    }
}
