import { ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { ASSIGN } from "../../runtime/constants";
import { Sym } from "../../tree/sym/Sym";
import { NIL, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends Function2<U, U> implements Operator<BCons<Sym, U, U>> {
    constructor($: ExtensionEnv) {
        super('assign_any_any', ASSIGN, is_any, is_any, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: U, rhs: U): [TFLAGS, U] {
        // const $ = this.$;
        // console.log(`${this.name} ${print_expr(lhs, $)} ${ASSIGN} ${print_expr(rhs, $)}`);
        // $.setBinding(lhs, rhs);
        // Assignments return NIL to prevent them from being printed.
        // That's a bit unfortunate for chained assignments.
        // The kernel of the problem is the printing of expressions by default in the REPL.
        return [NOFLAGS, NIL];
    }
}

export const assign_any_any = new Builder();
