import { CommandGenerator, SoftwarePipelineBuilder } from "../src/index";
import { AudioInputFile, VideoInputFile } from "../src/inputFile";
import { FFmpegState } from "../src/ffmpegState";
import { FrameState } from "../src/frameState";
import { VideoFormat } from "../src/format/videoFormat";
import { VideoStream } from "../src/mediaStream";

describe("CommandGenerator", () => {
    it("should generate arguments", () => {
        const videoInputFile = new VideoInputFile("video", new Array<VideoStream>(new VideoStream("hevc")));
        const audioInputFile: AudioInputFile | null = new AudioInputFile("");

        // more dummy data
        const ffmpegState = new FFmpegState();
        ffmpegState.start = "01:00:00";
        ffmpegState.finish = "00:00:22";
        ffmpegState.metadataServiceProvider = "service-provider";
        ffmpegState.metadataServiceName = "service-name";
        ffmpegState.metadataAudioLanguage = "en";

        const desiredState = new FrameState();
        desiredState.realtime = true;
        desiredState.videoFormat = VideoFormat.Mpeg2Video;

        const builder = new SoftwarePipelineBuilder(videoInputFile, audioInputFile);
        const steps = builder.build(ffmpegState, desiredState).pipelineSteps;

        const result = new CommandGenerator().generateArguments(videoInputFile, steps);
        console.log(result);
        expect(result).not.toBeNull();
    });
});
