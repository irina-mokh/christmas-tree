import html from './error404.html';

export class Error404 {
  constructor() {}

  async render() {
    return html;
  }

  async after_render() {}
}
