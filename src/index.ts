import { none, some, Option, match } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/function";

import { AudioInputFile, VideoInputFile } from "./inputFile";
import { SoftwarePipelineBuilder } from "./pipeline/softwarePipelineBuilder";

export class Test {
    build(): string {
        const videoInputFile: Option<VideoInputFile> = some(new VideoInputFile("video"));
        const audioInputFile: Option<AudioInputFile> = none;

        const builder = new SoftwarePipelineBuilder(videoInputFile, audioInputFile);
        const steps = builder.build().pipelineSteps;

        const args = new Array<string>();

        args.push(...steps.flatMap((s) => s.globalOptions));

        // TODO: input files
        const includedPaths = new Set<string>();
        pipe(
            videoInputFile,
            match(
                () => {},
                (vif) => {
                    includedPaths.add(vif.path);

                    args.push(...vif.inputOptions.flatMap((s) => s.inputOptions(vif)));

                    args.push("-i", vif.path);
                }
            )
        );

        // TODO: complex filter

        args.push(...steps.flatMap((s) => s.outputOptions));

        return args.join(" ");
    }
}
