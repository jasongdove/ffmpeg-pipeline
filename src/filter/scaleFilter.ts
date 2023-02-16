import { FFmpegState } from "../ffmpegState";
import { FrameDataLocation } from "../frameDataLocation";
import { FrameSize } from "../frameSize";
import { FrameState } from "../frameState";
import { BaseFilter } from "./baseFilter";

export class ScaleFilter extends BaseFilter {
    constructor(
        private ffmpegState: FFmpegState,
        private currentState: FrameState,
        private scaledSize: FrameSize,
        private paddedSize: FrameSize
    ) {
        super();
    }

    filter: string = this.generateFilter();

    nextState(currentState: FrameState): void {
        currentState.scaledSize = this.scaledSize;
        currentState.paddedSize = this.scaledSize;
        currentState.frameDataLocation = FrameDataLocation.Software;

        // this filter always outputs square pixels
        currentState.isAnamorphic = false;
    }

    private generateFilter(): string {
        let aspectRatio = "";
        if (this.scaledSize.equals(this.paddedSize) == false) {
            aspectRatio = ":force_original_aspect_ratio=decrease";
        }

        let scale: string;
        if (this.currentState.isAnamorphic) {
            scale = `scale=iw*sar:ih,setsar=1,scale=${this.paddedSize.width}:${this.paddedSize.height}:flags=${this.ffmpegState.softwareScalingAlgorithm}${aspectRatio}`;
        } else {
            scale = `scale=${this.paddedSize.width}:${this.paddedSize.height}:flags=${this.ffmpegState.softwareScalingAlgorithm}${aspectRatio},setsar=1`;
        }

        // TODO: hwdownload if needed

        return scale;
    }
}
