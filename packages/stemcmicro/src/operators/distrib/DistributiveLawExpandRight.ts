import { Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { is_cons_opr_eq_sym } from "@stemcmicro/predicates";
import { cons, Cons, Cons2, is_cons, items_to_cons, U } from "@stemcmicro/tree";
import { MODE_EXPANDING, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { wrap_as_transform } from "../wrap_as_transform";

type LHS = Cons;
type RHS = U;
type EXP = Cons2<Sym, LHS, RHS>;

function make_is_cons_and_opr_eq_sym(lower: Sym) {
    return function (expr: U): expr is Cons {
        return is_cons(expr) && is_cons_opr_eq_sym(expr, lower);
    };
}

/**
 * (upper (lower x1 x2 x3 ...) rhs) => (lower (upper x1 rhs) (upper x2 rhs) (upper x3 rhs) ...)
 */
export class DistributiveLawExpandRight extends Function2<LHS, RHS> {
    readonly #hash: string;
    readonly phases = MODE_EXPANDING;
    constructor(upper: Sym, lower: Sym) {
        super(`'${upper.key()}' right-distributive over '${lower.key()}'`, upper, make_is_cons_and_opr_eq_sym(lower), is_any);
        this.#hash = hash_binop_cons_atom(upper, lower, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(upper: Sym, lhs: LHS, rhs: RHS, oldExpr: EXP, $: ExprContext): [TFLAGS, U] {
        const lower = lhs.opr;
        try {
            const xs = lhs.rest;
            try {
                const terms = xs.map((x) => {
                    const term = items_to_cons(upper, x, rhs);
                    try {
                        return $.valueOf(term);
                    } finally {
                        term.release();
                    }
                });
                try {
                    const rawExpr = cons(lower, terms);
                    try {
                        const newExpr = $.valueOf(rawExpr);
                        try {
                            return wrap_as_transform(newExpr, oldExpr);
                        } finally {
                            newExpr.release();
                        }
                    } finally {
                        rawExpr.release();
                    }
                } finally {
                    terms.release();
                }
            } finally {
                xs.release();
            }
        } finally {
            lower.release();
        }
    }
}
