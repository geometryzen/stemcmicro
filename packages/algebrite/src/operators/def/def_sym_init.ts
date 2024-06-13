import { is_sym, Str, Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons2, nil, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hook_create_err } from "../../hooks/hook_create_err";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { extract_def_args } from "./extract_def_args";

type LHS = Sym;
type RHS = U;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * (def symbol doc-string? init?)
 * [symbol]
 * [symbol init]
 * [symbol doc-string init]
 * @param expr
 * @param $
 * @returns
 */
function eval_def_sym_init(expr: EXP, $: ExtensionEnv): U {
    const argList = expr.argList;
    const [sym, doc, init] = extract_def_args(expr);
    try {
        const binding = $.valueOf(init);
        try {
            return def_sym_init(sym, binding, $);
        } finally {
            binding.release();
        }
    } finally {
        argList.release();
        sym.release();
        doc.release();
        init.release();
    }
}

function def_sym_init(sym: Sym, init: U, $: ExtensionEnv): U {
    if (is_sym(sym)) {
        $.setBinding(sym, init);
        return nil;
    } else {
        return hook_create_err(new Str("First argument to def must be a symbol."));
    }
}

class Op extends Function2<LHS, RHS> {
    constructor(readonly config: Readonly<EnvConfig>) {
        super("def [symbol init]", native_sym(Native.def), is_sym, is_any);
    }
    valueOf(expr: EXP, $: ExtensionEnv): U {
        return eval_def_sym_init(expr, $);
    }
    override transform(expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        // We override the transform method because (def ...) is a special form.
        // If we don't we run into troble because we attempt to evaluate the symbol.
        const retval = eval_def_sym_init(expr, $);
        return [TFLAG_DIFF, retval];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        // This should not be called because of the override.
        // TODO: This suggests that we need a different base abstraction.
        throw new Error();
    }
}

/**
 * (def symbol init)
 */
export const def_sym_init_builder = mkbuilder<EXP>(Op);
