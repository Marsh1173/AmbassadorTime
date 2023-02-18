export interface IGrowlService {
  put_growl: (msg: string, type?: "bad" | "neutral" | "good") => void;
}

const GROWL_FADE_DURATION: number = 4;
const GROWL_COUNT_LIMIT: number = 3;

export class GrowlService {
  private growl_container: HTMLElement;

  constructor() {
    let growl_dom = document.getElementById("growl-dom");
    if (growl_dom) {
      this.growl_container = growl_dom;
    } else {
      throw new Error("Could not find growl dom!");
    }
  }

  readonly put_growl = (msg: string, type: "bad" | "neutral" | "good" = "neutral") => {
    let growl_component = document.createElement("div");
    growl_component.classList.add("growl");
    growl_component.classList.add(type);

    growl_component.style.animationDuration = GROWL_FADE_DURATION.toString() + "s";

    let growl_text_component = document.createElement("span");
    growl_text_component.innerText = msg;

    growl_component.appendChild(growl_text_component);
    this.growl_container.prepend(growl_component);

    while (this.growl_container.children.length > GROWL_COUNT_LIMIT && this.growl_container.lastChild) {
      this.growl_container.removeChild(this.growl_container.lastChild);
    }

    setTimeout(() => {
      growl_component.remove();
    }, GROWL_FADE_DURATION * 1000);
  };
}
