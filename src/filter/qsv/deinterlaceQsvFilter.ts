import { FrameDataLocation } from "../../frameDataLocation";
import { FrameState } from "../../frameState";
import { BaseFilter } from "../baseFilter";

export class DeinterlaceQsvFilter extends BaseFilter {
    constructor(private currentState: FrameState) {
        super();
    }

    filter: string = this.generateFilter();

    nextState(currentState: FrameState): void {
        currentState.interlaced = false;
        currentState.frameDataLocation = FrameDataLocation.Hardware;
    }

    private generateFilter(): string {
        return this.currentState.frameDataLocation == FrameDataLocation.Hardware
            ? "deinterlace_qsv"
            : "hwupload=extra_hw_frames=64,deinterlace_qsv";
    }
}
