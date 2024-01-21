import { create_sym_ns } from 'math-expression-atoms';
import { CharStream, consume_signed_num, NumHandler } from "../../algebrite/consume_num";
import { FltTokenParser } from "../../operators/flt/FltTokenParser";
import { IntTokenParser } from "../../operators/int/IntTokenParser";
import { create_tensor } from "../../tensor/create_tensor";
import { Boo } from "../../tree/boo/Boo";
import { create_flt, Flt } from "../../tree/flt/Flt";
import { Num } from "../../tree/num/Num";
import { create_int } from "../../tree/rat/Rat";
import { Str } from "../../tree/str/Str";
import { create_sym, Sym } from "../../tree/sym/Sym";
import { cons, nil, U } from "../../tree/tree";
import { CommentMarker } from "../atoms/CommentMarker";
import { EOS } from "../atoms/EOS";
import { Keyword } from "../atoms/Keyword";
import { Map } from "../atoms/Map";
import { Char } from "./char";
import { ClojureScriptParseOptions } from "./ClojureScriptParseOptions";
import { Pair } from "./Pair";

const endOfString = new EOS();
const sexpCommentMarker = new CommentMarker();

class CharStreamOnString implements CharStream {
    private pos = 0;
    constructor(private readonly chars: string) {
    }
    get curr(): string {
        return this.chars[this.pos];
    }
    get next(): string {
        return this.chars[this.pos + 1];
    }
    consumeChars(n: number): void {
        this.pos += n;
    }
    currEquals(ch: string): boolean {
        return this.curr === ch;
    }
}

