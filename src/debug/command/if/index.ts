import { BaseWriter } from "..";
import { com, command } from "../../../command";
import { conditionType } from "../../../command/excute/if";
import { kName } from "../../../command/score";
import { scoreCondition } from "./score";

export class If_stem extends BaseWriter {

    match(c: com): boolean {
        return c.type === "if_stem";
    }

    write(c: com): void {
        if (c.type !== "if_stem") return;
        this.dbg.write(`If Statement ${c.As ? `as${c.As}` : ""}${c.At ? `at ${c.At} ` : ""}${c.In ? `in ${c.In} ` : ""}:`);
        this.dbg.indentLevel++;
        this.writeIf(c.if);
        this.writeElseIf(c.else_if || []);
        this.writeElse(c.else);
        this.dbg.indentLevel--;
    }

    readCondition(c: conditionType) {
        if (c.type === "score") return scoreCondition(c);
        return "Unknown Condition";
    }

    writeIf(o: {
        condition: conditionType;
        command: command;
    }) {
        this.dbg.write(`if ${this.readCondition(o.condition)}`);
        this.dbg.writeCommand(o.command);
    }

    writeElseIf(o: {
        condition: conditionType;
        command: command;
    }[]) {
        for (const elseif of o) {
            this.dbg.write(`else_if ${this.readCondition(elseif.condition)}`);
            this.dbg.writeCommand(elseif.command);
        }
    }

    writeElse(o: command | null | undefined) {
        if (o) {
            this.dbg.write(`else`);
            this.dbg.writeCommand(o);
        }
    }
}