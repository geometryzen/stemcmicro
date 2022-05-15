import { TokenParser } from "../../scanner/ScanConfig";
import { Flt } from "../../tree/flt/Flt";

export class FltTokenParser implements TokenParser {
    parse(token: string, pos: number, end: number): Flt {
        const d = parseFloat(token);
        return new Flt(d, pos, end);
    }
}