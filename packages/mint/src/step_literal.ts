import { is_literal, Literal, Node } from "@geometryzen/esprima";
import { bigInt, Flt, Rat } from "@stemcmicro/atoms";
import { Stack } from "@stemcmicro/stack";
import { State } from "./State";

function assert_literal(node: Node): Literal | never {
    if (is_literal(node)) {
        return node;
    } else {
        throw new Error();
    }
}

function parse_flt(token: string, pos?: number, end?: number): Flt {
    const d = parseFloat(token);
    return new Flt(d, pos, end);
}

function parse_rat(token: string, pos?: number, end?: number): Rat {
    // TODO: Make use of pos and end
    const sign = token[0];
    if (sign === "+") {
        const numerator = bigInt(token.substring(1));
        return new Rat(numerator, bigInt.one, pos, end);
    }
    if (sign === "-") {
        const numerator = bigInt(token.substring(1));
        return new Rat(numerator, bigInt.one, pos, end).neg();
    }
    const numerator = bigInt(token);
    return new Rat(numerator, bigInt.one, pos, end);
}

export function step_literal(stack: Stack<State>, state: State): State | null {
    const expr = assert_literal(state.node);
    const value = expr.value;
    if (typeof value === "number") {
        const raw = expr.raw;
        stack.pop();
        if (raw.indexOf(".") >= 0 || raw.indexOf("e") >= 0 || raw.indexOf("E") >= 0) {
            stack.top.value = parse_flt(raw);
        } else {
            stack.top.value = parse_rat(raw);
        }
    } else {
        throw new Error(typeof value);
    }
    return null;
}
