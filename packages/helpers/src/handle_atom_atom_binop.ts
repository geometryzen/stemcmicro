import { create_sym, Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { diagnostic, Diagnostics } from "@stemcmicro/diagnostics";
import { Atom, is_nil, U } from "@stemcmicro/tree";

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
