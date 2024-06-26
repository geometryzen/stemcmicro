import { create_str, create_sym, is_blade, is_err, is_flt, is_hyp, is_imu, is_rat, is_sym, is_tensor, is_uom, one, Sym, zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { diagnostic, Diagnostics } from "@stemcmicro/diagnostics";
import { Directive } from "@stemcmicro/directive";
import { hash_for_atom } from "@stemcmicro/hashing";
import { float, iszero, is_pi, multiply } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, is_atom, is_nil, items_to_cons, nil, U } from "@stemcmicro/tree";
import { Extension, ExtensionEnv, mkbuilder, TFLAGS } from "../../env/ExtensionEnv";
import { order_binary } from "../../helpers/order_binary";
import { ProgrammingError } from "../../programming/ProgrammingError";
import { piAsFlt } from "../../tree/flt/Flt";
import { get_binding } from "./get_binding";

const ABS = native_sym(Native.abs);
const ADD = native_sym(Native.add);
const MUL = native_sym(Native.multiply);
const OUTER = native_sym(Native.outer);
const POW = native_sym(Native.pow);
const ISONE = native_sym(Native.isone);
const ISZERO = native_sym(Native.iszero);

function verify_sym(x: Sym): Sym | never {
    if (is_sym(x)) {
        return x;
    } else {
        throw new Error();
    }
}

class SymExtension implements Extension<Sym> {
    readonly #hash = hash_for_atom(verify_sym(create_sym("foo")));
    constructor() {
        // Nothing to see here.
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(atom: Sym, opr: Sym, env: ExprContext): boolean {
        if (opr.equalsSym(ISONE)) {
            return false;
        } else if (opr.equalsSym(ISZERO)) {
            return false;
        } else {
            return false;
        }
    }
    binL(lhs: Sym, opr: Sym, rhs: U, env: ExprContext): U {
        switch (opr.id) {
            case Native.add: {
                if (is_atom(rhs)) {
                    if (is_err(rhs)) {
                        return rhs;
                    } else if (is_sym(rhs)) {
                        return order_binary(ADD, lhs, rhs, env);
                    }
                }
                break;
            }
            case Native.multiply: {
                if (is_atom(rhs)) {
                    if (is_blade(rhs)) {
                        return order_binary(MUL, lhs, rhs, env);
                    } else if (is_err(rhs)) {
                        return rhs;
                    } else if (is_flt(rhs)) {
                        if (rhs.isZero()) {
                            return rhs;
                        } else {
                            return order_binary(MUL, float(lhs, env), rhs, env);
                        }
                    } else if (is_hyp(rhs)) {
                        return order_binary(MUL, lhs, rhs, env);
                    } else if (is_imu(rhs)) {
                        return order_binary(MUL, lhs, rhs, env);
                    } else if (is_rat(rhs)) {
                        if (rhs.isOne()) {
                            return env.valueOf(lhs);
                        }
                        // console.lg(`SymExtension.binL ${lhs} ${opr} ${rhs}`);
                        return order_binary(MUL, lhs, rhs, env);
                    } else if (is_sym(rhs)) {
                        return order_binary(MUL, lhs, rhs, env);
                    } else if (is_tensor(rhs)) {
                        return rhs.map((x) => multiply(env, lhs, x));
                    } else if (is_uom(rhs)) {
                        return order_binary(MUL, lhs, rhs, env);
                    }
                }
                break;
            }
            case Native.outer: {
                if (is_atom(rhs)) {
                    if (is_sym(rhs)) {
                        return order_binary(OUTER, lhs, rhs, env);
                    }
                }
                break;
            }
            case Native.pow: {
                if (is_atom(rhs)) {
                    if (is_rat(rhs)) {
                        if (rhs.isZero()) {
                            return one;
                        } else if (rhs.isOne()) {
                            return lhs;
                        } else {
                            return items_to_cons(POW, lhs, rhs);
                        }
                    } else if (is_flt(rhs)) {
                        if (rhs.isZero()) {
                            return one;
                        } else if (rhs.isOne()) {
                            return lhs;
                        } else {
                            return items_to_cons(POW, lhs, rhs);
                        }
                    } else if (is_sym(rhs)) {
                        return items_to_cons(POW, lhs, rhs);
                    }
                }
            }
        }
        return nil;
    }
    binR(rhs: Sym, opr: Sym, lhs: U, env: ExprContext): U {
        if (opr.equalsSym(MUL)) {
            if (is_atom(lhs)) {
                if (is_hyp(lhs)) {
                    return order_binary(MUL, lhs, rhs, env);
                } else if (is_tensor(lhs)) {
                    return lhs.map((x) => multiply(env, x, rhs));
                } else if (is_uom(lhs)) {
                    return order_binary(MUL, lhs, rhs, env);
                }
            }
        }
        return nil;
    }
    dispatch(target: Sym, opr: Sym, argList: Cons, env: ExprContext): U {
        switch (opr.id) {
            case Native.abs: {
                // See abs_sym.ts for an implementaion that looks at symbol predicates.
                return items_to_cons(ABS, target);
            }
            case Native.grade: {
                const head = argList.head;
                try {
                    if (iszero(head, env)) {
                        return target;
                    } else {
                        return zero;
                    }
                } finally {
                    head.release();
                }
            }
            case Native.mag: {
                // This assumes that all symbols represent positive scalars.
                return target;
            }
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
            case Native.simplify: {
                return target;
            }
        }
        return diagnostic(Diagnostics.Property_0_does_not_exist_on_type_1, opr, create_sym(target.type));
    }
    iscons(): this is Extension<Cons> {
        return false;
    }
    operator(): never {
        throw new Error();
    }
    get hash(): string {
        return this.#hash;
    }
    get name(): string {
        return "SymExtension";
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
        } else {
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
    toAsciiString(sym: Sym, env: ExprContext): string {
        return env.getSymbolPrintName(sym);
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
        } else {
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
