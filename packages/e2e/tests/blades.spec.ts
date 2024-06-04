import { check } from "./check";

describe("blades", function () {
    it("inner", function () {
        check("ex|ex", "1");
        check("ex|ey", "0");
        check("ex|ez", "0");
        check("ey|ex", "0");
        check("ey|ey", "1");
        check("ey|ez", "0");
        check("ez|ex", "0");
        check("ez|ey", "0");
        check("ez|ez", "1");
    });
    it("square", function () {
        check("(Ax*ex+Ay*ey+Az*ez)*(Ax*ex+Ay*ey+Az*ez)", "Ax**2+Ay**2+Az**2");
    });
    it("outer", function () {
        check("ex^ex", "0");
        check("ex^ey", "ex^ey");
        check("ex^ez", "ex^ez");
        check("ey^ex", "-ex^ey");
        check("ey^ey", "0");
        check("ey^ez", "ey^ez");
        check("ez^ex", "-ex^ez");
        check("ez^ey", "-ey^ez");
        check("ez^ez", "0");
    });
    it("cross", function () {
        check("cross(ex,ex)", "0");
        check("cross(ex,ey)", "ez");
        check("cross(ex,ez)", "-ey");
        check("cross(ey,ex)", "-ez");
        check("cross(ey,ey)", "0");
        check("cross(ey,ez)", "ex");
        check("cross(ez,ex)", "ey");
        check("cross(ez,ey)", "-ex");
        check("cross(ez,ez)", "0");
    });
    it("lco", function () {
        check("ex<<ex", "1");
        check("ex<<ey", "0");
        check("ex<<ez", "0");
        check("ey<<ex", "0");
        check("ey<<ey", "1");
        check("ey<<ez", "0");
        check("ez<<ex", "0");
        check("ez<<ey", "0");
        check("ez<<ez", "1");
    });
    it("rco", function () {
        check("ex>>ex", "1");
        check("ex>>ey", "0");
        check("ex>>ez", "0");
        check("ey>>ex", "0");
        check("ey>>ey", "1");
        check("ey>>ez", "0");
        check("ez>>ex", "0");
        check("ez>>ey", "0");
        check("ez>>ez", "1");
    });
});
