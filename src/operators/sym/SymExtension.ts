import { CostTable } from "../../env/CostTable";
import { Extension, ExtensionEnv, NOFLAGS, TFLAGS } from "../../env/ExtensionEnv";
import { PI } from "../../runtime/constants";
import { defs } from "../../runtime/defs";
import { piAsDouble } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { is_nil, NIL, U } from "../../tree/tree";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";
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
    get name(): string {
        return 'SymExtension';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cost(expr: Sym, costs: CostTable, depth: number): number {
        // If the symbol is bound then we absolutely want to have it be replaced by its binding.
        // But it's not clear how we can go in the reverse direction.
        // Perhaps the cost depends upon the phase of the transformations.
        const binding = this.$.getBinding(expr);
        if (is_nil(binding)) {
            return costs.getCost(expr, this.$);
        }
        else {
            return Infinity;
        }
    }
    valueOf(sym: Sym, $: ExtensionEnv): U {
        // Doing the dirty work for PI. Why do we need a special case?
        // What about E from the math namespace?
        if (PI.equals(sym) && defs.evaluatingAsFloats) {
            return piAsDouble;
        }

        // Evaluate symbol's binding
        const binding = $.getBinding(sym);

        // console.lg(`binding ${$.toInfixString(sym)} => ${$.toInfixString(binding)}`);

        if (NIL === binding) {
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
        throw new Error("Sym Method not implemented.");
    }
    isReal(sym: Sym, $: ExtensionEnv): boolean {
        return $.treatAsReal(sym);
    }
    isScalar(sym: Sym, $: ExtensionEnv): boolean {
        return $.treatAsScalar(sym);
    }
    isVector(sym: Sym, $: ExtensionEnv): boolean {
        return $.treatAsVector(sym);
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
    toListString(sym: Sym): string {
        return sym.key();
    }
    transform(expr: U): [TFLAGS, U] {
        if (is_sym(expr)) {
            return get_binding(expr, this.$);
        }
        return [NOFLAGS, expr];
    }
}

export const sym = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new SymExtension($);
});