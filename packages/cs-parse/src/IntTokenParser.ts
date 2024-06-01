import { bigInt, Rat } from "@stemcmicro/atoms";

export class IntTokenParser {
    parse(token: string, pos: number, end: number): Rat {
        // TODO: Make use of pos and end
        const sign = token[0];
        if (sign === "+") {
            const numerator = bigInt(token.substring(1));
            return new Rat(numerator, bigInt.one, pos, end);
        }
        if (sign === "-") {
            const numerator = bigInt(token.substring(1));
            return new Rat(numerator, bigInt.one, pos, end).neg();
        }
        const numerator = bigInt(token);
        return new Rat(numerator, bigInt.one, pos, end);
    }
}
