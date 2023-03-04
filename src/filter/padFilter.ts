import { FrameDataLocation } from "../frameDataLocation";
import { FrameSize } from "../frameSize";
import { FrameState } from "../frameState";
import { PixelFormat } from "../interfaces/pixelFormat";
import { BaseFilter } from "./baseFilter";

export class PadFilter extends BaseFilter {
    constructor(
        private currentState: FrameState,
        private paddedSize: FrameSize,
        private hardwarePixelFormat: PixelFormat | null
    ) {
        super();
    }

    filter: string = this.generateFilter();

    nextState(currentState: FrameState): void {
        currentState.paddedSize = this.paddedSize;
        currentState.frameDataLocation = FrameDataLocation.Software;
    }

    private generateFilter(): string {
        const pad = `pad=${this.paddedSize.width}:${this.paddedSize.height}:-1:-1:color=black`;

        if (this.currentState.frameDataLocation == FrameDataLocation.Hardware) {
            if (this.hardwarePixelFormat != null) {
                return `hwdownload,format=${this.hardwarePixelFormat.ffmpegName},${pad}`;
            }

            return `hwdownload,${pad}`;
        }

        return pad;
    }
}
