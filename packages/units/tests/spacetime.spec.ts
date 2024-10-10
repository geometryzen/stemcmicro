import { check } from "../src/check";

describe("spacetime", function () {
    it("001", function () {
        check("e1 * e1", "1", { format: "Infix" });
        check("e2 * e2", "1", { format: "Infix" });
        check("e1 * e2", "e1^e2", { format: "Infix" });
        check("e2 * e1", "-e1^e2", { format: "Infix" });
        check("e1 * (e1)", "1", { format: "Infix" });
        check("(e1) * e1", "1", { format: "Infix" });
        check("e2 * e2", "1", { format: "Infix" });
        check("e1 * e2", "e1^e2", { format: "Infix" });
        check("e2 * e1", "-e1^e2", { format: "Infix" });
        // Canonicalization should not allow the reordering of blades.
        // check("e1 * (e1+e2)", "e1*(e1+e2)", { format: "Infix" });
        // check("e1 * (2 * e1 + 3 * e2)", "2+3*e1^e2", { format: "Infix" });
        // check("simplify(e1 * (2 * e1 + 3 * e2))", "2+3*e1^e2", { format: "Infix" }); // FIXME
    });
});
