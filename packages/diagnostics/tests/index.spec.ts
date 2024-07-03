import { diagnostic } from "../src/diagnostics";

xdescribe("diagnostics", () => {
    it("diagnostic", () => {
        expect(typeof diagnostic === "function").toBe(true);
    });
});
