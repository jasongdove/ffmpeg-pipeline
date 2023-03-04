import { PixelFormat } from "../interfaces/pixelFormat";

export class PixelFormatYuv420p implements PixelFormat {
    public name: string = "yuv420p";
    public ffmpegName: string = "yuv420p";
    public bitDepth: number = 8;
}
