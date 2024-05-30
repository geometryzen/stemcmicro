import assert from "assert";
import { InputState } from "../src/algebrite/InputState";
import { is_digit } from "../src/algebrite/is_digit";

type CombinatorOutput = [sym: "str" | "digit" | "seq" | "rep" | "alt" | undefined, value: unknown, state: InputState | undefined];
const NOTHING: CombinatorOutput = [void 0, void 0, void 0];
type Combinator = (state: InputState) => CombinatorOutput;

function str(s: string): Combinator {
    const n = s.length;
    return function (state: InputState): CombinatorOutput {
        if (state.peek(n) === s) {
            return ["str", s, state.read(n)];
        } else {
            return NOTHING;
        }
    };
}
/*
function chr(s: string): Combinator {
    const regEx = new RegExp(`#${s}`);
    return function (state: InputState): CombinatorOutput {
        const chunk = state.peek(1);
        if (regEx.test(chunk)) {
            return [chunk, state.read(1)];
        }
        else {
            return NOTHING;
        }
    };
}
*/

function digit(): Combinator {
    return function (state: InputState): CombinatorOutput {
        const chunk = state.peek(1);
        if (is_digit(chunk)) {
            return ["digit", chunk, state.read(1)];
        } else {
            return NOTHING;
        }
    };
}

function seq(...parsers: Combinator[]): Combinator {
    return function (state: InputState): CombinatorOutput {
        const vs: unknown[] = [];
        let t: string | undefined;
        let v: unknown;
        let s: InputState | undefined = state;
        for (const parser of parsers) {
            if (s) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                [t, v, s] = parser(s);
                if (s) {
                    vs.push(v);
                }
            }
        }
        if (s) {
            return ["seq", vs, s];
        } else {
            return NOTHING;
        }
    };
}

// whitespace is zero or more space characters.
const ws = rep(str(" "), 0);

const num = alt(
    function (node: unknown) {
        if (Array.isArray(node)) {
            if (node[0] === "str") {
                return 0;
            } else {
                const dhead = node[0];
                const dtail = node[1];
                if (dtail) {
                    if (Array.isArray(dtail)) {
                        const digits = [dhead, ...dtail];
                        return parseInt(digits.join(""));
                    } else {
                        throw new Error();
                    }
                } else {
                    return parseInt(dhead);
                }
            }
        } else {
            return node;
        }
    },
    str("0"),
    seq(digit(), rep(digit(), 0))
);

// I don't really need to reference anythng more than the exp, but for consistency, do them all.
const add = binary(ref("num"), str("+"), ref("exp"));

const exp = alt(
    function (node: unknown) {
        if (Array.isArray(node)) {
            return ["+", node[0], node[4]];
        } else {
            if (typeof node === "number") {
                return node;
            } else {
                throw new Error(`${JSON.stringify(node)}`);
            }
        }
    },
    add,
    num
);

const grouping = seq(str("("), ws, ref("exp"), ws, str(")"));

const factor = alt(
    function (node) {
        return node;
    },
    ref("num"),
    ref("grouping")
);

const combos: { [name: string]: Combinator } = {};
combos["add"] = add;
combos["exp"] = exp;
combos["factor"] = factor;
combos["grouping"] = grouping;
combos["num"] = num;
combos["ws"] = ws;

/**
 * Returns a Combinator for deferring execution. This allows us to write recursive grammars.
 */
function ref(name: "exp" | "factor" | "grouping" | "num" | "ws"): Combinator {
    return function (state: InputState): CombinatorOutput {
        if (combos[name]) {
            return combos[name](state);
        } else {
            throw new Error();
        }
    };
}

/**
 *
 * @param combo
 * @param n 0 => zero or more, 1 => one or more
 * @returns
 */
function rep(combo: Combinator, n: 0 | 1): Combinator {
    return function (state: InputState): CombinatorOutput {
        const vs: unknown[] = [];
        let last_state: InputState = state;
        let t: string | undefined;
        let v: unknown;
        let s: InputState | undefined = state;
        while (s) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            [t, v, s] = combo(s);
            if (s) {
                vs.push(v);
                last_state = s;
            }
        }
        if (vs.length >= n) {
            return ["rep", vs, last_state];
        } else {
            return NOTHING;
        }
    };
}

function alt(action: (node: unknown) => unknown, ...parsers: Combinator[]): Combinator {
    return function (state: InputState): CombinatorOutput {
        for (const parser of parsers) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [t, node, new_state] = parser(state);
            if (new_state) {
                return ["alt", action(node), new_state];
            }
        }
        return NOTHING;
    };
}

function binary(lhs: Combinator, op: Combinator, rhs: Combinator): Combinator {
    return seq(lhs, ws, op, ws, rhs);
}

describe("combinators", function () {
    it("hello world", function () {
        const source = new InputState("hello world", 0, 0);
        assert.strictEqual(source.done, false);
        const hello = str("hello");
        const world = str("world");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [tB, b, sB] = world(source.read(6));
        assert.strictEqual(b, "world");
        assert.strictEqual(sB?.end, 11);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [tA, a, sA] = hello(source);
        assert.strictEqual(a, "hello");
        assert.strictEqual(sA?.end, 5);
    });
    it("12 + 34", function () {
        const source = new InputState("12 + 34", 0, 0);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [tA, a, sA] = digit()(source.read(1));
        assert.strictEqual(a, "2");
        assert.strictEqual(sA?.end, 2);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [tB, b, sB] = digit()(source.read(5));
        assert.strictEqual(b, "3");
        assert.strictEqual(sB?.end, 6);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [tC, c, sC] = digit()(source.read(2));
        assert.strictEqual(typeof c === "undefined", true);
        assert.strictEqual(typeof sC === "undefined", true);
    });
    it("Language 101", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [t, v, s] = exp(new InputState("34 + 567", 0, 0));
        if (s) {
            const elements = assert_array(v);
            assert.strictEqual(elements[0], "+");
            assert.strictEqual(elements[1], 34);
            assert.strictEqual(elements[2], 567);
        }
    });
    it("7 + 8 + 9", function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [t, v, s] = exp(new InputState("7 + 8 + 9", 0, 0));
        if (s) {
            // console.lg(`${JSON.stringify(v)}`);
            const elements = assert_array(v);
            assert.strictEqual(elements[0], "+");
            assert.strictEqual(elements[1], 7);
            const subExpr = assert_array(elements[2]);
            assert.strictEqual(subExpr[0], "+");
            assert.strictEqual(subExpr[1], 8);
            assert.strictEqual(subExpr[2], 9);
        }
    });
});

function assert_array(expr: unknown): unknown[] {
    if (Array.isArray(expr)) {
        return expr;
    } else {
        assert.fail(`expr MUST be an array.`);
    }
}
