import { FrameDataLocation } from "./frameDataLocation";

export class FrameState {
    public realtime: boolean = false;
    public videoFormat: string = "mpeg2video";
    public frameRate: number | null = null;
    public videoTrackTimescale: number | null = null;
    public videoBitrate: number | null = null;
    public videoBufferSize: number | null = null;
    public frameDataLocation: FrameDataLocation = FrameDataLocation.Unknown;
}
