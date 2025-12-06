import { Debugger } from "..";
import { com } from "../../command";

export abstract class BaseWriter {
    constructor(protected dbg: Debugger) {}
    abstract match(c: com): boolean;
    abstract write(c: com): void;
}