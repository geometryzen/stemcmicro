import { create_sym, is_sym, Sym } from "math-expression-atoms";
import { AtomHandler, ExprContext } from "math-expression-context";
import { Cons, is_nil, nil, U } from "math-expression-tree";
import { Directive, Extension, ExtensionEnv, TFLAGS } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";
import { ProgrammingError } from "../../programming/ProgrammingError";
import { piAsFlt } from "../../tree/flt/Flt";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";
import { is_pi } from "../pi/is_pi";
import { get_binding } from "./get_binding";

function verify_sym(x: Sym): Sym | never {
    if (is_sym(x)) {
        return x;
    }
    else {
        throw new Error();
    }
}

class SymExtension implements Extension<Sym>, AtomHandler<Sym> {
    readonly #hash = hash_for_atom(verify_sym(create_sym('foo')));
    constructor() {
        // Nothing to see here.
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(atom: Sym, opr: Sym, env: ExprContext): boolean {
        return false;
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

        const binding = $.getBinding(sym, nil);

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
    toListString(sym: Sym, $: ExtensionEnv): string {
        const token = $.getSymbolPrintName(sym);
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
    transform(sym: Sym, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg("SymExtension.transform", `${sym}`);
        // return [TFLAG_NONE, sym];
        const response = get_binding(sym, nil, $);
        // console.lg("binding", render_as_infix(binding[1], this.$));
        return response;
    }
}

export const sym_extension = new ExtensionOperatorBuilder(function () {
    return new SymExtension();
});