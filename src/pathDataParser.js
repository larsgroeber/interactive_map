import environment from "./environment";

export class PathDataParser {
  constructor() {
    this.data = {};
  }

  getData() {
    const dataUrl = environment.dataUrl;
    return new Promise((res, rej) => {
      fetch(dataUrl).then(response => {
        return response.json()
      }).then(data => {
        this.data = data;
        res();
      })
    })
  }

  getId(id) {
    return this.data[id];
  }
}
