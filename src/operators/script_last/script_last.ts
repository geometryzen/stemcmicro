import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_SYM } from "../../hashing/hash_info";
import { RESERVED_KEYWORD_LAST } from "../../runtime/ns_script";
import { cons, Cons, U } from "../../tree/tree";
import { AbstractKeywordOperator } from "../helpers/KeywordSymbol";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new ScriptLast($);
    }
}

class ScriptLast extends AbstractKeywordOperator {
    constructor($: ExtensionEnv) {
        super(RESERVED_KEYWORD_LAST, $);
    }
    get hash(): string {
        return HASH_SYM;
    }
    get name(): string {
        return 'ScriptLast';
    }
    evaluate(argList: Cons): [TFLAGS, U] {
        return this.transform(cons(RESERVED_KEYWORD_LAST, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        if (this.isKind(expr)) {
            return [TFLAG_DIFF, this.$.getSymbolBinding(RESERVED_KEYWORD_LAST)];
        }
        return [TFLAG_NONE, expr];
    }
}

export const script_last_0 = new Builder();
