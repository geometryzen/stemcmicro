import { Sym } from "@stemcmicro/atoms";
import { is_native, Native } from "@stemcmicro/native";

export function printname_from_symbol(sym: Sym): string {
    if (is_native(sym, Native.PI)) {
        return "pi";
    } else if (sym.key() === "Ω") {
        return "Omega";
    } else {
        return sym.key();
    }
}
