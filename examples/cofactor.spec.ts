import { check } from "./check";

describe("cofactor", function () {
    it("001", function () {
        check("cofactor([[a,b],[c,d]],1,2)", "-c");
        check("adj([[a,b],[c,d]])[2,1]", "-c");
    });
});
