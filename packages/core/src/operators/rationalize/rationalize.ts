import { is_tensor, one, zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Directive } from "@stemcmicro/directive";
import { add, divide, inverse, is_add, is_multiply, is_num_and_negative, is_power, multiply } from "@stemcmicro/helpers";
import { caddr, cadr, Cons, is_cons, U } from "@stemcmicro/tree";
import { condense } from "../../condense";
import { gcd } from "../gcd/gcd";

export function eval_rationalize(expr: Cons, $: ExprContext): U {
    // const infix = render_as_infix(expr, $);
    // console.lg("infix", infix);
    const arg = cadr(expr);
    // console.lg("arg", render_as_infix(arg, $));
    const value = $.valueOf(arg);
    // console.lg("value", render_as_infix(value, $));
    return rationalize_factoring(value, $);
}

export function rationalize_factoring(arg: U, $: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    // console.lg("rationalize_factoring", `${arg}`);
    $.pushDirective(Directive.factoring, 1);
    try {
        return yyrationalize(arg, $);
    } finally {
        $.popDirective();
    }
}

function yyrationalize(arg: U, $: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    // console.lg("yyrationalize", `${arg}`);
    if (is_tensor(arg)) {
        return __rationalize_tensor(arg, $);
    }

    // defs.expanding = false;

    if (!is_add(arg)) {
        return arg;
    }

    // get common denominator
    const commonDenominator = multiply_denominators(arg, $);

    // console.lg("commonDenominator", `${commonDenominator}`);

    // multiply each term by common denominator
    let temp: U = zero;
    if (is_cons(arg)) {
        temp = arg.tail().reduce((acc: U, term: U) => add($, acc, multiply($, commonDenominator, term)), temp);
    }

    // console.lg("temp", `${temp}`);

    // collect common factors
    // divide by common denominator
    // console.lg(`temp ${print_expr(temp, $)}`);
    const condensed = condense(temp, $);
    // console.lg("condensed", `${condensed}`);
    const rationalized = divide(condensed, commonDenominator, $);
    // console.lg("retval", `${rationalized}`);
    return rationalized;
}

function multiply_denominators(p: U, $: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    if (is_add(p)) {
        return p.tail().reduce((acc: U, el: U) => multiply_denominators_term(el, acc, $), one);
    }
    return multiply_denominators_term(p, one, $);
}

function multiply_denominators_term(p: U, p2: U, $: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    if (is_multiply(p)) {
        return p.tail().reduce((acc, el) => multiply_denominators_factor(el, acc, $), p2);
    }

    return multiply_denominators_factor(p, p2, $);
}

function multiply_denominators_factor(p: U, p2: U, $: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    if (!is_power(p)) {
        return p2;
    }

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
}

function __rationalize_tensor(p1: U, $: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    if (!is_tensor(p1)) {
        // might be zero
        return p1;
    }

    const elems = p1.mapElements(function (x) {
        return rationalize_factoring(x, $);
    });

    return p1.withElements(elems);
}

function __lcm(p1: U, p2: U, $: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    return divide(multiply($, p1, p2), gcd(p1, p2, $), $);
}
