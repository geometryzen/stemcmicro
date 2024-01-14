import { Sym } from "../tree/sym/Sym";

export interface ClojureScriptParseOptions {
    lexicon: { [op: string]: Sym };
    /**
     * Determines whether the parser makes associativity explicit or implicit in additive expressions.
     */
    explicitAssocAdd?: boolean;
    /**
     * Determines whether the parser makes associativity explicit or implicit in multiplicative expressions.
     */
    explicitAssocMul?: boolean;

}