import { create_sym, imu, is_tensor, Tensor } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { add, expfunc, multiply, multiply_factors, negate, pop_integer, power, push_integer, push_rational, sqrtfunc, stopf, subtract, value_of } from "@stemcmicro/eigenmath";
import { Native, native_sym } from "@stemcmicro/native";
import { ProgramStack } from "@stemcmicro/stack";
import { cadr, car, cddr, cdr, Cons, is_cons, U } from "@stemcmicro/tree";

const PI = native_sym(Native.PI);

export function stack_rotate(p1: Cons, env: ExprContext, $: ProgramStack): void {
    $.push(cadr(p1));
    value_of(env, $);
    const PSI = $.pop();

    if (!is_tensor(PSI) || PSI.ndim > 1 || PSI.nelem > 32768 || (PSI.nelem & (PSI.nelem - 1)) !== 0) stopf("rotate error 1 first argument is not a vector or dimension error");

    let c = 0;

    p1 = cddr(p1);

    while (is_cons(p1)) {
        if (!is_cons(cdr(p1))) stopf("rotate error 2 unexpected end of argument list");

        const OPCODE = car(p1);
        $.push(cadr(p1));
        value_of(env, $);
        let n = pop_integer($);

        if (n > 14 || 1 << n >= PSI.nelem) stopf("rotate error 3 qubit number format or range");

        p1 = cddr(p1);

        if (OPCODE.equals(create_sym("C"))) {
            c |= 1 << n;
            continue;
        }

        if (OPCODE.equals(create_sym("H"))) {
            rotate_h(PSI, c, n, env, $);
            c = 0;
            continue;
        }

        if (OPCODE.equals(create_sym("P"))) {
            if (!is_cons(p1)) stopf("rotate error 2 unexpected end of argument list");
            $.push(car(p1));
            p1 = cdr(p1);
            value_of(env, $);
            $.push(imu);
            multiply(env, $);
            expfunc(env, $);
            const PHASE = $.pop();
            rotate_p(PSI, PHASE, c, n, env, $);
            c = 0;
            continue;
        }

        if (OPCODE.equals(create_sym("Q"))) {
            rotate_q(PSI, n, env, $);
            c = 0;
            continue;
        }

        if (OPCODE.equals(create_sym("V"))) {
            rotate_v(PSI, n, env, $);
            c = 0;
            continue;
        }

        if (OPCODE.equals(create_sym("W"))) {
            const m = n;
            if (!is_cons(p1)) stopf("rotate error 2 unexpected end of argument list");
            $.push(car(p1));
            p1 = cdr(p1);
            value_of(env, $);
            n = pop_integer($);
            if (n > 14 || 1 << n >= PSI.nelem) stopf("rotate error 3 qubit number format or range");
            rotate_w(PSI, c, m, n, $);
            c = 0;
            continue;
        }

        if (OPCODE.equals(create_sym("X"))) {
            rotate_x(PSI, c, n, $);
            c = 0;
            continue;
        }

        if (OPCODE.equals(create_sym("Y"))) {
            rotate_y(PSI, c, n, env, $);
            c = 0;
            continue;
        }

        if (OPCODE.equals(create_sym("Z"))) {
            rotate_z(PSI, c, n, env, $);
            c = 0;
            continue;
        }

        stopf("rotate error 4 unknown rotation code");
    }

    $.push(PSI);
}

// hadamard

function rotate_h(PSI: Tensor, c: number, n: number, env: ExprContext, $: ProgramStack): void {
    n = 1 << n;
    for (let i = 0; i < PSI.nelem; i++) {
        if ((i & c) !== c) continue;
        if (i & n) {
            $.push(PSI.elems[i ^ n]); // KET0
            $.push(PSI.elems[i]); // KET1
            add(env, $);
            push_rational(1, 2, $);
            sqrtfunc(env, $);
            multiply(env, $);
            $.push(PSI.elems[i ^ n]); // KET0
            $.push(PSI.elems[i]); // KET1
            subtract(env, $);
            push_rational(1, 2, $);
            sqrtfunc(env, $);
            multiply(env, $);
            PSI.elems[i] = $.pop(); // KET1
            PSI.elems[i ^ n] = $.pop(); // KET0
        }
    }
}

