import { diffFlag, ExtensionEnv, TFLAG_NONE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_SYM } from "../../hashing/hash_info";
import { ASSIGN } from "../../runtime/constants";
import { Sym } from "../../tree/sym/Sym";
import { items_to_cons, nil, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type LHS = Sym;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('assign_sym_any', ASSIGN, is_sym, is_any, $);
        this.hash = hash_binop_atom_atom(ASSIGN, HASH_SYM, HASH_ANY);
    }
    transform(expr: U): [TFLAGS, U] {
        const m = this.match(expr);
        if (m) {
            const $ = this.$;
            // Unlike the base class, we do not evaluate the left hand side (var) of the assignment.
            const [flagsR, rhs] = $.transform(m.rhs);
            if (diffFlag(flagsR)) {
                return [TFLAG_DIFF, $.valueOf(items_to_cons(m.opr, m.lhs, rhs))];
            }
            else {
                return this.transform2(m.opr, m.lhs, m.rhs, m);
            }
        }
        return [TFLAG_NONE, expr];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: Sym, rhs: U, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        $.setSymbolValue(lhs, rhs);
        // Assignments return NIL to prevent them from being printed.
        // That's a bit unfortunate for chained assignments.
        // The kernel of the problem is the printing of expressions by default in the REPL.
        return [TFLAG_DIFF, nil];
    }
}

export const assign_sym_any = new Builder();
