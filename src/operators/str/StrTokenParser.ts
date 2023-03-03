import { TokenParser } from "../../brite/ScanConfig";
import { Str } from "../../tree/str/Str";

export class StrTokenParser implements TokenParser {
    parse(token: string, pos: number, end: number): Str {
        // We remove the delimiters. Not very sophisticated, I know.
        // TODO: Parsing of string with embedded and varying delimiters.
        const parsedText = token.substring(1, token.length - 1);
        return new Str(parsedText, pos, end);
    }
}