import { Score } from ".";
import { selector } from "../Argument/selectors";
import { commandStack, stack } from "..";

export interface CommandScoreChange {
    type: "ScoreAdd" | "ScoreRemove" | "ScoreSet";
    score: Score;
    selector: selector;
    value: number;
}

export interface CommandScoreReset{
    type: "ScoreReset";
    score: Score;
    selector: selector;
}

export interface ScoreOperation{
    type: "ScoreOperation";
    operation: "+=" | "-=" | "*=" | "/=" | "%=" | "=" | "<" | ">" | "><";
    score1: Score;
    selector1: selector;
    score2: Score;
    selector2: selector;
} 

export type CommandScore = 
| CommandScoreChange 
| CommandScoreReset
| ScoreOperation;

export class ScoreTarget {
    constructor(
        private parent: Score,
        private selector: selector
    ) {}

    private ScoreChange(type: CommandScoreChange["type"], value: number) {
        this.parent.used = true;
        const Stack = stack[stack.length - 1] ?? 0;
        commandStack[Stack] ||= [];
        commandStack[Stack].push({
            type,
            score: this.parent,
            selector: this.selector,
            value
        });
    }

    private ScoreOperation(score: Score, selector: selector, operation: ScoreOperation["operation"]) {
        this.parent.used = true;
        const Stack = stack[stack.length - 1] ?? 0;
        score.used = true;
        commandStack[Stack] ||= [];
        commandStack[Stack].push({
            type: "ScoreOperation",
            score1: this.parent,
            selector1: this.selector,
            score2: score,
            selector2: selector,
            operation: operation
        });
    }

    add(value: number | {Score: Score; Selector: selector}) {
        if (typeof value === "number") {
            this.ScoreChange("ScoreAdd", value);
            return;
        }
        this.ScoreOperation(value.Score, value.Selector, "+=");
    }

    remove(value: number| {Score: Score; Selector: selector}) {
        if (typeof value === "number") {
            this.ScoreChange("ScoreRemove", value);
            return;
        }
        this.ScoreOperation(value.Score, value.Selector, "-=");
    }

    set(value: number) {
        this.ScoreChange("ScoreSet", value);
    }

    operation({score, selector, operation}: {score: Score, selector: selector, operation: ScoreOperation["operation"]}) {
        this.ScoreOperation(score, selector, operation);
    }

    reset() {
        this.parent.used = true;
        const Stack = stack[stack.length - 1] ?? 0;
        commandStack[Stack] ||= [];
        commandStack[Stack].push({
            type: "ScoreReset",
            score: this.parent,
            selector: this.selector
        });
    }
}