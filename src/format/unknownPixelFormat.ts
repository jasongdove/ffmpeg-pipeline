import { PixelFormat } from "../interfaces/pixelFormat";

export class UnknownPixelFormat implements PixelFormat {
    constructor(public name: string, public ffmpegName: string, public bitDepth: number) {}
}
