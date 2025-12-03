import { dimension, selector } from "../Argument";

class baceExcute {
    protected As: selector | null = null;
    protected At: selector | null = null;
    protected In: dimension | null = null;

    constructor() {}
    
    as (selector: selector) {
        this.As = selector;
    }

    at (selector: selector) {
        this.At = selector;
    }

    in (dimension: dimension) {
        this.In = dimension;
    }

}

export { baceExcute };