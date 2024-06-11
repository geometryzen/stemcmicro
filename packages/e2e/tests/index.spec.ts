import { em_parse } from "@stemcmicro/em-parse";
import { create_engine, ExprEngine } from "@stemcmicro/engine";
import { js_parse } from "@stemcmicro/js-parse";
import { assert_cons, assert_U } from "@stemcmicro/tree";
import { check } from "../src/check";

describe("broken", function () {
    it("001", function () {
        check("1/4", "1/4");
    });
});

describe("e2e", () => {
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
    it("factor", () => {
        const engine: ExprEngine = create_engine();
        try {
            const sourceText = [`factor(56)`].join("\n");
            const { trees, errors } = js_parse(sourceText);
            if (errors.length > 0) {
            }
            for (let i = 0; i < trees.length; i++) {
                const tree = trees[i];
                const value = engine.valueOf(tree);
                if (!value.isnil) {
                    const s = engine.renderAsString(tree);
                    expect(s).toBe("factor(56)");
                    const t = engine.renderAsString(value);
                    expect(t).toBe("2**3*7");
                }
                value.release();
            }
        } finally {
            engine.release();
        }
    });
    it("Uom ** 2", () => {
        const engine: ExprEngine = create_engine();
        try {
            const sourceText = [`m ** 2`].join("\n");
            const { trees, errors } = em_parse(sourceText);
            if (errors.length > 0) {
            }
            for (let i = 0; i < trees.length; i++) {
                const tree = trees[i];
                const value = engine.valueOf(tree);
                if (!value.isnil) {
                    const s = engine.renderAsString(tree);
                    expect(s).toBe("m**2");
                    const t = engine.renderAsString(value);
                    expect(t).toBe("m**2");
                }
                value.release();
            }
        } finally {
            engine.release();
        }
    });
    it("1/4", () => {
        const engine: ExprEngine = create_engine();
        try {
            const sourceText = [`1/4`].join("\n");
            const { trees, errors } = js_parse(sourceText);
            if (errors.length > 0) {
            }
            for (let i = 0; i < trees.length; i++) {
                const tree = trees[i];
                assert_U(tree);
                assert_cons(tree);
                const value = engine.valueOf(tree);
                if (!value.isnil) {
                    const s = engine.renderAsString(tree);
                    expect(s).toBe("1/4");
                    const t = engine.renderAsString(value);
                    expect(t).toBe("1/4");
                }
                value.release();
            }
        } finally {
            engine.release();
        }
    });
});
