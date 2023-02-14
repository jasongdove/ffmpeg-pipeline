import { getOrElse } from "fp-ts/lib/Option";

import { FFmpegPipeline } from "../ffmpegPipeline";
import { PipelineStep } from "../interfaces/pipelineStep";
import { ClosedGopOutputOption } from "../option/closedGopOutputOption";
import { FastStartOutputOption } from "../option/fastStartOutputOption";
import { HideBannerOption } from "../option/hideBannerOption";
import { LoglevelErrorOption } from "../option/loglevelErrorOption";
import { NoDemuxDecodeDelayOutputOption } from "../option/noDemuxDecodeDelayOutputOption";
import { NoStandardInputOption } from "../option/noStandardInputOption";
import { NoStatsOption } from "../option/noStatsOption";
import { StandardFormatFlags } from "../option/standardFormatFlags";
import { FFmpegState } from "../ffmpegState";
import { FrameState } from "../frameState";
import { ThreadCountOption } from "../option/threadCountOption";
import { NoSceneDetectOutputOption } from "../option/noSceneDetectOutputOption";
import { VideoStream } from "../mediaStream";
import { VideoFormat } from "../format/videoFormat";

export abstract class PipelineBuilderBase {
    build(): FFmpegPipeline {
        // dummy data for testing
        const videoStream = new VideoStream();
        videoStream.codec = "hevc";

        // more dummy data
        const ffmpegState = new FFmpegState();
        const desiredState = new FrameState();
        desiredState.realtime = true;
        desiredState.videoFormat = "h264";

        const pipelineSteps = new Array<PipelineStep>(
            // default input options
            new NoStandardInputOption(),
            new HideBannerOption(),
            new NoStatsOption(),
            new LoglevelErrorOption(),
            new StandardFormatFlags(),

            // default output options
            new NoDemuxDecodeDelayOutputOption(),
            new FastStartOutputOption(),
            new ClosedGopOutputOption()
        );

        this.setThreadCount(ffmpegState, desiredState, pipelineSteps);
        this.setSceneDetect(videoStream, desiredState, pipelineSteps);

        return new FFmpegPipeline(pipelineSteps);
    }

    setThreadCount(ffmpegState: FFmpegState, desiredState: FrameState, pipelineSteps: Array<PipelineStep>): void {
        if (desiredState.realtime) {
            console.log("Forcing 1 ffmpeg thread due to buggy combination of stream seek and realtiem output");
            pipelineSteps.unshift(new ThreadCountOption(1));
        } else {
            const threadCount = getOrElse(() => 0)(ffmpegState.threadCount);
            pipelineSteps.unshift(new ThreadCountOption(threadCount));
        }
    }

    setSceneDetect(videoStream: VideoStream, desiredState: FrameState, pipelineSteps: Array<PipelineStep>): void {
        // -sc_threshold 0 is unsupported with mpeg2video
        // TODO: this also isn't supported by videotoolbox
        if (videoStream.codec == VideoFormat.Mpeg2Video || desiredState.videoFormat == VideoFormat.Mpeg2Video) {
            pipelineSteps.push(new NoSceneDetectOutputOption(1_000_000_000));
        } else {
            pipelineSteps.push(new NoSceneDetectOutputOption(0));
        }
    }
}
