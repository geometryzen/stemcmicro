import { Sym } from "math-expression-atoms";
import { nil, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_SYM } from "../../hashing/hash_info";
import { RESERVED_KEYWORD_LAST } from "../../runtime/ns_script";
import { AbstractKeywordOperator } from "../helpers/KeywordSymbol";

class ScriptLast extends AbstractKeywordOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(RESERVED_KEYWORD_LAST);
    }
    get hash(): string {
        return HASH_SYM;
    }
    get name(): string {
        return 'ScriptLast';
    }
    transform(expr: Sym, $: ExtensionEnv): [TFLAGS, U] {
        if (this.isKind(expr, $)) {
            return [TFLAG_DIFF, $.getBinding(RESERVED_KEYWORD_LAST, nil)];
        }
        return [TFLAG_NONE, expr];
    }
}

export const script_last_0 = mkbuilder(ScriptLast);
