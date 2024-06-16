import { ExprContext } from "@stemcmicro/context";
import { is_cons_opr_eq_add, is_cons_opr_eq_multiply, is_cons_opr_eq_power } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { ProgramStack } from "@stemcmicro/stack";
import { caddr, car, cdr, Cons, is_atom, is_cons, nil } from "@stemcmicro/tree";
import { delegate_to_atom } from "./delegate_to_atom";
import { add, denominator, divide, expfunc, imag, multiply, multiply_factors, numerator, power, push_integer, push_rational, real, rect, value_of } from "./eigenmath";
import { isminusone } from "./isminusone";

const MAGNITUDE = native_sym(Native.mag);

export function stack_mag(expr: Cons, env: ExprContext, $: ProgramStack): void {
    $.push(expr); //  [expr]
    $.rest(); //  [argList]
    $.head(); //  [argList.head]
    value_of(env, $); //  [z]
    mag(env, $); //  [mag(z)]
}

export function mag(env: ExprContext, $: ProgramStack): void {
    const z = $.pop();
    try {
        if (is_atom(z)) {
            delegate_to_atom(z, MAGNITUDE, nil, env, $);
            return;
        }

        // use numerator and denominator to handle (a + i b) / (c + i d)

        $.push(z);
        numerator(env, $);
        mag_nib(env, $);

        $.push(z);
        denominator(env, $);
        mag_nib(env, $);

        divide(env, $);
    } finally {
        z.release();
    }
}

function mag_nib(env: ExprContext, $: ProgramStack): void {
    const z = $.pop();
    try {
        if (is_atom(z)) {
            delegate_to_atom(z, MAGNITUDE, nil, env, $);
            return;
        }

        // -1 to a power

        if (is_cons(z) && is_cons_opr_eq_power(z)) {
            const base = z.base;
            try {
                if (isminusone(base)) {
                    push_integer(1, $);
                    return;
                }
            } finally {
                base.release();
            }
        }

        // exponential

        if (is_cons(z) && is_cons_opr_eq_power(z) && z.base.equals(native_sym(Native.E))) {
            $.push(caddr(z));
            real(env, $);
            expfunc(env, $);
            return;
        }

        // product

        if (is_cons(z) && is_cons_opr_eq_multiply(z)) {
            let p1 = cdr(z);
            const h = $.length;
            while (is_cons(p1)) {
                $.push(car(p1));
                mag(env, $);
                p1 = cdr(p1);
            }
            multiply_factors($.length - h, env, $);
            return;
        }

        // sum

        if (is_cons(z) && is_cons_opr_eq_add(z)) {
            $.push(z);
            rect(env, $); // convert polar terms, if any
            const p1 = $.pop();
            try {
                $.push(p1);
                real(env, $);
                const x = $.pop();
                try {
                    $.push(p1);
                    imag(env, $);
                    const y = $.pop();
                    try {
                        $.push(x);
                        $.push(x);
                        multiply(env, $);
                        $.push(y);
                        $.push(y);
                        multiply(env, $);
                        add(env, $);
                        push_rational(1, 2, $);
                        power(env, $);
                        return;
                    } finally {
                        y.release();
                    }
                } finally {
                    x.release();
                }
            } finally {
                p1.release();
            }
        }

        // real

        $.push(z);
    } finally {
        z.release();
    }
}
