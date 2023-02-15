import { none, some, Option } from "fp-ts/lib/Option";
import { CommandGenerator, SoftwarePipelineBuilder } from "../src/index";
import { AudioInputFile, VideoInputFile } from "../src/inputFile";
import { FFmpegState } from "../src/ffmpegState";
import { FrameState } from "../src/frameState";
import { VideoFormat } from "../src/format/videoFormat";
import { VideoStream } from "../src/mediaStream";

describe("CommandGenerator", () => {
    it("should generate arguments", () => {
        const videoInputFile = new VideoInputFile("video", new Array<VideoStream>(new VideoStream("hevc")));
        const audioInputFile: Option<AudioInputFile> = none;

        // more dummy data
        const ffmpegState = new FFmpegState();
        ffmpegState.start = some("01:00:00");
        ffmpegState.finish = some("00:00:22");
        ffmpegState.metadataServiceProvider = some("service-provider");
        ffmpegState.metadataServiceName = some("service-name");
        ffmpegState.metadataAudioLanguage = some("en");

        const desiredState = new FrameState();
        desiredState.realtime = true;
        desiredState.videoFormat = VideoFormat.Copy;

        const builder = new SoftwarePipelineBuilder(videoInputFile, audioInputFile);
        const steps = builder.build(ffmpegState, desiredState).pipelineSteps;

        const result = new CommandGenerator().generateArguments(videoInputFile, steps);
        console.log(result);
        expect(result).not.toBeNull();
    });
});
