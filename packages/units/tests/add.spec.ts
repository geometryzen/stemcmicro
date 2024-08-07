import { check } from "../src/index";

describe("add", function () {
    it("Blade, Blade", function () {
        check("ex + ex", "2*ex");
        check("ex + ey", "ex+ey");
    });
    it("Flatten", function () {
        check("(a+b)+c", "a+b+c");
        check("a+(b+c)", "a+b+c");
        check("(a-b)-c", "a-b-c");
    });
    xit("Probe", function () {
        check("a+b*(c+d)", "a+b*c+b*d");
    });
    xit("Probe", function () {
        check("a+b*(c+(d+e))", "a+b*c+b*d+b*e");
    });
    it("Rat+Boo", function () {
        check("2+true", `Operator '+' cannot be applied to types 'rational' and 'boolean'.`);
        check("2+false", `Operator '+' cannot be applied to types 'rational' and 'boolean'.`);
    });
    it("Boo+Rat", function () {
        check("true+2", `Operator '+' cannot be applied to types 'boolean' and 'rational'.`);
        check("false+2", `Operator '+' cannot be applied to types 'boolean' and 'rational'.`);
    });
    it("Flt+Boo", function () {
        check("2.0+true", `Operator '+' cannot be applied to types 'number' and 'boolean'.`);
        check("2.0+false", `Operator '+' cannot be applied to types 'number' and 'boolean'.`);
    });
    it("Boo+Flt", function () {
        check("true+2.0", `Operator '+' cannot be applied to types 'boolean' and 'number'.`);
        check("false+2.0", `Operator '+' cannot be applied to types 'boolean' and 'number'.`);
    });
    it("Rat+Flt", function () {
        check("2+3.0", "5.0");
    });
    it("Flt+Rat", function () {
        check("2.0+3", "5.0");
    });
});
