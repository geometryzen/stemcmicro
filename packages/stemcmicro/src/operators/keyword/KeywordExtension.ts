import { create_str, create_sym, is_keyword, Keyword, Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Native } from "@stemcmicro/native";
import { Cons, nil, U } from "@stemcmicro/tree";
import { diagnostic } from "../../diagnostics/diagnostics";
import { Diagnostics } from "../../diagnostics/messages";
import { Extension, ExtensionEnv, mkbuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";

function verify_keyword(x: Keyword): Keyword | never {
    if (is_keyword(x)) {
        return x;
    } else {
        throw new Error();
    }
}

class KeywordExtension implements Extension<Keyword> {
    readonly #hash = hash_for_atom(new Keyword("a", "ns"));
    constructor() {
        // Nothing to see here.
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(atom: Keyword, opr: Sym): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binL(atom: Keyword, opr: Sym, rhs: U, expr: ExprContext): U {
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(atom: Keyword, opr: Sym, lhs: U, expr: ExprContext): U {
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(target: Keyword, opr: Sym, argList: Cons, env: ExprContext): U {
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
        return this.#hash;
    }
    get name(): string {
        return "KeywordExtension";
    }
    valueOf(keyword: Keyword): U {
        verify_keyword(keyword);
        return keyword;
    }
    isKind(keyword: U): keyword is Keyword {
        if (is_keyword(keyword)) {
            return true;
        } else {
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
    toAsciiString(keyword: Keyword): string {
        return keyword.key();
    }
    toHumanString(keyword: Keyword): string {
        return keyword.key();
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
