import { U } from '../tree';
import { Adapter, SumTerm } from './Adapter';
import { Algebra, BasisBlade, MaskAndWeight, Metric } from './BasisBlade';
import { bitCount } from './bitCount';
import { Blade } from './Blade';
import { mustBeDefined } from './checks/mustBeDefined';
import { mustBeInteger } from './checks/mustBeInteger';
import { combine_mask_and_weights } from './combine_mask_and_weights';
import { create_mask_and_weight, create_scalar_mask_and_weight, create_vector_mask_and_weight } from './create_mask_and_weight';
import { gpE } from './gpE';
import { gpG } from './gpG';
import { gpL } from './gpL';
import { lcoE } from './lcoE';
import { lcoG } from './lcoG';
import { lcoL } from './lcoL';
import { rcoE } from './rcoE';
import { rcoG } from './rcoG';
import { rcoL } from './rcoL';

type METRIC<T> = T | T[] | Metric<T>;

/**
 * The JavaScript Bitwise operators use 32-bit signed numbers.
 * &  AND
 * |  OR
 * ~  NOT
 * ^  XOR
 * << Left shift (lhs is what is shifted, rhs is number of bits)
 * >> Right shift
 */
export function is_blade<T, K>(arg: unknown): arg is Blade {
    if (typeof arg === 'object') {
        const duck = arg as BasisBlade<T, K>;
        return typeof duck.scalarCoordinate === 'function';
    }
    else {
        return false;
    }
}

function is_metric<T>(arg: unknown): arg is Metric<T> {
    const duck = arg as Metric<T>;
    return typeof duck.getEigenMetric === 'function';
}

/**
 * Computes the dimension of the vector space from the metric.
 */
function dim<T, K>(metric: T | T[] | Metric<T>, field: Adapter<T, K>): number {
    if (Array.isArray(metric)) {
        return metric.length;
    }
    else if (is_metric(metric)) {
        return metric.getEigenMetric().length;
    }
    else if (field.isDimension(metric)) {
        return field.dim(metric);
    }
    else {
        throw new Error("metric is undefined");
    }
}

type Term<T, K> = { blade: BasisBlade<T, K>, weight: T }

function promote_blades_to_tree<T extends U, K extends U>(maws: MaskAndWeight<T>[], algebra: Algebra<T, K>, metric: METRIC<T>, labels: string[]): K {
    const field = algebra.field;
    if (maws.length > 0) {
        const terms = maws.map(function (maw) {
            return {
                blade: create_blade(maw.bitmap, algebra, metric, labels), weight: maw.weight
            };
        });
        return field.sum(terms);
    }
    else {
        return field.treeZero();
    }
}

/**
 * The bitmap of the maw (MaskAndWeight) MUST not be zero.
 * @param maw 
 * @param algebra 
 * @param metric 
 * @param labels 
 * @returns 
 */
function mask_and_weight_to_term<T extends U, K extends U>(maw: MaskAndWeight<T>, algebra: Algebra<T, K>, metric: METRIC<T>, labels: string[]): Term<T, K> {
    const blade = create_blade(maw.bitmap, algebra, metric, labels);
    return { blade, weight: maw.weight };
}

function promote_term_to_tree<T, K>(term: SumTerm<T, K>, adapter: Adapter<T, K>): K {
    return adapter.sum([term]);
}

function promote_mask_and_weight_to_tree<T extends U, K extends U>(maw: MaskAndWeight<T>, algebra: Algebra<T, K>, metric: METRIC<T>, labels: string[]): K {
    const adapter = algebra.field;
    if (maw.bitmap === 0) {
        return adapter.weightToTree(maw.weight);
    }
    else {
        const term = mask_and_weight_to_term(maw, algebra, metric, labels);
        return promote_term_to_tree(term, adapter);
    }
}

function add<T extends U, K extends U>(lhs: T | BasisBlade<T, K>, rhs: T | BasisBlade<T, K>, algebra: Algebra<T, K>, metric: METRIC<T>, labels: string[]): K | undefined {
    const field = algebra.field;
    if (field.isField(lhs) && is_blade(rhs)) {
        const rez: MaskAndWeight<T>[] = [];
        rez.push(create_scalar_mask_and_weight(lhs, field));
        rez.push(create_vector_mask_and_weight(rhs.bitmap, field));
        return promote_blades_to_tree(combine_mask_and_weights(rez, field), algebra, metric, labels);
    }
    else if (is_blade(lhs) && field.isField(rhs)) {
        const rez: MaskAndWeight<T>[] = [];
        rez.push(create_scalar_mask_and_weight(rhs, field));
        rez.push(create_vector_mask_and_weight(lhs.bitmap, field));
        return promote_blades_to_tree(combine_mask_and_weights(rez, field), algebra, metric, labels);
    }
    else {
        if (is_blade(lhs) && is_blade(rhs)) {
            const rez: MaskAndWeight<T>[] = [];
            rez.push(create_vector_mask_and_weight(lhs.bitmap, field));
            rez.push(create_vector_mask_and_weight(rhs.bitmap, field));
            return promote_blades_to_tree(combine_mask_and_weights(rez, field), algebra, metric, labels);
        }
        else {
            // We'll be using this function for operator overloading.
            return void 0;
        }
    }
}

