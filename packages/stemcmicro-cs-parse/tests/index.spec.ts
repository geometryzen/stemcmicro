import { is_flt, is_rat } from "@stemcmicro/atoms";
import { cs_parse } from "../src/cs_parse";

describe("py_parse", () => {
    it("Rat", () => {
        const { trees, errors } = cs_parse("2");
        expect(errors.length).toBe(0);
        expect(trees.length).toBe(1);
        const tree = trees[0];
        expect(is_rat(tree)).toBe(true);
        if (is_rat(tree)) {
            expect(tree.a.toJSNumber()).toBe(2);
            expect(tree.b.toJSNumber()).toBe(1);
        }
    });
    it("Flt", () => {
        const { trees, errors } = cs_parse("0.5");
        expect(errors.length).toBe(0);
        expect(trees.length).toBe(1);
        const tree = trees[0];
        expect(is_flt(tree)).toBe(true);
        if (is_flt(tree)) {
            expect(tree.d).toBe(0.5);
        }
    });
});
