import { check } from "../src/check";

describe("broken", function () {
    it("Blade,(* ...)", function () {
        check("ex^(5*ey*kilogram)", "5*ex^ey*kg");
    });
    it("(* ...), Blade", function () {
        check("(5*ex*kilogram)^ey", "5*ex^ey*kg");
    });
});

describe("outer", function () {
    it("tensor,tensor", function () {
        check("outer([a,b,c],[x,y,z])", "[[a*x,a*y,a*z],[b*x,b*y,b*z],[c*x,c*y,c*z]]");
    });
    it("blade,blade", function () {
        check("outer(ex,ex)", "0");
        check("outer(ex,ey)", "ex^ey");
        check("outer(ex,ez)", "ex^ez");
        check("outer(ey,ex)", "-ex^ey");
        check("outer(ey,ey)", "0");
        check("outer(ey,ez)", "ey^ez");
        check("outer(ez,ex)", "-ex^ez");
        check("outer(ez,ey)", "-ey^ez");
        check("outer(ez,ez)", "0");
    });
    it("Blade,Rat", function () {
        check("outer(ex,1)", "ex");
    });
    it("Rat,Blade", function () {
        check("outer(1,ex)", "ex");
    });
    it("Blade,Flt", function () {
        check("outer(ex,1.0)", "1.0*ex");
    });
    it("Flt, Blade", function () {
        check("outer(1.0, ex)", "1.0*ex");
    });
    it("Blade,Uom", function () {
        check("outer(ex,kilogram)", "ex*kg");
    });
    it("Uom, Blade", function () {
        check("outer(kilogram, ex)", "ex*kg");
    });
    xit("Distribution", function () {
        check("ex^(5+ex)", "5*ex");
        check("ex^(5+ey)", "5*ex+ex^ey");
        check("(5+ex)^ex", "5*ex");
        check("(5+ey)^ex", "5*ex-ex^ey");
    });
    it("Association", function () {
        check("ex^5^ey", "5*ex^ey");
        check("ex^5^ex", "0");
    });
    it("Arity", function () {
        check("outer()", "1");
        check("outer(ex)", "ex");
        check("outer(ex,ey)", "ex^ey");
        check("outer(ex,ey,ez)", "ex^ey^ez");
    });
    it("Blade,(* ...)", function () {
        // Check that were not just handling binary multiplication...
        check("ex^(5*ey*kilogram)", "5*ex^ey*kg");
        check("ex^(5^ey^kilogram)", "5*ex^ey*kg");
        check("ex^(5*ey*kilogram)^ez", "5*ex^ey^ez*kg");
        check("(ex^ey)^(5^ez^kilogram)", "5*ex^ey^ez*kg");
    });
    it("(* ...), Blade", function () {
        // Check that were not just handling binary multiplication...
        check("(5*ex*kilogram)^ey", "5*ex^ey*kg");
        check("(5^ex^kilogram)^ey", "5*ex^ey*kg");
    });
});
