import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { ASSIGN } from "../../runtime/constants";
import { Sym } from "../../tree/sym/Sym";
import { NIL, U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends Function2<Sym, U> implements Operator<U> {
    readonly breaker = true;
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('assign_sym_any', ASSIGN, is_sym, is_any, $);
        this.hash = `(= Sym U)`;
    }
    transform2(opr: Sym, lhs: Sym, rhs: U): [TFLAGS, U] {
        const $ = this.$;
        $.setBinding(lhs, rhs);
        // Assignments return NIL to prevent them from being printed.
        // That's a bit unfortunate for chained assignments.
        // The kernel of the problem is the printing of expressions by default in the REPL.
        return [CHANGED, NIL];
    }
}

export const assign_sym_any = new Builder();
