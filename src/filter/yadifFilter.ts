import { FrameDataLocation } from "../frameDataLocation";
import { FrameState } from "../frameState";
import { BaseFilter } from "./baseFilter";

export class YadifFilter extends BaseFilter {
    constructor(_currentState: FrameState) {
        super();
    }

    filter: string = this.generateFilter();

    nextState(currentState: FrameState): void {
        currentState.interlaced = false;
        currentState.frameDataLocation = FrameDataLocation.Software;
    }

    private generateFilter(): string {
        const yadif = `yadif=1`;

        // TODO: hwdownload if needed

        return yadif;
    }
}
