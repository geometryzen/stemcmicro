export interface PyParseOptions {
    /**
     * Determines whether the parser makes associativity explicit or implicit in additive expressions.
     */
    explicitAssocAdd?: boolean;
    /**
     * Determines whether the parser makes associativity explicit or implicit in multiplicative expressions.
     */
    explicitAssocMul?: boolean;
    /**
     * Determines whether the parser makes associativity explicit or implicit in exterior product expressions.
     */
    explicitAssocExt?: boolean;
}