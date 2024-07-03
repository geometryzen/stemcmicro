import { absfunc } from "../src/eigenmath";
xdescribe("index", () => {
    it("eignemath", () => {
        expect(true).toBe(true);
    });
    it("absfunc", () => {
        expect(typeof absfunc === "function").toBe(true);
    });
});
