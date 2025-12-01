import { FUNCTION } from "..";
import { selector } from "../Argument/selectors";

export interface CommandSay{
    type: "Say";
    message: string | selector;
}

export function say(...message: (string | selector)[]) {
    const fn = FUNCTION.functionStack.at(-1);
    if (!fn) throw new Error("say used outside FUNCTION()");
    fn.commands.push({
        type: "Say",
        message: message.map(msgPart => typeof msgPart === "string" ? msgPart : msgPart.toString()).join("")
    })
}