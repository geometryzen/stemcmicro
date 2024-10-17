import { Directive } from "@stemcmicro/directive";
import { create_engine, ExprEngine } from "@stemcmicro/engine";
import { js_parse } from "@stemcmicro/js-parse";

describe("abs", () => {
    xit("a*b", () => {
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
    xit("a/b", () => {
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
    xit("a+b", () => {
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
    xit("ex+ey", () => {
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
    xit("3*ex+4*ey", () => {
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
    it("3*ex*m+4*ey*m", () => {
        const engine: ExprEngine = create_engine();
        try {
            const sourceText = [
                `G20 = algebra([1, 1, 1],
                     ["i", "j", "k"])`,
                `ex = G20[1]`,
                `ey = G20[2]`,
                `ez = G20[3]`,
                `m=uom("meter")`,
                `r=3*ex*m+4*ey*m`,
                `abs(r)`
            ].join("\n");
            const { trees, errors } = js_parse(sourceText);
            if (errors.length > 0) {
            }
            for (let i = 0; i < trees.length; i++) {
                const tree = trees[i];
                // This exampe demonstrates how to set debugging for a single test.
                engine.pushDirective(Directive.traceLevel, 1);
                try {
                    const value = engine.valueOf(tree);
                    if (!value.isnil) {
                        // const s = engine.renderAsString(tree);
                        // expect(s).toBe("abs((3*ex)*m+(4*ey)*m)");
                        const t = engine.renderAsString(value);
                        expect(t).toBe("5*m");
                    }
                    value.release();
                } finally {
                    engine.popDirective();
                }
            }
        } finally {
            engine.release();
        }
    });
    xit("3*x*m+4*y*m", () => {
        const engine: ExprEngine = create_engine();
        try {
            const sourceText = [`m=uom("meter")`, `r=3*x*m+4*y*m`, `abs(r)`].join("\n");
            const { trees, errors } = js_parse(sourceText);
            if (errors.length > 0) {
            }
            for (let i = 0; i < trees.length; i++) {
                const tree = trees[i];
                const value = engine.valueOf(tree);
                if (!value.isnil) {
                    // const s = engine.renderAsString(tree);
                    // expect(s).toBe("abs((3*ex)*m+(4*ey)*m)");
                    const t = engine.renderAsString(value);
                    expect(t).toBe("(24*x*y*m ** 2+9*x**2*m ** 2+16*y**2*m ** 2)**(1/2)");
                }
                value.release();
            }
        } finally {
            engine.release();
        }
    });
});
