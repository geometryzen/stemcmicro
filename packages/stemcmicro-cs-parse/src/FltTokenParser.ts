import { Flt } from "@stemcmicro/atoms";

export class FltTokenParser {
    parse(token: string, pos: number, end: number): Flt {
        const d = parseFloat(token);
        return new Flt(d, pos, end);
    }
}
