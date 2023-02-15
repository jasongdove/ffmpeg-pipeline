import { FrameDataLocation } from "../../frameDataLocation";
import { FrameState } from "../../frameState";
import { BaseFilter } from "../baseFilter";

export class YadifCudaFilter extends BaseFilter {
    constructor(private currentState: FrameState) {
        super();
    }

    filter: string = this.generateFilter();

    nextState(currentState: FrameState): void {
        currentState.interlaced = false;
        currentState.frameDataLocation = FrameDataLocation.Hardware;
    }

    private generateFilter(): string {
        return this.currentState.frameDataLocation == FrameDataLocation.Hardware ? "yadif_cuda" : "hwupload,yadif_cuda";
    }
}
