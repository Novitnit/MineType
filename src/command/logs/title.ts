import { allFunctions, commandSym, FUNCTION } from "..";
import { selector } from "../Argument/selectors";
import { TitleComponent } from "../Argument/title";
import { kUsed } from "../score";

type titleType = "title" | "subtitle" | "actionbar";

export interface CommandTitle {
    type: "Title";
    selector: selector;
    titleType: titleType;
    component: TitleComponent[];
}

export class Title {
  private inner: TitleComponentReturn;

  constructor(selector: selector) {
    this.inner = new TitleComponentReturn(selector);
  }

  subtitle(component: TitleComponent[]) {
    this.inner.subtitle(component);
  }

  title(component: TitleComponent[]) {
    this.inner.title(component);
  }

  actionbar(component: TitleComponent[]) {
    this.inner.actionbar(component);
  }
}

class TitleComponentReturn {
    constructor(private selctor:selector) {}

    private addToFunction(component: TitleComponent[], titleType: titleType) {
        const fn = FUNCTION.functionStack.at(-1) ?? allFunctions[0] as FUNCTION;
        component.map(comp => {
            if ("score" in comp) {
                if (comp.score.score[kUsed] === false) {
                    console.error("\u001b[33mWarning: The Score used is not changed before. Did you forget to use it?\u001b[0m");
                    comp.score.score[kUsed] = true;
                }
            }
        })
        const result: CommandTitle = {
            type: "Title",
            selector: this.selctor,
            titleType: titleType,
            component: component
        };
        (fn as any)[commandSym] ||= [];
        (fn as any)[commandSym].push(result);
    }

    subtitle(component: TitleComponent[]) {
        this.addToFunction(component, "subtitle");
    }

    title(component: TitleComponent[]) {
        this.addToFunction(component, "title");
    }

    actionbar(component: TitleComponent[]) {
        this.addToFunction(component, "actionbar");
    }
}

// new Title([{text: "Hello"}, {text: "World"}]);