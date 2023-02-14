import { SoftwarePipelineBuilder } from "./pipeline/softwarePipelineBuilder";

export class Test {
    build(): string {
        const builder = new SoftwarePipelineBuilder();
        const steps = builder.build().pipelineSteps;

        const args = new Array<string>();

        args.push(...steps.flatMap((s) => s.globalOptions));

        // TODO: input files

        // TODO: complex filter

        args.push(...steps.flatMap((s) => s.outputOptions));

        return args.join(" ");
    }
}
