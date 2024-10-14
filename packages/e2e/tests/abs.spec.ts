import { create_engine, ExprEngine } from "@stemcmicro/engine";
import { js_parse } from "@stemcmicro/js-parse";

describe("abs", () => {
    it("a*b", () => {
        const engine: ExprEngine = create_engine();
        try {
            const sourceText = [`abs(a*b)`].join("\n");
            const { trees, errors } = js_parse(sourceText);
            if (errors.length > 0) {
            }
            for (let i = 0; i < trees.length; i++) {
                const tree = trees[i];
                const value = engine.valueOf(tree);
                if (!value.isnil) {
                    const s = engine.renderAsString(tree);
                    expect(s).toBe("abs(a*b)");
                    const t = engine.renderAsString(value);
                    expect(t).toBe("abs(a)*abs(b)");
                }
                value.release();
            }
        } finally {
            engine.release();
        }
    });
    it("a/b", () => {
        const engine: ExprEngine = create_engine();
        try {
            const sourceText = [`abs(a/b)`].join("\n");
            const { trees, errors } = js_parse(sourceText);
            if (errors.length > 0) {
            }
            for (let i = 0; i < trees.length; i++) {
                const tree = trees[i];
                const value = engine.valueOf(tree);
                if (!value.isnil) {
                    const s = engine.renderAsString(tree);
                    expect(s).toBe("abs(a/b)");
                    const t = engine.renderAsString(value);
                    expect(t).toBe("abs(a)/abs(b)");
                }
                value.release();
            }
        } finally {
            engine.release();
        }
    });
    it("a+b", () => {
        const engine: ExprEngine = create_engine();
        try {
            const sourceText = [`abs(a+b)`].join("\n");
            const { trees, errors } = js_parse(sourceText);
            if (errors.length > 0) {
            }
            for (let i = 0; i < trees.length; i++) {
                const tree = trees[i];
                const value = engine.valueOf(tree);
                if (!value.isnil) {
                    const s = engine.renderAsString(tree);
                    expect(s).toBe("abs(a+b)");
                    const t = engine.renderAsString(value);
                    expect(t).toBe("(2*a*b+a**2+b**2)**(1/2)");
                }
                value.release();
            }
        } finally {
            engine.release();
        }
    });
    it("ex+ey", () => {
        const engine: ExprEngine = create_engine();
        try {
            const sourceText = [`G20 = algebra([1, 1, 1], ["i", "j", "k"])`, `ex = G20[1]`, `ey = G20[2]`, `ez = G20[3]`, `abs(ex+ey)`].join("\n");
            const { trees, errors } = js_parse(sourceText);
            if (errors.length > 0) {
            }
            for (let i = 0; i < trees.length; i++) {
                const tree = trees[i];
                const value = engine.valueOf(tree);
                if (!value.isnil) {
                    const s = engine.renderAsString(tree);
                    expect(s).toBe("abs(ex+ey)");
                    const t = engine.renderAsString(value);
                    expect(t).toBe("2**(1/2)");
                }
                value.release();
            }
        } finally {
            engine.release();
        }
    });
    it("3*ex+4*ey", () => {
        const engine: ExprEngine = create_engine();
        try {
            const sourceText = [`G20 = algebra([1, 1, 1], ["i", "j", "k"])`, `ex = G20[1]`, `ey = G20[2]`, `ez = G20[3]`, `abs(3*ex+4*ey)`].join("\n");
            const { trees, errors } = js_parse(sourceText);
            if (errors.length > 0) {
            }
            for (let i = 0; i < trees.length; i++) {
                const tree = trees[i];
                const value = engine.valueOf(tree);
                if (!value.isnil) {
                    const s = engine.renderAsString(tree);
                    expect(s).toBe("abs(3*ex+4*ey)");
                    const t = engine.renderAsString(value);
                    expect(t).toBe("5");
                }
                value.release();
            }
        } finally {
            engine.release();
        }
    });
});
