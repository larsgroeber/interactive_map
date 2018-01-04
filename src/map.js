import environment from "./environment";
import { styler, value, listen, pointer } from "popmotion";
import { constrain, getTintedColor } from "./util";
import { PathDataParser } from "./pathDataParser";
import { InteractivePath } from "./path";

export class InteractiveMap {
  constructor(map) {
    this.mainElement = document.getElementById(environment.id);
    this.mapContainer = document.createElement("div");
    this.mapElement = document.createElement("object");
    this.mapElement.data = map;
    this.svgElement = null;
    this.paths = [];

    this.pathDataParser = new PathDataParser();

    this.setup();
  }

  setup() {
    this.mapContainer.appendChild(this.mapElement);
    this.mainElement.appendChild(this.mapContainer);
    this.mapContainer.id = "svg-container";
    this.mapElement.addEventListener("load", svgDoc => {
      this.svgElement = this.mapElement.contentDocument.querySelector("svg");
      this.svgElement.id = "svg";
      this.mapContainer.appendChild(this.svgElement);
      this.mapElement.remove();
      this.onSvgLoad();
    });
  }

  onSvgLoad() {
    const svgStyler = styler(this.svgElement);
    let scale = 1;
    const svgDocXY = value({ x: 0, y: 0 }, svgStyler.set);

    listen(this.svgElement, "mousedown touchstart").start(e => {
      const svgRect = this.svgElement.getBoundingClientRect();
      e.preventDefault();
      pointer(svgDocXY.get())
        .pipe(v => {
          return this.constrainXY(v.x, v.y, svgRect);
        })
        .start(svgDocXY);
    });

    listen(document, "mouseup touchend").start(() => {
      svgDocXY.stop();
    });

    listen(this.svgElement, "wheel").start(e => {
      const scroll = e.deltaY;
      if (scroll > 0) {
        scale -= 0.2;
      } else {
        scale += 0.2;
      }
      scale = constrain(1, 2, scale);
      svgStyler.set({ scale: scale });
    });

    listen(this.svgElement, "touchstart")
      .filter(({ touches }) => touches.length >= 2)
      .start(() => {
        multitouch(svgDocXY.get()).start(svgDocXY);
      });

    listen(document.getElementById('zoom-out-btn'), "click")
      .start(() => {
          scale = 1;
          svgStyler.set({ scale: scale })
      })

    this.pathDataParser.getData().then(() => {
      this.setupPaths();
    });
  }

  constrainXY(x, y, svgRect) {
    return {
      x: constrain(
        -(svgRect.width - (this.mainElement.clientWidth - Math.abs(svgRect.x))),
        -svgRect.x,
        x
      ),
      y: constrain(
        -(
          svgRect.height -
          (this.mainElement.clientHeight - Math.abs(svgRect.y))
        ),
        -svgRect.y,
        y
      )
    };
  }

  setupPaths() {
    const a = ["path", "polygon", "rect", "circle", "g"];

    let allObjects = [];

    for (let i of a) {
      allObjects = allObjects.concat(
        Array.prototype.slice.call(this.svgElement.getElementsByTagName(i), 0)
      );
    }

    this.paths = allObjects
      .filter(o => this.pathDataParser.getId(o.getAttribute("id")))
      .map(o => new InteractivePath(o, this.pathDataParser, this.svgElement));
  }
}
