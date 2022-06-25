import { coeff } from './coeff';
import { ExtensionEnv } from './env/ExtensionEnv';
import { imu } from './env/imu';
import { guess } from './guess';
import { imag } from './operators/imag/imag';
import { is_poly_expanded_form } from './is';
import { sort_stack } from './misc';
import { yyfloat } from './operators/float/float';
import { real } from './operators/real/real';
import { defs, halt, move_top_of_stack } from './runtime/defs';
import { stack_push } from './runtime/stack';
import { wrap_as_flt } from './tree/flt/Flt';
import { is_flt } from './operators/flt/is_flt';
import { caddr, cadr } from './tree/helpers';
import { Tensor } from './tree/tensor/Tensor';
import { nil, U } from './tree/tree';

// find the roots of a polynomial numerically
const NROOTS_YMAX = 101;
const NROOTS_DELTA = 1.0e-6;
const NROOTS_EPSILON = 1.0e-9;

function NROOTS_ABS(z: numericRootOfPolynomial): number {
    return Math.sqrt(z.r * z.r + z.i * z.i);
}

// random between -2 and 2
// const theRandom = 0.0;

function NROOTS_RANDOM(): number {
    //theRandom += 0.2
    //return theRandom
    return 4.0 * Math.random() - 2.0;
}

class numericRootOfPolynomial {
    public r = 0.0;
    public i = 0.0;
}

const nroots_a = new numericRootOfPolynomial();
const nroots_b = new numericRootOfPolynomial();
const nroots_x = new numericRootOfPolynomial();
const nroots_y = new numericRootOfPolynomial();
const nroots_fa = new numericRootOfPolynomial();
const nroots_fb = new numericRootOfPolynomial();
const nroots_dx = new numericRootOfPolynomial();
const nroots_df = new numericRootOfPolynomial();
const nroots_c: numericRootOfPolynomial[] = [];
for (let initNRoots = 0; initNRoots < NROOTS_YMAX; initNRoots++) {
    nroots_c[initNRoots] = new numericRootOfPolynomial();
}

export function Eval_nroots(p1: U, $: ExtensionEnv): void {
    let p2: U = $.valueOf(caddr(p1));
    p1 = $.valueOf(cadr(p1));

    p2 = nil === p2 ? guess(p1) : p2;

    if (!is_poly_expanded_form(p1, p2, $)) {
        halt('nroots: polynomial?');
    }

    // mark the stack
    const h = defs.tos;

    // get the coefficients
    const cs = coeff(p1, p2, $);
    let n = cs.length;
    if (n > NROOTS_YMAX) {
        halt('nroots: degree?');
    }

    // convert the coefficients to real and imaginary doubles
    for (let i = 0; i < n; i++) {
        p1 = $.valueOf(yyfloat(real(cs[i], $), $));
        p2 = $.valueOf(yyfloat(imag(cs[i], $), $));
        if (!is_flt(p1) || !is_flt(p2)) {
            halt('nroots: coefficients?');
        }
        nroots_c[i].r = p1.d;
        nroots_c[i].i = p2.d;
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
        stack_push($.add(wrap_as_flt(nroots_a.r), $.multiply(wrap_as_flt(nroots_a.i), imu)));
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
}

// divide the polynomial by its leading coefficient
function monic(n: number) {
    nroots_y.r = nroots_c[n - 1].r;
    nroots_y.i = nroots_c[n - 1].i;
    const t = nroots_y.r * nroots_y.r + nroots_y.i * nroots_y.i;
    for (let k = 0; k < n - 1; k++) {
        nroots_c[k].r =
            (nroots_c[k].r * nroots_y.r + nroots_c[k].i * nroots_y.i) / t;
        nroots_c[k].i =
            (nroots_c[k].i * nroots_y.r - nroots_c[k].r * nroots_y.i) / t;
    }
    nroots_c[n - 1].r = 1.0;
    nroots_c[n - 1].i = 0.0;
}

// uses the secant method
function findroot(n: number) {
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
            nroots_a.r =
                nroots_b.r - (nroots_y.r * nroots_fb.r - nroots_y.i * nroots_fb.i);
            nroots_a.i =
                nroots_b.i - (nroots_y.r * nroots_fb.i + nroots_y.i * nroots_fb.r);
        }
    }

    halt('nroots: convergence error');
}

function compute_fa(n: number) {
    // x = a
    nroots_x.r = nroots_a.r;
    nroots_x.i = nroots_a.i;

    // fa = c0 + c1 * x
    nroots_fa.r =
        nroots_c[0].r + nroots_c[1].r * nroots_x.r - nroots_c[1].i * nroots_x.i;
    nroots_fa.i =
        nroots_c[0].i + nroots_c[1].r * nroots_x.i + nroots_c[1].i * nroots_x.r;

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
function NROOTS_divpoly(n: number) {
    for (let k = n - 1; k > 0; k--) {
        nroots_c[k - 1].r +=
            nroots_c[k].r * nroots_a.r - nroots_c[k].i * nroots_a.i;
        nroots_c[k - 1].i +=
            nroots_c[k].i * nroots_a.r + nroots_c[k].r * nroots_a.i;
    }

    if (NROOTS_ABS(nroots_c[0]) > NROOTS_DELTA) {
        halt('nroots: residual error');
    }

    for (let k = 0; k < n - 1; k++) {
        nroots_c[k].r = nroots_c[k + 1].r;
        nroots_c[k].i = nroots_c[k + 1].i;
    }
}
