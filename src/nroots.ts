import { ExtensionEnv } from './env/ExtensionEnv';
import { imu } from './env/imu';
import { guess } from './guess';
import { is_poly_expanded_form } from './is';
import { sort_stack } from './misc';
import { coeff } from './operators/coeff/coeff';
import { evaluate_as_float } from './operators/float/float';
import { is_flt } from './operators/flt/is_flt';
import { imag } from './operators/imag/imag';
import { real } from './operators/real/real';
import { defs, halt, move_top_of_stack } from './runtime/defs';
import { stack_pop, stack_push } from './runtime/stack';
import { create_flt } from './tree/flt/Flt';
import { caddr, cadr } from './tree/helpers';
import { Tensor } from './tree/tensor/Tensor';
import { Cons, is_nil, U } from './tree/tree';

// find the roots of a polynomial numerically
const NROOTS_YMAX = 101;
const NROOTS_DELTA = 1.0e-6;
const NROOTS_EPSILON = 1.0e-9;

function NROOTS_ABS(z: NumericRootOfPolynomial): number {
    return Math.sqrt(z.r * z.r + z.i * z.i);
}

// random between -2 and 2
// const theRandom = 0.0;

function NROOTS_RANDOM(): number {
    //theRandom += 0.2
    //return theRandom
    return 4.0 * Math.random() - 2.0;
}

/**
 * A pair of numbers (r, i)
 */
class NumericRootOfPolynomial {
    public r = 0.0;
    public i = 0.0;
}

const nroots_a = new NumericRootOfPolynomial();
const nroots_b = new NumericRootOfPolynomial();
const nroots_x = new NumericRootOfPolynomial();
const nroots_y = new NumericRootOfPolynomial();
const nroots_fa = new NumericRootOfPolynomial();
const nroots_fb = new NumericRootOfPolynomial();
const nroots_dx = new NumericRootOfPolynomial();
const nroots_df = new NumericRootOfPolynomial();
const nroots_c: NumericRootOfPolynomial[] = [];
for (let i = 0; i < NROOTS_YMAX; i++) {
    nroots_c[i] = new NumericRootOfPolynomial();
}

/**
 * nroots(p,x), where x is optional and may be guessed from p.
 * @param expr 
 * @param $ 
 * @returns 
 */
export function Eval_nroots(expr: Cons, $: ExtensionEnv): U {
    // console.lg("Eval_nroots", render_as_infix(expr, $));
    let X: U = $.valueOf(caddr(expr));
    let P = $.valueOf(cadr(expr));
    // console.lg("P", render_as_infix(P, $));
    // console.lg("X", render_as_infix(X, $));

    X = is_nil(X) ? guess(P) : X;

    // console.lg("P", render_as_infix(X, $));

    if (!is_poly_expanded_form(P, X, $)) {
        halt(`nroots: Polynomial ${$.toInfixString(P)} in variable ${$.toInfixString(X)} must be in expanded form.`);
    }

    // mark the stack
    const h = defs.tos;

    // get the coefficients
    const coefficients = coeff(P, X, $);
    let n = coefficients.length;
    if (n > NROOTS_YMAX) {
        halt('nroots: degree?');
    }

    // convert the coefficients to real and imaginary doubles
    for (let i = 0; i < n; i++) {
        P = $.valueOf(evaluate_as_float(real(coefficients[i], $), $));
        X = $.valueOf(evaluate_as_float(imag(coefficients[i], $), $));
        if (!is_flt(P) || !is_flt(X)) {
            halt('nroots: coefficients?');
        }
        nroots_c[i].r = P.d;
        nroots_c[i].i = X.d;
    }

    // n is the number of coefficients, n = deg(p) + 1
    monic(n);

    for (let k = n; k > 1; k--) {
        findroot(k);
        if (Math.abs(nroots_a.r) < NROOTS_DELTA) {
            nroots_a.r = 0.0;
        }
        if (Math.abs(nroots_a.i) < NROOTS_DELTA) {
            nroots_a.i = 0.0;
        }
        stack_push($.add(create_flt(nroots_a.r), $.multiply(create_flt(nroots_a.i), imu)));
        NROOTS_divpoly(k);
    }

    // now make n equal to the number of roots
    n = defs.tos - h;

    if (n > 1) {
        sort_stack(n, $);
        const dims = [n];
        const elems = defs.stack.slice(h, h + n) as U[];
        move_top_of_stack(h);
        stack_push(new Tensor(dims, elems));
    }

    const retval = stack_pop();
    return retval;
}

