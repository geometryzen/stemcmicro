import { Directive } from "../src/Directive";

describe("index", () => {
    it("Directive", () => {
        expect(typeof Directive === "object").toBe(true);
    });
});
