export class AudioState {
    public audioEncoder: string = "aac";
    public audioChannels: number = 2;
    public audioBitrate: number | null = null;
    public audioBufferSize: number | null = null;
    public audioSampleRate: number | null = null;
    public audioDuration: number | null = null;
    public audioVolume: number | null = null;
}
