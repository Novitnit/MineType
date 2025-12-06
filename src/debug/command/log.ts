import { BaseWriter } from ".";
import { Debugger } from "..";
import { com } from "../../command";

export class Say extends BaseWriter {
    match(c: com): boolean {
        return c.type === "Say";
    }
    write(c: com): void {
        if (c.type !== "Say") return;
        this.dbg.write(`say ${c.message}`);
    }
}

export class Title extends BaseWriter {
    match(c: com): boolean {
        return c.type === "Title";
    }
    write(c: com): void {
        if (c.type !== "Title") return;
        this.dbg.write(`${c.titleType} ${c.selector} ${JSON.stringify(c.component)}`);
    }
}

export const logWriters = (k: Debugger) => [
    new Say(k),
    new Title(k),
];