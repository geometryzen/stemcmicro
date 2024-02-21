import { Blade, create_int, is_blade, one, Rat } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { items_to_cons, U } from "math-expression-tree";
import { contains_single_blade } from "../../calculators/compare/contains_single_blade";
import { extract_single_blade } from "../../calculators/compare/extract_single_blade";
import { remove_factors } from "../../calculators/remove_factors";
import { divide } from "../../helpers/divide";
import { multiply } from "../../helpers/multiply";
import { power } from "../../helpers/power";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function power_blade_int(x: Blade, n: number, env: ExprContext): U {
    if (n > 0) {
        const lhs = x;
        const rhs = power_blade_int(x, n - 1, env);
        try {
            return multiply(env, lhs, rhs);
        }
        finally {
            lhs.release();
            rhs.release();
        }
    }
    else if (n < 0) {
        const numer = x.rev();
        const denom = multiply(env, x, numer);
        try {
            const ratio = divide(numer, denom, env);
            if (contains_single_blade(ratio)) {
                const blade = extract_single_blade(ratio);
                const scale = remove_factors(ratio, is_blade);
                try {
                    const k = power(scale, create_int(-n), env);
                    const B = power_blade_int(blade, -n, env);
                    try {
                        return multiply(env, k, B);
                    }
                    finally {
                        k.release();
                        B.release();
                    }
                }
                finally {
                    blade.release();
                    scale.release();
                }
            }
            else {
                return power(ratio, create_int(-n), env);
            }
        }
        finally {
            numer.release();
            denom.release();
        }
    }
    else {
        return one;
    }
}

export function power_blade_rat(blade: Blade, expo: Rat, env: ExprContext): U {
    if (expo.isInteger()) {
        return power_blade_int(blade, expo.toNumber(), env);
    }
    else {
        const m = expo.numer();
        const n = expo.denom();
        try {
            const x = power_blade_int(blade, m.toNumber(), env);
            const y = one.div(n);
            try {
                // Must be careful not to go into infinite loop here.
                return items_to_cons(native_sym(Native.pow), x, y);
            }
            finally {
                x.release();
                y.release();
            }
        }
        finally {
            m.release();
            n.release();
        }
    }
}