class NumBuilder implements NumHandler {
    #num?: Num;
    constructor(private readonly chars: string) {

    }
    get num(): Num {
        if (this.#num) {
            return this.#num;
        }
        else {
            throw new Error();
        }
    }
    flt(): void {
        this.#num = new FltTokenParser().parse(this.chars, 0, 0);
    }
    int(): void {
        this.#num = new IntTokenParser().parse(this.chars, 0, 0);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/**
 * @deprecated
 */
export function clojurescript_parse(sourceText: string, options?: ClojureScriptParseOptions): { trees: U[], errors: Error[] } {
    const parser = new Parser(sourceText, options);
    const trees: U[] = [];
    let done = false;
    while (!done) {
        const expr = parser.value();
        if (expr === endOfString) {
            done = true;
        }
        else {
            trees.push(expr);
        }
    }
    return { trees, errors: [] };
}

class Parser {
    #tokenIdx = 0;
    readonly #tokens: string[] = [];
    constructor(sourceText: string, private readonly options: ClojureScriptParseOptions | undefined) {
        this.#tokens = tokenize(sourceText);
    }
    value(): U {
        return pairs_to_cons(this.#consumeObject());
    }
    #consumeObject(): U {
        let r = this.#consumeAtom();

        if (r !== sexpCommentMarker) {
            return r;
        }

        r = this.#consumeObject();
        if (r === endOfString)
            throw new Error("Readable object not found after S expression comment.");

        r = this.#consumeObject();
        return r;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    #consumeList(t: '(' | '[' | '{'): U {
        let list: Pair = nil;
        let prev: Pair = list;
        while (this.#tokenIdx < this.#tokens.length) {

            this.#consumeObjectsInSexpComment("Input stream terminated unexpectedly (in list).");

            if (this.#tokens[this.#tokenIdx] === ')' || this.#tokens[this.#tokenIdx] === ']' || this.#tokens[this.#tokenIdx] === '}') {
                this.#tokenIdx++; break;
            }

            if (this.#tokens[this.#tokenIdx] === '.') {
                this.#tokenIdx++;
                const o = this.#consumeObject();
                if (o !== endOfString && list !== nil) {
                    prev.cdr = o;
                }
            }
            else {
                const cur = new Pair(this.#consumeObject(), nil);
                if (list === nil) {
                    list = cur;
                }
                else {
                    prev.cdr = cur;
                }
                prev = cur;
            }
        }
        return list;
    }
    #consumeAtom(): Boo | Sym | Flt | Keyword | Str | Pair | CommentMarker | EOS {
        if (this.#tokenIdx >= this.#tokens.length) {
            return endOfString;
        }

        const t = this.#tokens[this.#tokenIdx++];
        // if( t == ')' ) return null;

        if (t == '#;') {
            return sexpCommentMarker;
        }

        const s: false | 'quote' | 'quasiquote' | 'unquote' | 'unquote-splicing' = t == "'" ? 'quote' :
            t == "`" ? 'quasiquote' :
                t == "," ? 'unquote' :
                    t == ",@" ? 'unquote-splicing' : false;


        if (s || t == '(' || t == '#(' || t == '[' || t == '#[' || t == '{' || t == '#{') {
            if (s) {
                return new Pair(sym_from_lexeme(s, this.options), new Pair(this.#consumeObject(), nil));
            }
            else {
                if (t === '(') {
                    return this.#consumeList(t);
                }
                else if (t === '[') {
                    return this.#consumeVector(t);
                }
                else if (t === '{') {
                    // This will be  a Map
                    return this.#consumeMap(t);
                }
                else {
                    throw new Error(`Unexpected ${t}`);
                }
            }
        }
        else {
            switch (t) {
                case "+inf.0": return new Flt(Infinity);
                case "-inf.0": return new Flt(-Infinity);
                case "+nan.0": return new Flt(NaN);
            }

            if (/^#x[0-9a-z]+$/i.test(t)) {  // #x... Hex
                return create_int(new Number('0x' + t.substring(2, t.length)).valueOf());
            }
            else if (/^#d[0-9.]+$/i.test(t)) {  // #d... Decimal
                return create_flt(new Number(t.substring(2, t.length)).valueOf());
            }
            else {
                const stream = new CharStreamOnString(t);
                const builder = new NumBuilder(t);
                if (consume_signed_num(stream, builder)) {
                    return builder.num;
                }
            }

            if (t.startsWith("::")) {
                const localName = t.substring(2);
                // Using Sym rather than Keyword for now...
                return create_sym_ns(localName, "cljs.user");
            }
            else if (t.startsWith(":")) {
                // TODO: Need to split the name
                const qualifiedName = t.substring(1);
                const slash = qualifiedName.indexOf('/');
                if (slash >= 0) {
                    const namespace = qualifiedName.substring(0, slash);
                    const localName = qualifiedName.substring(slash + 1);
                    // Using Sym rather than Keyword for now...
                    return create_sym_ns(localName, namespace);
                }
                else {
                    // Using Sym rather than Keyword for now...
                    return create_sym(qualifiedName);
                }
            }
            else if (t === 'false') {
                return Boo.valueOf(false);
            }
            else if (t === 'true') {
                return Boo.valueOf(true);
            }
            else if (t.toLowerCase() == '#\\newline') {
                return Char.get('\n');
            }
            else if (t.toLowerCase() == '#\\space') {
                return Char.get(' ');
            }
            else if (t.toLowerCase() == '#\\tab') {
                return Char.get('\t');
            }
            else if (/^#\\.$/.test(t)) {
                return Char.get(t.charAt(2));
            }
            else if (/^#\\x[a-zA-Z0-9]+$/.test(t)) {
                const scalar = parseInt(t.slice(3), 16);
                // R6RS 11.11 (surrogate codepoints)
                if (scalar >= 0xD800 && scalar <= 0xDFFF) {
                    throw new Error("Character in Unicode excluded range.");
                }
                // ECMA-262 4.3.16 -- Basically, strings are sequences of 16-bit
                // unsigned integers, so anything greater than 0xFFFF won't fit.
                // NOTE: This violates R6RS which requires the full Unicode range!
                else if (scalar > 0xFFFF) {
                    throw new Error("Character literal out of range.");
                }
                else {
                    return Char.get(String.fromCharCode(scalar));
                }
            }
            else if (/^"(\\(.|$)|[^"\\])*"?$/.test(t)) {
                const s = t.replace(/(\r?\n|\\n)/g, "\n").replace(/^"|\\(.|$)|"$/g, function ($0, $1) {
                    return $1 ? $1 : '';
                });
                return new Str(s);
            }
            else {
                return sym_from_lexeme(t, this.options);
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    #consumeVector(t: string): U {
        const elements: U[] = [];
        while (this.#tokenIdx < this.#tokens.length) {
            this.#consumeObjectsInSexpComment("Input stream terminated unexpectedly(in vector)");
            if (this.#tokens[this.#tokenIdx] == ']') {
                this.#tokenIdx++; break;
            }
            elements[elements.length] = this.#consumeObject();
        }
        return create_tensor(elements);
        // return new Vector(items);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    #consumeMap(t: string): U {
        const items: U[] = [];
        while (this.#tokenIdx < this.#tokens.length) {
            this.#consumeObjectsInSexpComment("Input stream terminated unexpectedly(in vector)");
            if (this.#tokens[this.#tokenIdx] == '}') {
                this.#tokenIdx++; break;
            }
            items[items.length] = this.#consumeObject();
        }
        return new Map(items);
    }
    #consumeObjectsInSexpComment(err_msg: string): void {
        while (this.#tokens[this.#tokenIdx] == '#;') {
            this.#tokenIdx++;
            if ((this.#consumeObject() == endOfString) || (this.#tokenIdx >= this.#tokens.length))
                throw new Error(err_msg);
        }
    }
}

function pairs_to_cons(expr: U): U {
    if (expr instanceof Pair) {
        const car = pairs_to_cons(expr.car);
        const cdr = pairs_to_cons(expr.cdr);
        return cons(car, cdr);
    }
    else {
        return expr;
    }
}

function tokenize(txt: string): string[] {
    const tokens: string[] = [];
    let oldTxt = null;
    let in_srfi_30_comment = 0;

    while (txt != "" && oldTxt != txt) {
        oldTxt = txt;
        txt = txt.replace(/^\s*(;[^\r\n]*(\r|\n|$)|#;|#\||#\\[^\w]|#?(\(|\[|{)|\)|\]|}|'|`|,@|,|\+inf\.0|-inf\.0|\+nan\.0|"(\\(.|$)|[^"\\])*("|$)|[^\s()[\]{}]+)/,
            function ($0, $1) {
                const t = $1;

                if (t == "#|") {
                    in_srfi_30_comment++;
                    return "";
                }
                else if (in_srfi_30_comment > 0) {
                    if (/(.*\|#)/.test(t)) {
                        in_srfi_30_comment--;
                        if (in_srfi_30_comment < 0) {
                            throw new Error("Found an extra comment terminator: `|#'");
                        }
                        // Push back the rest substring to input stream.
                        return t.substring(RegExp.$1.length, t.length);
                    }
                    else {
                        return "";
                    }
                }
                else {
                    if (t.charAt(0) != ';') {
                        tokens[tokens.length] = t;
                    }
                    return "";
                }
            });
    }
    return tokens;
}

export function sym_from_lexeme(lexeme: string, options: ClojureScriptParseOptions | undefined): Sym {
    // console.lg("sym_from_lexeme", JSON.stringify(lexeme), JSON.stringify(options, null, 2));
    if (options) {
        if (options.lexicon) {
            // console.lg(Object.keys(options.lexicon));
            if (options.lexicon[lexeme]) {
                return options.lexicon[lexeme];
            }
            else {
                return create_sym(lexeme);
            }
        }
        else {
            return create_sym(lexeme);
        }
    }
    else {
        return create_sym(lexeme);
    }
}
