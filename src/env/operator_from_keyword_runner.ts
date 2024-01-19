import { HASH_SYM } from "../hashing/hash_info";
import { AbstractKeywordOperator } from "../operators/helpers/KeywordSymbol";
import { is_sym } from "../operators/sym/is_sym";
import { Sym } from "../tree/sym/Sym";
import { nil, U } from "../tree/tree";
import { ExtensionEnv, KeywordRunner, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "./ExtensionEnv";

class Builder implements OperatorBuilder<U> {
    readonly #keyword: Sym;
    readonly #runner: KeywordRunner;
    constructor(keyword: Sym, runner: KeywordRunner) {
        this.#keyword = keyword;
        this.#runner = runner;
    }
    create($: ExtensionEnv): Operator<U> {
        return new KeywordRunnerOperator(this.#keyword, this.#runner, $);
    }
}

class KeywordRunnerOperator extends AbstractKeywordOperator {
    readonly #runner: KeywordRunner;
    constructor(keyword: Sym, runner: KeywordRunner, $: ExtensionEnv) {
        super(keyword, $);
        this.#runner = runner;
    }
    get hash(): string {
        return HASH_SYM;
    }
    get name(): string {
        return this.keyword().key();
    }
    transform(expr: U): [TFLAGS, U] {
        // Because of our hash, we are being matched with any symbol.
        if (is_sym(expr) && expr.equalsSym(this.keyword())) {
            const $ = this.$;
            this.#runner($);
            return [TFLAG_DIFF, nil];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
}

/**
 *
 */
export function operator_from_keyword_runner(sym: Sym, runner: KeywordRunner): OperatorBuilder<U> {
    return new Builder(sym, runner);
}
