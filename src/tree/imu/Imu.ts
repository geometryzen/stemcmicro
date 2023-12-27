import { Atom } from "math-expression-atoms";
import { U } from "math-expression-tree";

/**
 * The implementation of the imaginary unit.
 */
export class Imu extends Atom<'Imu'> {
    constructor(pos?: number, end?: number) {
        super('Imu', pos, end);
    }
    equals(other: U): boolean {
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
    toString(): string {
        return 'i';
    }
}

export const imu = new Imu();
