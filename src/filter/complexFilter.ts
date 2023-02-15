import { FilterChain } from "../filterChain";
import { AudioInputFile, InputFile, VideoInputFile } from "../inputFile";
import { EnvironmentVariable } from "../interfaces/environmentVariable";
import { PipelineStep } from "../interfaces/pipelineStep";

export class ComplexFilter implements PipelineStep {
    constructor(
        private videoInputFile: VideoInputFile,
        private audioInputFile: AudioInputFile | null,
        private filterChain: FilterChain
    ) {}

    environmentVariables = new Array<EnvironmentVariable>();
    globalOptions = new Array<string>();
    filterOptions = this.generateArguments();
    outputOptions = new Array<string>();

    inputOptions(_inputFile: InputFile): Array<string> {
        return new Array<string>();
    }

    private generateArguments(): Array<string> {
        let audioLabel = "0:a";
        let videoLabel = "0:v";

        const result = new Array<string>();

        let audioFilterComplex = "";
        let videoFilterComplex = "";

        const distinctPaths = new Array<string>();
        distinctPaths.push(this.videoInputFile.path);
        if (this.audioInputFile != null) {
            // TODO: use audio as a separate input with vaapi/qsv
            if (!distinctPaths.includes(this.audioInputFile.path)) {
                distinctPaths.push(this.audioInputFile.path);
            }
        }

        const videoInputIndex = distinctPaths.indexOf(this.videoInputFile.path);
        this.videoInputFile.videoStreams.forEach((videoStream) => {
            const index = videoStream.index;
            videoLabel = `${videoInputIndex}:${index}`;
            if (this.filterChain.videoFilterSteps.some((s) => !this.isNullOrWhitespace(s.filter))) {
                videoFilterComplex += `[${videoInputIndex}:${index}]`;
                videoFilterComplex += this.filterChain.videoFilterSteps
                    .filter((s) => !this.isNullOrWhitespace(s.filter))
                    .map((s) => s.filter)
                    .join(",");
                videoLabel = "[v]";
                videoFilterComplex += videoLabel;
            }
        });

        if (this.audioInputFile != null) {
            const audioInputIndex = distinctPaths.indexOf(this.audioInputFile.path);
            this.audioInputFile.audioStreams.forEach((audioStream) => {
                const index = audioStream.index;
                audioLabel = `${audioInputIndex}:${index}`;
                if (this.audioInputFile!.filterSteps.some((s) => !this.isNullOrWhitespace(s.filter))) {
                    audioFilterComplex += `[${audioInputIndex}:${index}]`;
                    audioFilterComplex += this.audioInputFile!.filterSteps.filter(
                        (s) => !this.isNullOrWhitespace(s.filter)
                    )
                        .map((s) => s.filter)
                        .join(",");
                    audioLabel = "[a]";
                    audioFilterComplex += audioLabel;
                }
            });
        }

        const filterComplex = new Array<string>(audioFilterComplex, videoFilterComplex)
            .filter((f) => !this.isNullOrWhitespace(f))
            .join(";");

        if (!this.isNullOrWhitespace(filterComplex)) {
            result.push("-filter_complex", filterComplex);
        }

        result.push("-map", audioLabel, "-map", videoLabel);

        return result;
    }

    private isNullOrWhitespace(val: string): boolean {
        return val == null || val.trim() == "";
    }
}
