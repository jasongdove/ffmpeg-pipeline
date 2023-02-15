import { PipelineStep } from "./pipelineStep";
import { AudioInputFile, VideoInputFile } from "../inputFile";

export interface InputOption extends PipelineStep {
    appliesToAudio(audioInputFile: AudioInputFile): boolean;
    appliesToVideo(videoInputFile: VideoInputFile): boolean;
}
