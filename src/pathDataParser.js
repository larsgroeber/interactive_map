import environment from './environment';

export class PathDataParser {
  constructor() {
    this.data = {};
  }

  getData() {
    this.data = require('./pathData.json');
    return Promise.resolve(this.data);
  }

  getId(id) {
    return this.data[id];
  }
}
