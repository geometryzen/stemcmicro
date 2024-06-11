import { Blade, create_int, is_blade, one, Rat } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { contains_single_blade, divide, multiply, power } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";
import { extract_single_blade } from "../../calculators/compare/extract_single_blade";
import { remove_factors } from "../../calculators/remove_factors";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function power_blade_int(x: Blade, n: number, _: ExprContext): U {
    if (n > 0) {
        const lhs = x;
        const rhs = power_blade_int(x, n - 1, _);
        try {
            return multiply(_, lhs, rhs);
        } finally {
            lhs.release();
            rhs.release();
        }
    } else if (n < 0) {
        const numer = x.rev();
        const denom = multiply(_, x, numer);
        try {
            const ratio = divide(numer, denom, _);
            if (contains_single_blade(ratio)) {
                const blade = extract_single_blade(ratio);
                const scale = remove_factors(ratio, is_blade);
                try {
                    const k = power(_, scale, create_int(-n));
                    const B = power_blade_int(blade, -n, _);
                    try {
                        return multiply(_, k, B);
                    } finally {
                        k.release();
                        B.release();
                    }
                } finally {
                    blade.release();
                    scale.release();
                }
            } else {
                return power(_, ratio, create_int(-n));
            }
        } finally {
            numer.release();
            denom.release();
        }
    } else {
        return one;
    }
}

export function power_blade_rat(blade: Blade, expo: Rat, env: ExprContext): U {
    if (expo.isInteger()) {
        return power_blade_int(blade, expo.toNumber(), env);
    } else {
        const m = expo.numer();
        const n = expo.denom();
        try {
            const x = power_blade_int(blade, m.toNumber(), env);
            const y = one.div(n);
            try {
                // Must be careful not to go into infinite loop here.
                return items_to_cons(native_sym(Native.pow), x, y);
            } finally {
                x.release();
                y.release();
            }
        } finally {
            m.release();
            n.release();
        }
    }
}
