import { assert_jsobject, is_jsobject, JsObject } from "math-expression-atoms";
import { Cons, U } from "math-expression-tree";
import { Extension, ExtensionEnv, TFLAGS, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";
import { ProgrammingError } from "../../programming/ProgrammingError";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";

class JsObjectExtension implements Extension<JsObject> {
    #hash: string = hash_for_atom(new JsObject({}));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor($: ExtensionEnv) {
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
        return 'JsObjectExtension';
    }
    valueOf(obj: JsObject): JsObject {
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

export const jsobject_extension = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new JsObjectExtension($);
});