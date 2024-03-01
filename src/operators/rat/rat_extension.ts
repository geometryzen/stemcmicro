import { assert_rat, create_flt, create_str, create_sym, is_blade, is_boo, is_err, is_flt, is_hyp, is_imu, is_rat, is_sym, is_tensor, is_uom, one, Rat, Str, Sym, zero } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { Atom, Cons, is_atom, is_cons, is_singleton, items_to_cons, nil, U } from "math-expression-tree";
import { multiply_num_num } from "../../calculators/mul/multiply_num_num";
import { diagnostic } from "../../diagnostics/diagnostics";
import { Diagnostics } from "../../diagnostics/messages";
import { Directive, Extension, ExtensionBuilder, ExtensionEnv, mkbuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";
import { iszero } from "../../helpers/iszero";
import { multiply } from "../../helpers/multiply";
import { order_binary } from "../../helpers/order_binary";
import { hook_create_err } from "../../hooks/hook_create_err";
import { power_rat_base_rat_expo } from "../../power_rat_base_rat_expo";
import { ProgrammingError } from "../../programming/ProgrammingError";
import { wrap_as_transform } from "../wrap_as_transform";

const ADD = native_sym(Native.add);
const ISONE = native_sym(Native.isone);
const ISZERO = native_sym(Native.iszero);
const MUL = native_sym(Native.multiply);
const PI = native_sym(Native.PI);
const POW = native_sym(Native.pow);

function rat_times_simple_atom(lhs: Rat, rhs: Atom, env: ExprContext) {
    if (lhs.isZero()) {
        return lhs;
    }
    else if (lhs.isOne()) {
        return rhs;
    }
    else {
        return order_binary(MUL, lhs, rhs, env);
    }
}

export class RatExtension implements Extension<Rat> {
    readonly #hash = hash_for_atom(assert_rat(one));
    constructor() {
        // Nothing to see here.
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(atom: Rat, opr: Sym, expr: ExprContext): boolean {
        if (opr.equalsSym(ISONE)) {
            return atom.isOne();
        }
        else if (opr.equalsSym(ISZERO)) {
            return atom.isZero();
        }
        else {
            throw new Error(`${this.name}.test(${atom},${opr}) method not implemented.`);
        }
    }
    binL(lhs: Rat, opr: Sym, rhs: U, env: ExprContext): U {
        switch (opr.id) {
            case Native.add: {
                // We don't have to concern ourselves with zero Flt(s) or Rat(s) because these were removed already.
                // TODO: Might be good to assert the preceeding assumption.
                if (is_atom(rhs)) {
                    if (is_boo(rhs)) {
                        return diagnostic(Diagnostics.Operator_0_cannot_be_applied_to_types_1_and_2, ADD, create_sym(lhs.type), create_sym(rhs.type));
                    }
                    else if (is_blade(rhs)) {
                        return order_binary(ADD, lhs, rhs, env);
                    }
                    else if (is_flt(rhs)) {
                        return create_flt(lhs.toNumber() + rhs.toNumber());
                    }
                    else if (is_imu(rhs)) {
                        return order_binary(ADD, lhs, rhs, env);
                    }
                    else if (is_rat(rhs)) {
                        return lhs.add(rhs);
                    }
                    else if (is_sym(rhs)) {
                        return order_binary(ADD, lhs, rhs, env);
                    }
                    else if (is_err(rhs)) {
                        return rhs;
                    }
                }
                break;
            }
            case Native.multiply: {
                if (is_atom(rhs)) {
                    if (is_blade(rhs)) {
                        return rat_times_simple_atom(lhs, rhs, env);
                    }
                    else if (is_err(rhs)) {
                        return rhs;
                    }
                    else if (is_flt(rhs)) {
                        return multiply_num_num(lhs, rhs);
                    }
                    else if (is_hyp(rhs)) {
                        return rat_times_simple_atom(lhs, rhs, env);
                    }
                    else if (is_imu(rhs)) {
                        return rat_times_simple_atom(lhs, rhs, env);
                    }
                    else if (is_rat(rhs)) {
                        return lhs.mul(rhs);
                    }
                    else if (is_sym(rhs)) {
                        return rat_times_simple_atom(lhs, rhs, env);
                    }
                    else if (is_tensor(rhs)) {
                        if (lhs.isZero()) {
                            return rhs.map(() => lhs);
                        }
                        else if (lhs.isOne()) {
                            return rhs.map((x) => x);
                        }
                        else {
                            return rhs.map(x => multiply(env, lhs, x));
                        }
                    }
                    else if (is_uom(rhs)) {
                        return rat_times_simple_atom(lhs, rhs, env);
                    }
                }
                break;
            }
            case Native.outer: {
                if (is_atom(rhs)) {
                    if (is_flt(rhs)) {
                        return multiply_num_num(lhs, rhs);
                    }
                    else if (is_rat(rhs)) {
                        return lhs.mul(rhs);
                    }
                    else if (is_sym(rhs)) {
                        return rat_times_simple_atom(lhs, rhs, env);
                    }
                    else if (is_uom(rhs)) {
                        return rat_times_simple_atom(lhs, rhs, env);
                    }
                }
                break;
            }
            case Native.pow: {
                if (is_atom(rhs)) {
                    if (is_rat(rhs)) {
                        return power_rat_base_rat_expo(lhs, rhs, env);
                    }
                    else if (is_sym(rhs)) {
                        if (lhs.isOne()) {
                            return lhs;
                        }
                        else {
                            return items_to_cons(POW, lhs, rhs);
                        }
                    }
                }
                break;
            }
        }
        return nil;
    }
    binR(rhs: Rat, opr: Sym, lhs: U, env: ExprContext): U {
        if (opr.equalsSym(MUL)) {
            if (is_atom(lhs)) {
                if (is_hyp(lhs)) {
                    return order_binary(MUL, lhs, rhs, env);
                }
                else if (is_tensor(lhs)) {
                    return lhs.map(x => multiply(env, x, rhs));
                }
                else if (is_uom(lhs)) {
                    return order_binary(MUL, lhs, rhs, env);
                }
            }
        }
        return nil;
    }
    dispatch(target: Rat, opr: Sym, argList: Cons, env: ExprContext): U {
        switch (opr.id) {
            case Native.abs: {
                return target.abs();
            }
            case Native.arg: {
                if (target.isZero()) {
                    return hook_create_err(new Str("arg of zero (0) is undefined"));
                }
                else if (target.isNegative()) {
                    return PI;
                }
                else {
                    return zero;
                }
                break;
            }
            case Native.grade: {
                const head = argList.head;
                try {
                    if (iszero(head, env)) {
                        return target;
                    }
                    else {
                        return zero;
                    }
                }
                finally {
                    head.release();
                }
            }
            case Native.ascii: {
                return create_str(this.toAsciiString(target));
            }
            case Native.human: {
                return create_str(this.toHumanString(target));
            }
            case Native.infix: {
                return create_str(this.toInfixString(target));
            }
            case Native.latex: {
                return create_str(this.toLatexString(target));
            }
            case Native.sexpr: {
                return create_str(this.toListString(target));
            }
            case Native.simplify: {
                return target;
            }
        }
        return diagnostic(Diagnostics.Property_0_does_not_exist_on_type_1, opr, create_sym(target.type));
    }
    iscons(): false {
        return false;
    }
    operator(): never {
        throw new ProgrammingError();
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
    toAsciiString(rat: Rat): string {
        return rat.toInfixString();
    }
    toHumanString(rat: Rat): string {
        return rat.toInfixString();
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    evaluate(rat: Rat, argList: Cons, $: ExprContext): [TFLAGS, U] {
        throw new ProgrammingError();
    }
    toString(): string {
        return this.name;
    }
    transform(expr: Rat, $: ExprContext): [TFLAGS, U] {
        return wrap_as_transform(this.valueOf(expr, $), expr);
    }
    valueOf(expr: Rat, $: ExprContext): U {
        if ($.getDirective(Directive.evaluatingAsFloat)) {
            return create_flt(expr.toNumber());
        }
        else {
            return expr;
        }
    }
}

export const rat_extension_builder: ExtensionBuilder<U> = mkbuilder<Rat>(RatExtension);