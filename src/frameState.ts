import { FrameDataLocation } from "./frameDataLocation";
import { FrameSize } from "./frameSize";

export class FrameState {
    constructor(public scaledSize: FrameSize, public paddedSize: FrameSize, public isAnamorphic: boolean) {}

    public realtime: boolean = false;
    public videoFormat: string = "mpeg2video";
    public frameRate: number | null = null;
    public videoTrackTimescale: number | null = null;
    public videoBitrate: number | null = null;
    public videoBufferSize: number | null = null;
    public frameDataLocation: FrameDataLocation = FrameDataLocation.Unknown;
    public interlaced: boolean = false;
}
