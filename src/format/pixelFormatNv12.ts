import { PixelFormat } from "../interfaces/pixelFormat";

export class PixelFormatNv12 implements PixelFormat {
    constructor(public name: string) {}

    public ffmpegName: string = "nv12";
    public bitDepth: number = 8;
}
