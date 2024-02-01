import { Sym } from "math-expression-atoms";
import { is_native, Native } from "math-expression-native";

export function printname_from_symbol(sym: Sym): string {
    if (is_native(sym, Native.PI)) {
        return 'pi';
    }
    else if (sym.key() === 'Ω') {
        return 'Omega';
    }
    else {
        return sym.key();
    }
}
