import { Blade, is_blade, is_rat, is_tensor, zero } from "@stemcmicro/atoms";
import { Directive } from "@stemcmicro/directive";
import { assert_stack_length, combine_terms, cons, copy_tensor, flatten_items, list, pop, ProgramControl, ProgramEnv, push, simplify_terms, sum_tensors, value_of_args } from "@stemcmicro/eigenmath";
import { Native, native_sym } from "@stemcmicro/native";
import { ProgramStack } from "@stemcmicro/stack";
import { Cons, U } from "@stemcmicro/tree";
import { ProgrammingError } from "../../programming/ProgrammingError";

const ADD = native_sym(Native.add);

/**
 * [...] => [..., X], where X is the sum of the evaluated terms, (x1 x2 x3 ... xn).
 */
export function micro_add(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, _: ProgramStack): void {
    ctrl.pushDirective(Directive.expanding, ctrl.getDirective(Directive.expanding) - 1);
    try {
        const L0 = _.length; // [...]
        _.push(expr); // [..., (+ x1 x2 ... xn)]
        _.rest(); // [..., (x1 x2 ... xn)]
        const n = value_of_args(env, ctrl, _); // [..., v1, v2, ..., vn]
        sum_terms(n, zero, env, ctrl, _); // [..., X]
        assert_stack_length(L0 + 1, _);
    } finally {
        ctrl.popDirective();
    }
}

/**
 * [..., v1, v2, ..., vn] => [..., X] where X is the sum of v1 through vn
 *
 * It is assumed that all the terms on the stack have been evaluated.
 *
 * @param n The number of terms on the stack that should be added.
 * @param id The identity element for addition, used when n is zero.
 */
function sum_terms(n: number, id: U, env: ProgramEnv, ctrl: ProgramControl, _: ProgramStack): void {
    if (n < 0) {
        throw new ProgrammingError(`n => ${n}`);
    }

    const start = _.length - n;

    flatten_items(start, ADD, _);

    const sigma = sum_tensors(start, env, ctrl, _);
    // const blades = sum_blades(start, env, ctrl, _);

    combine_terms(start, env, ctrl, _);

    if (simplify_terms(start, env, ctrl, _)) {
        combine_terms(start, env, ctrl, _);
    }

    const k = _.length - start;

    if (k === 0) {
        _.push(sigma);
        return;
    }

    if (k > 1) {
        list(k, _);
        _.push(ADD);
        _.swap();
        cons(_); // prepend ADD to list
    }

    if (is_tensor(sigma)) {
        const p1 = _.pop();

        const T = copy_tensor(sigma);

        const nelem = T.nelem;

        for (let i = 0; i < nelem; i++) {
            _.push(T.elems[i]);
            _.push(p1);
            sum_terms(2, id, env, ctrl, _);
            T.elems[i] = pop(_);
        }

        _.push(T);
    }
}

export function sum_blades(start: number, env: ProgramEnv, ctrl: ProgramControl, _: ProgramStack): U {
    let sum: U = zero;
    for (let i = start; i < _.length; i++) {
        const rhs = _.getAt(i);
        if (is_blade(rhs)) {
            if (is_rat(sum)) {
                sum = rhs;
            } else {
                push(sum, _);
                push(rhs, _);
                add_2_blades(env, ctrl, _);
                sum = pop(_);
            }
            _.splice(i, 1);
            i--; // use same index again
        }
    }
    return sum;
}
/**
 * [..., A, B] => [..., (+ A B)]
 */
function add_2_blades(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    //                              [..., A, B]
    const B = pop($) as Blade; //   [..., A]
    const A = pop($) as Blade; //   [...]

    const sum = A.add(B);

    push(sum, $); //  [..., (+ A B)]
}
