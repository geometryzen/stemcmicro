import { Blade, create_str, create_sym, is_blade, is_err, is_flt, is_hyp, is_imu, is_rat, is_sym, is_tensor, is_uom, Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { diagnostic, Diagnostics } from "@stemcmicro/diagnostics";
import { multiply } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, is_atom, items_to_cons, nil, U } from "@stemcmicro/tree";
import { Extension, FEATURE, mkbuilder, TFLAGS, TFLAG_HALT } from "../../env/ExtensionEnv";
import { HASH_BLADE } from "@stemcmicro/hashing";
import { order_binary } from "../../helpers/order_binary";
import { ProgrammingError } from "../../programming/ProgrammingError";
import { power_blade_rat } from "../pow/power_blade_int";

const MUL = native_sym(Native.multiply);
const SQRT = native_sym(Native.sqrt);

class BladeExtension implements Extension<Blade> {
    constructor() {
        // Nothing to see here.
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(atom: Blade, opr: Sym, env: ExprContext): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binL(lhs: Blade, opr: Sym, rhs: U, env: ExprContext): U {
        switch (opr.id) {
            case Native.add: {
                if (is_atom(rhs)) {
                    if (is_blade(rhs)) {
                        return lhs.add(rhs);
                    }
                }
                break;
            }
            case Native.multiply: {
                if (is_atom(rhs)) {
                    if (is_blade(rhs)) {
                        return lhs.mul(rhs);
                    } else if (is_err(rhs)) {
                        return rhs;
                    } else if (is_flt(rhs)) {
                        if (rhs.isZero()) {
                            return rhs;
                        } else {
                            return order_binary(MUL, lhs, rhs, env);
                        }
                    } else if (is_hyp(rhs)) {
                        return order_binary(MUL, lhs, rhs, env);
                    } else if (is_imu(rhs)) {
                        return order_binary(MUL, lhs, rhs, env);
                    } else if (is_rat(rhs)) {
                        return order_binary(MUL, lhs, rhs, env);
                    } else if (is_sym(rhs)) {
                        return order_binary(MUL, lhs, rhs, env);
                    } else if (is_tensor(rhs)) {
                        return rhs.map((x) => multiply(env, lhs, x));
                    } else if (is_uom(rhs)) {
                        return order_binary(MUL, lhs, rhs, env);
                    }
                }
                break;
            }
            case Native.outer: {
                if (is_atom(rhs)) {
                    if (is_flt(rhs)) {
                        if (rhs.isZero()) {
                            return rhs;
                        } else {
                            return order_binary(MUL, lhs, rhs, env);
                        }
                    } else if (is_rat(rhs)) {
                        if (rhs.isZero()) {
                            return rhs;
                        } else if (rhs.isOne()) {
                            return lhs;
                        } else {
                            return order_binary(MUL, lhs, rhs, env);
                        }
                    } else if (is_uom(rhs)) {
                        return order_binary(MUL, lhs, rhs, env);
                    }
                }
                break;
            }
            case Native.pow: {
                if (is_atom(rhs)) {
                    if (is_rat(rhs)) {
                        return power_blade_rat(lhs, rhs, env);
                    }
                }
            }
        }
        return nil;
    }
    binR(rhs: Blade, opr: Sym, lhs: U, env: ExprContext): U {
        switch (opr.id) {
            case Native.multiply: {
                if (is_atom(lhs)) {
                    if (is_hyp(lhs)) {
                        return order_binary(MUL, lhs, rhs, env);
                    } else if (is_rat(lhs)) {
                        return order_binary(MUL, lhs, rhs, env);
                    } else if (is_tensor(lhs)) {
                        return lhs.map((x) => multiply(env, x, rhs));
                    } else if (is_uom(lhs)) {
                        return order_binary(MUL, lhs, rhs, env);
                    }
                }
                break;
            }
            case Native.outer: {
                if (is_atom(lhs)) {
                    if (is_blade(lhs)) {
                        return lhs.wedge(rhs);
                    } else if (is_flt(lhs)) {
                        return order_binary(MUL, lhs, rhs, env);
                    } else if (is_rat(lhs)) {
                        if (lhs.isZero()) {
                            return lhs;
                        } else if (lhs.isOne()) {
                            return rhs;
                        } else {
                            return order_binary(MUL, lhs, rhs, env);
                        }
                    } else if (is_uom(lhs)) {
                        return order_binary(MUL, lhs, rhs, env);
                    }
                }
                throw new ProgrammingError(`${rhs} ${lhs}`);
            }
        }
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(target: Blade, opr: Sym, argList: Cons, env: ExprContext): U {
        switch (opr.id) {
            case Native.abs: {
                const expr = items_to_cons(SQRT, target.scp(target));
                try {
                    return env.valueOf(expr);
                } finally {
                    expr.release();
                }
            }
            case Native.grade: {
                const head = argList.head;
                try {
                    if (is_rat(head) && head.isInteger()) {
                        return target.extractGrade(head.toNumber());
                    }
                } finally {
                    head.release();
                }
                break;
            }
            case Native.ascii: {
                return create_str(this.toAsciiString(target));
            }
            case Native.human: {
                return create_str(this.toHumanString(target));
            }
            case Native.infix: {
                return create_str(this.toInfixString(target));
            }
            case Native.latex: {
                return create_str(this.toLatexString(target));
            }
            case Native.sexpr: {
                return create_str(this.toListString(target));
            }
            case Native.simplify: {
                return target;
            }
        }
        return diagnostic(Diagnostics.Property_0_does_not_exist_on_type_1, opr, create_sym(target.type));
    }
    iscons(): boolean {
        return false;
    }
    operator(): Sym {
        throw new Error();
    }
    get hash(): string {
        // TODO: How do we create an exemplar from which to compute the hash?
        return HASH_BLADE;
    }
    get name(): string {
        return "BladeExtension";
    }
    get dependencies(): FEATURE[] {
        return ["Blade"];
    }
    isKind(arg: U): arg is Blade {
        return is_blade(arg);
    }
    subst(expr: Blade, oldExpr: U, newExpr: U): U {
        if (is_blade(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    toAsciiString(blade: Blade): string {
        return blade.toInfixString();
    }
    toHumanString(blade: Blade): string {
        return blade.toInfixString();
    }
    toInfixString(blade: Blade): string {
        return blade.toInfixString();
    }
    toLatexString(blade: Blade): string {
        return blade.toLatexString();
    }
    toListString(blade: Blade): string {
        return blade.toListString();
    }
    toString(): string {
        return this.name;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    evaluate(expr: Blade, argList: Cons): [TFLAGS, U] {
        throw new ProgrammingError();
    }
    transform(expr: Blade): [TFLAGS, U] {
        return [TFLAG_HALT, expr];
    }
    valueOf(expr: Blade): U {
        return expr;
    }
}

export const blade_extension_builder = mkbuilder(BladeExtension);
