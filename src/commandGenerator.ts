import { VideoInputFile } from "./inputFile";
import { PipelineStep } from "./interfaces/pipelineStep";
import { ComplexFilter } from "./filter/complexFilter";
import { StreamKind } from "./streamKind";
import { EncoderBase } from "./encoder/encoderBase";

export class CommandGenerator {
    generateArguments(videoInputFile: VideoInputFile, pipelineSteps: Array<PipelineStep>): Array<string> {
        const args = new Array<string>();

        args.push(...pipelineSteps.flatMap((s) => s.globalOptions));

        // TODO: input files
        const includedPaths = new Set<string>();

        includedPaths.add(videoInputFile.path);
        args.push(...videoInputFile.inputOptions.flatMap((s) => s.inputOptions(videoInputFile)));
        args.push("-i", videoInputFile.path);

        args.push(...pipelineSteps.flatMap((s) => s.filterOptions));

        // rearrange complex filter output options directly after video encoder
        const sortedSteps = pipelineSteps.filter((s) => s instanceof ComplexFilter == false);
        const maybeComplex = pipelineSteps.find((s) => s instanceof ComplexFilter);
        if (maybeComplex != null) {
            const encoderIndex = sortedSteps.findIndex(
                (s) => s instanceof EncoderBase && (s as EncoderBase).kind == StreamKind.Video
            );
            sortedSteps.splice(encoderIndex + 1, 0, maybeComplex);
        }

        args.push(...sortedSteps.flatMap((s) => s.outputOptions));

        return args;
    }
}
