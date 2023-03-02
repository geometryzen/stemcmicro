import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "./ExtensionEnv";
import { HASH_SYM } from "../hashing/hash_info";
import { Sym } from "../tree/sym/Sym";
import { nil, U } from "../tree/tree";
import { KeywordOperator } from "../operators/helpers/KeywordSymbol";
import { is_sym } from "../operators/sym/is_sym";
import { TYPE_NAME_SYM } from "../operators/sym/TYPE_NAME_SYM";

class Builder implements OperatorBuilder<U> {
    constructor(private keyword: Sym, private runner: ($: ExtensionEnv) => void) {

    }
    create($: ExtensionEnv): Operator<U> {
        return new PluggableKeywordOperator(this.keyword, this.runner, $);
    }
}

class PluggableKeywordOperator extends KeywordOperator {
    constructor(keyword: Sym, private runner: ($: ExtensionEnv) => void, $: ExtensionEnv) {
        super(keyword, $);
    }
    get key(): string {
        return TYPE_NAME_SYM.name;
    }
    get hash(): string {
        return HASH_SYM;
    }
    get name(): string {
        return this.keyword.text;
    }
    transform(expr: U): [TFLAGS, U] {
        // Because of our hash, we are being matched with any symbol.
        if (is_sym(expr) && expr.equalsSym(this.keyword)) {
            const $ = this.$;
            this.runner($);
            return [TFLAG_DIFF, nil];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
}

export function make_pluggable_keyword_operator(sym: Sym, runner: ($: ExtensionEnv) => void): OperatorBuilder<U> {
    return new Builder(sym, runner);
}
