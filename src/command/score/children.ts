import { Score } from ".";
import { selector } from "../Argument/selectors";
import { FUNCTION } from "..";

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

export class ScoreTarget {
    constructor(
        protected parent: Score,
        protected selector: selector
    ) { }

    private ScoreChange(type: CommandScoreChange["type"], value: number) {
        this.parent.used = true;
        const fn = FUNCTION.functionStack.at(-1);
        if (!fn) throw new Error("ScoreAdd used outside FUNCTION()");
        fn.commands.push({
            type: type,
            score: this.parent,
            selector: this.selector,
            value: value
        });
    }

    private ScoreOperation(score: Score, selector: selector, operation: CommandScoreOperation["operation"]) {
        this.parent.used = true;
        const fn = FUNCTION.functionStack.at(-1);
        if (!fn) throw new Error("ScoreOperation used outside FUNCTION()");
        score.used = true;
        fn.commands.push({
            type: "ScoreOperation",
            operation: operation,
            score1: this.parent,
            selector1: this.selector,
            score2: score,
            selector2: selector
        });
    }

    add(value: number | { Score: Score; Selector: selector }) {
        if (typeof value === "number") {
            this.ScoreChange("ScoreAdd", value);
            return;
        }
        this.ScoreOperation(value.Score, value.Selector, "+=");
    }

    remove(value: number | { Score: Score; Selector: selector }) {
        if (typeof value === "number") {
            this.ScoreChange("ScoreRemove", value);
            return;
        }
        this.ScoreOperation(value.Score, value.Selector, "-=");
    }

    set(value: number) {
        this.ScoreChange("ScoreSet", value);
    }

    operation({ score, selector, operation }: { score: Score, selector: selector, operation: CommandScoreOperation["operation"] }) {
        this.ScoreOperation(score, selector, operation);
    }

    reset() {
        this.parent.used = true;
        const fn = FUNCTION.functionStack.at(-1);
        if (!fn) throw new Error("ScoreReset used outside FUNCTION()");
        fn.commands.push({
            type: "ScoreReset",
            score: this.parent,
            selector: this.selector
        });
    }

    enable() {
        this.parent.used = true;
        const fn = FUNCTION.functionStack.at(-1);
        if (!fn) throw new Error("ScoreEnable used outside FUNCTION()");
        if (this.parent.type !== "trigger") throw new Error("ScoreEnable can only be used on 'trigger' type scores");
        fn.commands.push({
            type: "ScoreEnable",
            score: this.parent,
            selector: this.selector
        });
    }
}