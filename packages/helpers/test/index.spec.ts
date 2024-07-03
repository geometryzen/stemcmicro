import { inverse } from "../src/inverse";

xdescribe("helpers", () => {
    it("inverse", () => {
        expect(typeof inverse === "function").toBe(true);
    });
});
