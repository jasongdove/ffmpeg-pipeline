import { PipelineBuilder } from "../interfaces/pipelineBuilder";
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
import { AudioEncoder } from "../encoder/audioEncoder";
import { EncoderCopyVideo } from "../encoder/encoderCopyVideo";
import { DoNotMapMetadataOutputOption } from "../option/doNotMapMetadataOutputOption";
import { OutputFormatMpegTs } from "../option/outputFormatMpegTs";
import { PipeProtocol } from "../option/pipeProtocol";
import { MetadataServiceProviderOutputOption } from "../option/metadataServiceProviderOutputOption";
import { MetadataServiceNameOutputOption } from "../option/metadataServiceNameOutputOption";
import { MetadataAudioLanguageOutputOption } from "../option/metadataAudioLanguageOutputOption";
import { FilterChain } from "../filterChain";
import { FrameRateOutputOption } from "../option/frameRateOutputOption";
import { VideoTrackTimescaleOutputOption } from "../option/videoTrackTimescaleOutputOption";
import { VideoBitrateOutputOption } from "../option/videoBitrateOutputOption";
import { VideoBufferSizeOutputOption } from "../option/videoBufferSizeOutputOption";
import { Decoder } from "../interfaces/decoder";
import { DecoderHevc } from "../decoder/decoderHevc";
import { DecoderH264 } from "../decoder/decoderH264";
import { DecoderMpeg1Video } from "../decoder/decoderMpeg1Video";
import { DecoderMpeg2Video } from "../decoder/decoderMpeg2Video";
import { DecoderVc1 } from "../decoder/decoderVc1";
import { DecoderMsMpeg4V2 } from "../decoder/decoderMsMpeg4V2";
import { DecoderMsMpeg4V3 } from "../decoder/decoderMsMpeg4V3";
import { DecoderMpeg4 } from "../decoder/decoderMpeg4";
import { DecoderVp9 } from "../decoder/decoderVp9";
import { DecoderImplicit } from "../decoder/decoderImplicit";
import { Encoder } from "../interfaces/encoder";
import { FrameDataLocation } from "../frameDataLocation";
import { EncoderLibx264 } from "../encoder/encoderLibx264";
import { EncoderLibx265 } from "../encoder/encoderLibx265";
import { EncoderMpeg2Video } from "../encoder/encoderMpeg2Video";
import { EncoderImplicitVideo } from "../encoder/encoderImplicitVideo";
import { ComplexFilter } from "../filter/complexFilter";
import { AudioChannelsOutputOption } from "../option/audioChannelsOutputOption";
import { AudioState } from "../state/audioState";
import { AudioBitrateOutputOption } from "../option/audioBitrateOutputOption";
import { AudioBufferSizeOutputOption } from "../option/audioBufferSizeOutputOption";
import { AudioSampleRateOutputOption } from "../option/audioSampleRateOutputOption";
import { AudioPadFilter } from "../filter/audioPadFilter";

export abstract class PipelineBuilderBase implements PipelineBuilder {
    constructor(protected videoInputFile: VideoInputFile, private audioInputFile: AudioInputFile | null) {}

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

        const filterChain = new FilterChain();

        if (desiredState.videoFormat == VideoFormat.Copy) {
            pipelineSteps.push(new EncoderCopyVideo());
        } else {
            this.buildVideoPipeline(videoStream, ffmpegState, desiredState, pipelineSteps, filterChain);
        }

        if (this.audioInputFile == null) {
            pipelineSteps.push(new EncoderCopyAudio());
        } else {
            this.buildAudioPipeline(this.audioInputFile.desiredState, pipelineSteps);
        }

        this.setDoNotMapMetadata(ffmpegState, pipelineSteps);
        this.setMetadataServiceProvider(ffmpegState, pipelineSteps);
        this.setMetadataServiceName(ffmpegState, pipelineSteps);
        this.setMetadataAudioLanguage(ffmpegState, pipelineSteps);
        this.setOutputFormat(pipelineSteps);

        const complexFilter = new ComplexFilter(this.videoInputFile, this.audioInputFile, filterChain);
        pipelineSteps.push(complexFilter);

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

    buildVideoPipeline(
        videoStream: VideoStream,
        ffmpegState: FFmpegState,
        desiredState: FrameState,
        pipelineSteps: Array<PipelineStep>,
        filterChain: FilterChain
    ): void {
        this.setAccelState(videoStream, ffmpegState, desiredState, pipelineSteps);

        const maybeDecoder = this.setDecoder(videoStream, ffmpegState, pipelineSteps);

        this.setFrameRateOutput(desiredState, pipelineSteps);
        this.setVideoTrackTimescaleOutput(desiredState, pipelineSteps);
        this.setVideoBitrateOutput(desiredState, pipelineSteps);
        this.setVideoBufferSizeOutput(desiredState, pipelineSteps);

        this.setVideoFilters(videoStream, maybeDecoder, ffmpegState, desiredState, pipelineSteps, filterChain);
    }

    protected abstract setAccelState(
        videoStream: VideoStream,
        ffmpegState: FFmpegState,
        desiredState: FrameState,
        pipelineSteps: Array<PipelineStep>
    ): void;

    protected abstract setDecoder(
        videoStream: VideoStream,
        ffmpegState: FFmpegState,
        pipelineSteps: Array<PipelineStep>
    ): Decoder | null;

