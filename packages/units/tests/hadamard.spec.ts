import { check } from "../src/check";

describe("hadamard", function () {
    it("is the element-wise product", function () {
        check("hadamard([[a11,a12],[a21,a22]],[[b11,b12],[b21,b22]])", "[[a11*b11,a12*b12],[a21*b21,a22*b22]]");
    });
});
