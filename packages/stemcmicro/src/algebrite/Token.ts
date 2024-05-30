export interface TokenCode {
    text: string;
    code: number;
}
export interface Token {
    /**
     * The actual text in the source code. Ideally we don't have any code that switches based upon this in the scanner
     * and instead use the code. This is a manifiestation of the idea that the text has certain meaning.
     */
    txt: string;
    /**
     * A code for the text. One of the T_ values above. TODO: rename them.
     * It is something of a classification because we deal with things like strings, floats, ...
     */
    code?: TokenCode;

    /**
     * The zero-based starting position of a token in the script.
     */
    pos: number;
    /**
     * The zero-based ending position of a token in the script.
     * This follows the usual convention of being the position of the character just after the last token character.
     */
    end: number;
}
