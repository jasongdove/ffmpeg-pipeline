import { VideoInputFile } from "./inputFile";
import { PipelineStep } from "./interfaces/pipelineStep";

export { SoftwarePipelineBuilder } from "./pipeline/softwarePipelineBuilder";
export { AudioInputFile, VideoInputFile } from "./inputFile";
export { VideoStream } from "./mediaStream";
export { FFmpegState } from "./ffmpegState";
export { FrameState } from "./frameState";
export { VideoFormat } from "./format/videoFormat";

export class CommandGenerator {
    generateArguments(videoInputFile: VideoInputFile, pipelineSteps: Array<PipelineStep>): Array<string> {
        const args = new Array<string>();

        args.push(...pipelineSteps.flatMap((s) => s.globalOptions));

        // TODO: input files
        const includedPaths = new Set<string>();

        includedPaths.add(videoInputFile.path);
        args.push(...videoInputFile.inputOptions.flatMap((s) => s.inputOptions(videoInputFile)));
        args.push("-i", videoInputFile.path);

        // TODO: complex filter

        args.push(...pipelineSteps.flatMap((s) => s.outputOptions));

        return args;
    }
}
