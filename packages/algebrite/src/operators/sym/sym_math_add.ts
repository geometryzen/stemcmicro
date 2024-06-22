import { create_str, create_sym, is_sym, Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { diagnostic, Diagnostics } from "@stemcmicro/diagnostics";
import { HASH_SYM } from "@stemcmicro/hashing";
import { Native } from "@stemcmicro/native";
import { cons, Cons, nil, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, ExtensionEnv, FEATURE, mkbuilder, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { MATH_ADD } from "../../runtime/ns_math";

/**
 *
 */
class SymMathAdd implements Extension<Sym> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(readonly config: Readonly<EnvConfig>) {}
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binL(lhs: Sym, opr: Sym, rhs: U, env: ExprContext): U {
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(rhs: Sym, opr: Sym, lhs: U, env: ExprContext): U {
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(target: Sym, opr: Sym, argList: Cons, env: ExprContext): U {
        switch (opr.id) {
            case Native.ascii: {
                return create_str(this.toAsciiString(target, env));
            }
            case Native.human: {
                return create_str(this.toHumanString(target, env));
            }
            case Native.infix: {
                return create_str(this.toInfixString(target, env));
            }
            case Native.latex: {
                return create_str(this.toLatexString(target, env));
            }
            case Native.sexpr: {
                return create_str(this.toListString(target, env));
            }
        }
        return diagnostic(Diagnostics.Property_0_does_not_exist_on_type_1, opr, create_sym(target.type));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(expr: Sym, opr: Sym): boolean {
        throw new Error("Method not implemented.");
    }
    iscons(): this is Extension<Cons> {
        return false;
    }
    operator(): never {
        throw new Error();
    }
    get hash(): string {
        return HASH_SYM;
    }
    get name(): string {
        return "SymMathAdd";
    }
    isKind(expr: U): expr is Sym {
        if (is_sym(expr)) {
            return MATH_ADD.equalsSym(expr);
        } else {
            return false;
        }
    }
    subst(opr: Sym, oldExpr: U, newExpr: U): U {
        if (opr.equals(oldExpr)) {
            return newExpr;
        } else {
            return opr;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toAsciiString(opr: Sym, $: ExprContext): string {
        return "+";
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toHumanString(opr: Sym, $: ExprContext): string {
        return "+";
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toInfixString(opr: Sym, $: ExprContext): string {
        return "+";
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toLatexString(opr: Sym, $: ExprContext): string {
        return "+";
    }
    toListString(opr: Sym, $: ExprContext): string {
        return $.getSymbolPrintName(MATH_ADD);
    }
    evaluate(opr: Sym, argList: Cons, $: ExtensionEnv): [TFLAGS, U] {
        return $.transform(cons(opr, argList));
    }
    transform(opr: Sym): [TFLAGS, U] {
        if (is_sym(opr) && MATH_ADD.equalsSym(opr)) {
            return [TFLAG_HALT, opr];
        } else {
            return [TFLAG_NONE, opr];
        }
    }
    valueOf(opr: Sym): Sym {
        return opr;
    }
}

export const sym_math_add_builder = mkbuilder(SymMathAdd);
