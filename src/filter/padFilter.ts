import { FrameDataLocation } from "../frameDataLocation";
import { FrameSize } from "../frameSize";
import { FrameState } from "../frameState";
import { BaseFilter } from "./baseFilter";

export class PadFilter extends BaseFilter {
    constructor(private currentState: FrameState, private paddedSize: FrameSize) {
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
            // TODO: pixel format?

            return `hwdownload,${pad}`;
        }

        return pad;
    }
}
