//import _ from 'lodash';
import "./styles.scss";
import Map from "./assets/map.svg";
import environment from "./environment";
import { styler, value, listen, pointer } from "popmotion";

const mainElement = document.getElementById(environment.id);
const mapContainer = document.createElement('div');
mapContainer.id = 'svg-container';
const mapElement = document.createElement("object");
mapElement.addEventListener("load", svgDoc => {
  const svg = mapElement.contentDocument.querySelector("svg");
  svg.id = "svg";
  mapContainer.appendChild(svg);
  mapElement.remove();
  onSvgLoad(svg);
});

function onSvgLoad(svg) {
  const svgStyler = styler(svg);
  const svgDocXY = value({ x: 0, y: 0 }, svgStyler.set);

  listen(svg, "mousedown touchstart").start(e => {
    const svgRect = svg.getBoundingClientRect();
    const containerRect = mapContainer.getBoundingClientRect();
    e.preventDefault();
    pointer(svgDocXY.get())
        .pipe(v => {
            return {
                x: constrain(mainElement.clientWidth - svg.scrollWidth, containerRect.x, v.x),
                y: constrain(mainElement.clientHeight - svg.scrollHeight, containerRect.y, v.y),
            }
        })
        .start(svgDocXY);
  });

  listen(document, "mouseup touchend").start(() => {
    svgDocXY.stop();
  });
}

function constrain(min, max, value) {
    return Math.min(max, Math.max(min, value));
}

mapElement.data = Map;
mapContainer.appendChild(mapElement);
mainElement.appendChild(mapContainer);
