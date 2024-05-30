import { is_sym } from "./operators/sym/is_sym";
import { Sym } from "./tree/sym/Sym";
import { is_cons, U } from "./tree/tree";

/**
 * (Sym (Sym (U ...)))
 * (op (lhs (rhs ...)))
 */
export function match_op_sym_any(expr: U, opFilter: (sym: Sym) => boolean, lhsFilter: (car_arg: Sym) => boolean): { sym: Sym; car_arg: Sym; arg_arg: U } | undefined {
    if (is_cons(expr)) {
        const sym = expr.car;
        if (is_sym(sym)) {
            if (opFilter(sym)) {
                if (is_cons(expr.cdr)) {
                    const argList = expr.argList;
                    if (is_cons(argList) && is_sym(argList.car)) {
                        const car_arg = argList.car;
                        if (lhsFilter(car_arg)) {
                            if (is_cons(argList.cdr)) {
                                const arg_arg = argList.argList;
                                return { sym, car_arg, arg_arg };
                            }
                        }
                    }
                }
            }
        }
    }
    return void 0;
}
