
/**
 * A ... Z or a ... z
 */
export function is_alphabetic(str: string): boolean {
    if (str == null) {
        return false;
    }
    // console.lg(`is_alphabetic(str = ${JSON.stringify(str)}) length is ${str.length}`);
    // Check for non-alphabetic characters and space
    return str.search(/[^A-Za-z]/) === -1;
}
