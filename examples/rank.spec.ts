import { check } from "./check";

describe("rank", function () {
    it("2x2", function () {
        check("rank([[a,b],[c,d]])", "2");
    });
    it("2x2", function () {
        check("rank([[1,0],[0,1]])", "2");
    });
    it("2x2", function () {
        check("rank([[1,0,0],[0,1,0],[0,0,1]])", "2");
    });
});
