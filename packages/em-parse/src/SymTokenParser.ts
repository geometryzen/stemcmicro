import { create_sym, Sym } from "@stemcmicro/atoms";

export class SymTokenParser {
    parse(token: string, pos: number, end: number): Sym {
        return create_sym(token, pos, end);
    }
}
