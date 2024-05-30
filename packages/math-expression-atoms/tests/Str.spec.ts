import { U } from "math-expression-tree";
import { assert_str, is_str, Str } from "../src/str/Str";

class BogusAtom implements U {
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

test("new Str(str, pos, end)", function () {
    const text = "Hello, World!";
    const s = new Str(text, 5, 23);
    expect(s.str).toBe(text);
    expect(s.pos).toBe(5);
    expect(s.end).toBe(23);
    expect(s.name).toBe("string");
    expect(s.iscons).toBe(false);
    expect(s.isnil).toBe(false);
});

test("equalsStr", function () {
    const a = new Str("a");
    const b = new Str("b");
    const s = new Str("a");

    expect(a.equalsStr(a)).toBe(true);
    expect(a.equalsStr(b)).toBe(false);
    expect(a.equalsStr(s)).toBe(true);

    expect(b.equalsStr(a)).toBe(false);
    expect(b.equalsStr(b)).toBe(true);
    expect(b.equalsStr(s)).toBe(false);

    expect(s.equalsStr(a)).toBe(true);
    expect(s.equalsStr(b)).toBe(false);
    expect(s.equalsStr(s)).toBe(true);
});

test("equals", function () {
    const a = new Str("a");
    const b = new Str("b");
    const s = new Str("a");
    const bogus = new BogusAtom();

    expect(a.equals(a)).toBe(true);
    expect(a.equals(b)).toBe(false);
    expect(a.equals(s)).toBe(true);

    expect(b.equals(a)).toBe(false);
    expect(b.equals(b)).toBe(true);
    expect(b.equals(s)).toBe(false);

    expect(s.equals(a)).toBe(true);
    expect(s.equals(b)).toBe(false);
    expect(s.equals(s)).toBe(true);

    expect(a.equals(bogus)).toBe(false);
});

test("toString", function () {
    const text = "Hello, World!";
    const s = new Str(text, 5, 23);
    expect(s.toString()).toBe(text);
});

test("toInfixString", function () {
    const text = "Hello, World!";
    const s = new Str(text, 5, 23);
    expect(s.toInfixString()).toBe('"Hello, World!"');
});

test("toListString", function () {
    const text = "Hello, World!";
    const s = new Str(text, 5, 23);
    expect(s.toListString()).toBe('"Hello, World!"');
});

test("is_str", function () {
    const text = "Hello, World!";
    const s = new Str(text, 5, 23);
    expect(is_str(s)).toBe(true);
    expect(is_str(new BogusAtom())).toBe(false);
});

test("assert_str", function () {
    const text = "Hello, World!";
    const greeting = new Str(text, 5, 23);
    const s = assert_str(greeting);
    expect(s).toStrictEqual(greeting);

    try {
        assert_str(new BogusAtom());
        fail();
    } catch (e) {
        if (e instanceof Error) {
            expect(e.message).toBe("Expecting a Str but got expression [object Object].");
        } else {
            fail();
        }
    }
});
