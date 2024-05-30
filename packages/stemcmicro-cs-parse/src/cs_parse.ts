import { bigInt, BigInteger, Boo, Char, create_sym_ns, create_tensor, Flt, is_str, Keyword, Map, Rat, Set, Str, Sym, Tag, Timestamp, Uuid } from "@stemcmicro/atoms";
import { pos_end_items_to_cons, U } from "@stemcmicro/tree";
import { EDNListParser, ParseConfig } from "./EDNListParser";

export interface ClojureScriptParseOptions {
    lexicon?: { [key: string]: Sym };
}

/**
 * ClojureScript parsing based upon the extensible data notation parser.
 *
 * @see https://github.com/edn-format/edn?tab=readme-ov-file
 *
 * @param sourceText
 * @param options
 * @returns
 */
export function cs_parse(sourceText: string, options: ClojureScriptParseOptions = {}): { trees: U[]; errors: Error[] } {
    // options.useCaretForExponentiation;
    // options.useParenForTensors;
    const parseConfig: ParseConfig<U> = {
        bigIntAs: (value: string, pos: number, end: number) => {
            return new Rat(new BigInteger(BigInt(value)), bigInt.one, pos, end);
        },
        booAs: (value: boolean, pos: number, end: number) => new Boo(value, pos, end),
        charAs: (ch: string, pos: number, end: number) => new Char(ch, pos, end),
        fltAs: (value: number, pos: number, end: number) => new Flt(value, pos, end),
        intAs: (value: number, pos: number, end: number) => {
            return new Rat(new BigInteger(BigInt(value)), bigInt.one, pos, end);
        },
        keywordAs: (localName: string, namespace: string, pos: number, end: number) => new Keyword(localName, namespace, pos, end),
        listAs: (items: U[], pos: number, end: number) => pos_end_items_to_cons(pos, end, ...items),
        mapAs: (entries: [key: U, value: U][], pos: number, end: number) => {
            return new Map(entries, pos, end);
        },
        nilAs: (pos: number, end: number) => {
            return pos_end_items_to_cons(pos, end, ...[]);
            // return new Cons(void 0, void 0, pos, end);
        },
        setAs: (members: U[], pos: number, end: number) => {
            return new Set(members, pos, end);
        },
        strAs: (value: string, pos: number, end: number) => new Str(value, pos, end),
        symAs: (localName: string, namespace: string, pos: number, end: number) => {
            const sym = create_sym_ns(localName, namespace, pos, end);
            if (options.lexicon) {
                const key = sym.key();
                const meaning = options.lexicon[key];
                if (meaning) {
                    return meaning;
                }
            }
            return sym;
        },
        tagAs: (tag: string, value: U, pos: number, end: number) => new Tag(tag, value, pos, end),
        vectorAs: (values: U[], pos: number, end: number) => create_tensor(values, pos, end),
        tagHandlers: {
            inst: (value: U) => {
                if (is_str(value)) {
                    return new Timestamp(new Date(value.str), value.pos, value.end);
                } else {
                    throw new Error("");
                }
            },
            uuid: (value: U) => {
                if (is_str(value)) {
                    return new Uuid(value.str, value.pos, value.end);
                } else {
                    throw new Error("");
                }
            }
        }
    };
    const parser: EDNListParser<U> = new EDNListParser(parseConfig);
    const trees = parser.next(sourceText);
    const errors: Error[] = [];
    return { trees, errors };
}
