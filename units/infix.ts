import { U } from "math-expression-tree";
import { create_engine } from "../src/api/api";

export function infix(expr: U): string {
    const engine = create_engine();
    try {
        return engine.renderAsString(expr);
    }
    finally {
        engine.release();
    }
}
