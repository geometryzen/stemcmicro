import { create_int, is_num, one, Tensor, zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { add, inverse, isone, is_add, is_multiply, is_power, multiply, num_to_number, power } from "@stemcmicro/helpers";
import { caddr, cadr, car, cdr, is_cons, U } from "@stemcmicro/tree";
import { sort_factors } from "../../calculators/compare/sort_factors";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { factor_small_number } from "../factor/factor";
import { gcd } from "../gcd/gcd";

function signum(n: number): 1 | -1 | 0 {
    if (n < 0) {
        return -1;
    } else if (n > 0) {
        return 1;
    } else {
        return 0;
    }
}

//-----------------------------------------------------------------------------
//
//  Generate all divisors of a term
//
//  Input:    Term (factor * factor * ...)
//
//  Output:    Divisors
//
//-----------------------------------------------------------------------------
export function divisors(term: U, $: ExtensionEnv): U {
    const factors: U[] = ydivisors(term, $);
    const n = factors.length;
    return new Tensor([n], sort_factors(factors, $));
}

export function ydivisors(term: U, $: Pick<ExprContext, "getDirective" | "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U[] {
    const stack: U[] = [];
    // push all of the term's factors
    if (is_num(term)) {
        stack.push(...factor_small_number(num_to_number(term)));
    } else if (is_cons(term) && is_add(term)) {
        stack.push(...__factor_add(term, $));
    } else if (is_multiply(term)) {
        let p1 = cdr(term);
        if (is_num(car(p1))) {
            stack.push(...factor_small_number(num_to_number(car(p1))));
            p1 = cdr(p1);
        }
        if (is_cons(p1)) {
            const mapped = [...p1].map((p2) => {
                if (is_power(p2)) {
                    return [cadr(p2), caddr(p2)];
                }
                return [p2, one];
            });
            stack.push(...mapped.flat());
        }
    } else if (is_power(term)) {
        stack.push(cadr(term), caddr(term));
    } else {
        stack.push(term, one);
    }

    const k = stack.length;

    // contruct divisors by recursive descent
    stack.push(one);
    gen(stack, 0, k, $);

    return stack.slice(k);
}

//-----------------------------------------------------------------------------
//
//  Generate divisors
//
//  Input:    Base-exponent pairs on stack
//
//      h  first pair
//
//      k  just past last pair
//
//  Output:    Divisors on stack
//
//  For example, factor list 2 2 3 1 results in 6 divisors,
//
//    1
//    3
//    2
//    6
//    4
//    12
//
//-----------------------------------------------------------------------------
function gen(stack: U[], h: number, k: number, _: Pick<ExprContext, "valueOf">): void {
    const ACCUM: U = stack.pop() as U;

    if (h === k) {
        stack.push(ACCUM);
        return;
    }

    const BASE: U = stack[h + 0];
    const EXPO: U = stack[h + 1];

    const expo = num_to_number(EXPO);
    if (!isNaN(expo)) {
        for (let i = 0; i <= Math.abs(expo); i++) {
            stack.push(multiply(_, ACCUM, power(_, BASE, create_int(signum(expo) * i))));
            gen(stack, h + 2, k, _);
        }
    }
}

//-----------------------------------------------------------------------------
//
//  Factor ADD expression
//
//  Input:    Expression
//
//  Output:    Factors
//
//  Each factor consists of two expressions, the factor itself followed
//  by the exponent.
//
//-----------------------------------------------------------------------------
function __factor_add(p1: U, $: Pick<ExprContext, "getDirective" | "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U[] {
    // get gcd of all terms
    const temp1 = is_cons(p1)
        ? p1.tail().reduce(function (x, y) {
              return gcd(x, y, $);
          })
        : car(p1);

    const stack: U[] = [];
    // check gcd
    let p2 = temp1;
    if (isone(p2, $)) {
        stack.push(p1, one);
        return stack;
    }

    // push factored gcd
    if (is_num(p2)) {
        stack.push(...factor_small_number(num_to_number(p2)));
    } else if (is_multiply(p2)) {
        const p3 = cdr(p2);
        if (is_num(car(p3))) {
            stack.push(...factor_small_number(num_to_number(car(p3))));
        } else {
            stack.push(car(p3), one);
        }
        if (is_cons(p3)) {
            p3.tail().forEach((p) => stack.push(p, one));
        }
    } else {
        stack.push(p2, one);
    }

    // divide each term by gcd
    p2 = inverse(p2, $);
    const temp2 = is_cons(p1) ? p1.tail().reduce((a: U, b: U) => add($, a, multiply($, p2, b)), zero) : cdr(p1);

    stack.push(temp2, one);
    return stack;
}
