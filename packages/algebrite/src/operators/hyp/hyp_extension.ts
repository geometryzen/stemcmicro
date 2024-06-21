import { create_str, create_sym, epsilon, Hyp, is_hyp, is_tensor, is_uom, Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { diagnostic, Diagnostics } from "@stemcmicro/diagnostics";
import { multiply } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { cons, Cons, nil, U } from "@stemcmicro/tree";
import { Extension, ExtensionEnv, mkbuilder, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_for_atom } from "@stemcmicro/hashing";
import { order_binary } from "../../helpers/order_binary";

const MUL = native_sym(Native.multiply);

function verify_hyp(hyp: Hyp): Hyp | never {
    if (is_hyp(hyp)) {
        return hyp;
    } else {
        throw new Error();
    }
}

class HypExtension implements Extension<Hyp> {
    readonly #hash: string = hash_for_atom(verify_hyp(epsilon));
    constructor() {
        // Nothing to see here.
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(atom: Hyp, opr: Sym, expr: ExprContext): boolean {
        return false;
    }
    binL(lhs: Hyp, opr: Sym, rhs: U, env: ExprContext): U {
        if (opr.equalsSym(MUL)) {
            if (is_hyp(rhs)) {
                return order_binary(MUL, lhs, rhs, env);
            } else if (is_tensor(rhs)) {
                return rhs.map((x) => multiply(env, lhs, x));
            } else if (is_uom(rhs)) {
                return order_binary(MUL, lhs, rhs, env);
            }
        }
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(atom: Hyp, opr: Sym, lhs: U, expr: ExprContext): U {
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(target: Hyp, opr: Sym, argList: Cons, env: ExprContext): U {
        switch (opr.id) {
            case Native.infix: {
                return create_str(this.toInfixString(target));
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
        throw new Error();
    }
    get hash() {
        return this.#hash;
    }
    get name() {
        return "HypExtension";
    }
    evaluate(hyp: Hyp, argList: Cons): [TFLAGS, U] {
        return this.transform(cons(hyp, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        return [expr instanceof Hyp ? TFLAG_HALT : TFLAG_NONE, expr];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(hyp: Hyp, $: ExtensionEnv): U {
        throw new Error("Hyp Method not implemented.");
    }
    isKind(arg: U): arg is Hyp {
        return is_hyp(arg);
    }
    subst(expr: Hyp, oldExpr: U, newExpr: U): U {
        if (this.isKind(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    toHumanString(hyp: Hyp): string {
        return hyp.printname;
    }
    toInfixString(hyp: Hyp): string {
        return hyp.printname;
    }
    toLatexString(hyp: Hyp): string {
        return hyp.printname;
    }
    toListString(hyp: Hyp): string {
        return hyp.printname;
    }
}

export const hyp_extension_builder = mkbuilder(HypExtension);
