import { FrameSize } from "./frameSize";
import { StreamKind } from "./streamKind";

export class MediaStream {
    constructor(public index: number, public codec: string, public kind: StreamKind) {}
}

export class AudioStream extends MediaStream {
    constructor(index: number, codec: string, public channels: number) {
        super(index, codec, StreamKind.Audio);
    }
}

export class VideoStream extends MediaStream {
    constructor(
        index: number,
        codec: string,
        public frameSize: FrameSize,
        public isAnamorphic: boolean,
        private pixelAspectRatio: string
    ) {
        super(index, codec, StreamKind.Video);
    }

    public squarePixelFrameSize(resolution: FrameSize): FrameSize {
        let width = this.frameSize.width;
        let height = this.frameSize.height;

        if (this.isAnamorphic) {
            const split = this.pixelAspectRatio.split(":");
            const num = Number.parseFloat(split[0]);
            const den = Number.parseFloat(split[1]);

            width = Math.floor((this.frameSize.width * num) / den);
            height = Math.floor((this.frameSize.height * height) / den);
        }

        const widthPercent = resolution.width / width;
        const heightPercent = resolution.height / height;
        const minPercent = Math.min(widthPercent, heightPercent);

        return new FrameSize(Math.floor(width * minPercent), Math.floor(height * minPercent));
    }
}
