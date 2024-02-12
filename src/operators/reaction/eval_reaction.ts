import { Cell, create_sym, Sym } from "math-expression-atoms";
import { nil, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { ProgrammingError } from "../../programming/ProgrammingError";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { wrap_as_transform } from "../wrap_as_transform";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        const REACTION = create_sym("reaction");
        return new Op($, REACTION);
    }
}

type ARG = U;
type EXP = Cons1<Sym, ARG>;

export function eval_reaction(expr: EXP, $: ExtensionEnv): U {
    const argList = expr.argList;
    const expression = argList.item(0);
    try {
        const cellHost = $.getCellHost();
        // TODO: Analyze data for deref operations to determine dependencies?
        const cell = new Cell(nil, cellHost);
        // Now have the identifier of the cell that will be affected.
        cellHost.reaction(expression, cell);
        return cell;
    }
    finally {
        expression.release();
    }
}

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor($: ExtensionEnv, REACTION: Sym) {
        super('reaction', REACTION, is_any, $);
        this.#hash = hash_unaop_atom(REACTION, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    valueOf(expr: EXP): U {
        return eval_reaction(expr, this.$);
    }
    transform(expr: EXP): [TFLAGS, U] {
        return wrap_as_transform(this.valueOf(expr), expr);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        throw new ProgrammingError();
    }
}

export const reaction_builder = new Builder();
