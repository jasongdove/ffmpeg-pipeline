import { OutputOption } from "../option/outputOption";

export class MetadataAudioLanguageOutputOption extends OutputOption {
    constructor(private audioLanguage: string) {
        super();
    }
    outputOptions = new Array<string>("-metadata:s:a:0", `language="${this.audioLanguage}"`);
}