function sub<T extends U, K extends U>(lhs: T | BasisBlade<T, K>, rhs: T | BasisBlade<T, K>, algebra: Algebra<T, K>, metric: METRIC<T>, labels: string[]): K | undefined {
    const field = algebra.field;
    if (field.isField(lhs) && is_blade(rhs)) {
        const rez: MaskAndWeight<T>[] = [];
        rez.push(create_scalar_mask_and_weight(lhs, field));
        rez.push(create_vector_mask_and_weight(rhs.bitmap, field).neg());
        return promote_blades_to_tree(combine_mask_and_weights(rez, field), algebra, metric, labels);
    }
    else if (is_blade(lhs) && field.isField(rhs)) {
        const rez: MaskAndWeight<T>[] = [];
        rez.push(create_scalar_mask_and_weight(field.neg(rhs), field));
        rez.push(create_vector_mask_and_weight(lhs.bitmap, field));
        return promote_blades_to_tree(combine_mask_and_weights(rez, field), algebra, metric, labels);
    }
    else {
        if (is_blade(lhs) && is_blade(rhs)) {
            const rez: MaskAndWeight<T>[] = [];
            rez.push(create_vector_mask_and_weight(lhs.bitmap, field));
            rez.push(create_vector_mask_and_weight(rhs.bitmap, field).neg());
            return promote_blades_to_tree(combine_mask_and_weights(rez, field), algebra, metric, labels);
        }
        else {
            // We'll be using this function for operator overloading.
            return void 0;
        }
    }
}

