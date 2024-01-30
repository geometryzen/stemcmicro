import { is_jsobject, JsObject, Str } from "math-expression-atoms";
import { Cons, U } from "math-expression-tree";
import { Extension, ExtensionEnv, Sign, TFLAGS, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";
import { ProgrammingError } from "../../programming/ProgrammingError";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";


export function strcmp(str1: string, str2: string): Sign {
    if (str1 === str2) {
        return 0;
    }
    else if (str1 > str2) {
        return 1;
    }
    else {
        return -1;
    }
}

export function is_str(arg: unknown): arg is Str {
    return arg instanceof Str;
}

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
    valueOf(str: JsObject): JsObject {
        return str;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isKind(arg: U, $: ExtensionEnv): arg is Str {
        return is_jsobject(arg);
    }
    subst(expr: JsObject, oldExpr: U, newExpr: U): U {
        if (is_jsobject(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    toInfixString(obj: JsObject): string {
        return obj.toString();
    }
    toLatexString(obj: JsObject): string {
        return obj.toString();
    }
    toListString(obj: JsObject): string {
        return obj.toString();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    evaluate(obj: JsObject, argList: Cons): [TFLAGS, U] {
        throw new ProgrammingError();
    }
    transform(obj: JsObject): [TFLAGS, U] {
        return [TFLAG_HALT, obj];
    }
}

export const jsobject_extension = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new JsObjectExtension($);
});