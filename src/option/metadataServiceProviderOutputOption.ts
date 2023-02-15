import { OutputOption } from "../option/outputOption";

export class MetadataServiceProviderOutputOption extends OutputOption {
    constructor(private serviceProvider: string) {
        super();
    }
    outputOptions = new Array<string>("-metadata", `service_provider="${this.serviceProvider}"`);
}
