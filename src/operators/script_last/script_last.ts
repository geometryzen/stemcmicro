import { ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_SYM } from "../../hashing/hash_info";
import { NAME_SCRIPT_LAST } from "../../runtime/ns_script";
import { U } from "../../tree/tree";
import { KeywordOperator } from "../helpers/KeywordSymbol";
import { TYPE_NAME_SYM } from "../sym/TYPE_NAME_SYM";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new ScriptLast($);
    }
}

class ScriptLast extends KeywordOperator {
    constructor($: ExtensionEnv) {
        super(NAME_SCRIPT_LAST, $);
    }
    get key(): string {
        return TYPE_NAME_SYM.name;
    }
    get hash(): string {
        return HASH_SYM;
    }
    get name(): string {
        return 'ScriptLast';
    }
    transform(expr: U): [TFLAGS, U] {
        if (this.isKind(expr)) {
            return [TFLAG_DIFF, this.$.getBinding(NAME_SCRIPT_LAST)];
        }
        return [NOFLAGS, expr];
    }
}

export const script_last_0 = new Builder();
