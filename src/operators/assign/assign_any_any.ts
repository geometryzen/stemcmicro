import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { ASSIGN } from "../../runtime/constants";
import { halt } from "../../runtime/defs";
import { caadr } from "../../tree/helpers";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, nil, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_sym } from "../sym/is_sym";
import { define_function } from "./define_function";
import { setq_indexed } from "./setq_indexed";

export const COMPONENT = native_sym(Native.component);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}
type LHS = U;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

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
 * @param expr (= lhs rhs)
 */
function Eval_assign(expr: EXP, $: ExtensionEnv): U {
    const lhs = expr.lhs;
    const rhs = expr.rhs;
    return setq(lhs, rhs, expr, $);
}

export function setq(lhs: U, rhs: U, expr: BCons<Sym, U, U>, $: Pick<ExtensionEnv, 'setSymbolBinding' | 'valueOf'>): U {

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
        halt('symbol assignment: error in symbol');
    }

    // TODO: The evaluation of the right hand side is not really necessary.
    const binding = $.valueOf(rhs);
    $.setSymbolBinding(lhs, binding);

    // An assignment returns nothing.
    // This is unlike most programming languages
    // where an assignment does return the
    // assigned value.
    // TODO Could be changed.
    return nil;
}

/**
 * 
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    constructor($: ExtensionEnv) {
        super('assign_any_any', ASSIGN, is_any, is_any, $);
    }
    transform(expr: U): [TFLAGS, U] {
        const m = this.match(expr);
        if (m) {
            return this.transform2(m.opr, m.lhs, m.rhs, m);
        }
        return [TFLAG_NONE, expr];
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        // console.lg(`${this.name} ${print_expr(lhs, $)} ${ASSIGN} ${print_expr(rhs, $)}`);
        // $.setBinding(lhs, rhs);
        // Assignments return NIL to prevent them from being printed.
        // That's a bit unfortunate for chained assignments.
        // The kernel of the problem is the printing of expressions by default in the REPL.
        // Notice here that Eval_assign is called with the original expression.
        return [TFLAG_DIFF, Eval_assign(expr, $)];
    }
}

export const assign_any_any = new Builder();
