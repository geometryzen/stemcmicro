import { check } from "./check";

describe("isone", function () {
    it("rational", function () {
        check("typeof(0)", "rational");
        check("isone(0)", "false");
        check("isone(1)", "true");
        check("isone(-1)", "false");
    });
    it("number", function () {
        check("typeof(0.0)", "number");
        check("isone(0.0)", "false");
        check("isone(1.0)", "true");
        check("isone(-1.0)", "false");
    });
    it("boolean", function () {
        check("typeof(true)", "boolean");
        check("typeof(false)", "boolean");
        check("isone(true)", "false");
        check("isone(false)", "false");
    });
    it("nil", function () {
        check("typeof(nil)", "symbol"); // TODO: Needs evaluation?
        check("isone(nil)", "false");
    });
    it("string", function () {
        check('typeof("Hello")', "string");
        check('isone("Hello")', "false");
    });
    it("uom", function () {
        check("typeof(second)", "uom");
        check("isone(second)", "false");
    });
    it("blade", function () {
        check("typeof(ex)", "blade");
        check("isone(ex)", "false");
    });
    it("tensor", function () {
        check("typeof([0])", "tensor");
        check("isone([[0,0],[0,0]])", "false");
        check("isone([[1,0],[0,1]])", "true");
        check("isone([0])", "false");
        check("isone([1])", "true");
    });
    it("hyperreal", function () {
        check('typeof(infinitesimal("dx"))', "hyperreal");
        check('isone(infinitesimal("dx"))', "false");
    });
    it("map", function () {
        check("typeof({})", "map");
        check("isone({})", "false");
    });
    it("imu", function () {
        check("typeof(sqrt(-1))", "imu");
        check("isone(sqrt(-1))", "false");
    });
    it("cell", function () {
        check("typeof(atom(x))", "cell");
        check("isone(atom(x))", "false");
        check("isone(atom(0))", "false");
        check("isone(atom(1))", "true");
    });
});
