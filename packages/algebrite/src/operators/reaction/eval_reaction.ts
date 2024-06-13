import { Cell, create_sym, Sym } from "@stemcmicro/atoms";
import { Cons1, nil, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { ProgrammingError } from "../../programming/ProgrammingError";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { wrap_as_transform } from "../wrap_as_transform";

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
    } finally {
        expression.release();
    }
}

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("reaction", create_sym("reaction"), is_any);
        this.#hash = hash_unaop_atom(create_sym("reaction"), HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    valueOf(expr: EXP, $: ExtensionEnv): U {
        return eval_reaction(expr, $);
    }
    transform(expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        return wrap_as_transform(this.valueOf(expr, $), expr);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        throw new ProgrammingError();
    }
}

export const reaction_builder = mkbuilder<EXP>(Op);
