import { GlobalOption } from "../globalOption";

export class CudaHardwareAccelerationOption extends GlobalOption {
    globalOptions = new Array<string>("-hwaccel", "cuda");
}
