import { FrameDataLocation } from "../frameDataLocation";
import { FrameSize } from "../frameSize";
import { FrameState } from "../frameState";
import { BaseFilter } from "./baseFilter";

export class PadFilter extends BaseFilter {
    constructor(_currentState: FrameState, private paddedSize: FrameSize) {
        super();
    }

    filter: string = this.generateFilter();

    nextState(currentState: FrameState): void {
        currentState.paddedSize = this.paddedSize;
        currentState.frameDataLocation = FrameDataLocation.Software;
    }

    private generateFilter(): string {
        const pad = `pad=${this.paddedSize.width}:${this.paddedSize.height}:-1:-1:color=black`;

        // TODO: hwdownload if needed

        return pad;
    }
}
