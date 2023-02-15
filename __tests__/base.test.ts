import { AudioState, CommandGenerator, HardwareAccelerationMode, PipelineBuilderFactory } from "../src/index";
import { AudioInputFile, VideoInputFile } from "../src/inputFile";
import { FFmpegState } from "../src/ffmpegState";
import { FrameState } from "../src/frameState";
import { VideoFormat } from "../src/format/videoFormat";
import { AudioStream, VideoStream } from "../src/mediaStream";
import { FrameSize } from "../src/frameSize";

describe("CommandGenerator", () => {
    it("should generate arguments", () => {
        const videoStream = new VideoStream(1, "hevc", new FrameSize(640, 480), false, "");
        const videoInputFile = new VideoInputFile("video", new Array<VideoStream>(videoStream));

        const audioStream = new AudioStream(2, "flac", 6);
        const desiredAudioState = new AudioState();
        desiredAudioState.audioEncoder = "ac3";
        desiredAudioState.audioChannels = 2;
        desiredAudioState.audioBitrate = 192;
        desiredAudioState.audioBufferSize = 50;
        desiredAudioState.audioSampleRate = 48;
        desiredAudioState.audioDuration = 11_000;
        const audioInputFile: AudioInputFile | null = new AudioInputFile(
            "audio",
            new Array<AudioStream>(audioStream),
            desiredAudioState
        );

        // more dummy data
        const ffmpegState = new FFmpegState();
        ffmpegState.start = "01:00:00";
        ffmpegState.finish = "00:00:22";
        ffmpegState.metadataServiceProvider = "service-provider";
        ffmpegState.metadataServiceName = "service-name";
        ffmpegState.metadataAudioLanguage = "en";

        const targetResolution = new FrameSize(1280, 720);
        const squarePixelFrameSize = videoStream.squarePixelFrameSize(targetResolution);
        const desiredState = new FrameState(squarePixelFrameSize, targetResolution, false);
        desiredState.realtime = true;
        desiredState.videoFormat = VideoFormat.Hevc;

        const builder = PipelineBuilderFactory.getBuilder(
            HardwareAccelerationMode.Nvenc,
            videoInputFile,
            audioInputFile
        );
        const steps = builder.build(ffmpegState, desiredState).pipelineSteps;

        const result = new CommandGenerator().generateArguments(videoInputFile, steps);
        console.log(result);
        expect(result).not.toBeNull();
    });
});
