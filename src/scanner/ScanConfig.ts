import { Sym } from "../tree/sym/Sym";
import { U } from "../tree/tree";


export interface TokenParser {
    /**
     * Converts a token string from the source text into an expression.
     * @param token The text provided by the scanner for the token.
     * @param pos The starting position of the token in the source text.
     * @param end The ending position of the token in the source text. 
     */
    parse(token: string, pos: number, end: number): U;
}

export interface ScanConfig {
    fltParser: TokenParser;
    intParser: TokenParser;
    strParser: TokenParser;
    symParser: TokenParser;
    /**
     * Substitutions for operators known to the scanner.
     */
    lexicon: { [op: string]: Sym }
    /**
    * Substitutions to be made for various meta symbols (only in meta mode).
    * The key to the map is the token, which is the representation obtained by the scanner.
    * The value of the map is the namespace qualified name of the substitution.
    */
    meta: { [token: string]: Sym };
    /**
     * For compatibility with 1.x, this is always set to true.
     */
    parse_time_simplifications: boolean;
}