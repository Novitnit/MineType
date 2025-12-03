import { dimension, selector } from "../Argument";

class baceExcute {
    protected As: selector | null = null;
    protected At: selector | null = null;
    protected In: dimension | null = null;

    constructor() {}
    
    as (selector: selector) {
        this.As = selector;
        return this as Omit<this, "as" >;
    }

    at (selector: selector) {
        this.At = selector;
        return this as Omit<this, "at" >;
    }

    in (dimension: dimension) {
        this.In = dimension;
        return this as Omit<this, "in" >;
    }

}

export { baceExcute };