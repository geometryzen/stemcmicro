import { Atom, is_atom, U } from "math-expression-tree";
import { assert_boo, Boo, booF, booT, booU, create_boo, is_boo } from "../src/index";

class BogusAtom implements Atom {
    readonly type = "bogus";
    addRef(): void {}
    release(): void {}
    get name(): string {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    contains(needle: U): boolean {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    equals(other: U): boolean {
        throw new Error("Method not implemented.");
    }
    get iscons(): boolean {
        throw new Error("Method not implemented.");
    }
    get isnil(): boolean {
        throw new Error("Method not implemented.");
    }
    pos?: number;
    end?: number;
}

test("ceate_boo", function () {
    expect(create_boo(true)).toBe(booT);
    expect(is_atom(create_boo(true))).toBe(true);
});
test("Boo.equals(other:U): boolean", function () {
    const bogus = new BogusAtom();
    expect(booT.equals(booT)).toBe(true);
    expect(booF.equals(booT)).toBe(false);
    expect(booU.equals(booT)).toBe(false);
    expect(booT.equals(bogus)).toBe(false);
    expect(booF.equals(bogus)).toBe(false);
    expect(booU.equals(bogus)).toBe(false);
});
test("Boo.isTrue(): boolean", function () {
    expect(booT.isTrue()).toBe(true);
    expect(booF.isTrue()).toBe(false);
    expect(booU.isTrue()).toBe(false);
});
test("Boo.isFalse(): boolean", function () {
    expect(booT.isFalse()).toBe(false);
    expect(booF.isFalse()).toBe(true);
    expect(booU.isFalse()).toBe(false);
});
test("Boo.toString(): string", function () {
    expect(booT.toString()).toBe("Boo(true)");
    expect(booF.toString()).toBe("Boo(false)");
    expect(booU.toString()).toBe("Boo(undefined)");
});
test("Boo.valueOf(b:boolean|undefined): Boo", function () {
    expect(Boo.valueOf(true)).toBe(booT);
    expect(Boo.valueOf(false)).toBe(booF);
    expect(Boo.valueOf(void 0)).toBe(booU);
});
test("is_boo(p: unknown): p is Boo", function () {
    const bogus = new BogusAtom();
    expect(is_boo(booT)).toBe(true);
    expect(is_boo(bogus)).toBe(false);
});
test("assert_boo(expr: U): Boo", function () {
    const bogus = new BogusAtom();
    assert_boo(booT);
    assert_boo(booF);
    assert_boo(booU);
    try {
        assert_boo(bogus);
    } catch (e) {
        expect(`${e}`).toBe("Error: Expecting a Boo but got expression [object Object].");
    }
});
