import { FrameDataLocation } from "../../frameDataLocation";
import { FrameSize } from "../../frameSize";
import { FrameState } from "../../frameState";
import { BaseFilter } from "../baseFilter";

export class ScaleCudaFilter extends BaseFilter {
    constructor(private currentState: FrameState, private scaledSize: FrameSize, private paddedSize: FrameSize) {
        super();
    }

    filter: string = this.generateFilter();

    nextState(currentState: FrameState): void {
        currentState.scaledSize = this.scaledSize;
        currentState.paddedSize = this.scaledSize;
        currentState.frameDataLocation = FrameDataLocation.Hardware;

        // this filter always outputs square pixels
        currentState.isAnamorphic = false;
    }

    private generateFilter(): string {
        let scale: string = "";

        if (this.currentState.scaledSize.equals(this.scaledSize) == false) {
            let aspectRatio = "";
            if (this.scaledSize.equals(this.paddedSize) == false) {
                aspectRatio = ":force_original_aspect_ratio=decrease";
            }

            let squareScale = "";
            const targetSize = `${this.paddedSize.width}:${this.paddedSize.height}`;
            if (this.currentState.isAnamorphic) {
                squareScale = `scale_cuda=iw*sar:ih,setsar=1,`;
            } else {
                aspectRatio += `,setsar=1`;
            }

            scale = `${squareScale}scale_cuda=${targetSize}${aspectRatio}`;
        }

        if (scale == "") {
            return scale;
        }

        return this.currentState.frameDataLocation == FrameDataLocation.Hardware ? scale : `hwupload_cuda,${scale}`;
    }
}
