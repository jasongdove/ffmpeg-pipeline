import { FrameDataLocation } from "../../frameDataLocation";
import { FrameSize } from "../../frameSize";
import { FrameState } from "../../frameState";
import { VideoStream } from "../../mediaStream";
import { BaseFilter } from "../baseFilter";

export class ScaleQsvFilter extends BaseFilter {
    constructor(
        private videoStream: VideoStream,
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
        currentState.frameDataLocation = FrameDataLocation.Hardware;

        // this filter always outputs square pixels
        currentState.isAnamorphic = false;
    }

    private generateFilter(): string {
        let scale: string = "";

        if (this.currentState.scaledSize.equals(this.scaledSize) == false) {
            let squareScale = "";
            const targetSize = `w=${this.scaledSize.width}:h=${this.scaledSize.height}`;
            let format = "";
            const sar = this.videoStream.pixelAspectRatio.replace(":", "/");
            if (this.currentState.isAnamorphic) {
                squareScale = `vpp_qsv=w=iw*${sar}:h=ih,setsar=1,`;
            } else {
                format += `,setsar=1`;
            }

            scale = `${squareScale}vpp_qsv=${targetSize}${format}`;
        }

        if (this.currentState.frameDataLocation == FrameDataLocation.Hardware) {
            return scale;
        }

        return `hwupload=extra_hw_frames=64,${scale}`;
    }
}
