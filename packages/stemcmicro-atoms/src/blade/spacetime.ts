/* eslint-disable @typescript-eslint/no-unused-vars */

import { U } from "@stemcmicro/tree";
import { create_int } from "../rat/Rat";
import { Adapter, SumTerm } from "./Adapter";
import { BasisBlade } from "./BasisBlade";
import { create_algebra, is_blade } from "./createAlgebra";

class Field implements Adapter<U, U> {
    get ε(): U {
        throw new Error("Method not implemented.");
    }
    get one(): U {
        throw new Error("Method not implemented.");
    }
    get zero(): U {
        throw new Error("Method not implemented.");
    }
    abs(arg: U): U {
        throw new Error("Method not implemented.");
    }
    add(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    sub(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    eq(lhs: U, rhs: U): boolean {
        throw new Error("Method not implemented.");
    }
    ne(lhs: U, rhs: U): boolean {
        throw new Error("Method not implemented.");
    }
    le(lhs: U, rhs: U): boolean {
        throw new Error("Method not implemented.");
    }
    lt(lhs: U, rhs: U): boolean {
        throw new Error("Method not implemented.");
    }
    ge(lhs: U, rhs: U): boolean {
        throw new Error("Method not implemented.");
    }
    gt(lhs: U, rhs: U): boolean {
        throw new Error("Method not implemented.");
    }
    max(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    min(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    mul(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    div(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    neg(arg: U): U {
        throw new Error("Method not implemented.");
    }
    asString(arg: U): string {
        throw new Error("Method not implemented.");
    }
    cos(arg: U): U {
        throw new Error("Method not implemented.");
    }
    isField(arg: U | BasisBlade<U, U>): arg is U {
        if (is_blade(arg)) {
            return true;
        } else {
            throw new Error(`isField ${arg} method not implemented.`);
        }
    }
    isOne(arg: U): boolean {
        throw new Error("Method not implemented.");
    }
    isZero(arg: U): boolean {
        throw new Error("Method not implemented.");
    }
    sin(arg: U): U {
        throw new Error("Method not implemented.");
    }
    sqrt(arg: U): U {
        throw new Error("Method not implemented.");
    }
    isDimension(arg: U): boolean {
        throw new Error("Method not implemented.");
    }
    dim(arg: U): number {
        throw new Error("Method not implemented.");
    }
    sum(terms: SumTerm<U, U>[]): U {
        throw new Error(`sum ${JSON.stringify(terms)} method not implemented.`);
    }
    extractGrade(arg: U, grade: number): U {
        throw new Error("Method not implemented.");
    }
    treeAdd(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    treeLco(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    treeMul(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    treeScp(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    treeSqrt(arg: U): U {
        throw new Error("Method not implemented.");
    }
    treeZero(): U {
        throw new Error("Method not implemented.");
    }
    weightToTree(arg: U): U {
        throw new Error("Method not implemented.");
    }
    scalarCoordinate(arg: U): U {
        throw new Error("Method not implemented.");
    }
    bladeToTree(blade: BasisBlade<U, U>): U {
        throw new Error("Method not implemented.");
    }
}
const field = new Field();
const algebra = create_algebra([create_int(-1), create_int(1), create_int(1), create_int(1)], field, ["et", "ex", "ey", "ez"]);
const units = algebra.units;
export const et = units[0];
export const ex = units[1];
export const ey = units[2];
export const ez = units[3];
