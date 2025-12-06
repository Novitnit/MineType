import { command, commandSym, FUNCTION, functionStackType } from "../..";
import { baceExcute } from "../class";
import { nscore, score, ScoreConditionType } from "./scoreConditions";

type conditionType = ScoreConditionType;

export interface If_StemType {
    type: "if_stem";
    ifType : "score";
    if: {
        condition: conditionType;
        command: command;
    };
    else_if: {
        condition: conditionType;
        command: command;
    }[] | null;
    else?: command | null;
}

export class If extends baceExcute {
    [commandSym]: command = [];
    private stackTack: functionStackType;

    static Score = score;
    static nScore = nscore;

    constructor() {
        super();
        const stack = FUNCTION.functionStack[FUNCTION.functionStack.length - 1] as functionStackType;
        if (!stack) throw new Error("If must be in function");
        this.stackTack = stack;
    }

    if(condition: conditionType, fn: () => void) {
        FUNCTION.functionStack.push(this)
        fn();
        FUNCTION.functionStack.pop();
        this.stackTack[commandSym].push({
            type:"if_stem",
            ifType:condition.type,
            if:{
                condition,
                command: this[commandSym]
            },
            else_if: null,
            else: null,
        })

        return new Else_If();
    }
}

export class Else_If {
    [commandSym]: command = [];
    private stackTack: functionStackType;
    constructor() {
         const stack = FUNCTION.functionStack[FUNCTION.functionStack.length - 1] as functionStackType;
        if (!stack) throw new Error("If must be in function");
        this.stackTack = stack;
    }
    else_if(condition: conditionType, fn: () => void) {
        const ifStem = (this.stackTack[commandSym][this.stackTack[commandSym].length -1] as If_StemType)
        if(condition.type !== ifStem.ifType) throw new Error(`Else_If condition type must be same as If condition type (${ifStem.ifType})`)
        FUNCTION.functionStack.push(this)
        fn();
        FUNCTION.functionStack.pop();
        ifStem!.else_if ||= [];
        ifStem!.else_if.push({
            condition,
            command: this[commandSym]
        });
        return this as Omit<this, "as" | "at" | "in" | "if" >;
    }
    else(fn: () => void) {
        const ifStem = (this.stackTack[commandSym][this.stackTack[commandSym].length -1] as If_StemType)
        FUNCTION.functionStack.push(this)
        fn();
        FUNCTION.functionStack.pop();
        ifStem!.else = this[commandSym];
    }
}