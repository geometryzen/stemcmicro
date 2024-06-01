import { assert_sym, create_str, create_sym, is_sym, Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { diagnostic, Diagnostics } from "@stemcmicro/diagnostics";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, cons, nil, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { Directive, Extension, FEATURE, mkbuilder, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_SYM } from "../../hashing/hash_info";

const POW = native_sym(Native.pow);

/**
 *
 */
class SymMathPow implements Extension<Sym> {
    constructor(readonly config: Readonly<EnvConfig>) {
        // We actually know config.useCaretForExponentiation already!
    }
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
    iscons(): false {
        return false;
    }
    operator(): Sym {
        throw new Error();
    }
    get hash(): string {
        return HASH_SYM;
    }
    get name(): string {
        return "SymMathPow";
    }
    evaluate(expr: U, argList: Cons): [TFLAGS, U] {
        return this.transform(cons(expr, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        return [this.isKind(expr) ? TFLAG_HALT : TFLAG_NONE, expr];
    }
    isKind(arg: U): arg is Sym {
        return is_sym(arg) && POW.equals(arg);
    }
    subst(expr: Sym, oldExpr: U, newExpr: U): U {
        if (expr.equals(oldExpr)) {
            return newExpr;
        } else {
            return expr;
        }
    }
    toAsciiString(expr: Sym, $: ExprContext): string {
        if ($.getDirective(Directive.useCaretForExponentiation)) {
            return "^";
        } else {
            return "**";
        }
    }
    toHumanString(expr: Sym, $: ExprContext): string {
        if ($.getDirective(Directive.useCaretForExponentiation)) {
            return "^";
        } else {
            return "**";
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toInfixString(expr: Sym, $: ExprContext): string {
        if ($.getDirective(Directive.useCaretForExponentiation)) {
            return "^";
        } else {
            return "**";
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toLatexString(expr: Sym, $: ExprContext): string {
        return " ^ ";
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toListString(expr: Sym, $: ExprContext): string {
        return $.getSymbolPrintName(POW);
    }
    valueOf(expr: Sym): Sym {
        return assert_sym(this.transform(expr)[1]);
    }
}

export const sym_math_pow_builder = mkbuilder(SymMathPow);
