import { Option, none } from "fp-ts/Option";

export class FFmpegState {
    public threadCount: Option<number> = none;
    public start: Option<string> = none;
    public finish: Option<string> = none;
    public doNotMapMetadata: boolean = true;
    public metadataServiceProvider: Option<string> = none;
    public metadataServiceName: Option<string> = none;
    public metadataAudioLanguage: Option<string> = none;
}
