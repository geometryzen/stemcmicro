import { Str } from "@stemcmicro/atoms";

export class StrTokenParser {
    parse(text: string, pos: number, end: number): Str {
        // Notice that the text is the parsed representation.
        // Delimiters have alreday been removed and account has been taken of escaped newlines.
        return new Str(text, pos, end);
    }
}
