import { FFmpegState } from "../ffmpegState";
import { FrameDataLocation } from "../frameDataLocation";
import { FrameState } from "../frameState";
import { BaseFilter } from "./baseFilter";

export class DeinterlaceFilter extends BaseFilter {
    constructor(private ffmpegState: FFmpegState, _currentState: FrameState) {
        super();
    }

    filter: string = this.generateFilter();

    nextState(currentState: FrameState): void {
        currentState.interlaced = false;
        currentState.frameDataLocation = FrameDataLocation.Software;
    }

    private generateFilter(): string {
        const filter = this.ffmpegState.softwareDeinterlaceFilter;

        // TODO: hwdownload if needed

        return filter;
    }
}
