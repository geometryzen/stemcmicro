import { is_sym, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons1, nil, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, make_extension_builder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { ProgrammingError } from "../../programming/ProgrammingError";
import { Function1 } from "../helpers/Function1";
import { extract_def_args } from "./extract_def_args";

type ARG = Sym;
type EXP = Cons1<Sym, ARG>;

/**
 * (def symbol doc-string? init?)
 * [symbol]
 * [symbol init]
 * [symbol doc-string init]
 * @param expr 
 * @param $ 
 * @returns 
 */
function eval_def_sym(expr: EXP, $: ExtensionEnv): U {
    const argList = expr.argList;
    const [sym, doc, init] = extract_def_args(expr);
    try {
        return def_sym(sym, $);
    }
    finally {
        argList.release();
        sym.release();
        doc.release();
        init.release();
    }

}

/**
 * (def symbol)
 */
function def_sym(sym: Sym, $: ExtensionEnv): U {
    $.setBinding(sym, nil);
    return nil;
}

class Op extends Function1<ARG> {
    constructor(readonly config: Readonly<EnvConfig>) {
        super('def [symbol]', native_sym(Native.def), is_sym);
    }
    valueOf(expr: EXP, $: ExtensionEnv): U {
        // console.lg(this.name, "valueOf", `${expr}`);
        return eval_def_sym(expr, $);
    }
    transform(expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, "transform", `${expr}`);
        const retval = eval_def_sym(expr, $);
        return [TFLAG_DIFF, retval];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, orig: EXP): [TFLAGS, U] {
        // Dead code because def is a Special Form.
        throw new ProgrammingError();
    }
}

/**
 * (def symbol)
 */
export const def_sym_builder = make_extension_builder<EXP>(Op);