// phase

function rotate_p(PSI: Tensor, PHASE: U, c: number, n: number, env: ExprContext, $: ProgramStack): void {
    n = 1 << n;
    for (let i = 0; i < PSI.nelem; i++) {
        if ((i & c) !== c) continue;
        if (i & n) {
            $.push(PSI.elems[i]); // KET1
            $.push(PHASE);
            multiply(env, $);
            PSI.elems[i] = $.pop(); // KET1
        }
    }
}

// swap

function rotate_w(PSI: Tensor, c: number, m: number, n: number, $: ProgramStack): void {
    m = 1 << m;
    n = 1 << n;
    for (let i = 0; i < PSI.nelem; i++) {
        if ((i & c) !== c) continue;
        if (i & m && !(i & n)) {
            $.push(PSI.elems[i]);
            $.push(PSI.elems[i ^ m ^ n]);
            PSI.elems[i] = $.pop();
            PSI.elems[i ^ m ^ n] = $.pop();
        }
    }
}

function rotate_x(PSI: Tensor, c: number, n: number, $: ProgramStack): void {
    n = 1 << n;
    for (let i = 0; i < PSI.nelem; i++) {
        if ((i & c) !== c) continue;
        if (i & n) {
            $.push(PSI.elems[i ^ n]); // KET0
            $.push(PSI.elems[i]); // KET1
            PSI.elems[i ^ n] = $.pop(); // KET0
            PSI.elems[i] = $.pop(); // KET1
        }
    }
}

function rotate_y(PSI: Tensor, c: number, n: number, env: ExprContext, $: ProgramStack): void {
    n = 1 << n;
    for (let i = 0; i < PSI.nelem; i++) {
        if ((i & c) !== c) continue;
        if (i & n) {
            $.push(imu);
            negate(env, $);
            $.push(PSI.elems[i ^ n]); // KET0
            multiply(env, $);
            $.push(imu);
            $.push(PSI.elems[i]); // KET1
            multiply(env, $);
            PSI.elems[i ^ n] = $.pop(); // KET0
            PSI.elems[i] = $.pop(); // KET1
        }
    }
}

function rotate_z(PSI: Tensor, c: number, n: number, env: ExprContext, $: ProgramStack): void {
    n = 1 << n;
    for (let i = 0; i < PSI.nelem; i++) {
        if ((i & c) !== c) continue;
        if (i & n) {
            $.push(PSI.elems[i]); // KET1
            negate(env, $);
            PSI.elems[i] = $.pop(); // KET1
        }
    }
}

// quantum fourier transform

function rotate_q(PSI: Tensor, n: number, env: ExprContext, $: ProgramStack): void {
    for (let i = n; i >= 0; i--) {
        rotate_h(PSI, 0, i, env, $);
        for (let j = 0; j < i; j++) {
            push_rational(1, 2, $);
            push_integer(i - j, $);
            power(env, $);
            $.push(imu);
            $.push(PI);
            value_of(env, $);
            multiply_factors(3, env, $);
            expfunc(env, $);
            const PHASE = $.pop();
            rotate_p(PSI, PHASE, 1 << j, i, env, $);
        }
    }
    for (let i = 0; i < (n + 1) / 2; i++) rotate_w(PSI, 0, i, n - i, $);
}

// inverse qft

function rotate_v(PSI: Tensor, n: number, env: ExprContext, $: ProgramStack): void {
    for (let i = 0; i < (n + 1) / 2; i++) rotate_w(PSI, 0, i, n - i, $);
    for (let i = 0; i <= n; i++) {
        for (let j = i - 1; j >= 0; j--) {
            push_rational(1, 2, $);
            push_integer(i - j, $);
            power(env, $);
            $.push(imu);
            $.push(PI);
            value_of(env, $);
            multiply_factors(3, env, $);
            negate(env, $);
            expfunc(env, $);
            const PHASE = $.pop();
            rotate_p(PSI, PHASE, 1 << j, i, env, $);
        }
        rotate_h(PSI, 0, i, env, $);
    }
}
