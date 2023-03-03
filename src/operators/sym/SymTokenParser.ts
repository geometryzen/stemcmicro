import { TokenParser } from "../../brite/ScanConfig";
import { create_sym, Sym } from "../../tree/sym/Sym";

export class SymTokenParser implements TokenParser {
    parse(token: string, pos: number, end: number): Sym {
        return create_sym(token, pos, end);
    }
}