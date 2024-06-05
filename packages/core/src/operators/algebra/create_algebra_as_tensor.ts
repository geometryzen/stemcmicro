import { Adapter, Blade, create_algebra, create_flt, create_int, is_blade, is_flt, is_num, is_rat, is_sym, is_tensor, one, SumTerm, Tensor, zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { isone, multiply } from "@stemcmicro/helpers";
import { cons, Cons, items_to_cons, U } from "@stemcmicro/tree";
import { iszero } from "../../helpers/iszero";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { extract_grade } from "./extract_grade";

function blade_times_weight(blade: Blade, weight: U, $: ExprContext): Cons | Blade {
    if (isone(weight, $)) {
        return blade;
    } else {
        return cons(MATH_MUL, items_to_cons(blade, weight));
    }
}

class AlgebraFieldAdapter implements Adapter<U, U> {
    constructor(private readonly $: ExprContext) {}
    get ε(): U {
        return create_flt(1e-6);
    }
    get one(): U {
        return one;
    }
    get zero(): U {
        return zero;
    }
    abs(): U {
        throw new Error("abs Method not implemented.");
    }
    add(lhs: U, rhs: U): U {
        if (isone(lhs, this.$)) {
            if (isone(rhs, this.$)) {
                return create_int(2);
            } else {
                throw new Error("add Method not implemented.");
            }
        } else {
            throw new Error("add Method not implemented.");
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sub(lhs: U, rhs: U): U {
        throw new Error("sub Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    eq(lhs: U, rhs: U): boolean {
        throw new Error("eq Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ne(lhs: U, rhs: U): boolean {
        throw new Error("ne Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    le(lhs: U, rhs: U): boolean {
        throw new Error("le Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    lt(lhs: U, rhs: U): boolean {
        throw new Error("lt Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ge(lhs: U, rhs: U): boolean {
        throw new Error("ge Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    gt(lhs: U, rhs: U): boolean {
        throw new Error("gt Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    max(lhs: U, rhs: U): U {
        throw new Error("max Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    min(lhs: U, rhs: U): U {
        throw new Error("min Method not implemented.");
    }
    mul(lhs: U, rhs: U): U {
        return multiply(this.$, lhs, rhs);
        /*
        if (is_rat(lhs)) {
            if (is_rat(rhs)) {
                return lhs.mul(rhs);
            }
        }
        throw new Error(`mul Method not implemented.`);
        */
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    div(lhs: U, rhs: U): U {
        throw new Error("div Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    neg(arg: U): U {
        if (is_rat(arg)) {
            return arg.neg();
        }
        throw new Error(`neg ${arg} Method not implemented.`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asString(arg: U): string {
        throw new Error("asString Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cos(arg: U): U {
        throw new Error("cos Method not implemented.");
    }
    isField(arg: U | Blade): arg is U {
        if (is_rat(arg)) {
            return true;
        } else if (is_flt(arg)) {
            return true;
        } else if (is_blade(arg)) {
            return false;
        } else {
            throw new Error(`isField method not implemented.`);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isOne(arg: U): boolean {
        throw new Error("isOne Method not implemented.");
    }
    isZero(arg: U): boolean {
        return iszero(arg, this.$);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sin(arg: U): U {
        throw new Error("sin Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sqrt(arg: U): U {
        throw new Error("sqrt Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isDimension(arg: U): boolean {
        throw new Error("isDimension Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dim(arg: U): number {
        throw new Error("dim Method not implemented.");
    }
    sum(terms: SumTerm<U, U>[]): U {
        // The general idea here is to implement optimizations and then to fall back to mathematical addition.
        // The fallback should be able to handle the undefined cases.

        if (terms.length === 1) {
            const term = terms[0];
            const weight = term.weight;
            const blade = term.blade;
            return multiply(this.$, weight, blade);
        } else if (terms.length === 2) {
            const a = blade_times_weight(terms[0].blade, terms[0].weight, this.$);
            const b = blade_times_weight(terms[1].blade, terms[1].weight, this.$);
            // TODO: Why don't we use add terms?
            return cons(MATH_ADD, items_to_cons(a, b));
        } else {
            // We may get more than two terms when we consider general metrics.
            // const bws = terms.map(function(term){return multiply(term.blade,term.weight)});
            throw new Error(`sum of ${terms.length} terms Method not implemented.`);
        }
    }
    extractGrade(arg: U, grade: number): U {
        return extract_grade(arg, grade, this.$);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    treeAdd(lhs: U, rhs: U): U {
        throw new Error("treeAdd Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    treeLco(lhs: U, rhs: U): U {
        if (is_blade(lhs) && is_blade(rhs)) {
            return lhs.lshift(rhs);
        }
        throw new Error(`treeLco(lhs=${lhs}, rhs=${rhs}) Method not implemented.`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    treeMul(lhs: U, rhs: U): U {
        throw new Error("treeMul Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    treeScp(lhs: U, rhs: U): U {
        throw new Error("treeScp Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    treeSqrt(arg: U): U {
        throw new Error("treeSqrt Method not implemented.");
    }
    treeZero(): U {
        return zero;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    scalarCoordinate(arg: U): U {
        throw new Error("scalarCoordinate Method not implemented.");
    }
    bladeToTree(blade: Blade): U {
        return blade;
    }
    weightToTree(weight: U): U {
        return weight;
    }
}

/**
 * The implementation of the algebra constructor function.
 * @param metric Currently limited to the diagonal elements.
 * @param labels Currently limited to the basis elements or the elements of the algebra.
 * @param $
 * @returns
 */
export function create_algebra_as_tensor<T extends U>(metric: T[], labels: string[], $: ExprContext): Tensor<U> {
    const blades: Blade[] = create_algebra_as_blades(metric, labels, $);
    return new Tensor([metric.length], blades);
}

export function create_algebra_as_blades<T extends U>(metric: T[], labels: string[], $: ExprContext): Blade[] {
    const uFieldAdaptor = new AlgebraFieldAdapter($);
    const GA = create_algebra(metric, uFieldAdaptor, labels);
    /**
     * Number of basis vectors in algebra is dimensionality.
     */
    const dimensions = metric.length;
    const blades: Blade[] = new Array<Blade>(dimensions);
    for (let index = 0; index < dimensions; index++) {
        blades[index] = GA.unit(index);
    }
    return blades;
}

export function convertMetricToNative(tensor: U): U[] {
    if (is_tensor(tensor)) {
        return tensor.mapElements(function (e) {
            if (is_sym(e)) {
                return e;
            } else if (is_num(e)) {
                return e;
            } else if (is_rat(e) && e.isInteger()) {
                return e;
            } else {
                throw new Error(`${e} must be an integer.`);
            }
        });
    } else {
        throw new Error("must be a tensor.");
    }
}
