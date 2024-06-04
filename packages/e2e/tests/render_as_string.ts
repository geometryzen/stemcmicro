import { create_engine } from "@stemcmicro/engine";
import { U } from "@stemcmicro/tree";

interface RenderConfig {}

export function render_as_string(expr: U, config?: Partial<RenderConfig>): string {
    const engine = create_engine();
    try {
        return engine.renderAsString(expr, config);
    } finally {
        engine.release();
    }
}
