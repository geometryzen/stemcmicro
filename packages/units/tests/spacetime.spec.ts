import { check } from "../src/check";

xdescribe("spacetime", function () {
    it("001", function () {
        check("e1 * (2 * e1 + 3 * e2)", "2+3*e1^e2", { format: "Infix" });
        check("simplify(e1 * (2 * e1 + 3 * e2))", "2+3*e1^e2", { format: "Infix" }); // FIXME
    });
});
