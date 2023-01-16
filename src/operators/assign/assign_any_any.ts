import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { ASSIGN, SYM_MATH_COMPONENT } from "../../runtime/constants";
import { caadr } from "../../tree/helpers";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, nil, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_sym } from "../sym/is_sym";
import { define_user_function } from "./define";
import { setq_indexed } from "./setq_indexed";

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
 * @param expr (set! var expr)
 */
function Eval_setq(expr: EXP, $: ExtensionEnv): U {
    // console.lg(`Eval_setq ${expr}`);
    const lhs = expr.lhs;

    // case of tensor
    if (caadr(expr) === SYM_MATH_COMPONENT) {
        return setq_indexed(expr, $);
    }

    // case of function definition
    if (is_cons(lhs)) {
        define_user_function(expr, $);
        return nil;
    }

    if (!is_sym(lhs)) {
        throw new Error('symbol assignment: error in symbol');
    }

    // TODO: The evaluation of the right hand side is not really necessary.
    const binding = $.valueOf(expr.rhs);
    $.setBinding(lhs, binding);

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
        return [TFLAG_DIFF, Eval_setq(expr, $)];
    }
}

export const assign_any_any = new Builder();
