import { assert_rat, assert_sym, create_rat, is_rat } from "@stemcmicro/atoms";
import { create_env } from "@stemcmicro/core";
import { create_engine } from "@stemcmicro/engine";
import { js_parse } from "@stemcmicro/js-parse";
import { assert_cons, cadnr } from "@stemcmicro/tree";

// The mystery here is why we can work with some packages but not engine.
describe("index", () => {
    it("atoms", () => {
        const two = create_rat(2);
        expect(is_rat(two)).toBe(true);
    });
    it("js-parse", () => {
        expect(typeof js_parse === "function").toBe(true);
        const { trees, errors } = js_parse("x = 23");
        expect(errors.length).toBe(0);
        expect(trees.length).toBe(1);
        const x_equals_2 = assert_cons(trees[0]);
        const opr = assert_sym(cadnr(x_equals_2, 0));
        expect(opr.localName).toBe("=");
        const lhs = assert_sym(cadnr(x_equals_2, 1));
        expect(lhs.localName).toBe("x");
        const rhs = assert_rat(cadnr(x_equals_2, 2));
        expect(rhs.toNumber()).toBe(23);
    });
    it("create_env", () => {
        expect(typeof create_env === "function").toBe(true);
    });
    it("engine", () => {
        expect(typeof create_engine === "function").toBe(true);
    });
});
