import { assert_jsobject, is_jsobject, JsObject, Sym } from "math-expression-atoms";
import { AtomHandler } from "math-expression-context";
import { Cons, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, ExtensionEnv, make_extension_builder, TFLAGS, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";
import { ProgrammingError } from "../../programming/ProgrammingError";

export class JsObjectExtension implements Extension<JsObject>, AtomHandler<JsObject> {
    #hash: string = hash_for_atom(new JsObject({}));
    constructor(readonly config: Readonly<EnvConfig>) {
        // Nothing to see here.
    }
    test(atom: JsObject, opr: Sym): boolean {
        throw new Error(`${this.name}.dispatch(${atom},${opr}) method not implemented.`);
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

export const jsobject_extension_builder = make_extension_builder(JsObjectExtension);