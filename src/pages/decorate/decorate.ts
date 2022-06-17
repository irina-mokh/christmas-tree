import html from './decorate.html';
import './decorate.scss';
import { Item } from '../main/main';
/*
const enum LightsColor {
  white = 'white',
  blue = 'blue',
  red = 'red',
  yellow = 'yellow',
  multi = 'multicolor'
}
*/
const SNOWFLAKES_AMOUNT = 100;
const LIGHTS_AMOUNT = 200;

interface IConfig {
  bg: string;
  tree: string;
  snow: boolean;
  music: boolean;
  lights: boolean;
  lightsColor: string;
}

class Scene {
  config: IConfig;
  bg: HTMLImageElement;
  tree: HTMLImageElement;
  lights: HTMLElement;
  snow: HTMLElement;
  music: HTMLAudioElement;

  constructor(config: IConfig) {
    this.config = config;
    this.bg = document.querySelector('.scene__bg');
    this.tree = document.querySelector('.tree__img');
    this.snow = document.querySelector('.scene__snow');
    this.music = new Audio('../../assets/audio/audio.mp3');
    this.lights = document.querySelector('.tree__lights');
  }

  render() {
    this.bg.src = `../../assets/bg/${this.config.bg}.jpg`;
    this.tree.src = `../../assets/tree/${this.config.tree}.png`;

    if (this.config.snow) {
      this.snow.classList.remove('hide');
    } else {
      this.snow.classList.add('hide');
    }

    if (this.config.music) {
      this.music.play();
    } else {
      this.music.pause();
    }

    function colorize(item: Element, color: string) {
      item.className = '';
      item.classList.add('light', `light_${color}`);
    }

    if (this.config.lights) {
      this.lights.classList.remove('hide');
      let bulbs = this.lights.querySelectorAll('.light');

      if (this.config.lightsColor === 'multicolor') {
        for (let i = 0; i < bulbs.length; i++) {
          if (i % 4 == 0) {
            colorize(bulbs[i], 'blue');
          } else if (i % 3 == 0) {
            colorize(bulbs[i], 'red');
          } else if (i % 2 == 0) {
            colorize(bulbs[i], 'yellow');
          } else {
            colorize(bulbs[i], 'white');
          }
        }
      } else {
        bulbs.forEach((item) => {
          colorize(item, this.config.lightsColor);
        });
      }
    } else {
      this.lights.classList.add('hide');
    }
  }
}

class Toy {
  num: number | string;
  amount: number | string;
  card: HTMLElement;
  imgEl: HTMLImageElement;
  amountEl: HTMLElement;

  constructor(data: Item) {
    this.num = data.num;
    this.amount = data.count;
    this.imgEl = null;
    this.amountEl = null;
    this.card = null;
  }

  render() {
    const template = document.querySelector('.decor-template');
    const card = template.cloneNode(true) as HTMLElement;
    this.card = card;
    card.classList.remove('decor-template');

    this.amountEl = card.querySelector('.item__amount') as HTMLElement;
    this.imgEl = card.querySelector('.item__img') as HTMLImageElement;
    this.imgEl.src = `../../assets/toys/${this.num}.png`;

    this.updateCard();
    this.card = card;
    this.run();
    return card;
  }

  updateCard() {
    this.amountEl.innerHTML = '' + this.amount;
  }

  run() {
    let toy: HTMLElement = null;
    let tree: HTMLElement = document.querySelector('.scene__tree');

    function moveStart(e: MouseEvent) {
      if (this.amount > 0) {
        toy = (e.target as HTMLElement).cloneNode(true) as HTMLElement;
      }
    }

    function moveDragOver(e: Event) {
      e.preventDefault();
    }

    function moveDrop(e: MouseEvent) {
      let treeTop: number = tree.getBoundingClientRect().top + window.scrollY;
      let treeLeft: number = tree.getBoundingClientRect().left + window.scrollX;

      e.preventDefault();
      toy.classList.add('draggable');
      toy.style.width = '26px';
      toy.style.height = '26px';

      toy.style.left = e.pageX - treeLeft - 13 + 'px';
      toy.style.top = e.pageY - treeTop - 13 + 'px';

      if (this.amount > 0) {
        tree.append(toy);
        this.amount -= 0.5;
      }

      this.updateCard();
    }

    this.imgEl.addEventListener('dragstart', moveStart.bind(this));
    this.imgEl.addEventListener('dragend', moveDrop.bind(this), false);
    document.querySelector('.droppable').addEventListener('dragover', moveDragOver, false);
    //document.querySelector('.droppable').addEventListener('drop', moveDrop.bind(this), false);
  }
}

export class Decorate {
  data: Item[];
  scene: any;
  constructor() {
    this.data = null;
    this.scene = '';
  }

  renderCatalog() {
    this.data = JSON.parse(window.localStorage.chosen);
    if (this.data.length == 0) {
      this.data = JSON.parse(window.localStorage.data).slice(0, 20);
    }

    let itemTemplate: HTMLElement = document.querySelector('.decor-template');
    let list = document.querySelector('.catalog__list');
    for (let i = 0; i < this.data.length; i += 1) {
      let item = new Toy(this.data[i]);
      list.append(item.render());
      item.run();
    }
    itemTemplate.classList.add('hide');
  }

  async render() {
    return html;
  }

  async run() {
    this.scene = new Scene(this.getConfig());
    this.renderScene();

    // render catalog
    this.renderCatalog();
    // rerender scene
    document.querySelector('.decorate__settings').addEventListener('change', () => {
      this.renderScene();
    });

    // multiple snowflakes
    let flake: HTMLElement = document.querySelector('.snowflake');
    let snow: HTMLElement = document.querySelector('.scene__snow');
    for (let i = 1; i < SNOWFLAKES_AMOUNT; i += 1) {
      snow.append(flake.cloneNode(true));
    }

    // render lights
    let light: HTMLElement = document.querySelector('.light');
    let rope: HTMLElement = document.querySelector('.tree__lights');
    for (let i = 1; i < LIGHTS_AMOUNT; i += 1) {
      let item = light.cloneNode(true) as HTMLElement;
      rope.append(item);
    }

    // render amount on button
    let chosenAmount: HTMLElement = document.querySelector('.chosen-amount');
    chosenAmount.innerHTML = '' + this.data.length;
  }

  getConfig() {
    let config = {
      bg: document.querySelector('.config__background .radio:checked').id.slice(3),
      tree: document.querySelector('.config__tree .radio:checked').id.slice(5),
      snow: Boolean(document.querySelector('#snow:checked')),
      music: Boolean(document.querySelector('#music:checked')),
      lights: Boolean(document.querySelector('#lights:checked')),
      lightsColor: document.querySelector('.config__garland .radio:checked').id,
    };
    return config;
  }

  renderScene() {
    // render scene
    this.scene.config = this.getConfig();
    this.scene.render();
  }
}
