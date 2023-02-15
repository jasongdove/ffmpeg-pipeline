import { VideoInputFile } from "./inputFile";
import { PipelineStep } from "./interfaces/pipelineStep";

export { SoftwarePipelineBuilder } from "./pipeline/softwarePipelineBuilder";

export class CommandGenerator {
    generateArguments(videoInputFile: VideoInputFile, pipelineSteps: Array<PipelineStep>): string {
        const args = new Array<string>();

        args.push(...pipelineSteps.flatMap((s) => s.globalOptions));

        // TODO: input files
        const includedPaths = new Set<string>();

        includedPaths.add(videoInputFile.path);
        args.push(...videoInputFile.inputOptions.flatMap((s) => s.inputOptions(videoInputFile)));
        args.push("-i", videoInputFile.path);

        // TODO: complex filter

        args.push(...pipelineSteps.flatMap((s) => s.outputOptions));

        return args.join(" ");
    }
}
