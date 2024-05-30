import { is_flt } from "math-expression-atoms";
import { ExprContext, Sign, SIGN_GT, SIGN_LT } from "math-expression-context";
import { Shareable, U } from "math-expression-tree";
import { abs } from "../helpers/abs";
import { arg } from "../helpers/arg";

export function item_to_complex(env: ExprContext): (arg: U) => Polar {
    return function (arg: U) {
        return inner_as_complex(arg, env);
    };
}

function inner_as_complex(z: U, env: ExprContext): Polar {
    const theta = arg(z, env);
    const radius = abs(z, env);
    try {
        return new Polar(radius, theta, z);
    } finally {
        theta.release();
        radius.release();
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function complex_to_item(env: ExprContext): (x: Polar) => U {
    return function (z: Polar): U {
        return z.orig;
    };
}

export function complex_comparator(compareFn: (lhs: U, rhs: U) => Sign): (lhs: Polar, rhs: Polar) => Sign {
    return function (lhs: Polar, rhs: Polar) {
        return inner_complex_comparator(lhs, rhs, compareFn);
    };
}

function inner_complex_comparator(lhs: Polar, rhs: Polar, compareFn: (lhs: U, rhs: U) => Sign): Sign {
    const thetaL = lhs.arg;
    const thetaR = rhs.arg;
    try {
        switch (compareFn(thetaL, thetaR)) {
            case SIGN_LT:
                return SIGN_LT;
            case SIGN_GT:
                return SIGN_GT;
            default: {
                const radiusL = lhs.mag;
                const radiusR = rhs.mag;
                try {
                    return compareFn(radiusL, radiusR);
                } finally {
                    radiusL.release();
                    radiusR.release();
                }
            }
        }
    } finally {
        thetaL.release();
        thetaR.release();
    }
}

/**
 * This class is NOT being used as an atom. The purpose is to provide an easily sortable element in an array.
 * The sorting is based on the argument (theta) first followed by the magnitude.
 * The original (complex) item is retained in order to avoid numerical losses.
 */
export class Polar implements Shareable {
    readonly #mag: U;
    readonly #arg: U;
    readonly #orig: U;
    #refCount = 1;
    constructor(mag: U, arg: U, orig: U) {
        this.#mag = mag;
        this.#arg = arg;
        this.#orig = orig;
        this.#mag.addRef();
        this.#arg.addRef();
        this.#orig.addRef();
    }
    get mag(): U {
        this.#mag.addRef();
        return this.#mag;
    }
    get arg(): U {
        this.#arg.addRef();
        return this.#arg;
    }
    get orig(): U {
        this.#orig.addRef();
        return this.#orig;
    }
    toString(): string {
        if (is_flt(this.#mag) && is_flt(this.#arg)) {
            return `(${this.#mag.d}, ${this.#arg.d})`;
        } else {
            return `(${this.#mag}, ${this.#arg})`;
        }
    }
    addRef(): void {
        this.#refCount++;
    }
    release(): void {
        this.#refCount--;
        if (this.#refCount === 0) {
            this.#mag.release();
            this.#arg.release();
            this.#orig.release();
        }
    }
}
