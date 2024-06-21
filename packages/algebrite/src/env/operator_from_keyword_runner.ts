import { HASH_SYM } from "@stemcmicro/hashing";
import { AbstractKeywordExtension } from "../operators/helpers/KeywordSymbol";
import { is_sym } from "../operators/sym/is_sym";
import { Sym } from "../tree/sym/Sym";
import { nil, U } from "../tree/tree";
import { EnvConfig } from "./EnvConfig";
import { Extension, ExtensionBuilder, ExtensionEnv, KeywordRunner, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "./ExtensionEnv";

class Builder implements ExtensionBuilder<U> {
    readonly #keyword: Sym;
    readonly #runner: KeywordRunner;
    constructor(keyword: Sym, runner: KeywordRunner) {
        this.#keyword = keyword;
        this.#runner = runner;
    }
    create(config: Readonly<EnvConfig>): Extension<U> {
        return new KeywordRunnerExtension(this.#keyword, this.#runner, config);
    }
}

class KeywordRunnerExtension extends AbstractKeywordExtension {
    readonly #runner: KeywordRunner;
    constructor(
        keyword: Sym,
        runner: KeywordRunner,
        readonly config: Readonly<EnvConfig>
    ) {
        super(keyword, config);
        this.#runner = runner;
    }
    get hash(): string {
        return HASH_SYM;
    }
    get name(): string {
        return this.keyword().key();
    }
    transform(expr: U, $: ExtensionEnv): [TFLAGS, U] {
        // Because of our hash, we are being matched with any symbol.
        if (is_sym(expr) && expr.equalsSym(this.keyword())) {
            this.#runner($);
            return [TFLAG_DIFF, nil];
        } else {
            return [TFLAG_NONE, expr];
        }
    }
}

/**
 *
 */
export function extension_builder_from_keyword_runner(sym: Sym, runner: KeywordRunner): ExtensionBuilder<U> {
    return new Builder(sym, runner);
}
