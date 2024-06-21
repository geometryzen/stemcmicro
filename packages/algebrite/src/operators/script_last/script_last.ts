import { Sym } from "@stemcmicro/atoms";
import { HASH_SYM } from "@stemcmicro/hashing";
import { nil, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS } from "../../env/ExtensionEnv";
import { RESERVED_KEYWORD_LAST } from "../../runtime/ns_script";
import { AbstractKeywordExtension } from "../helpers/KeywordSymbol";
import { wrap_as_transform } from "../wrap_as_transform";

class ScriptLast extends AbstractKeywordExtension {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(RESERVED_KEYWORD_LAST, config);
    }
    get hash(): string {
        return HASH_SYM;
    }
    get name(): string {
        return "ScriptLast";
    }
    transform(keyword: Sym, $: ExtensionEnv): [TFLAGS, U] {
        const binding = $.getBinding(RESERVED_KEYWORD_LAST, nil);
        try {
            return wrap_as_transform(binding, keyword);
        } finally {
            binding.release();
        }
    }
}

export const script_last_0 = mkbuilder(ScriptLast);
