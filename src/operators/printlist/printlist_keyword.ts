import { ExtensionEnv, TFLAG_NONE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_SYM } from "../../hashing/hash_info";
import { NAME_SCRIPT_LAST } from "../../runtime/ns_script";
import { makeList, U } from "../../tree/tree";
import { KeywordOperator } from "../helpers/KeywordSymbol";
import { is_sym } from "../sym/is_sym";
import { TYPE_NAME_SYM } from "../sym/TYPE_NAME_SYM";
import { FNAME_PRINTLIST } from "./FNAME_PRINTLIST";
import { KEYWORD_PRINTLIST } from "./KEYWORD_PRINTLIST";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new PrintListKeyword($);
    }
}

class PrintListKeyword extends KeywordOperator {
    constructor($: ExtensionEnv) {
        super(KEYWORD_PRINTLIST, $);
    }
    get key(): string {
        return TYPE_NAME_SYM.name;
    }
    get hash(): string {
        return HASH_SYM;
    }
    get name(): string {
        return 'PrintListKeyword';
    }
    transform(expr: U): [TFLAGS, U] {
        if (is_sym(expr) && expr.equalsSym(KEYWORD_PRINTLIST)) {
            const $ = this.$;
            return [TFLAG_DIFF, $.valueOf(makeList(FNAME_PRINTLIST, NAME_SCRIPT_LAST))];
        }
        return [TFLAG_NONE, expr];
    }
}

export const printlist_keyword = new Builder();
