import { U } from "math-expression-tree";

export class CommentMarker implements U {
    addRef(): void {
    }
    release(): void {
    }
    name = "CommentMarker";
    contains(needle: U): boolean {
        return needle instanceof CommentMarker;
    }
    equals(other: U): boolean {
        return other instanceof CommentMarker;
    }
    get iscons(): boolean {
        return false;
    }
    get isnil(): boolean {
        return false;
    }
    pos?: number | undefined;
    end?: number | undefined;
}
