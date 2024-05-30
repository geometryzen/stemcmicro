import { Boo, booT, create_str, create_sym, is_boo, Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, is_atom, nil, U } from "@stemcmicro/tree";
import { diagnostic } from "../../diagnostics/diagnostics";
import { Diagnostics } from "../../diagnostics/messages";
import { Extension, ExtensionEnv, FEATURE, mkbuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_BOO } from "../../hashing/hash_info";
import { ProgrammingError } from "../../programming/ProgrammingError";
import { wrap_as_transform } from "../wrap_as_transform";

const ADD = native_sym(Native.add);

export class BooExtension implements Extension<Boo> {
    readonly dependencies: FEATURE[] = ["Boo"];
    constructor() {
        // Nothing to see here.
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(atom: Boo, opr: Sym, env: ExprContext): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binL(lhs: Boo, opr: Sym, rhs: U, expr: ExprContext): U {
        if (opr.equalsSym(ADD)) {
            if (is_atom(rhs)) {
                return diagnostic(Diagnostics.Operator_0_cannot_be_applied_to_types_1_and_2, ADD, create_sym(lhs.type), create_sym(rhs.type));
            }
        }
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(rhs: Boo, opr: Sym, lhs: U, expr: ExprContext): U {
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(target: Boo, opr: Sym, argList: Cons, env: ExprContext): U {
        switch (opr.id) {
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
        throw new Error();
    }
    get hash(): string {
        return HASH_BOO;
    }
    get name(): string {
        return "BooExtension";
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    evaluate(expr: Boo, argList: Cons, $: ExprContext): [number, U] {
        throw new ProgrammingError();
    }
    transform(expr: Boo): [TFLAGS, U] {
        return wrap_as_transform(expr, expr);
    }
    valueOf(expr: Boo): U {
        return expr;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isKind(arg: U): arg is Boo {
        return is_boo(arg);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    subst(expr: Boo, oldExpr: U, newExpr: U, $: ExtensionEnv): U {
        return expr;
        // throw new Error(`Boo.subst(expr=${render_as_infix(expr, $)}, oldExpr=${render_as_infix(oldExpr, $)}, newExpr=${render_as_infix(newExpr, $)}) Method not implemented.`);
    }
    toAsciiString(expr: Boo): string {
        return expr.equals(booT) ? "true" : "false";
    }
    toHumanString(expr: Boo): string {
        return expr.equals(booT) ? "true" : "false";
    }
    toInfixString(expr: Boo): string {
        return expr.equals(booT) ? "true" : "false";
    }
    toLatexString(expr: Boo): string {
        return expr.equals(booT) ? "true" : "false";
    }
    toListString(expr: Boo): string {
        return expr.equals(booT) ? "true" : "false";
    }
}

export const boo_extension = mkbuilder<Boo>(BooExtension);
