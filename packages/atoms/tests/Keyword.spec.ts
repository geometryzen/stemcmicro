import { booF, booT, booU } from "../src/boo/Boo";
import { assert_keyword, create_keyword, create_keyword_ns, is_keyword, Keyword } from "../src/keyword/Keyword";

test("Construction", function () {
    const pos = 5;
    const end = 10;
    const k: Keyword = create_keyword_ns("foo", "explicit-ns", pos, end);
    expect(k.localName).toBe("foo");
    expect(k.namespace).toBe("explicit-ns");
    expect(k.key()).toBe(":explicit-ns/foo");
    expect(k.toString()).toBe('Keyword("foo", "explicit-ns")');
    expect(k.pos).toBe(pos);
    expect(k.end).toBe(end);
});
test("Keyword.equals(other: U): boolean", function () {
    const a1: Keyword = create_keyword_ns("a", "ns-1");
    const a2: Keyword = create_keyword_ns("a", "ns-2");
    const b1: Keyword = create_keyword_ns("b", "ns-1");
    const b2: Keyword = create_keyword_ns("b", "ns-2");

    expect(a1.equals(a1)).toBe(true);
    expect(a1.equals(a2)).toBe(false);
    expect(a1.equals(b1)).toBe(false);
    expect(a1.equals(b2)).toBe(false);
    expect(a1.equals(booT)).toBe(false);
    expect(a1.equals(booF)).toBe(false);
    expect(a1.equals(booU)).toBe(false);
});
test("Keyword.clone(pos?: number, end?: number): Keyword", function () {
    const pos = 5;
    const end = 10;
    const a: Keyword = create_keyword_ns("foo", "explicit-ns", pos, end);
    const b = a.clone();
    expect(a.key()).toBe(":explicit-ns/foo");
    expect(b.key()).toBe(":explicit-ns/foo");
    expect(b.equals(a)).toBe(true);
    expect(a.pos).toBe(b.pos);
    expect(a.end).toBe(b.end);

    const c = a.clone(7, 11);
    expect(c.key()).toBe(":explicit-ns/foo");
    expect(c.equals(a)).toBe(true);
    expect(c.pos).toBe(7);
    expect(c.end).toBe(11);
});
test("Keyword.contains(needle: U): boolean", function () {
    const a1: Keyword = create_keyword_ns("a", "ns-1");
    const a2: Keyword = create_keyword_ns("a", "ns-2");
    const b1: Keyword = create_keyword_ns("b", "ns-1");
    const b2: Keyword = create_keyword_ns("b", "ns-2");

    expect(a1.contains(a1)).toBe(true);
    expect(a1.contains(a2)).toBe(false);
    expect(a1.contains(b1)).toBe(false);
    expect(a1.contains(b2)).toBe(false);
    expect(a1.contains(booT)).toBe(false);
    expect(a1.contains(booF)).toBe(false);
    expect(a1.contains(booU)).toBe(false);
});
test("Keyword.compare(other: Keyword): 0 | 1 | -1", function () {
    const a: Keyword = create_keyword("a");
    const b: Keyword = create_keyword("b");
    const aa: Keyword = create_keyword_ns("a", "ns-a");
    const ba: Keyword = create_keyword_ns("b", "ns-a");
    const ab: Keyword = create_keyword_ns("a", "ns-b");
    const bb: Keyword = create_keyword_ns("b", "ns-b");

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
    const k: Keyword = create_keyword("foo", pos, end);
    expect(k.key()).toBe(":foo");
    expect(k.localName).toBe("foo");
    expect(k.namespace).toBe("");
    expect(k.toString()).toBe('Keyword("foo", "")');

    const a: Keyword = create_keyword("a", pos, end);
    const b: Keyword = create_keyword("b", pos, end);
    const alias: Keyword = create_keyword("a", pos, end);

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
test("is_keyword(expr: U): expr is Sym", function () {
    const a: Keyword = create_keyword("a");

    expect(is_keyword(a)).toBe(true);
    expect(is_keyword(booT)).toBe(false);
    expect(is_keyword(booF)).toBe(false);
    expect(is_keyword(booU)).toBe(false);
});
test("assert_sym(expr: U): Keyword", function () {
    const a: Keyword = create_keyword_ns("a", "ns");
    const b: Keyword = assert_keyword(a);
    expect(a === b).toBe(true);

    try {
        assert_keyword(booT);
        fail("assert_keyword MUST throw an Error if the argument is not a Sym");
    } catch (e) {
        expect(e instanceof Error).toBe(true);
    }
});
