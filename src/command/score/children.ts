import { Score, ScoreInternal } from ".";
import { selector } from "../Argument/selectors";
import { commandReturnType, commandSym, FUNCTION } from "..";

interface CommandScoreChange {
    type: "ScoreAdd" | "ScoreRemove" | "ScoreSet";
    score: Score;
    selector: selector;
    value: number;
}

interface CommandScoreReset {
    type: "ScoreReset";
    score: Score;
    selector: selector;
}

interface CommandScoreOperation {
    type: "ScoreOperation";
    operation: "+=" | "-=" | "*=" | "/=" | "%=" | "=" | "<" | ">" | "><";
    score1: Score;
    selector1: selector;
    score2: Score;
    selector2: selector;
}

interface CommandScoreEnable {
    type: "ScoreEnable";
    score: Score;
    selector: selector;
}

export type CommandScore =
    | CommandScoreChange
    | CommandScoreReset
    | CommandScoreOperation
    | CommandScoreEnable;

export const Parent = Symbol("ScoreTargetParent");
export const sel = Symbol("ScoreTargetSelector");

export class ScoreTarget {
    private [Parent]: Score;
    private [sel]: selector;
    constructor(
        parent: Score,
        selector: selector
    ) {
        this[Parent] = parent;
        this[sel] = selector;
    }

    private ScoreChange(type: CommandScoreChange["type"], value: number): commandReturnType {
        ScoreInternal.setUsed(this[Parent], true);
        const fn = FUNCTION.functionStack.at(-1);
        if (!fn) throw new Error("ScoreAdd used outside FUNCTION()");
        const result: CommandScoreChange = {
            type: type,
            score: this[Parent],
            selector: this[sel],
            value: value
        };
        (fn as any)[commandSym] ||= [];
        (fn as any)[commandSym].push(result);
        
        return {
            type: "commandReturnType",
            command: [result]
        }
    }

    private ScoreOperation(score: Score, selector: selector, operation: CommandScoreOperation["operation"]): commandReturnType {
        ScoreInternal.setUsed(this[Parent], true);
        const fn = FUNCTION.functionStack.at(-1);
        if (!fn) throw new Error("ScoreOperation used outside FUNCTION()");
        if (ScoreInternal.isUsed(score) === false) {
            console.error("\u001b[33mWarning: The Score used is not changed before. Did you forget to use it?\u001b[0m");
            ScoreInternal.setUsed(score, true);
        }
        const result: CommandScoreOperation = {
            type: "ScoreOperation",
            operation: operation,
            score1: this[Parent],
            selector1: this[sel],
            score2: score,
            selector2: selector
        };
        (fn as any)[commandSym].push(result);

        return {
            type: "commandReturnType",
            command: [result]
        };
    }

    add(value: number | { Score: Score; Selector: selector }): commandReturnType {
        if (typeof value === "number") {
            const result = this.ScoreChange("ScoreAdd", value);
            return result;
        }
        const result = this.ScoreOperation(value.Score, value.Selector, "+=");
        return result;

    }

    remove(value: number | { Score: Score; Selector: selector }): commandReturnType {
        if (typeof value === "number") {
            const result = this.ScoreChange("ScoreRemove", value);
            return result;
        }
        const result = this.ScoreOperation(value.Score, value.Selector, "-=");
        return result;
    }

    set(value: number): commandReturnType {
        const result = this.ScoreChange("ScoreSet", value);
        return result;
    }

    operation({ score, selector, operation }: { score: Score, selector: selector, operation: CommandScoreOperation["operation"] }): commandReturnType {
        const result = this.ScoreOperation(score, selector, operation);
        return result;
    }

    reset(): commandReturnType {
        ScoreInternal.setUsed(this[Parent], true);
        const fn = FUNCTION.functionStack.at(-1);
        if (!fn) throw new Error("ScoreReset used outside FUNCTION()");
        const result: CommandScoreReset = {
            type: "ScoreReset",
            score: this[Parent],
            selector: this[sel]
        };
        (fn as any)[commandSym].push(result);
        return {
            type: "commandReturnType",
            command: [result]
        };
    }

    enable(): commandReturnType {
        ScoreInternal.setUsed(this[Parent], true);
        const fn = FUNCTION.functionStack.at(-1);
        if (!fn) throw new Error("ScoreEnable used outside FUNCTION()");
        if (ScoreInternal.getType(this[Parent]) !== "trigger") throw new Error("ScoreEnable can only be used on 'trigger' type scores");
        const result: CommandScoreEnable = {
            type: "ScoreEnable",
            score: this[Parent],
            selector: this[sel]
        };
        (fn as any)[commandSym].push(result);
        return {
            type: "commandReturnType",
            command: [result]
        };
    }
}