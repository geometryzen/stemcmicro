import { assert } from 'chai';
import { Sym } from '../src/tree/sym/Sym';

describe("Sym", function () {
    it("constructor", function () {
        const foo = new Sym('foo');
        assert.strictEqual(foo.ln, 'foo');
        assert.isUndefined(foo.ns);
    });
    it("constructor", function () {
        const foo = new Sym('foo');
        const bar = new Sym('bar', foo);
        assert.strictEqual(bar.ln, 'bar');
        assert.strictEqual(bar.ns, foo);
    });
    it("name", function () {
        const foo = new Sym('foo');
        assert.strictEqual(foo.name, 'Sym');
    });
    it("toString", function () {
        const foo = new Sym('foo');
        const bar = new Sym('bar', foo);
        assert.strictEqual(foo.toString(), 'foo');
        assert.strictEqual(bar.toString(), 'foo.bar');
    });
    it("toIndexString", function () {
        const foo = new Sym('foo');
        const bar = new Sym('bar', foo);
        const baz = new Sym('baz', bar);
        assert.strictEqual(foo.key(), 'foo');
        assert.strictEqual(bar.key(), 'foo.bar');
        assert.strictEqual(baz.key(), 'foo.bar.baz');
    });
    it("equals", function () {
        const foo = new Sym('foo');
        const foe = new Sym('foo');
        const fiz = new Sym('fiz');
        const bar = new Sym('bar', foo);
        const bor = new Sym('bar', foe);
        const baz = new Sym('baz', bar);
        const biz = new Sym('biz', bar);

        assert.strictEqual(foo.equals(foo), true);
        assert.strictEqual(foo.equals(foe), true);
        assert.strictEqual(foo.equals(fiz), false);
        assert.strictEqual(foo.equals(bar), false);
        assert.strictEqual(foo.equals(bor), false);
        assert.strictEqual(foo.equals(baz), false);
        assert.strictEqual(foo.equals(biz), false);

        assert.strictEqual(foe.equals(foo), true);
        assert.strictEqual(foe.equals(foe), true);
        assert.strictEqual(foe.equals(fiz), false);
        assert.strictEqual(foe.equals(bar), false);
        assert.strictEqual(foe.equals(bor), false);
        assert.strictEqual(foe.equals(baz), false);
        assert.strictEqual(foe.equals(biz), false);

        assert.strictEqual(fiz.equals(foo), false);
        assert.strictEqual(fiz.equals(foe), false);
        assert.strictEqual(fiz.equals(fiz), true);
        assert.strictEqual(fiz.equals(bar), false);
        assert.strictEqual(fiz.equals(bor), false);
        assert.strictEqual(fiz.equals(baz), false);
        assert.strictEqual(fiz.equals(biz), false);

        assert.strictEqual(bar.equals(foo), false);
        assert.strictEqual(bar.equals(foe), false);
        assert.strictEqual(bar.equals(fiz), false);
        assert.strictEqual(bar.equals(bar), true);
        assert.strictEqual(bar.equals(bor), true);
        assert.strictEqual(bar.equals(baz), false);
        assert.strictEqual(bar.equals(biz), false);

        assert.strictEqual(bar.equals(foo), false);
        assert.strictEqual(bar.equals(foe), false);
        assert.strictEqual(bar.equals(fiz), false);
        assert.strictEqual(bar.equals(bar), true);
        assert.strictEqual(bar.equals(bor), true);
        assert.strictEqual(bar.equals(baz), false);
        assert.strictEqual(bar.equals(biz), false);

        assert.strictEqual(bor.equals(foo), false);
        assert.strictEqual(bor.equals(foe), false);
        assert.strictEqual(bor.equals(fiz), false);
        assert.strictEqual(bor.equals(bar), true);
        assert.strictEqual(bor.equals(bor), true);
        assert.strictEqual(bor.equals(baz), false);
        assert.strictEqual(bor.equals(biz), false);

        assert.strictEqual(baz.equals(foo), false);
        assert.strictEqual(baz.equals(foe), false);
        assert.strictEqual(baz.equals(fiz), false);
        assert.strictEqual(baz.equals(bar), false);
        assert.strictEqual(baz.equals(bor), false);
        assert.strictEqual(baz.equals(baz), true);
        assert.strictEqual(baz.equals(biz), false);

        assert.strictEqual(biz.equals(foo), false);
        assert.strictEqual(biz.equals(foe), false);
        assert.strictEqual(biz.equals(fiz), false);
        assert.strictEqual(biz.equals(bar), false);
        assert.strictEqual(biz.equals(bor), false);
        assert.strictEqual(biz.equals(baz), false);
        assert.strictEqual(biz.equals(biz), true);
    });
    it("contains", function () {
        const foo = new Sym('foo');
        const foe = new Sym('foo');
        const fiz = new Sym('fiz');
        const bar = new Sym('bar', foo);
        const bor = new Sym('bar', foe);
        const baz = new Sym('baz', bar);
        const biz = new Sym('biz', bar);

        // foo (a.k.a foe)                       fiz
        //  |
        //  ---------
        //  |
        //  bar (a.k.a. bor)
        //  |
        //  ----------
        //  |        |
        //  baz      biz

        assert.strictEqual(foo.contains(foo), true);    // foo contains itself.
        assert.strictEqual(foo.contains(foe), true);    // foe is an alias for foo.
        assert.strictEqual(foo.contains(fiz), false);   // fiz is distinct root namespace.
        assert.strictEqual(foo.contains(bar), true);    // bar is in foo.
        assert.strictEqual(foo.contains(bor), true);    // bor is in foe which is the same as foo.
        assert.strictEqual(foo.contains(baz), true);    // baz is in bar which is in foo.
        assert.strictEqual(foo.contains(biz), true);    // biz is in bar which is in foo.

        assert.strictEqual(foe.contains(foo), true);    // foo is an alias for foe.
        assert.strictEqual(foe.contains(foe), true);    // foe is an alias for foo.
        assert.strictEqual(foe.contains(fiz), false);   // fiz is a distinct root namespace.
        assert.strictEqual(foe.contains(bar), true);    // bar is in foo.
        assert.strictEqual(foe.contains(bor), true);    // bor is in foe which is an alias for foo.
        assert.strictEqual(foe.contains(baz), true);    // baz is in bar which is in foo.
        assert.strictEqual(foe.contains(biz), true);    // biz is in bar which is in foo.

        assert.strictEqual(fiz.contains(foo), false);   // foo is distinct from fiz.
        assert.strictEqual(fiz.contains(foe), false);   // foe is distinct from fiz.
        assert.strictEqual(fiz.contains(fiz), true);    // fiz is contained in itself.
        assert.strictEqual(fiz.contains(bar), false);   // bar is in foo which is not fiz.
        assert.strictEqual(fiz.contains(bor), false);   // bor is in foe which is foo which is not fiz.
        assert.strictEqual(fiz.contains(baz), false);   // baz is in bar which is in foo which is not fiz.
        assert.strictEqual(fiz.contains(biz), false);   // biz is in bar which is in foo which is not fiz.

        assert.strictEqual(bar.contains(foo), false);   // foo is top level, bar is in foo, not the other way.
        assert.strictEqual(bar.contains(foe), false);   // foe is top level...
        assert.strictEqual(bar.contains(fiz), false);   // fiz is top level...
        assert.strictEqual(bar.contains(bar), true);    // bar is contained in itself.
        assert.strictEqual(bar.contains(bor), true);    // bor is an alias for bar, so it is contained in itself.
        assert.strictEqual(bar.contains(baz), true);    // baz is in bar.
        assert.strictEqual(bar.contains(biz), true);    // biz is in bar. 

        assert.strictEqual(bar.contains(foo), false);   // foo is top level.   
        assert.strictEqual(bar.contains(foe), false);   // foe is top level.
        assert.strictEqual(bar.contains(fiz), false);   // fiz is top level.
        assert.strictEqual(bar.contains(bar), true);    // bar is contained in itself.
        assert.strictEqual(bar.contains(bor), true);    // bor is an alias for bar.
        assert.strictEqual(bar.contains(baz), true);    // baz is in bar.
        assert.strictEqual(bar.contains(biz), true);    // biz is in bar.   

        assert.strictEqual(bor.contains(foo), false);   // foo is top level.
        assert.strictEqual(bor.contains(foe), false);   // foe is top level.
        assert.strictEqual(bor.contains(fiz), false);   // fiz is top level.
        assert.strictEqual(bor.contains(bar), true);    // bar is an alias for bor.
        assert.strictEqual(bor.contains(bor), true);    // bor is contained in itself.
        assert.strictEqual(bor.contains(baz), true);    // baz is in bar which is alias for bor.
        assert.strictEqual(bor.contains(biz), true);    // biz is in bar...

        assert.strictEqual(baz.contains(foo), false);   // foo is top level.
        assert.strictEqual(baz.contains(foe), false);   // foe is top level.
        assert.strictEqual(baz.contains(fiz), false);   // fiz is top level.
        assert.strictEqual(baz.contains(bar), false);   // bar is in foo
        assert.strictEqual(baz.contains(bor), false);
        assert.strictEqual(baz.contains(baz), true);
        assert.strictEqual(baz.contains(biz), false);

        assert.strictEqual(biz.contains(foo), false);
        assert.strictEqual(biz.contains(foe), false);
        assert.strictEqual(biz.contains(fiz), false);
        assert.strictEqual(biz.contains(bar), false);
        assert.strictEqual(biz.contains(bor), false);
        assert.strictEqual(biz.contains(baz), false);
        assert.strictEqual(biz.contains(biz), true);
    });
});
