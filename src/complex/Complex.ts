import { is_flt } from "math-expression-atoms";
import { ExprContext, Sign, SIGN_GT, SIGN_LT } from "math-expression-context";
import { Shareable, U } from "math-expression-tree";
import { abs } from "../helpers/abs";
import { arg } from "../helpers/arg";

export function item_to_complex(env: ExprContext): (arg: U) => Complex {
    return function (arg: U) {
        return inner_as_complex(arg, env);
    };
}

function inner_as_complex(z: U, env: ExprContext): Complex {
    const re = arg(z, env);
    const im = abs(z, env);
    try {
        return new Complex(re, im, z);
    }
    finally {
        re.release();
        im.release();
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function complex_to_item(env: ExprContext): (x: Complex) => U {
    return function (z: Complex): U {
        return z.orig;
    };
}

export function complex_comparator(compareFn: (lhs: U, rhs: U) => Sign): (lhs: Complex, rhs: Complex) => Sign {
    return function (lhs: Complex, rhs: Complex) {
        return inner_complex_comparator(lhs, rhs, compareFn);
    };
}

function inner_complex_comparator(lhs: Complex, rhs: Complex, compareFn: (lhs: U, rhs: U) => Sign): Sign {
    const xL = lhs.re;
    const xR = rhs.re;
    try {
        switch (compareFn(xL, xR)) {
            case SIGN_LT: return SIGN_LT;
            case SIGN_GT: return SIGN_GT;
            default: {
                const yL = lhs.im;
                const yR = rhs.im;
                try {
                    return compareFn(yL, yR);
                }
                finally {
                    yL.release();
                    yR.release();
                }
            }
        }
    }
    finally {
        xL.release();
        xR.release();
    }
}

export class Complex implements Shareable {
    readonly #re: U;
    readonly #im: U;
    readonly #orig: U;
    #refCount = 1;
    constructor(re: U, im: U, orig: U) {
        this.#re = re;
        this.#im = im;
        this.#orig = orig;
        this.#re.addRef();
        this.#im.addRef();
        this.#orig.addRef();
    }
    get re(): U {
        this.#re.addRef();
        return this.#re;
    }
    get im(): U {
        this.#im.addRef();
        return this.#im;
    }
    get orig(): U {
        this.#orig.addRef();
        return this.#orig;
    }
    toString(): string {
        if (is_flt(this.#re) && is_flt(this.#im)) {
            return `(${this.#re.d}, ${this.#im.d})`;
        }
        else {
            return `(${this.#re}, ${this.#im})`;
        }
    }
    addRef(): void {
        this.#refCount++;
    }
    release(): void {
        this.#refCount--;
        if (this.#refCount === 0) {
            this.#re.release();
            this.#im.release();
            this.#orig.release();
        }
    }
}