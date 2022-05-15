import bigInt from "big-integer";
import { TokenParser } from "../../scanner/ScanConfig";
import { Rat } from "../../tree/rat/Rat";

export class IntTokenParser implements TokenParser {
    parse(token: string, pos: number, end: number): Rat {
        // TODO: Make use of pos and end
        const sign = token[0];
        if (sign === '+') {
            const numerator = bigInt(token.substring(1));
            return new Rat(numerator, bigInt.one, pos, end);
        }
        if (sign === '-') {
            const numerator = bigInt(token.substring(1));
            return new Rat(numerator, bigInt.one, pos, end).neg();
        }
        const numerator = bigInt(token);
        return new Rat(numerator, bigInt.one, pos, end);
    }
}