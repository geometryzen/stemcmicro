import { ExtensionEnv } from "../../env/ExtensionEnv";
import { Pattern } from "../../patterns/Pattern";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_sym } from "./is_sym";

export class SymPattern implements Pattern {
    constructor(private readonly sym: Sym) {

    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    match(expr: U, $: ExtensionEnv): boolean {
        return is_sym(expr) && this.sym.equalsSym(expr);
    }
}