import { check } from "./check";

describe("hadamard", function () {
    it("001", function () {
        // FIXME: Something wrong here...
        check("hadamard([[a11,a12],[a21,a22]],[[b11,b21],[b21,b22]])", "[[a11*b11,a12*b21],[a21*b21,a22*b22]]");
    });
});
