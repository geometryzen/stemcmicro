import { Cons, U } from "math-expression-tree";
import { is_keyword, Keyword } from "../../clojurescript/atoms/Keyword";
import { Extension, ExtensionEnv, FEATURE, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";

function verify_keyword(x: Keyword): Keyword | never {
    if (is_keyword(x)) {
        return x;
    }
    else {
        throw new Error();
    }
}

class KeywordExtension implements Extension<Keyword> {
    readonly #hash = hash_for_atom(new Keyword('a', 'ns'));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(private readonly $: ExtensionEnv) {
        // Nothing to see here.
    }
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
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
        return 'KeywordExtension';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(keyword: Keyword, $: ExtensionEnv): U {
        verify_keyword(keyword);
        return keyword;
    }
    isKind(keyword: U): keyword is Keyword {
        if (is_keyword(keyword)) {
            return true;
        }
        else {
            return false;
        }
    }
    subst(expr: Keyword, oldExpr: U, newExpr: U): U {
        if (is_keyword(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    toInfixString(keyword: Keyword): string {
        return keyword.key();
    }
    toLatexString(keyword: Keyword): string {
        return keyword.key();
    }
    toListString(keyword: Keyword): string {
        return keyword.key();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    evaluate(expr: Keyword, argList: Cons, $: ExtensionEnv): [number, U] {
        throw new Error("Method not implemented.");
    }
    transform(expr: Keyword): [TFLAGS, U] {
        return [TFLAG_NONE, expr];
    }
}

export const keyword_extension = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new KeywordExtension($);
});