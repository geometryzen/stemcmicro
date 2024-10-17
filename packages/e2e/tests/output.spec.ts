import { create_engine, ExprEngine } from "@stemcmicro/engine";
import { js_parse } from "@stemcmicro/js-parse";

describe("output", () => {
    it("should render Alphax in SVG as &alpha; and x embedded in SVG", () => {
        const engine: ExprEngine = create_engine();
        try {
            const sourceText = [`Alphax`].join("\n");
            const { trees, errors } = js_parse(sourceText);
            if (errors.length > 0) {
            }
            for (let i = 0; i < trees.length; i++) {
                const tree = trees[i];
                const value = engine.valueOf(tree);
                if (!value.isnil) {
                    const s = engine.renderAsString(tree);
                    expect(s).toBe("Alphax");
                    const t = engine.renderAsString(value, { format: "SVG" });
                    expect(t.indexOf(">&Alpha;<") >= 0).toBe(true);
                    expect(t.indexOf(">x<") >= 0).toBe(true);
                    expect(t.indexOf(">&Alpha;<") < t.indexOf(">x<")).toBe(true);
                }
                value.release();
            }
        } finally {
            engine.release();
        }
    });
    it("should render Omegax in SVG as &Omega; and x embedded in SVG", () => {
        const engine: ExprEngine = create_engine();
        try {
            const sourceText = [`Omegax`].join("\n");
            const { trees, errors } = js_parse(sourceText);
            if (errors.length > 0) {
            }
            for (let i = 0; i < trees.length; i++) {
                const tree = trees[i];
                const value = engine.valueOf(tree);
                if (!value.isnil) {
                    const s = engine.renderAsString(tree);
                    expect(s).toBe("Omegax");
                    const t = engine.renderAsString(value, { format: "SVG" });
                    expect(t.indexOf(">&Omega;<") >= 0).toBe(true);
                    expect(t.indexOf(">x<") >= 0).toBe(true);
                    expect(t.indexOf(">&Omega;<") < t.indexOf(">x<")).toBe(true);
                }
                value.release();
            }
        } finally {
            engine.release();
        }
    });
    it("should render alphax in SVG as &alpha; and x embedded in SVG", () => {
        const engine: ExprEngine = create_engine();
        try {
            const sourceText = [`alphax`].join("\n");
            const { trees, errors } = js_parse(sourceText);
            if (errors.length > 0) {
            }
            for (let i = 0; i < trees.length; i++) {
                const tree = trees[i];
                const value = engine.valueOf(tree);
                if (!value.isnil) {
                    const s = engine.renderAsString(tree);
                    expect(s).toBe("alphax");
                    const t = engine.renderAsString(value, { format: "SVG" });
                    expect(t.indexOf(">&alpha;<") >= 0).toBe(true);
                    expect(t.indexOf(">x<") >= 0).toBe(true);
                    expect(t.indexOf(">&alpha;<") < t.indexOf(">x<")).toBe(true);
                }
                value.release();
            }
        } finally {
            engine.release();
        }
    });
    it("should render omegax in SVG as &omega; and x embedded in SVG", () => {
        const engine: ExprEngine = create_engine();
        try {
            const sourceText = [`omegax`].join("\n");
            const { trees, errors } = js_parse(sourceText);
            if (errors.length > 0) {
            }
            for (let i = 0; i < trees.length; i++) {
                const tree = trees[i];
                const value = engine.valueOf(tree);
                if (!value.isnil) {
                    const s = engine.renderAsString(tree);
                    expect(s).toBe("omegax");
                    const t = engine.renderAsString(value, { format: "SVG" });
                    expect(t.indexOf(">&omega;<") >= 0).toBe(true);
                    expect(t.indexOf(">x<") >= 0).toBe(true);
                    expect(t.indexOf(">&omega;<") < t.indexOf(">x<")).toBe(true);
                }
                value.release();
            }
        } finally {
            engine.release();
        }
    });
    it("should render thetax in SVG as &theta; and x embedded in SVG", () => {
        const engine: ExprEngine = create_engine();
        try {
            const sourceText = [`thetax`].join("\n");
            const { trees, errors } = js_parse(sourceText);
            if (errors.length > 0) {
            }
            for (let i = 0; i < trees.length; i++) {
                const tree = trees[i];
                const value = engine.valueOf(tree);
                if (!value.isnil) {
                    const s = engine.renderAsString(tree);
                    expect(s).toBe("thetax");
                    const t = engine.renderAsString(value, { format: "SVG" });
                    expect(t.indexOf(">&theta;<")).toBe(118);
                    expect(t.indexOf(">x<")).toBe(240);
                    expect(t).toBe(
                        "<svg height='44'width='42'><text style='font-family:\"Times New Roman\";font-size:24px;font-style:italic;' x='10' y='26'>&theta;</text><text style='font-family:\"Times New Roman\";font-size:18px;font-style:italic;' x='23.7890625' y='33.9453125'>x</text></svg>"
                    );
                }
                value.release();
            }
        } finally {
            engine.release();
        }
    });
});
