import { check } from "./check";

describe("misc", function () {
    it("001", function () {
        check("mega * joule", "1000000*J");
        check("pi", "pi");
        check("e1 * (2 * e1 + 3 * e2)", "2+3*e1^e2");
        check("2.7 * kilo * volt/(milli * ampere)", "2700000.0*Ω");
        check("cos(x)**2+sin(x)**2", "cos(x)**2+sin(x)**2");
        // check("hilbert(3)", "[[1,1/2,1/3],[1/2,1/3,1/4],[1/3,1/4,1/5]]");
        // check("eigenval(hilbert(3))", "[[1.408319...,0.0,0.0],[0.0,0.122327...,0.0],[0.0,0.0,0.002687...]]");
        check("cross(ex,ey)", "ez");
    });
});
