import { is_imu, is_num, is_sym, is_tensor, is_uom, one } from "@stemcmicro/atoms";
import { is_cons_opr_eq_add, is_cons_opr_eq_multiply, is_cons_opr_eq_power } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { ProgramControl, ProgramEnv, ProgramStack } from "@stemcmicro/stack";
import { caddr, car, cdr, Cons, is_atom, is_cons } from "@stemcmicro/tree";
import { absfunc, add, denominator, divide, elementwise, expfunc, imag, multiply, multiply_factors, numerator, power, push_integer, push_rational, real, rect, value_of } from "./eigenmath";
import { isminusone } from "./isminusone";

export function stack_mag(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    $.push(expr); //  [expr]
    $.rest(); //  [argList]
    $.head(); //  [argList.head]
    value_of(env, ctrl, $); //  [z]
    mag(env, ctrl, $); //  [mag(z)]
}

export function mag(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const z = $.pop();
    try {
        if (is_atom(z)) {
            if (is_imu(z)) {
                $.push(one);
                return;
            }
            if (is_tensor(z)) {
                $.push(elementwise(z, mag, env, ctrl, $));
                return;
            }
        }

        // use numerator and denominator to handle (a + i b) / (c + i d)

        $.push(z);
        numerator(env, ctrl, $);
        mag_nib(env, ctrl, $);

        $.push(z);
        denominator(env, ctrl, $);
        mag_nib(env, ctrl, $);

        divide(env, ctrl, $);
    } finally {
        z.release();
    }
}

function mag_nib(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    const z = $.pop();
    try {
        if (is_atom(z)) {
            // Every atom should be handled, there should be no fall-through.
            if (is_num(z)) {
                $.push(z);
                absfunc(env, ctrl, $);
                return;
            }
            if (is_imu(z)) {
                $.push(one);
                return;
            }
            if (is_sym(z)) {
                // We assume that the symbol is a real number.
                $.push(z);
                return;
            }
            if (is_uom(z)) {
                $.push(z);
                return;
            }
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
            real(env, ctrl, $);
            expfunc(env, ctrl, $);
            return;
        }

        // product

        if (is_cons(z) && is_cons_opr_eq_multiply(z)) {
            let p1 = cdr(z);
            const h = $.length;
            while (is_cons(p1)) {
                $.push(car(p1));
                mag(env, ctrl, $);
                p1 = cdr(p1);
            }
            multiply_factors($.length - h, env, ctrl, $);
            return;
        }

        // sum

        if (is_cons(z) && is_cons_opr_eq_add(z)) {
            $.push(z);
            rect(env, ctrl, $); // convert polar terms, if any
            const p1 = $.pop();
            try {
                $.push(p1);
                real(env, ctrl, $);
                const x = $.pop();
                try {
                    $.push(p1);
                    imag(env, ctrl, $);
                    const y = $.pop();
                    try {
                        $.push(x);
                        $.push(x);
                        multiply(env, ctrl, $);
                        $.push(y);
                        $.push(y);
                        multiply(env, ctrl, $);
                        add(env, ctrl, $);
                        push_rational(1, 2, $);
                        power(env, ctrl, $);
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
