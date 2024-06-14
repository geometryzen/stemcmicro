import { imu, is_blade, is_uom, negOne, one } from "@stemcmicro/atoms";
import { count_factors, remove_factors } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { is_power } from "../../runtime/helpers";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";
import { is_imu } from "../imu/is_imu";
import { is_rat } from "../rat/is_rat";
import { is_sym } from "../sym/is_sym";
import { compute_r_from_base_and_expo } from "./compute_r_from_base_and_expo";
import { compute_theta_from_base_and_expo } from "./compute_theta_from_base_and_expo";

const ADD = native_sym(Native.add);
const EXP = native_sym(Native.exp);
const IM = native_sym(Native.imag);
const POW = native_sym(Native.pow);
const RE = native_sym(Native.real);
const MUL = native_sym(Native.multiply);

function multiply_factors(factors: U[], $: ExtensionEnv): U {
    if (factors.length > 1) {
        return $.valueOf(items_to_cons(MUL, ...factors));
    } else if (factors.length === 1) {
        return $.valueOf(factors[0]);
    } else {
        return one;
    }
}

/**
 * (re (* ...))
 *
 * The strategy is to remove factors which are themselves real and treat them as scalars.
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(RE, MUL);
    }
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg("opr", $.toSExprString(opr), "innerExpr", $.toSExprString(innerExpr), "outerExpr", $.toSExprString(outerExpr));
        const count_imu = count_factors(innerExpr, is_imu);
        if (count_imu > 0) {
            const z = remove_factors(innerExpr, is_imu);
            switch (count_imu % 4) {
                case 0: {
                    // This would cause an infinite loop if count_imu were 0.
                    return [TFLAG_DIFF, $.re(z)];
                }
                case 1: {
                    return [TFLAG_DIFF, $.negate($.im(z))];
                }
                case 2: {
                    return [TFLAG_DIFF, $.negate($.re(z))];
                }
                case 3: {
                    return [TFLAG_DIFF, $.im(z)];
                }
                default: {
                    throw new Error(`${count_imu}`);
                }
            }
        }
        // console.lg("Computing Re of a * expression...", $.toSExprString(expr));
        const rs: U[] = []; // the real factors.
        const cs: U[] = []; // the complex factors
        [...innerExpr.argList].forEach(function (factor) {
            // console.lg("testing the factor using is_real:", $.toInfixString(factor));
            if ($.isreal(factor)) {
                // console.lg("factor is real:", $.toInfixString(factor));
                rs.push(factor);
            } else {
                // console.lg("factor is NOT real:", $.toInfixString(factor));
                // console.lg("arg is NOT real:", $.toInfixString(arg));
                // With no boolean response, we have to assume that the argument is not real valued.
                // How do we make progress with the factors that are complex numbers?
                if (is_sym(factor)) {
                    // console.lg("arg is Sym and possibly complex", $.toInfixString(arg));
                    const x = items_to_cons(RE, factor);
                    const y = items_to_cons(IM, factor);
                    const iy = items_to_cons(MUL, imu, y);
                    const z = items_to_cons(ADD, x, iy);
                    // console.lg("Z=>", $.toInfixString(z));
                    cs.push(z);
                } else if (factor.equals(imu)) {
                    // console.lg("arg is imu", $.toInfixString(arg));
                    cs.push(factor);
                } else if (is_power(factor)) {
                    const base = factor.base;
                    const expo = factor.expo;
                    if (is_rat(expo) && expo.isMinusOne()) {
                        // Get the complex number out of the denominator.
                        const z_star = $.conj(base);
                        const denom = $.valueOf(items_to_cons(MUL, z_star, base));
                        const one_over_denom = $.valueOf(items_to_cons(POW, denom, negOne));
                        const z = $.valueOf(items_to_cons(MUL, z_star, one_over_denom));
                        cs.push(z);
                    } else {
                        // console.lg("base", $.toInfixString(base));
                        // console.lg("expo", $.toInfixString(expo));
                        // console.lg("YAN");
                        const r = compute_r_from_base_and_expo(base, expo, $);
                        // console.lg("r", $.toInfixString(r));
                        const theta = compute_theta_from_base_and_expo(base, expo, $);
                        // console.lg("theta", $.toInfixString(theta));
                        const i_times_theta = $.valueOf(items_to_cons(MUL, imu, theta));
                        const cis_theta = $.valueOf(items_to_cons(EXP, i_times_theta));
                        // console.lg("cis_theta", $.toInfixString(cis_theta));
                        rs.push(r);
                        cs.push(cis_theta);
                    }
                } else if (is_cons(factor) && is_sym(factor.opr)) {
                    cs.push(factor);
                } else if (is_uom(factor)) {
                    // console.lg("Uom factor is real:", $.toInfixString(factor));
                    rs.push(factor);
                } else if (is_blade(factor)) {
                    // console.lg("Blade factor is real:", $.toInfixString(factor));
                    rs.push(factor);
                } else {
                    // console.lg("WT...");
                    // Here we might encounter a function.
                    // So far we've handled math.pow.
                    // How to handle arbitrary functions. e.g. abs, sin, ...
                    throw new Error($.toSExprString(factor));
                }
            }
        });
        // console.lg(`argList.length=${innerExpr.argList.length}`);
        // console.lg(`rs.length=${rs.length}`);
        // console.lg(`cs.length=${cs.length}`);
        if (cs.length === 0) {
            // Everything is real. We can throw away the (re ...) wrapper.
            const A = multiply_factors(rs, $);
            // console.lg("A", $.toInfixString(A));
            return [TFLAG_DIFF, A];
        }
        const A = multiply_factors(rs, $);
        // console.lg("A", $.toInfixString(A));
        const B = multiply_factors(cs, $);
        // console.lg("B", $.toInfixString(B));
        if (B.equals(innerExpr)) {
            // We didn't make any progress.
            // We must avoid infinite recursion.
            return [TFLAG_NONE, outerExpr];
        }
        // console.lg("exp", $.toInfixString(expr));
        const C = $.valueOf(items_to_cons(RE, B));
        // console.lg("C", $.toSExprString(C));
        const D = $.valueOf(items_to_cons(MUL, A, C));
        // console.lg("D", $.toSExprString(D));
        // console.lg("real of", $.toInfixString(expr), "is", $.toInfixString(D));

        return [TFLAG_DIFF, D];
    }
}

export const real_mul = mkbuilder(Op);
