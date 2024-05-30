import { Cons0, Cons1, Cons2, Cons3, Cons4 } from "../src/helpers";
import { Atom, car, cdr, Cons, cons, is_atom, is_cons, is_nil, is_singleton, items_to_cons, nil, U } from "../src/tree";

/**
 * This is just a test atom, so we expose the reference count.
 */
class MyAtom implements Atom {
    readonly name = "MyAtom";
    readonly type = "myatom";
    #refCount = 1;
    constructor(readonly value: string) {}
    #destructor(): void {}
    addRef(): void {
        this.#refCount++;
    }
    release(): void {
        this.#refCount--;
        if (this.#refCount === 0) {
            this.#destructor();
        }
    }
    contains(needle: U): boolean {
        return this.equals(needle);
    }
    equals(other: U): boolean {
        if (other === this) {
            return true;
        } else {
            if (other instanceof MyAtom) {
                return this.value === other.value;
            } else {
                return false;
            }
        }
    }
    get iscons(): boolean {
        return false;
    }
    get isnil(): boolean {
        return false;
    }
    get refCount(): number {
        return this.#refCount;
    }
    toString(): string {
        return `Atom('${this.value}')`;
    }
    pos?: number;
    end?: number;
}

test("is_nil(nil)", function () {
    expect(is_nil(nil)).toBe(true);
});
test("is_singleton", function () {
    expect(is_singleton(nil)).toBe(false);
    const foo = new MyAtom("foo");
    const bar = new MyAtom("bar");
    const X = items_to_cons(foo);
    const Y = items_to_cons(foo, bar);
    expect(is_singleton(X)).toBe(true);
    expect(is_singleton(Y)).toBe(false);
});
test("name", function () {
    expect(nil.name).toBe("Nil");
    const foo = new MyAtom("foo");
    expect(foo.name).toBe("MyAtom");
    const X = items_to_cons(foo);
    expect(X.name).toBe("Cons");
});
test("type", function () {
    const foo = new MyAtom("foo");
    expect(is_atom(foo)).toBe(true);
    expect(foo.type).toBe("myatom");
});
test("is_atom", function () {
    const foo = new MyAtom("foo");
    expect(is_atom(foo)).toBe(true);
    expect(is_atom(nil)).toBe(false);
    const X = items_to_cons(foo);
    expect(is_atom(X)).toBe(false);
});
test("is_cons", function () {
    const foo = new MyAtom("foo");
    expect(is_cons(foo)).toBe(false);
    expect(is_cons(nil)).toBe(false);
    const X = items_to_cons(foo);
    expect(is_cons(X)).toBe(true);
    expect(is_cons(void 0 as unknown as U)).toBe(false);
});
test("car", function () {
    expect(nil.car).toBe(nil);
    const foo = new MyAtom("foo");
    const X = items_to_cons(foo);
    expect(X.car).toBe(foo);
});
test("cdr", function () {
    expect(nil.cdr).toBe(nil);
    const foo = new MyAtom("foo");
    const X = items_to_cons(foo);
    expect(X.cdr).toBe(nil);
});
test("rest", function () {
    expect(nil.rest).toBe(nil);
    const foo = new MyAtom("foo");
    const X = items_to_cons(foo);
    expect(X.rest).toBe(nil);
});
test("length", function () {
    expect(nil.length).toBe(0);
    const a = new MyAtom("a");
    const b = new MyAtom("b");
    const c = new MyAtom("c");
    const d = new MyAtom("d");
    const e = new MyAtom("3");
    const X0 = items_to_cons(a) as Cons0<MyAtom>;
    const X1 = items_to_cons(a, b) as Cons1<MyAtom, MyAtom>;
    const X2 = items_to_cons(a, b, c) as Cons2<MyAtom, MyAtom, MyAtom>;
    const X3 = items_to_cons(a, b, c, d) as Cons3<MyAtom, MyAtom, MyAtom, MyAtom>;
    const X4 = items_to_cons(a, b, c, d, e) as Cons4<MyAtom, MyAtom, MyAtom, MyAtom, MyAtom>;
    expect(X0.length).toBe(1);
    expect(X1.length).toBe(2);
    expect(X2.length).toBe(3);
    expect(X3.length).toBe(4);
    expect(X4.length).toBe(5);
});
test("equal_cons_cons", function () {
    expect(nil.length).toBe(0);
    const foo = new MyAtom("foo");
    const bar = new MyAtom("bar");
    const X = items_to_cons(foo);
    const Y = items_to_cons(foo, bar);
    expect(nil.equals(nil)).toBe(true);
    expect(nil.equals(X)).toBe(false);
    expect(nil.equals(Y)).toBe(false);
    expect(X.equals(nil)).toBe(false);
    expect(X.equals(X)).toBe(true);
    expect(X.equals(Y)).toBe(false);
    expect(Y.equals(nil)).toBe(false);
    expect(Y.equals(X)).toBe(false);
    expect(Y.equals(Y)).toBe(true);
});
test("iscons()", function () {
    expect(nil.iscons).toBe(false);
    const foo = new MyAtom("foo");
    const X = items_to_cons(foo);
    expect(X.iscons).toBe(true);
});
test("Cons.isnil()", function () {
    expect(nil.isnil).toBe(true);
    const foo = new MyAtom("foo");
    const X = items_to_cons(foo);
    expect(X.isnil).toBe(false);
});
test("Cons.contains(needle: U): boolean", function () {
    const foo = new MyAtom("foo");
    const bar = new MyAtom("bar");
    expect(nil.contains(foo)).toBe(false);
    const X = items_to_cons(foo);
    const Y = items_to_cons(foo, bar);
    const Z = items_to_cons(X, bar);
    expect(X.contains(foo)).toBe(true);
    expect(X.contains(bar)).toBe(false);
    expect(X.contains(X)).toBe(true);
    expect(Y.contains(foo)).toBe(true);
    expect(Y.contains(bar)).toBe(true);
    expect(Z.contains(foo)).toBe(true);
    expect(Z.contains(bar)).toBe(true);
});
test("Cons.equals(other: U): boolean", function () {
    const foo = new MyAtom("foo");
    const bar = new MyAtom("bar");
    expect(nil.contains(foo)).toBe(false);
    const X = items_to_cons(foo);
    const Y = items_to_cons(foo, bar);
    const Z = items_to_cons(X, bar);
    expect(X.equals(foo)).toBe(false);
    expect(X.equals(bar)).toBe(false);
    expect(X.equals(X)).toBe(true);
    expect(X.equals(Y)).toBe(false);
    expect(Y.equals(foo)).toBe(false);
    expect(Y.equals(bar)).toBe(false);
    expect(Z.equals(foo)).toBe(false);
    expect(Z.equals(bar)).toBe(false);
});
test("Cons.base", function () {
    const foo = new MyAtom("foo");
    const bar = new MyAtom("bar");
    const baz = new MyAtom("baz");
    const X = items_to_cons(foo, bar, baz);
    expect(X.base).toBe(bar);
});
test("Cons.expo", function () {
    const foo = new MyAtom("foo");
    const bar = new MyAtom("bar");
    const baz = new MyAtom("baz");
    const X = items_to_cons(foo, bar, baz);
    expect(X.expo).toBe(baz);
});
test("Cons.toString()", function () {
    const foo = new MyAtom("foo");
    const bar = new MyAtom("bar");
    const baz = new MyAtom("baz");
    const X = items_to_cons(foo, bar, baz);
    expect(X.toString()).toBe("(Atom('foo') (Atom('bar') (Atom('baz') ())))");
    expect(nil.toString()).toBe("()");
});
test("Cons.head", function () {
    const foo = new MyAtom("foo");
    const bar = new MyAtom("bar");
    const baz = new MyAtom("baz");
    const X = items_to_cons(foo, bar, baz);
    expect(X.head).toBe(foo);
});
test("Cons.tail", function () {
    const foo = new MyAtom("foo");
    const bar = new MyAtom("bar");
    const baz = new MyAtom("baz");
    const X = items_to_cons(foo, bar, baz);
    const tail = X.tail();
    expect(tail.length).toBe(2);
    expect(tail[0]).toBe(bar);
    expect(tail[1]).toBe(baz);
});
test("Cons.opr", function () {
    const foo = new MyAtom("foo");
    const bar = new MyAtom("bar");
    const baz = new MyAtom("baz");
    const X = items_to_cons(foo, bar, baz);
    expect(X.opr).toBe(foo);
});
test("Cons.arg", function () {
    const foo = new MyAtom("foo");
    const bar = new MyAtom("bar");
    const baz = new MyAtom("baz");
    const X = items_to_cons(foo, bar, baz);
    expect(X.arg).toBe(bar);
});
test("Cons.lhs", function () {
    const foo = new MyAtom("foo");
    const bar = new MyAtom("bar");
    const baz = new MyAtom("baz");
    const X = items_to_cons(foo, bar, baz);
    expect(X.lhs).toBe(bar);
});
test("Cons.rhs", function () {
    const foo = new MyAtom("foo");
    const bar = new MyAtom("bar");
    const baz = new MyAtom("baz");
    const X = items_to_cons(foo, bar, baz) as Cons2<MyAtom, MyAtom, MyAtom>;
    expect(X.rhs).toBe(baz);
});
test("Cons.item(index: number): U", function () {
    const opr = new MyAtom("opr");
    const a = new MyAtom("a");
    const b = new MyAtom("b");
    const c = new MyAtom("c");
    const d = new MyAtom("d");
    const X = items_to_cons(opr, a, b, c, d) as Cons4<MyAtom, MyAtom, MyAtom, MyAtom, MyAtom>;
    expect(X.item(0)).toBe(opr);
    expect(X.item(1)).toBe(a);
    expect(X.item(2)).toBe(b);
    expect(X.item(3)).toBe(c);
    expect(X.item(4)).toBe(d);
    expect(X.item(5).isnil).toBe(true);
    expect(X.item(-1).isnil).toBe(true);
    expect(X.item0).toBe(opr);
    expect(X.item1).toBe(a);
    expect(X.item2).toBe(b);
    expect(X.item3).toBe(c);
    expect(X.item4).toBe(d);
});
test("cons(car: U, cdr: U): Cons", function () {
    expect(nil.car).toBe(nil);
    const foo = new MyAtom("foo");
    const X = cons(foo, nil);
    expect(X.car).toBe(foo);
});
test("car(node:U): U", function () {
    expect(car(nil)).toBe(nil);
    const foo = new MyAtom("foo");
    const X = cons(foo, nil);
    expect(car(X)).toBe(foo);
});
test("cdr(node:U): U", function () {
    expect(cdr(nil)).toBe(nil);
    const foo = new MyAtom("foo");
    const X = cons(foo, nil);
    expect(cdr(X)).toBe(nil);
});
test("empty", function () {
    const empty = new Cons(void 0, void 0, 23, 26);
    expect(empty.isnil).toBe(true);
    expect(empty.iscons).toBe(false);
    expect(empty.equals(nil)).toBe(true);
    expect(empty.length).toBe(0);
    expect(is_nil(empty)).toBe(true);
    expect(cdr(empty)).toBe(nil);
});
