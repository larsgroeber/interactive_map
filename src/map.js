import environment from "./environment";
import { styler, value, listen, pointer } from "popmotion";
import { constrain, getTintedColor } from "./util";
import { PathDataParser } from "./pathDataParser";
import { InteractivePath } from "./path";
import { VideoModal } from "./modal";

export class InteractiveMap {
  constructor(map) {
    this.mainElement = document.getElementById(environment.id);
    this.mapContainer = document.createElement("div");
    this.mapElement = document.createElement("object");
    this.spinner = document.getElementById("spinner");
    this.mapElement.data = map;
    this.svgElement = null;
    this.mapContainerStyle = null;
    this.originalStyle = null;
    this.svgStyler = null;
    this.paths = [];
    this.scale = 1;
    this.originalScale = 1;

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
      this.mapContainerStyle = window.getComputedStyle(this.mapContainer, null);
      this.originalStyle = {
        padding: this.mapContainerStyle["padding-top"],
        width: this.mapContainerStyle["width"]
      };
      this.onSvgLoad();
      this.spinner.style.display = "none";
    });
  }

  onSvgLoad() {
    this.svgStyler = styler(this.svgElement);
    const svgDocXY = this.setupSvgPosition();
    this.originalScale = this.scale;
    this.scaleSvg();

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

    // listen(this.svgElement, "wheel").start(e => {
    //   if (e.shiftKey) {
    //     e.preventDefault();
    //     const scroll = e.deltaY;
    //     if (scroll > 0) {
    //       this.scale -= 0.2;
    //     } else {
    //       this.scale += 0.2;
    //     }
    //     this.scale = constrain(
    //       this.originalScale,
    //       this.originalScale + 1,
    //       this.scale
    //     );
    //     this.scaleSvg();
    //   }
    // });

    // listen(this.svgElement, "touchstart")
    //   .filter(({ touches }) => touches.length >= 2)
    //   .start(() => {
    //     multitouch(svgDocXY.get()).start(svgDocXY);
    //   });
    //
    // listen(document.getElementById("zoom-out-btn"), "click").start(() => {
    //   this.scale = this.originalScale;
    //   this.scaleSvg();
    // });

    listen(document.getElementById("help-btn"), "click").start(() => {
      new VideoModal().showModal('info', {
        title: "Information",
        description: "Interaktive Karte des Campus Riedberg.<br><br>" + "<small>Entwickelt von Lars Gröber</small>"
      })
    })

    this.pathDataParser.getData().then(() => {

      this.setupPaths();
    });
  }

  setupSvgPosition() {
    const svgRect = this.svgElement.getBoundingClientRect();
    const mainWidth = this.mainElement.clientWidth;
    const mainHeight = this.mainElement.clientHeight;
    let x = 0;
    let y = 0;
    if (svgRect.height > mainHeight) {
      x = svgRect.x;
      y = svgRect.y - (svgRect.height - mainHeight) / 4;
    } else {
      this.scale = mainHeight / svgRect.height;
      this.scaleSvg();
      x =
        svgRect.x -
        (this.svgElement.getBoundingClientRect().width - mainWidth) / 2;
    }
    this.svgStyler.set({
      x: x,
      y: y
    });
    return value({ x: x, y: y }, this.svgStyler.set);
  }

  constrainXY(x, y, svgRect) {
    return {
      x: constrain(this.mainElement.clientWidth - svgRect.width, 0, x),
      y: constrain(this.mainElement.clientHeight - svgRect.height, 0, y)
    };
  }

  scaleSvg() {
    // hack because svg scaling/responsiveness is not well supported...
    const oldHeight = parseFloat(this.originalStyle.padding);
    const oldWidth = parseFloat(this.originalStyle.width);
    const height = oldHeight * this.scale;
    const width = oldWidth * this.scale;

    // this.svgStyler.set({
    //   x: this.svgStyler.get().x - (width - oldWidth),
    //   y: this.svgStyler.get().y - (height - oldHeight)
    // });
    this.mapContainer.style.paddingTop = height;
    this.mapContainer.style.width = width;
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
