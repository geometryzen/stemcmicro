import { create_engine, ExprEngine } from "@stemcmicro/engine";
import { js_parse } from "@stemcmicro/js-parse";

describe("units", () => {
    it("create_engine", () => {
        const engine: ExprEngine = create_engine();
        try {
            const sourceText = [`G20 = algebra([1, 1, 1], ["ex", "ey", "ez"])`, `ex = G20[1]`, `ey = G20[2]`, `cross(ex,ey)`].join("\n");
            const { trees, errors } = js_parse(sourceText);
            if (errors.length > 0) {
            }
            for (let i = 0; i < trees.length; i++) {
                const tree = trees[i];
                const value = engine.valueOf(tree);
                if (!value.isnil) {
                    const s = engine.renderAsString(tree);
                    expect(s).toBe("cross(ex,ey)");
                    const t = engine.renderAsString(engine.simplify(value));
                    expect(t).toBe("ez");
                }
                value.release();
            }
        } finally {
            engine.release();
        }
    });
    it("tensor component assignment", () => {
        const engine: ExprEngine = create_engine();
        try {
            const sourceText = [`M=zero(2,2)`, `M[1,1]=a`, `M[1,2]=b`, `M[2,1]=c`, `M[2,2]=d`, `M`].join("\n");
            const { trees, errors } = js_parse(sourceText);
            if (errors.length > 0) {
            }
            for (let i = 0; i < trees.length; i++) {
                const tree = trees[i];
                const value = engine.valueOf(tree);
                if (!value.isnil) {
                    const s = engine.renderAsString(tree);
                    expect(s).toBe("M");
                    const t = engine.renderAsString(engine.simplify(value));
                    expect(t).toBe("[[a,b],[c,d]]");
                }
                value.release();
            }
        } finally {
            engine.release();
        }
    });
});
