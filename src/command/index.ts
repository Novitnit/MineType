import { CommandScore } from "./score/children";
export { Debugger } from './debug'

//FUNCTION type
export type FUNCTIONReturn = {
    (): void;
} & { id: number };

//command
type command = (
    |CommandScore

)[];

//function
export const allFunctions: FUNCTION[] = [];

export class FUNCTION {
    static nextId = 1;
    static functionStack: FUNCTION[] = [];

    id: number;
    commands: command = [];

    constructor(fn: () => void) {
        this.id = FUNCTION.nextId++;
        FUNCTION.functionStack.push(this);
        fn();
        FUNCTION.functionStack.pop();
        allFunctions.push(this);
    }

    addCommand(command:command){
        this.commands.push(...command);
    }

}

export { Score } from './score'
export { self, nearestPlayer, randomPlayer, allPlayers, regPlayer , allEntities } from './Argument/selectors'
