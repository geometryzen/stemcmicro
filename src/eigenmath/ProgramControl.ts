export interface ProgramControl {
    getDirective(directive: number): number;
    pushDirective(directive: number, value: number): void;
    popDirective(): void;
}