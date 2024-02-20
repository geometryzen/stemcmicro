import { create_sym, is_blade, is_err, is_rat, is_sym, one, Sym } from "math-expression-atoms";
import { ExprContext, SIGN_GT, SIGN_LT } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { Cons, is_atom, is_nil, items_to_cons, nil, U } from "math-expression-tree";
import { Directive, Extension, ExtensionEnv, mkbuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";
import { order_binary } from "../../helpers/order_binary";
import { ProgrammingError } from "../../programming/ProgrammingError";
import { piAsFlt } from "../../tree/flt/Flt";
import { is_pi } from "../pi/is_pi";
import { get_binding } from "./get_binding";

const ABS = native_sym(Native.abs);
const ADD = native_sym(Native.add);
const MUL = native_sym(Native.multiply);
const POW = native_sym(Native.pow);
const ISONE = native_sym(Native.isone);
const ISZERO = native_sym(Native.iszero);

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
    constructor() {
        // Nothing to see here.
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(atom: Sym, opr: Sym, env: ExprContext): boolean {
        if (opr.equalsSym(ISONE)) {
            return false;
        }
        else if (opr.equalsSym(ISZERO)) {
            return false;
        }
        throw new ProgrammingError(`SymExtension.test ${atom} ${opr}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binL(lhs: Sym, opr: Sym, rhs: U, _: ExprContext): U {
        if (opr.equalsSym(ADD)) {
            if (is_atom(rhs)) {
                if (is_err(rhs)) {
                    return rhs;
                }
                else if (is_sym(rhs)) {
                    return items_to_cons(ADD, lhs, rhs);
                }
            }
        }
        else if (opr.equalsSym(MUL)) {
            if (is_atom(rhs)) {
                if (is_blade(rhs)) {
                    return order_binary(MUL, lhs, rhs, _);
                }
                else if (is_rat(rhs)) {
                    if (rhs.isOne()) {
                        return _.valueOf(lhs);
                    }
                    // console.lg(`SymExtension.binL ${lhs} ${opr} ${rhs}`);
                    return items_to_cons(MUL, lhs, rhs);
                }
                else if (is_sym(rhs)) {
                    const compareFn = _.compareFn(MUL);
                    switch (compareFn(lhs, rhs)) {
                        case SIGN_LT: {
                            return items_to_cons(MUL, lhs, rhs);
                        }
                        case SIGN_GT: {
                            return items_to_cons(MUL, rhs, lhs);
                        }
                        default: {
                            return items_to_cons(MUL, lhs, rhs);
                        }
                    }
                }
            }
        }
        else if (opr.equalsSym(POW)) {
            if (is_atom(rhs)) {
                if (is_rat(rhs)) {
                    if (rhs.isZero()) {
                        return one;
                    }
                    else if (rhs.isOne()) {
                        return lhs;
                    }
                    else {
                        return items_to_cons(POW, lhs, rhs);
                    }
                }
                else if (is_sym(rhs)) {
                    return items_to_cons(POW, lhs, rhs);
                }
            }
        }
        throw new ProgrammingError(` ${lhs} ${opr} ${rhs}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(rhs: Sym, opr: Sym, lhs: U, expr: ExprContext): U {
        throw new ProgrammingError(` ${lhs} ${opr} ${rhs}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(target: Sym, opr: Sym, argList: Cons, env: ExprContext): U {
        if (opr.equalsSym(ABS)) {
            // See abs_sym.ts for an implementaion that looks at symbol predicates.
            return items_to_cons(ABS, target);
        }
        throw new ProgrammingError(`SymExtension.dispatch ${target} ${opr} ${argList} method not implemented.`);
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
    toHumanString(sym: Sym, env: ExprContext): string {
        return env.getSymbolPrintName(sym);
    }
    toInfixString(sym: Sym, env: ExprContext): string {
        return env.getSymbolPrintName(sym);
    }
    toLatexString(sym: Sym, env: ExprContext): string {
        return env.getSymbolPrintName(sym);
    }
    toListString(sym: Sym, $: ExprContext): string {
        const token = $.getSymbolPrintName(sym);
        if (token) {
            return token;
        }
        else {
            return sym.key();
        }
    }
    toString(): string {
        return this.name;
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

export const sym_extension_builder = mkbuilder<Sym>(SymExtension);