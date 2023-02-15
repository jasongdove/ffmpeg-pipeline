import { OutputOption } from "../option/outputOption";

export class DoNotMapMetadataOutputOption extends OutputOption {
    outputOptions = new Array<string>("-map_metadata", "-1");
}
