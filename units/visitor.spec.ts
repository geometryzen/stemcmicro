import { assert } from "chai";
import { Boo, booF, booT, booU, create_flt, create_rat, create_sym, Flt, Keyword, Map, Rat, Str, Sym, Tensor } from "math-expression-atoms";
import { nil, U } from "math-expression-tree";
import { create_tensor } from "../src/tensor/create_tensor";
import { visit } from '../src/visitor/visit';
import { Visitor } from '../src/visitor/Visitor';

class TestVisitor implements Visitor {
    readonly items: U[] = [];
    constructor() { }
    beginMap(map: Map): void {
        this.items.push(map);
    }
    endMap(map: Map): void {
        this.items.push(map);
    }
    beginTensor(tensor: Tensor<U>): void {
        this.items.push(tensor);
    }
    endTensor(tensor: Tensor<U>): void {
        this.items.push(tensor);
    }
    beginCons(): void {
    }
    endCons(): void {
    }
    boo(boo: Boo): void {
        this.items.push(boo);
    }
    keyword(keyword: Keyword): void {
        this.items.push(keyword);
    }
    str(str: Str): void {
        this.items.push(str);
    }
    rat(rat: Rat): void {
        this.items.push(rat);
    }
    flt(flt: Flt): void {
        this.items.push(flt);
    }
    sym(sym: Sym): void {
        this.items.push(sym);
    }
    atom(atom: U): void {
        this.items.push(atom);
    }
    nil(expr: U): void {
        this.items.push(expr);
    }
}

describe("visitor", function () {
    it("nil", function () {
        const visitor = new TestVisitor();
        visit(nil, visitor);
        const items = visitor.items;
        assert.strictEqual(items.length, 1);
        assert.strictEqual(items[0], nil);
    });
    it("Sym", function () {
        const visitor = new TestVisitor();
        const atom = create_sym('foo');
        visit(atom, visitor);
        const items = visitor.items;
        assert.strictEqual(items.length, 1);
        assert.strictEqual(items[0], atom);
    });
    it("Rat", function () {
        const visitor = new TestVisitor();
        const atom = create_rat(1, 2);
        visit(atom, visitor);
        const items = visitor.items;
        assert.strictEqual(items.length, 1);
        assert.strictEqual(items[0], atom);
    });
    it("Flt", function () {
        const visitor = new TestVisitor();
        const atom = create_flt(Math.PI);
        visit(atom, visitor);
        const items = visitor.items;
        assert.strictEqual(items.length, 1);
        assert.strictEqual(items[0], atom);
    });
    it("Str", function () {
        const visitor = new TestVisitor();
        const atom = new Str("foo");
        visit(atom, visitor);
        const items = visitor.items;
        assert.strictEqual(items.length, 1);
        assert.strictEqual(items[0], atom);
    });
    it("Boo", function () {
        const visitor = new TestVisitor();
        const atom = booT;
        visit(atom, visitor);
        const items = visitor.items;
        assert.strictEqual(items.length, 1);
        assert.strictEqual(items[0], atom);
    });
    it("Tensor", function () {
        const visitor = new TestVisitor();
        const atom = create_tensor([booT, booF, booU]);
        visit(atom, visitor);
        const items = visitor.items;
        assert.strictEqual(items.length, 5);
        assert.strictEqual(items[0], atom);
        assert.strictEqual(items[1], booT);
        assert.strictEqual(items[2], booF);
        assert.strictEqual(items[3], booU);
        assert.strictEqual(items[4], atom);
    });
    it("Map", function () {
        const visitor = new TestVisitor();
        const word = create_sym('word');
        const alice = new Str("Alice");
        const atom = new Map([[word, alice]]);
        visit(atom, visitor);
        const items = visitor.items;
        assert.strictEqual(items.length, 4);
        assert.strictEqual(items[0], atom);
        assert.strictEqual(items[1], word);
        assert.strictEqual(items[2], alice);
        assert.strictEqual(items[3], atom);
    });
});
