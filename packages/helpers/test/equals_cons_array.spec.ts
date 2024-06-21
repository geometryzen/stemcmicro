import { create_int } from "@stemcmicro/atoms";
import { items_to_cons, nil, U } from "@stemcmicro/tree";
import { equals_cons_array } from "../src/equals_cons_array";

describe("equals_cons_array", () => {
    it("items_to_cons of an empty array should be nil", () => {
        expect(items_to_cons(...[])).toBe(nil);
    });
    it("(nil, []) should be true", () => {
        expect(equals_cons_array(nil, [])).toBe(true);
    });
    it("(nil, [N]) should be false", () => {
        const N = create_int(2);
        expect(equals_cons_array(nil, [N])).toBe(false);
    });
    it("(N, []) should be false", () => {
        const N = create_int(2);
        const lhs = items_to_cons(N);
        const rhs: U[] = [];
        expect(equals_cons_array(lhs, rhs)).toBe(false);
    });
    it("((N), [N]) should be true", () => {
        const N = create_int(2);
        const lhs = items_to_cons(N);
        const rhs = [N];
        expect(lhs.length === 1);
        expect(rhs.length === 1);
        expect(equals_cons_array(lhs, [N])).toBe(true);
    });
    it("((N), [M]) should be true", () => {
        const N = create_int(2);
        const M = create_int(3);
        const lhs = items_to_cons(N);
        const rhs = [M];
        expect(lhs.length === 1);
        expect(rhs.length === 1);
        expect(equals_cons_array(lhs, rhs)).toBe(false);
    });
    it("((2,3), [2,3]) should be false", () => {
        const M = create_int(2);
        const N = create_int(3);
        expect(equals_cons_array(items_to_cons(M, N), [M, N])).toBe(true);
    });
});
