import { assert_jsobject, create_sym, is_jsobject, JsObject, Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Cons, nil, U } from "math-expression-tree";
import { diagnostic } from "../../diagnostics/diagnostics";
import { Diagnostics } from "../../diagnostics/messages";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, ExtensionEnv, mkbuilder, TFLAGS, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";
import { ProgrammingError } from "../../programming/ProgrammingError";

export class JsObjectExtension implements Extension<JsObject> {
    #hash: string = hash_for_atom(new JsObject({}));
    constructor(readonly config: Readonly<EnvConfig>) {
        // Nothing to see here.
    }
    test(atom: JsObject, opr: Sym): boolean {
        throw new Error(`${this.name}.test(${atom},${opr}) method not implemented.`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binL(atom: JsObject, opr: Sym, rhs: U, expr: ExprContext): U {
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(atom: JsObject, opr: Sym, lhs: U, expr: ExprContext): U {
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(target: JsObject, opr: Sym, argList: Cons, env: ExprContext): U {
        return diagnostic(Diagnostics.Poperty_0_does_not_exist_on_type_1, opr, create_sym(target.type));
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
        return 'JsObjectExtension';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(obj: JsObject, $: ExtensionEnv): JsObject {
        assert_jsobject(obj);
        return obj;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isKind(arg: U, $: ExtensionEnv): arg is JsObject {
        return is_jsobject(arg);
    }
    subst(expr: JsObject, oldExpr: U, newExpr: U): U {
        assert_jsobject(expr);
        if (is_jsobject(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    toHumanString(obj: JsObject): string {
        assert_jsobject(obj);
        return obj.toString();
    }
    toInfixString(obj: JsObject): string {
        assert_jsobject(obj);
        return obj.toString();
    }
    toLatexString(obj: JsObject): string {
        assert_jsobject(obj);
        return obj.toString();
    }
    toListString(obj: JsObject): string {
        assert_jsobject(obj);
        return obj.toString();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    evaluate(obj: JsObject, argList: Cons): [TFLAGS, U] {
        assert_jsobject(obj);
        throw new ProgrammingError();
    }
    transform(obj: JsObject): [TFLAGS, U] {
        assert_jsobject(obj);
        return [TFLAG_HALT, obj];
    }
}

export const jsobject_extension_builder = mkbuilder(JsObjectExtension);