// divide the polynomial by its leading coefficient
function monic(n: number): void {
    nroots_y.r = nroots_c[n - 1].r;
    nroots_y.i = nroots_c[n - 1].i;
    const t = nroots_y.r * nroots_y.r + nroots_y.i * nroots_y.i;
    for (let k = 0; k < n - 1; k++) {
        nroots_c[k].r = (nroots_c[k].r * nroots_y.r + nroots_c[k].i * nroots_y.i) / t;
        nroots_c[k].i = (nroots_c[k].i * nroots_y.r - nroots_c[k].r * nroots_y.i) / t;
    }
    nroots_c[n - 1].r = 1.0;
    nroots_c[n - 1].i = 0.0;
}

// uses the secant method
function findroot(n: number): void {
    if (NROOTS_ABS(nroots_c[0]) < NROOTS_DELTA) {
        nroots_a.r = 0.0;
        nroots_a.i = 0.0;
        return;
    }

    for (let j = 0; j < 100; j++) {
        nroots_a.r = NROOTS_RANDOM();
        nroots_a.i = NROOTS_RANDOM();

        compute_fa(n);

        nroots_b.r = nroots_a.r;
        nroots_b.i = nroots_a.i;

        nroots_fb.r = nroots_fa.r;
        nroots_fb.i = nroots_fa.i;

        nroots_a.r = NROOTS_RANDOM();
        nroots_a.i = NROOTS_RANDOM();

        for (let k = 0; k < 1000; k++) {
            compute_fa(n);

            const nrabs = NROOTS_ABS(nroots_fa);
            if (nrabs < NROOTS_EPSILON) {
                return;
            }

            if (NROOTS_ABS(nroots_fa) < NROOTS_ABS(nroots_fb)) {
                nroots_x.r = nroots_a.r;
                nroots_x.i = nroots_a.i;

                nroots_a.r = nroots_b.r;
                nroots_a.i = nroots_b.i;

                nroots_b.r = nroots_x.r;
                nroots_b.i = nroots_x.i;

                nroots_x.r = nroots_fa.r;
                nroots_x.i = nroots_fa.i;

                nroots_fa.r = nroots_fb.r;
                nroots_fa.i = nroots_fb.i;

                nroots_fb.r = nroots_x.r;
                nroots_fb.i = nroots_x.i;
            }

            // dx = nroots_b - nroots_a
            nroots_dx.r = nroots_b.r - nroots_a.r;
            nroots_dx.i = nroots_b.i - nroots_a.i;

            // df = fb - fa
            nroots_df.r = nroots_fb.r - nroots_fa.r;
            nroots_df.i = nroots_fb.i - nroots_fa.i;

            // y = dx / df
            const t = nroots_df.r * nroots_df.r + nroots_df.i * nroots_df.i;

            if (t === 0.0) {
                break;
            }

            nroots_y.r = (nroots_dx.r * nroots_df.r + nroots_dx.i * nroots_df.i) / t;
            nroots_y.i = (nroots_dx.i * nroots_df.r - nroots_dx.r * nroots_df.i) / t;

            // a = b - y * fb
            nroots_a.r = nroots_b.r - (nroots_y.r * nroots_fb.r - nroots_y.i * nroots_fb.i);
            nroots_a.i = nroots_b.i - (nroots_y.r * nroots_fb.i + nroots_y.i * nroots_fb.r);
        }
    }

    halt('nroots: convergence error');
}

function compute_fa(n: number): void {
    // x = a
    nroots_x.r = nroots_a.r;
    nroots_x.i = nroots_a.i;

    // fa = c0 + c1 * x
    nroots_fa.r = nroots_c[0].r + nroots_c[1].r * nroots_x.r - nroots_c[1].i * nroots_x.i;
    nroots_fa.i = nroots_c[0].i + nroots_c[1].r * nroots_x.i + nroots_c[1].i * nroots_x.r;

    for (let k = 2; k < n; k++) {
        // x = a * x
        const t = nroots_a.r * nroots_x.r - nroots_a.i * nroots_x.i;
        nroots_x.i = nroots_a.r * nroots_x.i + nroots_a.i * nroots_x.r;
        nroots_x.r = t;

        // fa += c[k] * x
        nroots_fa.r += nroots_c[k].r * nroots_x.r - nroots_c[k].i * nroots_x.i;
        nroots_fa.i += nroots_c[k].r * nroots_x.i + nroots_c[k].i * nroots_x.r;
    }
}

// divide the polynomial by x - a
function NROOTS_divpoly(n: number): void {
    for (let k = n - 1; k > 0; k--) {
        nroots_c[k - 1].r += nroots_c[k].r * nroots_a.r - nroots_c[k].i * nroots_a.i;
        nroots_c[k - 1].i += nroots_c[k].i * nroots_a.r + nroots_c[k].r * nroots_a.i;
    }

    if (NROOTS_ABS(nroots_c[0]) > NROOTS_DELTA) {
        halt('nroots: residual error');
    }

    for (let k = 0; k < n - 1; k++) {
        nroots_c[k].r = nroots_c[k + 1].r;
        nroots_c[k].i = nroots_c[k + 1].i;
    }
}
