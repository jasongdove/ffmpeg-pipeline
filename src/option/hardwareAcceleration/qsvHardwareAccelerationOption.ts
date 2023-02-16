import { GlobalOption } from "../globalOption";
import os from "os";

export class QsvHardwareAccelerationOption extends GlobalOption {
    constructor(private qsvDevice: string | null) {
        super();
    }

    globalOptions = this.getGlobalOptions();

    private getGlobalOptions(): Array<string> {
        const initDevices =
            os.type().toLowerCase() == "windows_nt"
                ? new Array<string>("-init_hw_device", "qsv=hw:hw,child_device_type=dxva2", "-filter_hw_device", "hw")
                : new Array<string>("-init_hw_device", "qsv=hw:hw,child_device_type=vaapi", "-filter_hw_device", "hw");

        const result = new Array<string>("-hwaccel", "qsv", "-hwaccel_output_format", "qsv");

        if (os.type().toLowerCase() == "linux") {
            if (this.qsvDevice != null && this.qsvDevice != "") {
                result.push("-qsv_device", this.qsvDevice);
            }
        }

        result.push(...initDevices);

        return result;
    }
}
