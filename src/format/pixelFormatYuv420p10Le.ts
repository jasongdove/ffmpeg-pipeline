import { PixelFormat } from "../interfaces/pixelFormat";

export class PixelFormatYuv420p10Le implements PixelFormat {
    public name: string = "yuv420p10le";
    public ffmpegName: string = "p010le";
    public bitDepth: number = 10;
}
