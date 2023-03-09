import { Extension, ExtensionEnv, TFLAGS, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_RAT } from "../../hashing/hash_info";
import { evaluatingAsFloat } from "../../modes/modes";
import { create_flt } from '../../tree/flt/Flt';
import { one, Rat } from "../../tree/rat/Rat";
import { cons, Cons, is_cons, is_singleton, U } from "../../tree/tree";
import { ExtensionOperatorBuilder } from '../helpers/ExtensionOperatorBuilder';

export function is_rat(p: unknown): p is Rat {
    return p instanceof Rat;
}

class RatExtension implements Extension<Rat> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(private readonly $: ExtensionEnv) {
        // Nothing to see here.
    }
    get key(): 'Rat' {
        return one.name;
    }
    get hash(): 'Rat' {
        return HASH_RAT;
    }
    get name(): string {
        return 'RatExtension';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isImag(expr: Rat): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isKind(arg: U, $: ExtensionEnv): arg is Rat {
        // console.lg(`RatExtension.isKind for ${arg.toString()}`);
        // We must be prepared to handle singleton lists containing a single rat.
        if (is_cons(arg) && is_singleton(arg)) {
            return this.isKind(arg.head, $);
        }
        return arg instanceof Rat;
    }
    isMinusOne(arg: Rat): boolean {
        return arg.isMinusOne();
    }
    isOne(arg: Rat): boolean {
        return arg.isOne();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: Rat): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: Rat): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(expr: Rat): boolean {
        return false;
    }
    isZero(expr: Rat): boolean {
        return expr.isZero();
    }
    one(): Rat {
        return one;
    }
    subst(expr: Rat, oldExpr: U, newExpr: U): U {
        if (is_rat(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    toInfixString(rat: Rat): string {
        return rat.toInfixString();
    }
    toLatexString(rat: Rat): string {
        return rat.toInfixString();
    }
    toListString(rat: Rat): string {
        return rat.toListString();
    }
    evaluate(rat: Rat, argList: Cons): [TFLAGS, U] {
        if (is_cons(rat)) {
            throw new Error(`The expr is really a Cons! ${rat}`);
        }
        return this.transform(cons(rat, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        if (expr instanceof Rat) {
            // console.lg(`RatExtension.transform ${expr}`);
            if (this.$.getModeFlag(evaluatingAsFloat)) {
                return [TFLAG_DIFF, create_flt(expr.toNumber())];
            }
            else {
                return [TFLAG_HALT, expr];
            }
        }
        return [TFLAG_NONE, expr];
    }
    valueOf(expr: Rat): U {
        return this.transform(expr)[1];
    }
}

export const rat_extension = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new RatExtension($);
});