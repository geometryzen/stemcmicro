import { check } from "../src/check";

xdescribe("ascii", function () {
    it("001", function () {
        check("mega * joule", "1000000 J", { format: "Ascii" });
        check("mega * joule", "1000000 J", { format: "Human" });
        check("mega * joule", "1000000*J", { format: "Infix" });
        check("mega * joule", "1000000J", { format: "LaTeX" });
        check("mega * joule", "(* 1000000 J)", { format: "SExpr" });
        // check("mega * joule", "1000000*J", { format: 'SVG' });
    });
});
