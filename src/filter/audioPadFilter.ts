import { FrameState } from "../frameState";
import { BaseFilter } from "./baseFilter";

export class AudioPadFilter extends BaseFilter {
    constructor(private audioDuration: number) {
        super();
    }

    filter: string = this.generateFilter();

    nextState(_currentState: FrameState): void {}

    private generateFilter(): string {
        return `apad=whole_dur=${this.audioDuration}ms`;
    }
}
