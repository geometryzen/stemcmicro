import { create_sym, Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Atom, is_nil, U } from "math-expression-tree";
import { diagnostic } from "../diagnostics/diagnostics";
import { Diagnostics } from "../diagnostics/messages";

export function handle_atom_atom_binop(opr: Sym, lhs: Atom, rhs: Atom, env: ExprContext): U {
    const lhsExt = env.handlerFor(lhs);
    const rhsExt = env.handlerFor(rhs);
    const binLhs = lhsExt.binL(lhs, opr, rhs, env);
    if (is_nil(binLhs)) {
        const binRhs = rhsExt.binR(rhs, opr, lhs, env);
        if (is_nil(binRhs)) {
            return diagnostic(Diagnostics.Operator_0_cannot_be_applied_to_types_1_and_2, opr, create_sym(lhs.type), create_sym(rhs.type));
        } else {
            return binRhs;
        }
    } else {
        return binLhs;
    }
}
