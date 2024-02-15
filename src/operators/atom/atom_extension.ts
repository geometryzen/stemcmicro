import { Cell, is_cell, Sym } from "math-expression-atoms";
import { AtomHandler, ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { cons, Cons, is_atom, U } from "math-expression-tree";
import { Extension, ExtensionEnv, FEATURE, mkbuilder, TFLAGS, TFLAG_HALT } from "../../env/ExtensionEnv";
import { HASH_CELL } from "../../hashing/hash_info";
import { ProgrammingError } from "../../programming/ProgrammingError";

const ISZERO = native_sym(Native.iszero);

class CellExtension implements Extension<Cell>, AtomHandler<Cell> {
    constructor() {
        // Nothing to see here.
    }
    test(cell: Cell, opr: Sym, env: ExprContext): boolean {
        if (opr.equalsSym(ISZERO)) {
            const atom = cell.deref();
            try {
                if (is_atom(atom)) {
                    return env.handlerFor(atom).test(atom, opr, env);
                }
            }
            finally {
                atom.release();
            }
        }
        return false;
    }
    iscons(): boolean {
        return false;
    }
    operator(): Sym {
        throw new Error();
    }
    get hash(): string {
        // TODO: How do we create an exemplar from which to compute the hash?
        return HASH_CELL;
    }
    get name(): string {
        return 'CellExtension';
    }
    get dependencies(): FEATURE[] {
        return ['Cell'];
    }
    isKind(arg: U): arg is Cell {
        return is_cell(arg);
    }
    subst(cell: Cell, oldExpr: U, newExpr: U): U {
        if (cell.equals(oldExpr)) {
            return newExpr;
        }
        return cell;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toInfixString(cell: Cell): string {
        throw new ProgrammingError();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toLatexString(cell: Cell): string {
        throw new ProgrammingError();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toListString(cell: Cell): string {
        throw new ProgrammingError();
    }
    evaluate(cell: Cell, argList: Cons, $: ExtensionEnv): [TFLAGS, U] {
        return $.transform(cons(cell, argList));
    }
    transform(cell: Cell): [TFLAGS, U] {
        return [TFLAG_HALT, cell];
    }
    valueOf(expr: Cell): U {
        return expr;
    }
}

export const cell_extension_builder = mkbuilder(CellExtension);