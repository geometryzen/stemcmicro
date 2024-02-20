import { check } from "./check";

describe("imu", function () {
    it("Euler's identity", function () {
        check("exp(sqrt(-1)*pi)+1", "0");
    });
    it("raised to integer powers", function () {
        check("sqrt(-1)**-1", "-i");
        check("sqrt(-1)**0", "1");
        check("sqrt(-1)**1", "i");
        check("sqrt(-1)**2", "-1");
        check("sqrt(-1)**3", "-i");
        check("sqrt(-1)**4", "1");
        check("sqrt(-1)**5", "i");
        check("sqrt(-1)**6", "-1");
        check("sqrt(-1)**7", "-i");
    });
    it("raised to fractional powers", function () {
        check("sqrt(-1)**(1/2)", "(-1)**(1/4)");
    });
});
