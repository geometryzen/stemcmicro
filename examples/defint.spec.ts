import { check } from "./check";

describe("defint", function () {
    xit("001", function () {
        check("defint((1+cos(theta)**2)*sin(theta), theta, 0, pi, phi, 0, 2, pi)", "16/3*pi");
    });
});
