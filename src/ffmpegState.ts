import { Option, none } from "fp-ts/Option";

export class FFmpegState {
    public threadCount: Option<number> = none;
}
