import { Test } from "../src/index";

describe("FFmpegPipeline", () => {
    it("should do something", () => {
        const result = new Test().build();
        console.log(result);
        expect(result).not.toBeNull();
    });
});
