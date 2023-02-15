import { OutputOption } from "../option/outputOption";

export class VideoTrackTimescaleOutputOption extends OutputOption {
    constructor(private timeScale: number) {
        super();
    }

    outputOptions = new Array<string>("-video_track_timescale", this.timeScale.toString(10));
}
