import { is_sym } from "./operators/sym/is_sym";
import { Sym } from "./tree/sym/Sym";
import { Cons, is_cons, U } from "./tree/tree";

/**
 * (Sym (Sym Cons))
 * 
 * (op (sym arg))
 */
export function match_op_sym_arg(
    expr: U,
    opFilter: (sym: Sym) => boolean,
    symFilter: (car_arg: Sym) => boolean): { op: Sym, sym: Sym, arg: Cons } | undefined {
    if (is_cons(expr)) {
        const sym = expr.car;
        if (is_sym(sym)) {
            if (opFilter(sym)) {
                if (is_cons(expr.cdr)) {
                    const arg = expr.argList;
                    if (is_cons(arg) && is_sym(arg.car)) {
                        const car_arg = arg.car;
                        if (symFilter(car_arg)) {
                            if (is_cons(arg.cdr)) {
                                const arg_arg = arg.argList;
                                if (is_cons(arg_arg)) {
                                    return { op: sym, sym: car_arg, arg: arg_arg };
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
