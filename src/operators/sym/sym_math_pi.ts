import { CostTable } from "../../env/CostTable";
import { TFLAG_HALT, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_PI } from "../../runtime/ns_math";
import { VERSION_ONE } from "../../runtime/version";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { assert_sym } from "./assert_sym";
import { is_sym } from "./is_sym";
import { TYPE_NAME_SYM } from "./TYPE_NAME_SYM";

class Builder implements OperatorBuilder<Sym> {
    create($: ExtensionEnv): Operator<Sym> {
        return new SymMathPi($);
    }
}

/**
 * 
 */
class SymMathPi implements Operator<Sym> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(private readonly $: ExtensionEnv) {
    }
    get key(): string {
        return TYPE_NAME_SYM.name;
    }
    get name(): string {
        return 'SymMathPi';
    }
    cost(expr: U, costs: CostTable): number {
        return costs.getCost(MATH_PI, this.$);
    }
    transform(expr: U): [TFLAGS, U] {
        return [this.isKind(expr) ? TFLAG_HALT : NOFLAGS, expr];
    }
    isImag(): boolean {
        return false;
    }
    isKind(expr: U): boolean {
        return is_sym(expr) && MATH_PI.equals(expr);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isMinusOne(expr: Sym): boolean {
        throw new Error("SymMathPi.isMinusOne Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isOne(expr: Sym): boolean {
        throw new Error("SymMathPi.isOne Method not implemented.");
    }
    isReal(): boolean {
        return true;
    }
    isScalar(): boolean {
        return true;
    }
    isVector(): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isZero(expr: Sym): boolean {
        throw new Error("SymMathPi.isZero Method not implemented.");
    }
    subst(expr: Sym, oldExpr: U, newExpr: U): U {
        if (expr.equals(oldExpr)) {
            return newExpr;
        }
        else {
            return expr;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toInfixString(expr: Sym): string {
        if (this.$.version > VERSION_ONE) {
            return 'π';
        }
        else {
            return 'pi';
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toListString(expr: Sym): string {
        if (this.$.version > VERSION_ONE) {
            return 'π';
        }
        else {
            return 'pi';
        }
    }
    valueOf(expr: Sym): Sym {
        return assert_sym(this.transform(expr)[1]);
    }
}

export const sym_math_pi = new Builder();
