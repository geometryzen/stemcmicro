import { check } from "../src/check";

xdescribe("sandbox", function () {
    it("001", function () {
        // check("1+x+x**2", "1+x+x**2");
        // check("x**2+x+1", "1+x+x**2");
        // check("abs(Ax*ex+Ay*ey)", "1");
        check("outer()", "1");
        check("outer(ex)", "ex");
        check("outer(ex,ey)", "ex^ey");
        check("outer(ex,ey,ez)", "ex^ey^ez");
    });
});
