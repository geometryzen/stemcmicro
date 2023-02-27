import { is_sym } from "./operators/sym/is_sym";
import { Sym } from "./tree/sym/Sym";
import { is_cons, nil, U } from "./tree/tree";

/**
 * (Sym (Sym (U NIL)))
 * (op (lhs (rhs NIL)))
 */
export function match_op_sym_any_nil(expr: U, op: (sym: Sym) => boolean, lhs: (car_arg: Sym) => boolean, rhs: (car_arg_arg: U) => boolean): [Sym, Sym, U] | undefined {
    if (is_cons(expr)) {
        const sym = expr.car;
        if (is_sym(sym)) {
            if (op(sym)) {
                if (is_cons(expr.cdr)) {
                    const argList = expr.argList;
                    if (is_cons(argList) && is_sym(argList.car)) {
                        const car_arg = argList.car;
                        if (lhs(car_arg)) {
                            if (is_cons(argList.cdr)) {
                                const arg_arg = argList.argList;
                                if (is_cons(arg_arg)) {
                                    const car_arg_arg = arg_arg.car;
                                    if (rhs(car_arg_arg)) {
                                        const cdr_arg_arg = arg_arg.cdr;
                                        if (is_cons(cdr_arg_arg)) {
                                            if (nil === cdr_arg_arg) {
                                                return [sym, car_arg, car_arg_arg];
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return void 0;
}
