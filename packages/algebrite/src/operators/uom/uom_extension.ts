import { create_int, create_str, create_sym, is_hyp, is_rat, is_tensor, is_uom, QQ, Sym, two, Uom } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { diagnostic, Diagnostics } from "@stemcmicro/diagnostics";
import { multiply } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, is_atom, items_to_cons, nil, U } from "@stemcmicro/tree";
import { Extension, FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";
import { order_binary } from "../../helpers/order_binary";
import { ProgrammingError } from "../../programming/ProgrammingError";
import { create_uom } from "./uom";

export const HASH_UOM = hash_for_atom(create_uom("kilogram"));

const MUL = native_sym(Native.multiply);

class UomExtension implements Extension<Uom> {
    constructor() {
        // Nothing to see here.
    }
    test(): boolean {
        return false;
    }
    binL(lhs: Uom, opr: Sym, rhs: U, env: ExprContext): U {
        switch (opr.id) {
            case Native.add: {
                if (is_atom(rhs)) {
                    if (is_uom(rhs)) {
                        if (lhs.equals(rhs)) {
                            const expr = items_to_cons(MUL, two, lhs);
                            try {
                                return env.valueOf(expr);
                            } finally {
                                expr.release();
                            }
                        }
                    }
                }
                break;
            }
            case Native.multiply: {
                if (is_atom(rhs)) {
                    if (is_hyp(rhs)) {
                        return order_binary(MUL, lhs, rhs, env);
                    } else if (is_tensor(rhs)) {
                        return rhs.map((x) => multiply(env, lhs, x));
                    } else if (is_uom(rhs)) {
                        // This could create a dimensionless quantity equivalent to one.
                        // In the interest of staying DRY, the correct way is to evaluate the product.
                        return env.valueOf(lhs.mul(rhs));
                    }
                }
                break;
            }
            case Native.pow: {
                if (is_atom(rhs)) {
                    if (is_rat(rhs)) {
                        const numer = rhs.numer();
                        const denom = rhs.denom();
                        const expo = QQ.valueOf(numer.toNumber(), denom.toNumber());
                        return lhs.pow(expo);
                    }
                }
                break;
            }
        }
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(rhs: Uom, opr: Sym, lhs: U, expr: ExprContext): U {
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(target: Uom, opr: Sym, argList: Cons, env: ExprContext): U {
        switch (opr.id) {
            case Native.abs: {
                return target;
            }
            case Native.mag: {
                return target;
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
    iscons(): false {
        return false;
    }
    operator(): never {
        throw new ProgrammingError();
    }
    get hash(): string {
        return HASH_UOM;
    }
    get name(): string {
        return "UomExtension";
    }
    get dependencies(): FEATURE[] {
        return ["Uom"];
    }
    valueOf(uom: Uom): U {
        return uom;
    }
    isKind(arg: U): arg is Uom {
        return is_uom(arg);
    }
    subst(uom: Uom, oldExpr: U, newExpr: U): U {
        if (is_uom(oldExpr)) {
            if (uom.equals(oldExpr)) {
                return newExpr;
            }
        }
        return uom;
    }
    toAsciiString(uom: Uom): string {
        return uom.toInfixString();
    }
    toHumanString(uom: Uom): string {
        return uom.toInfixString();
    }
    toInfixString(uom: Uom): string {
        if (uom.isOne()) {
            return "1";
        } else {
            return uom.toInfixString();
        }
    }
    toLatexString(uom: Uom): string {
        return uom.toInfixString();
    }
    toListString(uom: Uom): string {
        return uom.toString(10, false);
    }
    toString(): string {
        return this.name;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    evaluate(uom: Uom, argList: Cons): [TFLAGS, U] {
        // TODO; We probably need a proper diagnostic should this construction happen.
        throw new ProgrammingError();
    }
    transform(uom: Uom): [TFLAGS, U] {
        if (uom.isOne()) {
            return [TFLAG_DIFF, create_int(1)];
        } else {
            return [TFLAG_HALT, uom];
        }
    }
}

export const uom_extension_builder = mkbuilder(UomExtension);
