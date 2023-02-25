import { U } from "../tree/tree";

export class CommentMarker implements U {
    name = "CommentMarker";
    meta = 0;
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
    reset(meta: number): void {
        this.meta = meta;
    }
    pos?: number | undefined;
    end?: number | undefined;
}
