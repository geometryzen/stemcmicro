import { check } from "../src/check";

describe("arccos", function () {
    it("001", function () {
        check("arccos(1/2)", "1/3*pi");
    });
    it("002", function () {
        check("arccos(-2/sqrt(5))", "pi-arccos(2/(5**(1/2)))");
    });
    it("003", function () {
        check("arccos(-2/sqrt(5))*180/tau(1/2)", "180-180*arccos(2/(5**(1/2)))/pi");
    });
    it("004", function () {
        check("float(arccos(-2/sqrt(5))*180/tau(1/2))", "153.434949...");
    });
    it("005", function () {
        check("float(arccos(1/sqrt(5))*180/tau(1/2))", "63.434949...");
    });
});
