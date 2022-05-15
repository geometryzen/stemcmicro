import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
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
    get name(): string {
        return 'ScriptLast';
    }
    transform(expr: U): [TFLAGS, U] {
        if (this.isKind(expr)) {
            return [CHANGED, this.$.getBinding(NAME_SCRIPT_LAST)];
        }
        return [NOFLAGS, expr];
    }
}

export const script_last_0 = new Builder();
