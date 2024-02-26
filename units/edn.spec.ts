import assert from 'assert';
import { bigInt, BigInteger, Boo, Char, create_rat, create_sym_ns, create_tensor, Flt, is_boo, is_char, is_flt, is_keyword, is_map, is_rat, is_set, is_str, is_sym, is_tag, is_tensor, is_timestamp, is_uuid, Keyword, Map, Rat, Set, Str, Tag, Timestamp, Uuid } from 'math-expression-atoms';
import { is_cons, is_nil, pos_end_items_to_cons, U } from "math-expression-tree";
import { EDNListParser, ParseConfig } from '../src/edn';

describe("edn", function () {
    it("coverage", function () {
        const parseConfig: ParseConfig<U> = {
            bigIntAs: (value: string, pos: number, end: number) => {
                return new Rat(new BigInteger(BigInt(value)), bigInt.one, pos, end);
            },
            booAs: (value: boolean, pos: number, end: number) => new Boo(value, pos, end),
            charAs: (ch: string, pos: number, end: number) => new Char(ch, pos, end),
            fltAs: (value: number, pos: number, end: number) => new Flt(value, pos, end),
            intAs: (value: number, pos: number, end: number) => {
                return new Rat(new BigInteger(BigInt(value)), bigInt.one, pos, end);
            },
            keywordAs: (localName: string, namespace: string, pos: number, end: number) => new Keyword(localName, namespace, pos, end),
            listAs: (items: U[], pos: number, end: number) => pos_end_items_to_cons(pos, end, ...items),
            mapAs: (entries: [key: U, value: U][], pos: number, end: number) => {
                return new Map(entries, pos, end);
            },
            nilAs: (pos: number, end: number) => {
                return pos_end_items_to_cons(pos, end, ...[]);
                // return new Cons(void 0, void 0, pos, end);
            },
            setAs: (members: U[], pos: number, end: number) => {
                return new Set(members, pos, end);
            },
            strAs: (value: string, pos: number, end: number) => new Str(value, pos, end),
            symAs: (localName: string, namespace: string, pos: number, end: number) => create_sym_ns(localName, namespace, pos, end),
            tagAs: (tag: string, value: U, pos: number, end: number) => new Tag(tag, value, pos, end),
            vectorAs: (values: U[], pos: number, end: number) => create_tensor(values, pos, end),
            tagHandlers: {
                'inst': (value: U) => {
                    if (is_str(value)) {
                        return new Timestamp(new Date(value.str), value.pos, value.end);
                    }
                    else {
                        throw new Error("");
                    }
                },
                'uuid': (value: U) => {
                    if (is_str(value)) {
                        return new Uuid(value.str, value.pos, value.end);
                    }
                    else {
                        throw new Error("");
                    }
                }
            }
        };
        const parser: EDNListParser<U> = new EDNListParser(parseConfig);
        // The string to be parsed must be inside parenthesis.
        // TODO: Move this inside the next function and keep track of the offset.
        const lines: string[] = [
            `123`,
            `"Hello, World!"`,
            `2.718`,
            `true`,
            `false`,
            `(sin x)`,
            `foo ; a friend of bar`,
            `{:a 1 :b 2}`,
            `[x y z]`,
            `nil`,
            `:ns/bar`,
            `:foo`,
            `456N`,
            `#{a b}`,
            `\\c`,
            `\\newline`,
            `\\return`,
            `\\space`,
            `\\tab`,
            `#myapp/Person {:first "Fred" :last "Mertz"}`,
            `#_baz`,
            `\\\\`,
            `#inst "1985-04-12T23:20:50.52Z"`,
            `()`,
            `#uuid "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"`
        ];
        const items: U[] = parser.next(lines.join('\n'));
        assert.strictEqual(parser.isDone(), true);

        assert.strictEqual(Array.isArray(items), true);

        assert.strictEqual(items.length, 24);

        // Rat(123)
        const I0 = items[0];
        assert.strictEqual(is_rat(I0), true);
        if (is_rat(I0)) {
            assert.strictEqual(I0.equalsRat(create_rat(123, 1)), true);
            assert.strictEqual(I0.pos, 0);
            assert.strictEqual(I0.end, 3);
        }

        // Str("Hello, World!")
        const I1 = items[1];
        assert.strictEqual(is_str(I1), true);
        if (is_str(I1)) {
            assert.strictEqual(I1.str, "Hello, World!");
            assert.strictEqual(I1.pos, 4);
            assert.strictEqual(I1.end, 19);
        }

        // Flt(2.718)
        const I2 = items[2];
        assert.strictEqual(is_flt(I2), true);
        if (is_flt(I2)) {
            assert.strictEqual(I2.toNumber(), 2.718);
            assert.strictEqual(I2.pos, 20);
            assert.strictEqual(I2.end, 25);
        }

        // Boo(true)
        const I3 = items[3];
        assert.strictEqual(is_boo(I3), true);
        if (is_boo(I3)) {
            assert.strictEqual(I3.isTrue(), true);
            assert.strictEqual(I3.isFalse(), false);
            assert.strictEqual(I3.pos, 26);
            assert.strictEqual(I3.end, 30);
        }

        // Boo(false)
        const I4 = items[4];
        assert.strictEqual(is_boo(I4), true);
        if (is_boo(I4)) {
            assert.strictEqual(I4.isTrue(), false);
            assert.strictEqual(I4.isFalse(), true);
            assert.strictEqual(I4.pos, 31);
            assert.strictEqual(I4.end, 36);
        }

        // (sin x)
        const I5 = items[5];
        assert.strictEqual(is_cons(I5), true);
        if (is_cons(I5)) {
            const opr = I5.opr;
            const arg = I5.arg;
            assert.strictEqual(is_sym(opr), true);
            assert.strictEqual(is_sym(arg), true);
            assert.strictEqual(I5.pos, 37);
            assert.strictEqual(I5.end, 44);
        }

        // Sym("foo")
        const I6 = items[6];
        assert.strictEqual(is_sym(I6), true);
        if (is_sym(I6)) {
            assert.strictEqual(I6.localName, 'foo');
            assert.strictEqual(I6.namespace, '');
            assert.strictEqual(I6.pos, 45);
            assert.strictEqual(I6.end, 48);
        }

        // Map, {:a 1 :b 2}
        const I7 = items[7];
        assert.strictEqual(is_map(I7), true);
        if (is_map(I7)) {
            const entries = I7.entries;
            assert.strictEqual(entries.length, 2);
            // Note extra for comment.
            assert.strictEqual(I7.pos, 67);
            assert.strictEqual(I7.end, 78);
        }

        // Tensor, [x y z]
        const I8 = items[8];
        assert.strictEqual(is_tensor(I8), true);
        if (is_tensor(I8)) {
            const elems = I8.elems;
            assert.strictEqual(elems.length, 3);
            assert.strictEqual(I8.pos, 79);
            assert.strictEqual(I8.end, 86);
            const x = elems[0];
            assert.strictEqual(is_sym(x), true);
            if (is_sym(x)) {
                assert.strictEqual(x.localName, 'x');
                assert.strictEqual(x.namespace, '');
                assert.strictEqual(x.pos, 80);
                assert.strictEqual(x.end, 81);
            }
            const y = elems[1];
            assert.strictEqual(is_sym(y), true);
            if (is_sym(y)) {
                assert.strictEqual(y.localName, 'y');
                assert.strictEqual(y.namespace, '');
                assert.strictEqual(y.pos, 82);
                assert.strictEqual(y.end, 83);
            }
            const z = elems[2];
            assert.strictEqual(is_sym(z), true);
            if (is_sym(z)) {
                assert.strictEqual(z.localName, 'z');
                assert.strictEqual(z.namespace, '');
                assert.strictEqual(z.pos, 84);
                assert.strictEqual(z.end, 85);
            }
        }

        // nil
        const I9 = items[9];
        assert.strictEqual(is_nil(I9), true);
        assert.strictEqual(I9.pos, 87);
        assert.strictEqual(I9.end, 90);

        // :ns/bar
        const I10 = items[10];
        assert.strictEqual(is_keyword(I10), true);
        if (is_keyword(I10)) {
            assert.strictEqual(I10.localName, 'bar');
            assert.strictEqual(I10.namespace, 'ns');
        }

        // :foo
        const I11 = items[11];
        assert.strictEqual(is_keyword(I11), true);
        if (is_keyword(I11)) {
            assert.strictEqual(I11.localName, 'foo');
            assert.strictEqual(I11.namespace, '');
        }

        // Rat(456N)
        const I12 = items[12];
        assert.strictEqual(is_rat(I12), true);
        if (is_rat(I12)) {
            assert.strictEqual(I12.equalsRat(create_rat(456, 1)), true);
        }

        // #{a b}
        const I13 = items[13];
        assert.strictEqual(is_set(I13), true);
        if (is_set(I13)) {
            const members = I13.members;
            assert.strictEqual(members.length, 2);
        }

        // /c
        const I14 = items[14];
        assert.strictEqual(is_char(I14), true);
        if (is_char(I14)) {
            const ch = I14.ch;
            assert.strictEqual(ch, "c");
        }

        // /newline
        const I15 = items[15];
        assert.strictEqual(is_char(I15), true);
        if (is_char(I15)) {
            const ch = I15.ch;
            assert.strictEqual(ch, "\n");
        }

        // /return
        const I16 = items[16];
        assert.strictEqual(is_char(I16), true);
        if (is_char(I16)) {
            const ch = I16.ch;
            assert.strictEqual(ch, "\r");
        }

        // /space
        const I17 = items[17];
        assert.strictEqual(is_char(I17), true);
        if (is_char(I17)) {
            const ch = I17.ch;
            assert.strictEqual(ch, " ");
        }

        // /tab
        const I18 = items[18];
        assert.strictEqual(is_char(I18), true);
        if (is_char(I18)) {
            const ch = I18.ch;
            assert.strictEqual(ch, "\t");
        }

        // #myapp/Person {:first "Fred" :last "Mertz"}
        const I19 = items[19];
        assert.strictEqual(is_tag(I19), true);
        if (is_tag(I19)) {
            const tag = I19.tag;
            assert.strictEqual(tag, "myapp/Person");
            const value = I19.value;
            assert.strictEqual(is_map(value), true);
        }

        // //
        const I20 = items[20];
        assert.strictEqual(is_char(I20), true);
        if (is_char(I20)) {
            const ch = I20.ch;
            assert.strictEqual(JSON.stringify(ch), `${JSON.stringify('\\')}`);
        }

        // #inst "1985-04-12T23:20:50.52Z" (RFC-3339)
        const I21 = items[21];
        assert.strictEqual(is_timestamp(I21), true);
        if (is_timestamp(I21)) {
            assert.strictEqual(I21.year, 1985);
            assert.strictEqual(I21.month, 4);
            assert.strictEqual(I21.day, 12);
            assert.strictEqual(I21.hour, 23);
            assert.strictEqual(I21.minute, 20);
            assert.strictEqual(I21.second, 50);
            assert.strictEqual(I21.millis, 520);
        }

        // ()
        const I22 = items[22];
        assert.strictEqual(is_nil(I22), true);

        // #uuid "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
        const I23 = items[23];
        assert.strictEqual(is_uuid(I23), true);
        if (is_uuid(I23)) {
            assert.strictEqual(I23.str, "f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
        }
    });
});

