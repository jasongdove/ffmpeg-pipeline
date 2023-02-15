export class FrameSize {
    constructor(public width: number, public height: number) {}

    equals(other: FrameSize): boolean {
        return this.width == other.width && this.height == other.height;
    }
}
