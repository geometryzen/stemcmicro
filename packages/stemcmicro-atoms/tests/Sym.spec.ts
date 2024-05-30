import { booF, booT, booU } from "../src/boo/Boo";
import { assert_sym, create_sym, create_sym_ns, is_sym, Sym } from "../src/sym/Sym";

test("Construction", function () {
    const pos = 5;
    const end = 10;
    const id = 23;
    const sym: Sym = create_sym_ns("foo", "explicit-ns", pos, end, id);
    expect(sym.localName).toBe("foo");
    expect(sym.namespace).toBe("explicit-ns");
    expect(typeof sym.id).toBe("number");
    expect(sym.id).toBe(id);
    expect(sym.key()).toBe("explicit-ns/foo");
    expect(sym.toString()).toBe("explicit-ns/foo");
    expect(sym.pos).toBe(pos);
    expect(sym.end).toBe(end);
    expect(create_sym("", void 0, void 0, id).id).toBe(id);
    expect(create_sym_ns("", "", void 0, void 0, id).id).toBe(id);
    expect(typeof create_sym("", void 0, void 0, void 0).id).toBe("undefined");
    expect(typeof create_sym_ns("", "", void 0, void 0, void 0).id).toBe("undefined");
});
test("Sym.equals(other: U): boolean", function () {
    const a1: Sym = create_sym_ns("a", "ns-1");
    const a2: Sym = create_sym_ns("a", "ns-2");
    const b1: Sym = create_sym_ns("b", "ns-1");
    const b2: Sym = create_sym_ns("b", "ns-2");

    expect(a1.equals(a1)).toBe(true);
    expect(a1.equals(a2)).toBe(false);
    expect(a1.equals(b1)).toBe(false);
    expect(a1.equals(b2)).toBe(false);
    expect(a1.equals(booT)).toBe(false);
    expect(a1.equals(booF)).toBe(false);
    expect(a1.equals(booU)).toBe(false);
});
test("Sym.clone(pos?: number, end?: number): Sym", function () {
    const pos = 5;
    const end = 10;
    const a: Sym = create_sym_ns("foo", "explicit-ns", pos, end);
    const b = a.clone();
    expect(a.key()).toBe("explicit-ns/foo");
    expect(b.key()).toBe("explicit-ns/foo");
    expect(b.equals(a)).toBe(true);
    expect(a.pos).toBe(b.pos);
    expect(a.end).toBe(b.end);

    const c = a.clone(7, 11);
    expect(c.key()).toBe("explicit-ns/foo");
    expect(c.equals(a)).toBe(true);
    expect(c.pos).toBe(7);
    expect(c.end).toBe(11);
});
test("Sym.contains(needle: U): boolean", function () {
    const a1: Sym = create_sym_ns("a", "ns-1");
    const a2: Sym = create_sym_ns("a", "ns-2");
    const b1: Sym = create_sym_ns("b", "ns-1");
    const b2: Sym = create_sym_ns("b", "ns-2");

    expect(a1.contains(a1)).toBe(true);
    expect(a1.contains(a2)).toBe(false);
    expect(a1.contains(b1)).toBe(false);
    expect(a1.contains(b2)).toBe(false);
    expect(a1.contains(booT)).toBe(false);
    expect(a1.contains(booF)).toBe(false);
    expect(a1.contains(booU)).toBe(false);
});
test("Sym.compare(other: Sym): 0 | 1 | -1", function () {
    const a: Sym = create_sym("a");
    const b: Sym = create_sym("b");
    const aa: Sym = create_sym_ns("a", "ns-a");
    const ba: Sym = create_sym_ns("b", "ns-a");
    const ab: Sym = create_sym_ns("a", "ns-b");
    const bb: Sym = create_sym_ns("b", "ns-b");

    expect(a.compare(a)).toBe(0);
    expect(a.compare(b)).toBe(-1);
    expect(b.compare(a)).toBe(1);
    expect(b.compare(b)).toBe(0);

    expect(aa.compare(aa)).toBe(0);
    expect(aa.compare(ba)).toBe(-1);
    expect(aa.compare(ab)).toBe(-1);
    expect(aa.compare(bb)).toBe(-1);

    expect(ba.compare(aa)).toBe(1);
    expect(ba.compare(ba)).toBe(0);
    expect(ba.compare(ab)).toBe(-1);
    expect(ba.compare(bb)).toBe(-1);

    expect(ab.compare(aa)).toBe(1);
    expect(ab.compare(ba)).toBe(1);
    expect(ab.compare(ab)).toBe(0);
    expect(ab.compare(bb)).toBe(-1);

    expect(bb.compare(aa)).toBe(1);
    expect(bb.compare(ba)).toBe(1);
    expect(bb.compare(ab)).toBe(1);
    expect(bb.compare(bb)).toBe(0);
});
test("Backwards compatibility", function () {
    const pos = 5;
    const end = 10;
    const sym: Sym = create_sym("foo", pos, end);
    expect(sym.key()).toBe("foo");
    expect(sym.localName).toBe("foo");
    expect(sym.namespace).toBe("");
    expect(sym.toString()).toBe("foo");

    const a: Sym = create_sym("a", pos, end);
    const b: Sym = create_sym("b", pos, end);
    const alias: Sym = create_sym("a", pos, end);

    expect(a.equals(a)).toBe(true);
    expect(a.equals(b)).toBe(false);
    expect(a.equals(alias)).toBe(true);
    expect(b.equals(a)).toBe(false);
    expect(b.equals(b)).toBe(true);
    expect(b.equals(alias)).toBe(false);

    expect(a.compare(a)).toBe(0);
    expect(a.compare(b)).toBe(-1);
    expect(a.compare(alias)).toBe(0);
    expect(b.compare(a)).toBe(1);
    expect(b.compare(b)).toBe(0);
    expect(b.compare(alias)).toBe(1);
});
test("is_sym(expr: U): expr is Sym", function () {
    const a: Sym = create_sym("a");

    expect(is_sym(a)).toBe(true);
    expect(is_sym(booT)).toBe(false);
    expect(is_sym(booF)).toBe(false);
    expect(is_sym(booU)).toBe(false);
});
test("assert_sym(expr: U): Sym", function () {
    const a: Sym = create_sym_ns("a", "ns");
    const b: Sym = assert_sym(a);
    expect(a === b).toBe(true);

    try {
        assert_sym(booT);
        fail("assert_sym MUST throw an Error if the argument is not a Sym");
    } catch (e) {
        expect(e instanceof Error).toBe(true);
    }
});
