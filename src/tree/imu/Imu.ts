import { Atom } from "math-expression-atoms";
import { U } from "math-expression-tree";

/**
 * The implementation of the imaginary unit.
 */
export class Imu extends Atom {
    // We need something to make Imu distictive, otherwise the type guard is_imu gives never results.
    #bogus: string;
    constructor(pos?: number, end?: number) {
        super('Imu', pos, end);
        this.#bogus = "";
    }
    override equals(other: U): boolean {
        if (this === other) {
            return true;
        }
        if (other instanceof Imu) {
            return true;
        }
        else {
            return false;
        }
    }
    override toString(): string {
        return 'i';
    }
}

export const imu = new Imu();
