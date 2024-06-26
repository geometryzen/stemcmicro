import { create_int } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { iszero, is_add, is_multiply, is_num_and_eq_number } from "@stemcmicro/helpers";
import { car, cons, is_cons, items_to_cons, U } from "@stemcmicro/tree";
import { is_poly_expanded_form } from "./is";
import { coefficients } from "./operators/coeff/coeff";
import { ADD, FOR, MULTIPLY, POWER, SYMBOL_S, SYMBOL_T, SYMBOL_X, SYMBOL_Y, SYMBOL_Z } from "./runtime/constants";
import { doexpand_unary } from "./runtime/defs";
import { SystemError } from "./runtime/SystemError";

/**
 * This is called by the top level execution (and by itself recursively to evaluate the operands of Cons expressions).
 * @param expr
 * @param $
 * @returns
 */
export function eval_bake(expr: U, $: ExprContext): U {
    return doexpand_unary(bake_internal, expr, $);
}

export function bake_internal(expr: U, $: ExprContext): U {
    // console.lg(`bake_internal ${print_expr(expr, $)}`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        return retval;
    };
    // Determine which variable the polynomial contains.
    const s = is_poly_expanded_form(expr, SYMBOL_S);
    const t = is_poly_expanded_form(expr, SYMBOL_T);
    const x = is_poly_expanded_form(expr, SYMBOL_X);
    const y = is_poly_expanded_form(expr, SYMBOL_Y);
    const z = is_poly_expanded_form(expr, SYMBOL_Z);

    if (s && !t && !x && !y && !z) {
        return hook(bake_poly(expr, SYMBOL_S, $), "S");
    } else if (!s && t && !x && !y && !z) {
        return hook(bake_poly(expr, SYMBOL_T, $), "T");
    } else if (!s && !t && x && !y && !z) {
        return hook(bake_poly(expr, SYMBOL_X, $), "X");
    } else if (!s && !t && !x && y && !z) {
        return hook(bake_poly(expr, SYMBOL_Y, $), "Y");
    } else if (!s && !t && !x && !y && z) {
        return hook(bake_poly(expr, SYMBOL_Z, $), "Z");
        // don't bake the contents of some constructs such as "for"
        // because we don't want to evaluate the body of
        // such constructs "statically", i.e. without fully running
        // the loops.
        // TODO: The fact that we have to special case the "for" suggests that the handlers
        // of operators should be called so that the system is generic.
    } else if (is_cons(expr) && !car(expr).equals(FOR)) {
        const bakeList = items_to_cons(
            car(expr),
            ...expr.tail().map(function (x) {
                return eval_bake(x, $);
            })
        );
        return hook(bakeList, "F");
    } else {
        return hook(expr, "G");
    }
}

export function polyform(p1: U, p2: U, $: ExprContext): U {
    if (is_poly_expanded_form(p1, p2)) {
        return bake_poly(p1, p2, $);
    }
    if (is_cons(p1)) {
        return items_to_cons(car(p1), ...p1.tail().map((el) => polyform(el, p2, $)));
    }

    return p1;
}

/**
 * Returns the poynomial (in expanded form when in expanding mode).
 * Algorithm...
 * Computes the coefficients of the polynomial by iteratively...
 * 1. Evaluating at zero.
 * 2. Subtracting the constant term.
 * 3. Dividing by the variable.
 * 4. Rinse and repeat.
 *
 * , then rebuilds the polynomial using the coefficients.
 * However, this is all happening while in expanding mode.
 *
 * @param p The polynomial.
 * @param x The polynomial variable.
 */
function bake_poly(p: U, x: U, $: ExprContext): U {
    // console.lg(`bake_poly ${p} ${x}`);
    const beans = coefficients(p, x, $);
    // console.lg(`beans => ${beans}`);
    // We're not getting to see this because coeff blows up
    const result: U[] = [];
    for (let i = beans.length - 1; i >= 0; i--) {
        const bean = beans[i];
        const baked_beans = bake_poly_term(i, bean, x, $);
        // console.lg(`baked_beans => ${items_to_infix(baked_beans, $)}`);
        result.push(...baked_beans);
    }
    if (result.length > 1) {
        return cons(ADD, items_to_cons(...result));
    }
    if (result.length > 0) {
        return result[0];
    } else {
        throw new SystemError();
    }
}

// p1 points to coefficient of p2 ^ k

// k is an int
function bake_poly_term(k: number, coefficient: U, term: U, $: Pick<ExprContext, "valueOf">): U[] {
    if (iszero(coefficient, $)) {
        return [];
    }

    // constant term?
    if (k === 0) {
        if (is_cons(coefficient) && is_add(coefficient)) {
            return coefficient.tail();
        }
        return [coefficient];
    }

    const result: U[] = [];
    // coefficient
    if (is_multiply(coefficient)) {
        result.push(...coefficient.tail());
    } else if (!is_num_and_eq_number(coefficient, 1)) {
        result.push(coefficient);
    }

    // x ^ k
    if (k === 1) {
        result.push(term);
    } else {
        result.push(items_to_cons(POWER, term, create_int(k)));
    }
    if (result.length > 1) {
        return [items_to_cons(MULTIPLY, ...result)];
    }
    return result;
}
