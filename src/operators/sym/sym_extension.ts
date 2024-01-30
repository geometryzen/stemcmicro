import { create_sym, Sym } from "math-expression-atoms";
import { Directive, Extension, ExtensionEnv, TFLAGS } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";
import { ProgrammingError } from "../../programming/ProgrammingError";
import { piAsFlt } from "../../tree/flt/Flt";
import { Cons, is_nil, U } from "../../tree/tree";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";
import { is_pi } from "../pi/is_pi";
import { get_binding } from "./get_binding";
import { is_sym } from "./is_sym";

function verify_sym(x: Sym): Sym | never {
    if (is_sym(x)) {
        return x;
    }
    else {
        throw new Error();
    }
}

class SymExtension implements Extension<Sym> {
    readonly #hash = hash_for_atom(verify_sym(create_sym('foo')));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(private readonly $: ExtensionEnv) {
        // Nothing to see here.
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
        return 'SymExtension';
    }
    valueOf(sym: Sym, $: ExtensionEnv): U {

        verify_sym(sym);

        if (is_pi(sym) && $.getDirective(Directive.evaluatingAsFloat)) {
            return piAsFlt;
        }

        const binding = $.getBinding(sym);

        if (is_nil(binding) || binding.equals(sym)) {
            return sym;
        }
        return $.valueOf(binding);
    }
    isKind(sym: U): sym is Sym {
        if (is_sym(sym)) {
            return true;
        }
        else {
            return false;
        }
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
        const token = this.$.getSymbolPrintName(sym);
        if (token) {
            return token;
        }
        else {
            return sym.key();
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    evaluate(sym: Sym, argList: Cons): [TFLAGS, U] {
        // Dead code?
        throw new ProgrammingError();
    }
    transform(sym: Sym): [TFLAGS, U] {
        // console.lg("SymExtension.transform", `${sym}`);
        // return [TFLAG_NONE, sym];
        const response = get_binding(sym, this.$);
        // console.lg("binding", render_as_infix(binding[1], this.$));
        return response;
    }
}

export const sym_extension = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new SymExtension($);
});