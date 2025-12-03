import { commandReturnType, commandSym, FUNCTION } from "..";
import { selector } from "../Argument/selectors";

export interface CommandSay{
    type: "Say";
    message: string | selector;
}

export function say(...message: (string | selector)[]):commandReturnType {
    const fn = FUNCTION.functionStack.at(-1);
    if (!fn) throw new Error("say used outside FUNCTION()");

    const result: CommandSay = {
        type: "Say",
        message: message.map(msgPart => typeof msgPart === "string" ? msgPart : msgPart.toString()).join("")
    };
    (fn as any)[commandSym] ||= [];
    (fn as any)[commandSym].push(result);

    return {
        type: "commandReturnType",
        command: [result]
    }
}