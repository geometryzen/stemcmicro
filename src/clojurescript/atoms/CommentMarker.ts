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
    isCons(): boolean {
        return false;
    }
    isNil(): boolean {
        return false;
    }
    pos?: number | undefined;
    end?: number | undefined;
}
