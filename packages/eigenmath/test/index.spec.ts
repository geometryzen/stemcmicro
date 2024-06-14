import { absfunc } from "../src/eigenmath";
describe("index", () => {
    it("eignemath", () => {
        expect(true).toBe(true);
    });
    it("absfunc", () => {
        expect(typeof absfunc === "function").toBe(true);
    });
});
