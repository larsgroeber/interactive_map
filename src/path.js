import { Modal } from "./modal";
import * as SVG from "svg.js";
import { constrain, getTintedColor } from "./util";
import { InteractivePath } from "./path";

export class InteractivePath {
  constructor(path, pathDataParser, svgElement) {
    this.path = path;
    this.id = path.getAttribute("id");
    this.svgPath = SVG.adopt(svgElement).select("path#" + this.id);
    this.color = path.getAttribute("style").slice(5);
    this.path.setAttribute("fill", this.color);
    this.path.setAttribute("style", "");
    this.data = pathDataParser.getId(this.id);
    this.animation = null;
    this.tintedColor = getTintedColor(this.color, 100);
    this.modal = new Modal();
    this.clickedOnPath = false;
    this.setup();
  }

  setup() {
    this.animate();

    this.path.addEventListener("mouseenter", this.onPathEnter.bind(this));

    this.path.addEventListener("mousedown", this.onPathMouseDown.bind(this));
    this.path.addEventListener("touchstart", this.onPathMouseDown.bind(this));
    this.path.addEventListener("mouseup", this.onPathMouseUp.bind(this));
    this.path.addEventListener("touchend", this.onPathMouseUp.bind(this));

    this.path.addEventListener("mouseleave", this.onPathLeave.bind(this));
  }

  animate() {
    this.animation = this.svgPath
      .animate()
      .attr({ fill: this.tintedColor })
      .loop(true, true);
  }

  onPathEnter(event) {
    this.animation.stop();
    this.path.setAttribute("fill", this.tintedColor);
  }

  onPathLeave(event) {
    this.path.setAttribute("fill", this.color);
    this.clickedOnPath = false;
  }

  onPathMouseUp(event) {
    if (this.clickedOnPath) {
      this.modal.showModal(this.id, this.data);
      this.clickedOnPath = false;
    }
  }

  onPathMouseDown(event) {
    this.clickedOnPath = true;
  }
}