    protected getEncoder(_ffmpegState: FFmpegState, currentState: FrameState, desiredState: FrameState) {
        return this.getSoftwareEncoder(currentState, desiredState);
    }

    protected abstract setVideoFilters(
        videoStream: VideoStream,
        maybeDecoder: Decoder | null,
        ffmpegState: FFmpegState,
        desiredState: FrameState,
        pipelineSteps: Array<PipelineStep>,
        filterChain: FilterChain
    ): void;

    protected getSoftwareDecoder(videoStream: VideoStream): Decoder {
        switch (videoStream.codec) {
            case VideoFormat.Hevc:
                return new DecoderHevc();
            case VideoFormat.H264:
                return new DecoderH264();
            case VideoFormat.Mpeg1Video:
                return new DecoderMpeg1Video();
            case VideoFormat.Mpeg2Video:
                return new DecoderMpeg2Video();
            case VideoFormat.Vc1:
                return new DecoderVc1();
            case VideoFormat.MsMpeg4V2:
                return new DecoderMsMpeg4V2();
            case VideoFormat.MsMpeg4V3:
                return new DecoderMsMpeg4V3();
            case VideoFormat.Mpeg4:
                return new DecoderMpeg4();
            case VideoFormat.Vp9:
                return new DecoderVp9();
            case VideoFormat.Undetermined:
                return new DecoderImplicit();
            default:
                // TODO: log something?
                return new DecoderImplicit();
        }
    }

    protected getSoftwareEncoder(currentState: FrameState, desiredState: FrameState): Encoder {
        switch (desiredState.videoFormat) {
            case VideoFormat.Hevc:
                currentState.frameDataLocation = FrameDataLocation.Software;
                return new EncoderLibx265(currentState);
            case VideoFormat.H264:
                return new EncoderLibx264();
            case VideoFormat.Mpeg2Video:
                return new EncoderMpeg2Video();
            case VideoFormat.Copy:
                return new EncoderCopyVideo();
            case VideoFormat.Undetermined:
                return new EncoderImplicitVideo();
            default:
                // TODO: log something?
                return new EncoderImplicitVideo();
        }
    }

    private setFrameRateOutput(desiredState: FrameState, pipelineSteps: Array<PipelineStep>): void {
        if (desiredState.frameRate != null) {
            pipelineSteps.push(new FrameRateOutputOption(desiredState.frameRate));
        }
    }

    private setVideoTrackTimescaleOutput(desiredState: FrameState, pipelineSteps: Array<PipelineStep>): void {
        if (desiredState.videoTrackTimescale != null) {
            pipelineSteps.push(new VideoTrackTimescaleOutputOption(desiredState.videoTrackTimescale));
        }
    }

    private setVideoBitrateOutput(desiredState: FrameState, pipelineSteps: Array<PipelineStep>): void {
        if (desiredState.videoBitrate != null) {
            pipelineSteps.push(new VideoBitrateOutputOption(desiredState.videoBitrate));
        }
    }

    private setVideoBufferSizeOutput(desiredState: FrameState, pipelineSteps: Array<PipelineStep>): void {
        if (desiredState.videoBufferSize != null) {
            pipelineSteps.push(new VideoBufferSizeOutputOption(desiredState.videoBufferSize));
        }
    }

    private buildAudioPipeline(desiredState: AudioState, pipelineSteps: Array<PipelineStep>): void {
        const encoder = new AudioEncoder(desiredState.audioEncoder);
        pipelineSteps.push(encoder);

        this.setAudioChannels(desiredState, pipelineSteps);
        this.setAudioBitrate(desiredState, pipelineSteps);
        this.setAudioBufferSize(desiredState, pipelineSteps);
        this.setAudioSampleRate(desiredState, pipelineSteps);
        // TODO: this.setAudioVolume();
        this.setAudioPad(desiredState);
    }

    private setAudioChannels(desiredState: AudioState, pipelineSteps: Array<PipelineStep>): void {
        const audioStream = this.audioInputFile?.audioStreams.at(0);
        if (audioStream != null) {
            pipelineSteps.push(
                new AudioChannelsOutputOption(audioStream.codec, audioStream.channels, desiredState.audioChannels)
            );
        }
    }

    private setAudioBitrate(desiredState: AudioState, pipelineSteps: Array<PipelineStep>): void {
        if (desiredState.audioBitrate != null) {
            pipelineSteps.push(new AudioBitrateOutputOption(desiredState.audioBitrate));
        }
    }

    private setAudioBufferSize(desiredState: AudioState, pipelineSteps: Array<PipelineStep>): void {
        if (desiredState.audioBufferSize != null) {
            pipelineSteps.push(new AudioBufferSizeOutputOption(desiredState.audioBufferSize));
        }
    }

    private setAudioSampleRate(desiredState: AudioState, pipelineSteps: Array<PipelineStep>): void {
        if (desiredState.audioSampleRate != null) {
            pipelineSteps.push(new AudioSampleRateOutputOption(desiredState.audioSampleRate));
        }
    }

    private setAudioPad(desiredState: AudioState): void {
        if (desiredState.audioDuration != null && this.audioInputFile != null) {
            this.audioInputFile.filterSteps.push(new AudioPadFilter(desiredState.audioDuration));
        }
    }
}
