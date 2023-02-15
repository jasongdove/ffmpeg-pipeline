import { HardwareAccelerationMode } from "../hardwareAccelerationMode";
import { AudioInputFile, VideoInputFile } from "../inputFile";
import { PipelineBuilder } from "../interfaces/pipelineBuilder";
import { SoftwarePipelineBuilder } from "./softwarePipelineBuilder";
import { NvidiaPipelineBuilder } from "./nvidiaPipelineBuilder";

export class PipelineBuilderFactory {
    public static getBuilder(
        hardwareAccelerationMode: HardwareAccelerationMode,
        videoInputFile: VideoInputFile,
        audioInputFile: AudioInputFile | null
    ): PipelineBuilder {
        console.log("getBuilder");
        switch (hardwareAccelerationMode) {
            case HardwareAccelerationMode.Nvenc:
                console.log("get nvidia builder");
                return new NvidiaPipelineBuilder(videoInputFile, audioInputFile);
            default:
                return new SoftwarePipelineBuilder(videoInputFile, audioInputFile);
        }
    }
}