function mul<T extends U, K extends U>(lhs: T | BasisBlade<T, K>, rhs: T | BasisBlade<T, K>, algebra: Algebra<T, K>, metric: METRIC<T>, labels: string[]): K | undefined {
    const field = algebra.field;
    if (field.isField(lhs) && is_blade(rhs)) {
        const term: SumTerm<T, K> = { blade: rhs, weight: lhs };
        return promote_term_to_tree(term, field);
    }
    else if (is_blade(lhs) && field.isField(rhs)) {
        const term: SumTerm<T, K> = { blade: lhs, weight: rhs };
        return promote_term_to_tree(term, field);
    }
    else {
        if (is_blade(lhs) && is_blade(rhs)) {
            const B1 = create_mask_and_weight(lhs.bitmap, field.one, field);
            const B2 = create_mask_and_weight(rhs.bitmap, field.one, field);
            if (Array.isArray(metric)) {
                const B = gpL(B1, B2, metric, field);
                return promote_mask_and_weight_to_tree(B, algebra, metric, labels);
            }
            else if (is_metric(metric)) {
                const B = gpG(B1, B2, metric, field);
                const rez: MaskAndWeight<T>[] = [];
                for (let b = 0; b < B.length; b++) {
                    rez.push(B[b]);
                }
                return promote_blades_to_tree(combine_mask_and_weights(rez, field), algebra, metric, labels);
            }
            else {
                const B = gpE(B1, B2, field);
                return promote_mask_and_weight_to_tree(B, algebra, metric, labels);
            }
        }
        else {
            // We'll be using this function for operator overloading.
            return void 0;
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function div<T, K>(lhs: T | BasisBlade<T, K>, rhs: T | BasisBlade<T, K>, algebra: Algebra<T, K>): K | undefined {
    throw new Error(`Multivector division is not yet supported. ${lhs} / ${rhs}`);
}

/**
 * Returns the basis vector with index in the integer range [0 ... dim).
 * The bitmap is simply 1 shifted to the left by the index.
 */
function getBasisVector<T extends U, K extends U>(index: number, algebra: Algebra<T, K>, metric: METRIC<T>, labels: string[]): BasisBlade<T, K> {
    mustBeInteger('index', index);
    mustBeDefined('algebra', algebra);
    return create_blade(1 << index, algebra, metric, labels);
}

/**
 * The bitmap MUST not be zero.
 * @param bitmap
 * @param algebra 
 * @param metric 
 * @param labels 
 * @returns 
 */
export function create_blade<T extends U, K extends U>(bitmap: number, algebra: Algebra<T, K>, metric: METRIC<T>, labels: string[]): BasisBlade<T, K> {
    if (bitmap === 0) {
        const e = new Error("bitmap must be non-zero (without weights a scalar blade is ambiguous)");
        // console.lg(e.stack);
        throw e;
    }
    const field = algebra.field;
    const extractGrade = function (grade: number): K {
        // const bits = bitCount(bitmap);
        // console.lg(`bitmap=>${bitmap}, bitCount=${bits}`);
        if (bitCount(bitmap) === grade) {
            // console.lg(`extractGrade(${that}, grade) returning ${that}`);
            return field.bladeToTree(theBlade);
        }
        else {
            // console.lg(`extractGrade(${that}, grade) returning zero`);
            return field.treeZero();
        }
    };
    const theBlade: BasisBlade<T, K> = {
        get bitmap(): number {
            return bitmap;
        },
        get name(): string {
            return 'Blade';
        },
        add(rhs: BasisBlade<T, K>): K {
            return add(theBlade, rhs, algebra, metric, labels) as K;
        },
        sub(rhs: BasisBlade<T, K>): K {
            return sub(theBlade, rhs, algebra, metric, labels) as K;
        },
        isCons(): boolean {
            return false;
        },
        isNil(): boolean {
            return false;
        },
        mul(rhs: BasisBlade<T, K>): K {
            return mul(theBlade, rhs, algebra, metric, labels) as K;
        },
        lshift(rhs: BasisBlade<T, K>): K {
            const B1 = create_mask_and_weight(bitmap, field.one, field);
            const B2 = create_mask_and_weight(rhs.bitmap, field.one, field);
            if (Array.isArray(metric)) {
                const B = lcoL(B1, B2, metric, field);
                return promote_mask_and_weight_to_tree(B, algebra, metric, labels);
            }
            else if (is_metric(metric)) {
                const B = lcoG(B1, B2, <Metric<T>>metric, field);
                const rez: MaskAndWeight<T>[] = [];
                for (let b = 0; b < B.length; b++) {
                    rez.push(B[b]);
                }
                return promote_blades_to_tree(combine_mask_and_weights(rez, field), algebra, metric, labels);
            }
            else {
                const B = lcoE(B1, B2, field);
                return promote_mask_and_weight_to_tree(B, algebra, metric, labels);
            }
        },
        rshift(rhs: BasisBlade<T, K>): K {
            const B1 = create_mask_and_weight(bitmap, field.one, field);
            const B2 = create_mask_and_weight(rhs.bitmap, field.one, field);
            if (Array.isArray(metric)) {
                const B = rcoL(B1, B2, metric, field);
                return promote_mask_and_weight_to_tree(B, algebra, metric, labels);
            }
            else if (is_metric(metric)) {
                const rez: MaskAndWeight<T>[] = [];
                const B = rcoG(B1, B2, <Metric<T>>metric, field);
                for (let b = 0; b < B.length; b++) {
                    rez.push(B[b]);
                }
                return promote_blades_to_tree(combine_mask_and_weights(rez, field), algebra, metric, labels);
            }
            else {
                const B = rcoE(B1, B2, field);
                return promote_mask_and_weight_to_tree(B, algebra, metric, labels);
            }
        },
        scp(rhs: BasisBlade<T, K>): K {
            // console.lg(`BasisBlade.__vbar__(lhs=>${theBlade}, rhs=>${rhs})`);
            // Use the definition of the scalar product in terms of the geometric product.
            const adapter = algebra.field;
            const gp = theBlade.mul(rhs);
            // console.lg(`BasisBlade.__vbar__(lhs=>${that}, rhs=>${rhs}) => ${gp}`);
            // TODO: Why do we need the adapter? We know that we have a BasisBlade.
            // This changed because we don't have weights.
            return adapter.extractGrade(gp, 0);
        },
        wedge(rhs: BasisBlade<T, K>): K {
            const rez: MaskAndWeight<T>[] = [];
            const B1 = create_vector_mask_and_weight(bitmap, field);
            const B2 = create_vector_mask_and_weight(rhs.bitmap, field);
            const B = B1.wedge(B2);
            rez.push(B);
            // It seems that promotion is not required in this case.
            return promote_blades_to_tree(combine_mask_and_weights(rez, field), algebra, metric, labels);
        },
        contains(needle: U): boolean {
            return theBlade.equals(needle);
        },
        equals(other: U): boolean {
            if (theBlade === other) {
                return true;
            }
            else {
                if (is_blade(other)) {
                    return this.bitmap === other.bitmap;
                }
                else {
                    return false;
                }
            }
        },
        extractGrade,
        dual(): K {
            const n = dim(metric, algebra.field);
            const I = promote_mask_and_weight_to_tree(create_mask_and_weight((1 << n) - 1, field.one, field), algebra, metric, labels);
            return field.treeLco(field.bladeToTree(theBlade), I);
        },
        rev(): K {
            return promote_mask_and_weight_to_tree(create_vector_mask_and_weight(bitmap, field).reverse(), algebra, metric, labels);
        },
        scalarCoordinate(): T {
            if (bitmap === 0) {
                return field.one;
            }
            return field.zero;
        },
        asString(n: number, names: string[], wedge: string): string {
            if (names.length === n) {
                let bladePart = "";
                let i = 1;
                let x = bitmap;
                while (x !== 0) {
                    if ((x & 1) !== 0) {
                        if (bladePart.length > 0) bladePart += wedge;
                        // TODO: redundancy here with isUndefined and the explicit comparison to void 0. TypeScript prefers the latter.
                        // Can isUndefined be better typed? 
                        if (typeof names === 'undefined' || (names === null) || (names === void 0) || (i > names.length) || (names[i - 1] == null)) {
                            bladePart = bladePart + "e" + i;
                        }
                        else {
                            bladePart = bladePart + names[i - 1];
                        }
                    }
                    x >>= 1;
                    i++;
                }
                if (bladePart.length > 0) {
                    return bladePart;
                }
                else {
                    throw new Error(`Expecting something for bitmap ${bitmap}`);
                }
            }
            else if (Math.pow(2, n) === names.length) {
                return names[bitmap];
            }
            else {
                throw new Error();
            }
        },
        toInfixString(): string {
            const n = dim(metric, algebra.field);
            return theBlade.asString(n, labels, '^');
        },
        toListString(): string {
            const n = dim(metric, algebra.field);
            return theBlade.asString(n, labels, '^');
        },
        toLatexString(): string {
            const n = dim(metric, algebra.field);
            return theBlade.asString(n, labels, ' \\wedge ');
        },
        toString(): string {
            const n = dim(metric, algebra.field);
            return theBlade.asString(n, labels, '^');
        }
    };
    return theBlade;
}

/**
 * Verify that the basis vector labels are strings and that there are the correct number.
 */
function check_algebra_labels(name: string, labels: string[], n: number): void {
    // console.lg("check_algebra_labels", "name", JSON.stringify(name), "labels", JSON.stringify(labels), "n", n);
    if (labels) {
        if (Array.isArray(labels)) {
            for (let i = 0; i < labels.length; i++) {
                const label = labels[i];
                if (typeof label !== 'string') {
                    throw new Error(`${name}[${i}] must be a string.`);
                }
            }
            check_labels_length(labels, n);
        }
        else {
            throw new Error(`${name} must be a string[]`);
        }
    }
}

function check_labels_length(labels: string[], n: number): void | never {
    if (labels.length === n) {
        // The labels are describing only the basis vectors of the algebra.
    }
    else if (labels.length === Math.pow(2, n)) {
        // The labels are describing all the elements of the algebra.
    }
    else {
        throw new Error(`labels length must be compatible with the dimensionality of the vector space.`);
    }
}

export function createAlgebra<T extends U, K extends U>(metric: T | T[] | Metric<T>, field: Adapter<T, K>, labels: string[]): Algebra<T, K> {

    mustBeDefined('metric', metric);

    const n = dim(metric, field);

    mustBeDefined('field', field);

    check_algebra_labels('labels', labels, n);

    /**
     * A cache of the basis vectors.
     */
    const basisVectors: BasisBlade<T, K>[] = [];

    const that: Algebra<T, K> = {
        get field() {
            return field;
        },
        unit(index: number) {
            mustBeInteger('index', index);
            if (index >= 0 && index < n) {
                return basisVectors[index];
            }
            else {
                throw new Error(`index must be in range [0 ... ${n - 1})`);
            }
        },
        get units(): BasisBlade<T, K>[] {
            // For safety, return a copy of the cached array of basis vectors.
            return basisVectors.map(x => x);
        }
    };
    for (let i = 0; i < n; i++) {
        basisVectors[i] = getBasisVector(i, that, metric, labels);
    }
    return that;
}

