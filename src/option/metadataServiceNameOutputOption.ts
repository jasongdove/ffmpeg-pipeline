import { OutputOption } from "../option/outputOption";

export class MetadataServiceNameOutputOption extends OutputOption {
    constructor(private serviceName: string) {
        super();
    }
    outputOptions = new Array<string>("-metadata", `service_name="${this.serviceName}"`);
}
