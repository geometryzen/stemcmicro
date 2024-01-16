/* eslint-disable no-console */
import { Native } from "../native/Native";
import { native_sym } from "../native/native_sym";
import { FltTokenParser } from "../operators/flt/FltTokenParser";
import { IntTokenParser } from "../operators/int/IntTokenParser";
import { StrTokenParser } from "../operators/str/StrTokenParser";
import { SymTokenParser } from "../operators/sym/SymTokenParser";
import { METAA, METAB, METAX } from "../runtime/constants";
import { LANG_COLON_EQ } from "../runtime/ns_lang";
import { create_sym, Sym } from "../tree/sym/Sym";
import { U } from "../tree/tree";
import { T_ASTRX, T_ASTRX_ASTRX, T_BANG, T_CARET, T_COLON, T_COLON_EQ, T_COMMA, T_END, T_EQ, T_EQ_EQ, T_FLT, T_FUNCTION, T_FWDSLASH, T_GT, T_GTEQ, T_GTGT, T_INT, T_LPAR, T_LSQB, T_LT, T_LTEQ, T_LTLT, T_MIDDLE_DOT, T_MINUS, T_NEWLINE, T_NTEQ, T_PLUS, T_RPAR, T_RSQB, T_STR, T_SYM, T_VBAR } from "./codes";
import { consume_num } from "./consume_num";
import { is_alphabetic } from "./is_alphabetic";
import { is_alphanumeric_or_underscore } from "./is_alphabetic_or_underscore";
import { is_space } from "./is_space";
import { ScanConfig } from "./ScanConfig";
import { Token, TokenCode } from "./Token";
import { TokenError } from "./TokenError";

const scanConfig: ScanConfig = {
    fltParser: new FltTokenParser(),
    intParser: new IntTokenParser(),
    strParser: new StrTokenParser(),
    symParser: new SymTokenParser(),
    // The lexicon should ONLY contain operators that are "hard-coded" into the scanner.
    // All other functions should be excluded. This conversion is a convenience for the
    // consumer by having normalized operators rather than syntax dependency.
    // Note that MATH_OUTER and MATH_POW depend upon the scanner version.
    // version 1.x : '^' is exponentiation, '**' is not defined.
    // version 2.x : '^' is outer product, '**' is exponentiation.
    lexicon: {
        '+': native_sym(Native.add),
        '-': native_sym(Native.subtract),
        '*': native_sym(Native.multiply),
        '/': native_sym(Native.divide),
        '^': native_sym(Native.outer),
        '|': native_sym(Native.inner),
        '>>': native_sym(Native.rco),
        '<<': native_sym(Native.lco),
        '**': native_sym(Native.pow),
        '<=': native_sym(Native.testle),
        '<': native_sym(Native.testlt),
        '>=': native_sym(Native.testge),
        '>': native_sym(Native.testgt),
        '!=': native_sym(Native.testne),
        '==': native_sym(Native.testeq),
        ':=': LANG_COLON_EQ,
        '=': native_sym(Native.setq),
        'abs': native_sym(Native.abs),
        'cos': native_sym(Native.cos),
        'exp': native_sym(Native.exp),
        'iscomplex': native_sym(Native.iscomplex),
        'isreal': native_sym(Native.isreal),
        'not': native_sym(Native.not),
        'sin': native_sym(Native.sin),
    },
    meta: {
        'a': METAA,
        'b': METAB,
        'x': METAX
    },
    parse_time_simplifications: true
};

export class InputState {
    /**
     * The token is a string when it contains single character operators.
     * Tokens or Operators with multiple characters are combined into a number captured in a T_* constant. e.g. T_
     */
    #token: Token;
    meta_mode = false;
    scan_level: number;

    /**
     * Initialized to zero in the constructor.
     * The only place it is incremented is in scan_error.
     * A better name might be the input start.
     */
    private input_str: number;

