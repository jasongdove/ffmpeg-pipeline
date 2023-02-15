export class FFmpegState {
    public threadCount: number | null = null;
    public start: string | null = null;
    public finish: string | null = null;
    public doNotMapMetadata: boolean = true;
    public metadataServiceProvider: string | null = null;
    public metadataServiceName: string | null = null;
    public metadataAudioLanguage: string | null = null;
}
