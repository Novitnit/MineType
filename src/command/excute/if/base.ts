import { command, commandSym, functionStackType } from "../..";
import { dimension, selector } from "../../Argument";

export class IF_base {
    [commandSym]: command = [];
    constructor(protected stackTrack:functionStackType, protected As:selector | null, protected At:selector | null, protected In:dimension | null){
        
    }
}