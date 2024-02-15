import { is_keyword, Keyword, Sym } from "math-expression-atoms";
import { AtomHandler } from "math-expression-context";
import { Cons, U } from "math-expression-tree";
import { Extension, ExtensionEnv, FEATURE, mkbuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";

function verify_keyword(x: Keyword): Keyword | never {
    if (is_keyword(x)) {
        return x;
    }
    else {
        throw new Error();
    }
}

class KeywordExtension implements Extension<Keyword>, AtomHandler<Keyword> {
    readonly #hash = hash_for_atom(new Keyword('a', 'ns'));
    constructor() {
        // Nothing to see here.
    }
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    test(atom: Keyword, opr: Sym): boolean {
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

export const keyword_extension_builder = mkbuilder(KeywordExtension);
