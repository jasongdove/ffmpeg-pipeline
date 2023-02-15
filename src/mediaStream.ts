import { StreamKind } from "./streamKind";

export class MediaStream {
    constructor(public codec: string, public kind: StreamKind) {}
}

export class VideoStream extends MediaStream {
    constructor(codec: string) {
        super(codec, StreamKind.Video);
    }
}
