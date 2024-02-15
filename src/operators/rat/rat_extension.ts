import { create_flt, one, Rat, Sym } from "math-expression-atoms";
import { AtomHandler, ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { Atom, cons, Cons, is_cons, is_singleton, U } from "math-expression-tree";
import { Directive, Extension, ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";

const ISZERO = native_sym(Native.iszero);

export function is_rat(p: unknown): p is Rat {
    return p instanceof Rat;
}

function verify_rat(x: Rat): Rat | never {
    if (is_rat(x)) {
        return x;
    }
    else {
        throw new Error();
    }
}

export class RatExtension implements Extension<Rat>, AtomHandler<Rat> {
    readonly #hash = hash_for_atom(verify_rat(one));
    constructor() {
        // Nothing to see here.
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(atom: Rat, opr: Sym, expr: ExprContext): boolean {
        if (opr.equalsSym(ISZERO)) {
            return atom.isZero();
        }
        else {
            throw new Error(`${this.name}.dispatch(${atom},${opr}) method not implemented.`);
        }
    }
    iscons(): false {
        return false;
    }
    operator(): never {
        throw new Error();
    }
    get hash(): string {
        return this.#hash;
    }
    get name(): string {
        return 'RatExtension';
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
    evaluate(rat: Rat, argList: Cons, $: ExtensionEnv): [TFLAGS, U] {
        if (is_cons(rat)) {
            throw new Error(`The expr is really a Cons! ${rat}`);
        }
        return this.transform(cons(rat, argList), $);
    }
    transform(expr: U, $: ExtensionEnv): [TFLAGS, U] {
        if (expr instanceof Rat) {
            // console.lg(`RatExtension.transform ${expr}`);
            if ($.getDirective(Directive.evaluatingAsFloat)) {
                return [TFLAG_DIFF, create_flt(expr.toNumber())];
            }
            else {
                return [TFLAG_HALT, expr];
            }
        }
        return [TFLAG_NONE, expr];
    }
    valueOf(expr: Rat, $: ExtensionEnv): U {
        return this.transform(expr, $)[1];
    }
}

export const rat_extension: AtomHandler<Atom> = new RatExtension;

export const rat_extension_builder = mkbuilder<Rat>(RatExtension);