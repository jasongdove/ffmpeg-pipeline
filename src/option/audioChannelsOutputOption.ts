import { AudioFormat } from "../format/audioFormat";
import { OutputOption } from "../option/outputOption";

export class AudioChannelsOutputOption extends OutputOption {
    constructor(private audioFormat: string, private sourceChannels: number, private desiredChannels: number) {
        super();
    }

    outputOptions = this.getOutputOptions();

    private getOutputOptions(): Array<string> {
        const result = new Array<string>();

        if (
            this.sourceChannels != this.desiredChannels ||
            (this.audioFormat == AudioFormat.Aac && this.desiredChannels > 2)
        ) {
            result.push("-ac", this.desiredChannels.toString(10));
        }

        return result;
    }
}
