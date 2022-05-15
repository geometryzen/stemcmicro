import { TokenParser } from "../../scanner/ScanConfig";
import { Sym } from "../../tree/sym/Sym";

export class SymTokenParser implements TokenParser {
    parse(token: string, pos: number, end: number): Sym {
        return new Sym(token, void 0, pos, end);
    }
}