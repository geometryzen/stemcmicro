import { diagnostic } from "../src/diagnostics";

describe("diagnostics", () => {
    it("diagnostic", () => {
        expect(typeof diagnostic === "function").toBe(true);
    });
});
