import { Directive } from "../src/Directive";

xdescribe("index", () => {
    it("Directive", () => {
        expect(typeof Directive === "object").toBe(true);
    });
});
