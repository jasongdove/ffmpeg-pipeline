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
import { StreamSeekInputOption } from "../option/streamSeekInputOption";
import { RealtimeInputOption } from "../option/realtimeInputOption";
import { AudioInputFile, VideoInputFile } from "../inputFile";
import { TimeLimitOutputOption } from "../option/timeLimitOutputOption";
import { EncoderCopyAudio } from "../encoder/encoderCopyAudio";
import { EncoderCopyVideo } from "../encoder/encoderCopyVideo";
import { DoNotMapMetadataOutputOption } from "../option/doNotMapMetadataOutputOption";
import { OutputFormatMpegTs } from "../option/outputFormatMpegTs";
import { PipeProtocol } from "../option/pipeProtocol";
import { MetadataServiceProviderOutputOption } from "../option/metadataServiceProviderOutputOption";
import { MetadataServiceNameOutputOption } from "../option/metadataServiceNameOutputOption";
import { MetadataAudioLanguageOutputOption } from "../option/metadataAudioLanguageOutputOption";

export abstract class PipelineBuilderBase {
    constructor(private videoInputFile: VideoInputFile, private audioInputFile: AudioInputFile | null) {}

    build(ffmpegState: FFmpegState, desiredState: FrameState): FFmpegPipeline {
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

        const videoStream = this.videoInputFile.videoStreams[0];

        this.setThreadCount(ffmpegState, desiredState, pipelineSteps);
        this.setSceneDetect(videoStream, desiredState, pipelineSteps);
        this.setStreamSeek(ffmpegState);
        this.setTimeLimit(ffmpegState, pipelineSteps);
        this.setRealtimeInput(desiredState);

        if (desiredState.videoFormat == VideoFormat.Copy) {
            pipelineSteps.push(new EncoderCopyVideo());
        } else {
            // TODO: build video pipeline
        }

        if (this.audioInputFile == null) {
            pipelineSteps.push(new EncoderCopyAudio());
        } else {
            // TODO: build audio pipeline
        }

        this.setDoNotMapMetadata(ffmpegState, pipelineSteps);
        this.setMetadataServiceProvider(ffmpegState, pipelineSteps);
        this.setMetadataServiceName(ffmpegState, pipelineSteps);
        this.setMetadataAudioLanguage(ffmpegState, pipelineSteps);
        this.setOutputFormat(pipelineSteps);

        // TODO: complex filter

        return new FFmpegPipeline(pipelineSteps);
    }

    setThreadCount(ffmpegState: FFmpegState, desiredState: FrameState, pipelineSteps: Array<PipelineStep>): void {
        if (desiredState.realtime) {
            console.log("Forcing 1 ffmpeg thread due to buggy combination of stream seek and realtime output");
            pipelineSteps.unshift(new ThreadCountOption(1));
        } else {
            pipelineSteps.unshift(new ThreadCountOption(ffmpegState.threadCount ?? 0));
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

    setStreamSeek(ffmpegState: FFmpegState): void {
        // TODO: is this right? what format do we get the start time from dtv?
        if (ffmpegState.start != null) {
            const option = new StreamSeekInputOption(ffmpegState.start);

            if (this.audioInputFile != null) {
                this.audioInputFile.addOption(option);
            }

            this.videoInputFile.addOption(option);
        }
    }

    setTimeLimit(ffmpegState: FFmpegState, pipelineSteps: Array<PipelineStep>) {
        if (ffmpegState.finish != null) {
            pipelineSteps.push(new TimeLimitOutputOption(ffmpegState.finish));
        }
    }

    setRealtimeInput(desiredState: FrameState): void {
        if (desiredState.realtime != null) {
            const option = new RealtimeInputOption();

            if (this.audioInputFile != null) {
                this.audioInputFile.addOption(option);
            }

            this.videoInputFile.addOption(option);
        }
    }

    setDoNotMapMetadata(ffmpegState: FFmpegState, pipelineSteps: Array<PipelineStep>) {
        if (ffmpegState.doNotMapMetadata) {
            pipelineSteps.push(new DoNotMapMetadataOutputOption());
        }
    }

    setMetadataServiceProvider(ffmpegState: FFmpegState, pipelineSteps: Array<PipelineStep>) {
        if (ffmpegState.metadataServiceProvider != null) {
            pipelineSteps.push(new MetadataServiceProviderOutputOption(ffmpegState.metadataServiceProvider));
        }
    }

    setMetadataServiceName(ffmpegState: FFmpegState, pipelineSteps: Array<PipelineStep>) {
        if (ffmpegState.metadataServiceName != null) {
            pipelineSteps.push(new MetadataServiceNameOutputOption(ffmpegState.metadataServiceName));
        }
    }

    setMetadataAudioLanguage(ffmpegState: FFmpegState, pipelineSteps: Array<PipelineStep>) {
        if (ffmpegState.metadataAudioLanguage != null) {
            pipelineSteps.push(new MetadataAudioLanguageOutputOption(ffmpegState.metadataAudioLanguage));
        }
    }

    setOutputFormat(pipelineSteps: Array<PipelineStep>): void {
        pipelineSteps.push(new OutputFormatMpegTs(), new PipeProtocol());
    }
}
