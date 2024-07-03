import { inverse } from "../src/inverse";

describe("helpers", () => {
    it("inverse", () => {
        expect(typeof inverse === "function").toBe(true);
    });
});
