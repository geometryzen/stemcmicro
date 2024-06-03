import { hilbert } from "../src/hilbert";
import { hilbertLambdaExpr } from "../src/hilbertLambdaExpr";

describe("index", () => {
    it("hilbert", () => {
        expect(typeof hilbert === "function").toBe(true);
    });
    it("eval_hilbert", () => {
        expect(typeof hilbertLambdaExpr === "function").toBe(true);
    });
});
