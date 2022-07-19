import { reset_meta_flag, U } from "../tree";

export abstract class Atom implements U {
    private $meta = 0;
    constructor(public readonly name: string, public readonly pos?: number, public readonly end?: number) {

    }
    reset(meta: number): void {
        this.$meta = reset_meta_flag(this.$meta, meta);
    }
    get meta(): number {
        return this.$meta;
    }
    set meta(meta: number) {
        this.$meta = meta;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    contains(needle: U): boolean {
        return this.equals(needle);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    equals(other: U): boolean {
        throw new Error(`Atom(name=${this.name}).equals(other=${other}) Method not implemented.`);
    }
    isCons(): boolean {
        return false;
    }
    isNil(): boolean {
        return false;
    }
}