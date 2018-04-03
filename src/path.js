import { VideoModal } from "./modal";
import * as SVG from "svg.js";
import { constrain, getTintedColor, dispatchEvent } from "./util";
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
    this.modal = new VideoModal();
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
      .loop(2, true);
  }

  onPathEnter(event) {
    // this.animation.stop();
    this.path.setAttribute("fill", this.tintedColor);
  }

  onPathLeave(event) {
    this.path.setAttribute("fill", this.color);
    this.clickedOnPath = false;
  }

  onPathMouseUp(event) {
    if (this.clickedOnPath) {
      // this.modal.showModal(this.id, this.data);
      dispatchEvent('pathClicked', {id: this.id});
      this.clickedOnPath = false;
    }
  }

  onPathMouseDown(event) {
    this.clickedOnPath = true;
  }
}
