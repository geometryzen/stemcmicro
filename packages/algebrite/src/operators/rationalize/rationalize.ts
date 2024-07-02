import { is_tensor, one, Tensor, zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Directive } from "@stemcmicro/directive";
import { add, divide, inverse, is_cons_opr_eq_add, is_cons_opr_eq_multiply, is_cons_opr_eq_power, is_multiply, is_num_and_negative, multiply } from "@stemcmicro/helpers";
import { caddr, cadr, Cons, is_cons, U } from "@stemcmicro/tree";
import { condense } from "../../condense";
import { gcd } from "../gcd/gcd";

/**
 * rationalize(x) = (rationalize x)
 *
 * Returns x with everything over a common denominator.
 */
export function eval_rationalize(expr: Cons, $: ExprContext): U {
    const argList = expr.argList;
    try {
        const x = argList.head;
        try {
            const value = $.valueOf(x);
            try {
                return rationalize(value, $);
            } finally {
                value.release();
            }
        } finally {
            x.release();
        }
    } finally {
        argList.release();
    }
}

export function rationalize(x: U, $: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    $.pushDirective(Directive.factoring, 1);
    try {
        return yyrationalize(x, $);
    } finally {
        $.popDirective();
    }
}

function yyrationalize(x: U, $: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    if (is_tensor(x)) {
        return __rationalize_tensor(x, $);
    }

    if (is_cons(x) && is_cons_opr_eq_add(x)) {
        const terms = x.tail();

        const denom = multiply_denominators(terms, $);

        // multiply each term by common denominator, adding as we go.
        const x_times_denom = terms.reduce((acc: U, term: U) => add($, acc, multiply($, denom, term)), zero);

        const x_times_denom_condensed = condense(x_times_denom, $);

        return divide(x_times_denom_condensed, denom, $);
    } else {
        return x;
    }
}

function multiply_denominators(terms: U[], $: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    return terms.reduce((acc: U, term: U) => multiply_denominators_term(term, acc, $), one);
}

function multiply_denominators_term(term: U, initialValue: U, $: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    if (is_cons(term) && is_cons_opr_eq_multiply(term)) {
        const factors = term.tail();
        return factors.reduce((acc, factor) => multiply_denominators_factor(factor, acc, $), initialValue);
    }
    return multiply_denominators_factor(term, initialValue, $);
}

function multiply_denominators_factor(p: U, p2: U, $: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    if (is_cons(p) && is_cons_opr_eq_power(p)) {
        const arg2 = p;

        p = caddr(p);

        // like x^(-2) ?
        if (is_num_and_negative(p)) {
            return __lcm(p2, inverse(arg2, $), $);
        }

        // like x^(-a) ?
        if (is_multiply(p) && is_num_and_negative(cadr(p))) {
            return __lcm(p2, inverse(arg2, $), $);
        }

        // no match
        return p2;
    } else {
        return p2;
    }
}

function __rationalize_tensor(p1: Tensor<U>, $: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    if (!is_tensor(p1)) {
        // might be zero
        return p1;
    }

    const elems = p1.mapElements(function (x) {
        return rationalize(x, $);
    });

    return p1.withElements(elems);
}

function __lcm(p1: U, p2: U, $: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    return divide(multiply($, p1, p2), gcd(p1, p2, $), $);
}
