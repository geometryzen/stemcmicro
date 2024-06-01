import { U } from "@stemcmicro/tree";
import { create_engine, RenderConfig } from "../src/api/api";

export function render_as_string(expr: U, config?: Partial<RenderConfig>): string {
    const engine = create_engine();
    try {
        return engine.renderAsString(expr, config);
    } finally {
        engine.release();
    }
}
