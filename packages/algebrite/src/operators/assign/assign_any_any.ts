import { is_sym, Sym } from "@stemcmicro/atoms";
import { define_function, setq_indexed } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons2, is_cons, nil, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { ASSIGN } from "../../runtime/constants";
import { halt } from "../../runtime/defs";
import { caadr } from "../../tree/helpers";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

const COMPONENT = native_sym(Native.component);

type LHS = U;
type RHS = U;
type EXP = Cons2<Sym, LHS, RHS>;

// Evaluates the right side and assigns the
// result of the evaluation to the left side.
// It's called setq because it stands for "set quoted" from Lisp,
// see:
//   http://stackoverflow.com/questions/869529/difference-between-set-setq-and-setf-in-common-lisp
// Note that this also takes case of assigning to a tensor
// element, which is something that setq wouldn't do
// in list, see comments further down below.

// Example:
//   f = x
//   // f evaluates to x, so x is assigned to g really
//   // rather than actually f being assigned to g
//   g = f
//   f = y
//   g
//   > x
/**
 * @param expr (= lhs rhs) The expression for the assignment, assumed not to have been evaluated yet.
 */
function eval_setq(expr: EXP, $: ExtensionEnv): U {
    const lhs = expr.lhs;
    const rhs = expr.rhs;
    return setq(lhs, rhs, expr, $);
}

/**
 * Handles three cases:
 * 1) LHS is a tensor element, T[i,j,...],
 * 2) LHS is a function definition.
 * 3) LHS is a symbol.
 *
 * @param lhs The unevaluated LHS.
 * @param rhs The unevaluated RHS.
 * @param expr The unevaluated original expression.
 * @returns nil
 */
export function setq(lhs: U, rhs: U, expr: Cons2<Sym, U, U>, $: Pick<ExtensionEnv, "setBinding" | "setSymbolUsrFunc" | "valueOf">): U {
    // case of tensor
    if (caadr(expr).equals(COMPONENT)) {
        return setq_indexed(expr, $);
    }

    // case of function definition
    if (is_cons(lhs)) {
        define_function(expr, $);
        return nil;
    }

    if (!is_sym(lhs)) {
        halt("symbol assignment: error in symbol");
    }

    const value = $.valueOf(rhs);

    return set_symbol(lhs, value, nil, $);
}

/**
 * The implementation of assignment when the LHS is a symbol and the RHS has been evaluated.
 * @param lhs The symbol on the LHS.
 * @param binding The evaluated RHS.
 * @returns nil
 */
export function set_symbol(lhs: Sym, binding: U, usrfunc: U, $: Pick<ExtensionEnv, "setBinding" | "setSymbolUsrFunc">): U {
    $.setBinding(lhs, binding);
    $.setSymbolUsrFunc(lhs, usrfunc);
    return nil;
}

/**
 *
 */
class Op extends Function2<LHS, RHS> {
    constructor(readonly config: Readonly<EnvConfig>) {
        super("assign_any_any", ASSIGN, is_any, is_any);
    }
    transform(expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const m = this.match(expr, $);
        if (m) {
            return this.transform2(m.opr, m.lhs, m.rhs, m, $);
        }
        return [TFLAG_NONE, expr];
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(`${this.name} ${print_expr(lhs, $)} ${ASSIGN} ${print_expr(rhs, $)}`);
        // $.setBinding(lhs, rhs);
        // Assignments return NIL to prevent them from being printed.
        // That's a bit unfortunate for chained assignments.
        // The kernel of the problem is the printing of expressions by default in the REPL.
        // Notice here that eval_setq is called with the original expression.
        return [TFLAG_DIFF, eval_setq(expr, $)];
    }
}

export const assign_any_any = mkbuilder<EXP>(Op);