    /**
     * @param sourceText The text that will be used for the scan.
     * @param start The zero-based starting position in the text.
     * @param offset The number which must be added to make the (pos, end) values absolute. 
     */
    constructor(private readonly sourceText: string, start: number, private readonly offset: number) {
        this.#token = { txt: '', pos: 0, end: start };
        this.scan_level = 0;
        this.input_str = 0;
    }
    get code(): TokenCode {
        const code = this.#token.code;
        if (code) {
            return code;
        }
        else {
            throw new Error();
        }
    }
    peek(n: number): string {
        return this.sourceText.slice(this.#token.end, this.#token.end + n);
    }
    /**
     * Returns a new InputState n characters to the right of the this input state.
     */
    read(n: number): InputState {
        return new InputState(this.sourceText, this.#token.end + n, this.offset);
    }
    get done(): boolean {
        return this.#token.end === this.sourceText.length;
    }
    get text(): string {
        return this.#token.txt;
    }
    /**
     * The absolute 0-based pos.
     */
    get pos(): number {
        return this.#token.pos + this.offset;
    }
    /**
     * The absolute 0-based end.
     */
    get end(): number {
        return this.#token.end + this.offset;
    }
    get scanned(): number {
        return this.#token.pos - this.input_str;
    }
    /**
     * The character at token.end
     */
    get curr(): string {
        return this.sourceText.charAt(this.#token.end);
    }
    /**
     * The character at token.end + 1
     */
    get next(): string {
        return this.sourceText[this.#token.end + 1];
    }
    get_token_skip_newlines(): void {
        this.scan_level++;
        try {
            this.get_token();
        }
        finally {
            this.scan_level--;
        }
    }
    get_token(): void {
        this.get_token_nib();
        if (this.scan_level > 0) {
            while (this.#token.code === T_NEWLINE) {
                this.get_token_nib();
            }
        }
    }
    consumeChars(n: number): void {
        this.#token.end += n;
    }
    currEquals(thing: string): boolean {
        return this.curr === thing;
    }
    expect(code: TokenCode): { pos: number, end: number } {
        if (this.code === code) {
            return { pos: this.pos, end: this.end };
        }
        else {
            this.scan_error(`${code.text} expected`);
        }
    }
    tokenToFlt(): U {
        return scanConfig.fltParser.parse(this.#token.txt, this.#token.pos + this.offset, this.#token.end + this.offset);
    }
    tokenToInt(): U {
        const atom = scanConfig.intParser.parse(this.#token.txt, this.#token.pos + this.offset, this.#token.end + this.offset);
        return atom;
    }
    tokenToStr(): U {
        const atom = scanConfig.strParser.parse(this.#token.txt, this.#token.pos + this.offset, this.#token.end + this.offset);
        return atom;
    }
    tokenToSym(): Sym {
        // console.lg(`tokenToSym(txt=${this.#token.txt} pos=${this.#token.pos}, end=${this.#token.end})`);
        // TODO: This stuff seems like it could go into a parser, but we would need the meta_mode.
        // Maybe we use two different symbol parsers?
        const key = this.#token.txt;
        if (this.meta_mode && typeof this.#token.txt == 'string') {
            const metaKey = scanConfig.meta[key];
            if (metaKey) {
                return metaKey;
            }
        }
        if (scanConfig.lexicon[key]) {
            return scanConfig.lexicon[key].clone(this.#token.pos + this.offset, this.#token.end + this.offset);
        }
        else {
            const atom = create_sym(key, this.#token.pos + this.offset, this.#token.end + this.offset);
            return atom;
        }
    }
    /**
     * Sets the (private) token variable to the next token.
     * Skips whitespace.
     * Eats numbers giving T_DOUBLE (scientific notation) or T_INTEGER (otherwise).
     * Eats symbols giving T_SYMBOL or T_FUNCTION if Lpar detected.
     * Eats (double) quoted strings giving T_STRING.
     * Eats comments giving T_NEWLINE.
     * Combines multi-character operators as follows:
     * ':=' T_COLON_EQ
     * '==' T_EQ_EQ
     * '!=' T_BANG_EQ
     * '<=' T_LTEQ
     * '>=' T_GTEQ
     * '**' or "**" T_STAR_STAR
     */
    private get_token_nib(): void {
        // eslint-disable-next-line no-console
        // console.lg(`get_token(start = ${JSON.stringify(this.#token)})`);

        // skip spaces
        while (is_space(this.curr)) {
            if (this.curr === '\n' || this.curr === '\r') {
                this.#token.code = T_NEWLINE;
                this.#token.pos = this.#token.end;
                this.#token.end++;
                return;
            }
            this.#token.end++;
        }

        this.#token.pos = this.#token.end;

        // end of source text?
        if (this.#token.end === this.sourceText.length) {
            this.#token.txt = '';
            this.#token.code = T_END;
            return;
        }

        if (consume_num(this, {
            flt: () => {
                this.#token.code = T_FLT;
                this.update_token_text(this.#token.pos, this.#token.end);
            },
            int: () => {
                this.#token.code = T_INT;
                this.update_token_text(this.#token.pos, this.#token.end);
            }
        })) {
            return;
        }
        /*
        if (is_digit(this.curr) || this.curr === '.') {
            while (is_digit(this.curr)) {
                this.#token.end++;
            }
            if (this.curr === '.') {
                this.#token.end++;
                while (is_digit(this.curr)) {
                    this.#token.end++;
                }
                if (this.currEquals('e') && (this.next === '+' || this.next === '-' || is_digit(this.next))) {
                    this.#token.end += 2;
                    while (is_digit(this.curr)) {
                        this.#token.end++;
                    }
                }
                this.#token.code = T_FLT;
            }
            else {
                this.#token.code = T_INT;
            }
            this.update_token_text(this.#token.pos, this.#token.end);
            return;
        }
        */

        // symbol or function call?
        if (is_alphabetic(this.curr)) {
            this.#token.code = T_SYM;
            this.#token.end++;
            while (is_alphanumeric_or_underscore(this.curr)) {
                this.#token.code = T_SYM;
                this.#token.end++;
            }
            // TODO: T_FUNCTION or T_SYM
            if (this.curr === '(') {
                this.#token.code = T_FUNCTION;
            }
            else {
                this.#token.code = T_SYM;
            }
            this.update_token_text(this.#token.pos, this.#token.end);
            return;
        }

        // string ?
        // TODO: Handle strings containing embedded double quotes
        if (this.curr === '"') {
            this.#token.end++;
            while (this.curr !== '"') {
                //if (scan_str == scanned.length || scanned[scan_str] == '\n' || scanned[scan_str] == '\r')
                if (this.#token.end === this.sourceText.length - 1) {
                    this.#token.end++;
                    this.scan_error('runaway string');
                    // FIXME...
                    this.#token.end--;
                }
                this.#token.end++;
            }
            this.#token.end++;
            this.#token.code = T_STR;
            // Notice that the token.buf contains the entire un-parsed string.
            this.update_token_text(this.#token.pos, this.#token.end);
            return;
        }

        // comment?
        if (this.curr === '#' || (this.curr === '-' && this.next === '-')) {
            while (this.curr && !this.currEquals('\n') && !this.currEquals('\r')) {
                this.#token.end++;
            }
            if (this.curr) {
                this.#token.end++;
            }
            this.#token.code = T_NEWLINE;
            return;
        }

        switch (this.curr) {
            case '*': {
                switch (this.next) {
                    case '*': {
                        this.#token.code = T_ASTRX_ASTRX;
                        this.#token.txt = '**';
                        this.#token.end += 2;
                        return;
                    }
                    default: {
                        this.#token.txt = '*';
                        this.#token.code = T_ASTRX;
                        this.#token.end += 1;
                        return;
                    }
                }
            }
            case ':': {
                switch (this.next) {
                    case '=': {
                        this.#token.code = T_COLON_EQ;
                        this.#token.txt = ':=';
                        this.#token.end += 2;
                        return;
                    }
                    default: {
                        this.#token.code = T_COLON;
                        this.#token.txt = ':';
                        this.#token.end += 1;
                        return;
                    }
                }
                break;
            }
            case '=': {
                switch (this.next) {
                    case '=': {
                        this.#token.code = T_EQ_EQ;
                        this.#token.txt = '==';
                        this.#token.end += 2;
                        return;
                    }
                    default: {
                        this.#token.code = T_EQ;
                        this.#token.txt = '=';
                        this.#token.end += 1;
                        return;
                    }
                }
            }
            case '>': {
                switch (this.next) {
                    case '=': {
                        this.#token.code = T_GTEQ;
                        this.#token.txt = '>=';
                        this.#token.end += 2;
                        return;
                    }
                    case '>': {
                        this.#token.code = T_GTGT;
                        this.#token.txt = '>>';
                        this.#token.end += 2;
                        return;
                    }
                    default: {
                        this.#token.code = T_GT;
                        this.#token.txt = '>';
                        this.#token.end += 1;
                        return;
                    }
                }
            }
            case '<': {
                switch (this.next) {
                    case '=': {
                        this.#token.code = T_LTEQ;
                        this.#token.txt = '<=';
                        this.#token.end += 2;
                        return;
                    }
                    case '<': {
                        this.#token.code = T_LTLT;
                        this.#token.txt = '<<';
                        this.#token.end += 2;
                        return;
                    }
                    default: {
                        this.#token.code = T_LT;
                        this.#token.txt = '<';
                        this.#token.end += 1;
                        return;
                    }
                }
            }
            case '!': {
                switch (this.next) {
                    case '=': {
                        this.#token.code = T_NTEQ;
                        this.#token.txt = '!=';
                        this.#token.end += 2;
                        return;
                    }
                    default: {
                        this.#token.code = T_BANG;
                        this.#token.txt = '!';
                        this.#token.end += 1;
                        return;
                    }
                }
                break;
            }
            case '(': {
                switch (this.next) {
                    default: {
                        this.#token.code = T_LPAR;
                        this.#token.txt = '(';
                        this.#token.end += 1;
                        return;
                    }
                }
            }
            case ')': {
                switch (this.next) {
                    default: {
                        this.#token.code = T_RPAR;
                        this.#token.txt = ')';
                        this.#token.end += 1;
                        return;
                    }
                }
            }
            case ',': {
                switch (this.next) {
                    default: {
                        this.#token.code = T_COMMA;
                        this.#token.txt = ',';
                        this.#token.end += 1;
                        return;
                    }
                }
            }
            case '[': {
                switch (this.next) {
                    default: {
                        this.#token.code = T_LSQB;
                        this.#token.txt = '[';
                        this.#token.end += 1;
                        return;
                    }
                }
            }
            case ']': {
                switch (this.next) {
                    default: {
                        this.#token.code = T_RSQB;
                        this.#token.txt = ']';
                        this.#token.end += 1;
                        return;
                    }
                }
            }
        }

        if (this.curr === '+') {
            this.#token.txt = this.curr;
            this.#token.code = T_PLUS;
            this.#token.end += 1;
            return;
        }

        if (this.curr === '-') {
            this.#token.txt = this.curr;
            this.#token.code = T_MINUS;
            this.#token.end += 1;
            return;
        }

        if (this.curr === '^') {
            this.#token.txt = this.curr;
            this.#token.code = T_CARET;
            this.#token.end += 1;
            return;
        }

        if (this.curr === '|') {
            this.#token.txt = this.curr;
            this.#token.code = T_VBAR;
            this.#token.end += 1;
            return;
        }

        if (this.curr === '/') {
            this.#token.txt = this.curr;
            this.#token.code = T_FWDSLASH;
            this.#token.end += 1;
            return;
        }

        if (this.curr === '·') {
            this.#token.txt = this.curr;
            this.#token.code = T_MIDDLE_DOT;
            this.#token.end += 1;
            return;
        }

        // single char token. What did we miss?
        this.#token.txt = this.sourceText[this.#token.end++];
        throw new Error(`text = ${this.#token.txt}`);
    }

    /**
     * Updates the token buffer string to be the substring defined by pos and end.
     * TODO: In version 1.x there could be a problem with embedded string delimiters.
     * @param pos The end position of the token.
     * @param end The start position of the token.
     */
    private update_token_text(pos: number, end: number): void {
        this.#token.txt = this.sourceText.substring(pos, end);
        // console.lg(`update_token_buf(pos => ${pos}, end => ${end}), token.buf => ${JSON.stringify(token.buf)}`);
    }
    public scan_error(errmsg: string): never {
        throw new TokenError(errmsg, this.#token.pos, this.#token.end);
    }
    tokenCharCode(): number | undefined {
        const mtoken = this.munge(this.#token);
        if (typeof mtoken == 'string') {
            return mtoken.charCodeAt(0);
        }
        return undefined;
    }
    /**
     * Temporary function until all token texts are recognized and codified.
     */
    private munge(token: Token): string | number {
        const token_code = token.code;
        if (typeof token_code === 'object' && typeof token_code.code === 'number') {
            return token_code.code;
        }
        else {
            return token.txt;
        }
    }
    get parse_time_simplifications(): boolean {
        return scanConfig.parse_time_simplifications;
    }
}
