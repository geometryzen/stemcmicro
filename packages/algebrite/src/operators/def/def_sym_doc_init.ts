import { assert_str, create_sym, is_str, is_sym, Str, Sym } from "@stemcmicro/atoms";
import { Cons3, nil, U } from "@stemcmicro/tree";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hook_create_err } from "../../hooks/hook_create_err";
import { Function3 } from "../helpers/Function3";
import { is_any } from "../helpers/is_any";
import { extract_def_args } from "./extract_def_args";

/**
 * TODO: We need this in the Native arsenal?
 */
const DEF = create_sym("def");

type A = Sym;
type B = Str;
type C = U;
type EXP = Cons3<Sym, A, B, C>;

/**
 * (def symbol doc-string? init?)
 * [symbol]
 * [symbol init]
 * [symbol doc-string init]
 * @param expr
 * @param $
 * @returns
 */
function eval_def_sym_doc_init(expr: EXP, $: ExtensionEnv): U {
    const argList = expr.argList;
    const [sym, doc, init] = extract_def_args(expr);
    try {
        const binding = $.valueOf(init);
        try {
            return def_sym_doc_init(sym, assert_str(doc), binding, $);
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

function def_sym_doc_init(sym: Sym, doc: Str, init: U, $: ExtensionEnv): U {
    if (is_sym(sym)) {
        $.setBinding(sym, init);
        return nil;
    } else {
        return hook_create_err(new Str("First argument to def must be a symbol."));
    }
}

class Op extends Function3<A, B, C> {
    constructor() {
        super("def [symbol doc-string init]", DEF, is_sym, is_str, is_any);
    }
    valueOf(expr: EXP, $: ExtensionEnv): U {
        return eval_def_sym_doc_init(expr, $);
    }
    override transform(expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        // We override the transform method because (def ...) is a special form.
        // If we don't we run into troble because we attempt to evaluate the symbol.
        const retval = eval_def_sym_doc_init(expr, $);
        return [TFLAG_DIFF, retval];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform3(opr: Sym, a: A, b: B, c: C, orig: EXP): [TFLAGS, U] {
        // This should not be called because of the override.
        // TODO: This suggests that we need a different base abstraction.
        throw new Error();
    }
}

/**
 * (def symbol doc-string init)
 */
export const def_sym_doc_init_builder = mkbuilder<EXP>(Op);
