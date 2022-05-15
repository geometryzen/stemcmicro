import { defs } from './runtime/defs';

/*
  Clear all patterns
*/
export function clear_patterns() {
    defs.userSimplificationsInListForm = [];
    defs.userSimplificationsInStringForm = [];
}

export function patternsinfo() {
    let str = '';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const i of Array.from(defs.userSimplificationsInListForm)) {
        str += defs.userSimplificationsInListForm + '\n';
    }
    return str;
}
