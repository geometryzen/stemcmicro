import { Extension, ExtensionEnv, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_SYM } from "../../hashing/hash_info";
import { evaluatingAsFloat } from "../../modes/modes";
import { piAsDouble } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { nil, U } from "../../tree/tree";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";
import { is_pi } from "../pi/is_pi";
import { get_binding } from "./get_binding";
import { is_sym } from "./is_sym";
import { TYPE_NAME_SYM } from "./TYPE_NAME_SYM";

class SymExtension implements Extension<Sym> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(private readonly $: ExtensionEnv) {
        // Nothing to see here.
    }
    get key(): string {
        return TYPE_NAME_SYM.name;
    }
    get hash(): string {
        return HASH_SYM;
    }
    get name(): string {
        return 'SymExtension';
    }
    valueOf(sym: Sym, $: ExtensionEnv): U {
        // Doing the dirty work for PI. Why do we need a special case?
        // What about E from the math namespace?
        if (is_pi(sym) && $.getModeFlag(evaluatingAsFloat)) {
            return piAsDouble;
        }

        // Evaluate symbol's binding
        const binding = $.getBinding(sym);

        // console.lg(`binding ${$.toInfixString(sym)} => ${$.toInfixString(binding)}`);

        if (nil === binding) {
            return sym;
        }

        if (sym !== binding) {
            return $.valueOf(binding);
        }
        else {
            return sym;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isImag(sym: Sym, $: ExtensionEnv): boolean {
        return false;
    }
    isKind(sym: U): sym is Sym {
        if (is_sym(sym)) {
            return true;
        }
        else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isMinusOne(arg: Sym, $: ExtensionEnv): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isOne(arg: Sym, $: ExtensionEnv): boolean {
        return false;
    }
    isReal(sym: Sym, $: ExtensionEnv): boolean {
        return $.treatAsReal(sym);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(sym: Sym, $: ExtensionEnv): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(sym: Sym, $: ExtensionEnv): boolean {
        return false;
    }
    isZero(): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    one(zero: Sym, $: ExtensionEnv): Sym {
        // Sym does not have a zero value.
        throw new Error();
    }
    subst(expr: Sym, oldExpr: U, newExpr: U): U {
        if (is_sym(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    toInfixString(sym: Sym): string {
        return sym.key();
    }
    toLatexString(sym: Sym): string {
        return sym.key();
    }
    toListString(sym: Sym): string {
        const token = this.$.getSymbolToken(sym);
        if (token) {
            return token;
        }
        else {
            return sym.key();
        }
    }
    transform(expr: U): [TFLAGS, U] {
        if (is_sym(expr)) {
            return get_binding(expr, this.$);
        }
        return [TFLAG_NONE, expr];
    }
}

export const sym_extension = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new SymExtension($);
});