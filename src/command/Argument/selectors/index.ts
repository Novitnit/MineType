import { SelectorArguments } from "./argument-types";

export type SelectorKind = "@p" | "@r" | "@a" | "@e" | "@s";

export interface SelectorArgumentsMap {
  "@p": SelectorArguments;      
  "@r": SelectorArguments;       
  "@a": SelectorArguments;
  "@e": SelectorArguments;
  "@s": {};                   
}

export type Selector<K extends SelectorKind> = {
  kind: K;
  arguments?: SelectorArgumentsMap[K];
};