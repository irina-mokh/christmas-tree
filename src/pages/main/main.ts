import html from './main.html';
import './main.scss';
import { decorate, main } from '../../index';

export interface Item {
  name: string;
  num: string | number;
  count: string | number;
  year: string | number;
  shape: string;
  color: string;
  size: string;
  favorite: boolean;
  selected: Boolean;
}

enum Sort {
  none = '',
  name = 'sort-by-name-direct',
  nameRev = 'sort-by-name-reverse',
  year = 'sort-by-year-direct',
  yearRev = 'sort-by-year-reverse',
}
/*
const defaultFilter = {
  sort = Sort,
  favorite: boolean;
  amount: Range;
  year: Range;
  shape: string[];
  color: string[];
  size: string[];
}

enum Shape { 
  ball = 'shape-ball', 
  snowflake = 'shape-snowflake', 
  bell = 'shape-bell', 
  cone = 'shape-cone', 
  figurine ='shape-figurine'
};
enum Color { 
  red ='color-red', 
  blue = 'color-blue', 
  green = 'color-green', 
  yellow = 'color-yellow'
};
enum Size {
  small = 'small', 
  medium = 'medium', 
  big = 'big'
};
*/
type Range = {
  min: number;
  max: number;
};

interface IFilter {
  sort: string;
  favorite: boolean;
  amount: Range;
  year: Range;
  shape: string[];
  color: string[];
  size: string[];
}

interface IRangeInput extends HTMLInputElement {
  min: string;
  max: string;
  elem: HTMLElement;
  thumb: HTMLElement;
}

//let favorite: Item[];
const MAX_FVRTS: number = 20;

function renderErrorMsg(msg: string, evt: MouseEvent) {
  let popup: HTMLElement = document.querySelector('.error-popup');
  popup.classList.add('error-popup_active');
  popup.innerHTML = msg;
  popup.style.top = `${evt.pageY}px`;
  popup.style.left = `${evt.pageX}px`;
  setTimeout(() => {
    popup.classList.remove('error-popup_active');
  }, 1000);
}

// range bars
class RangeBar {
  fieldset: HTMLElement;
  inputLeft: IRangeInput;
  inputRight: IRangeInput;
  thumbLeft: HTMLElement;
  thumbRight: HTMLElement;
  range: HTMLElement;
  minEl: HTMLElement;
  maxEl: HTMLElement;

  constructor(fieldset: HTMLElement) {
    (this.fieldset = fieldset),
      (this.inputLeft = fieldset.querySelector('.range_start')),
      (this.inputLeft.elem = fieldset.querySelector('.min'));
    this.inputLeft.thumb = fieldset.querySelector('.thumb_left');

    this.inputRight = fieldset.querySelector('.range_end');
    this.inputRight.elem = fieldset.querySelector('.max');
    this.inputRight.thumb = fieldset.querySelector('.thumb_right');
    this.range = fieldset.querySelector('.slider__track_active');
  }

  setValue(input: IRangeInput) {
    let _this: IRangeInput = input,
      min = parseInt(_this.min),
      max = parseInt(_this.max);
    let percent = ((+_this.value - min) / (max - min)) * 100;

    if (input == this.inputLeft) {
      _this.value = '' + Math.min(parseInt(_this.value), parseInt(this.inputRight.value) - 1);

      input.thumb.style.left = percent + '%';
      this.range.style.left = percent + '%';
    } else if (input == this.inputRight) {
      _this.value = '' + Math.max(parseInt(_this.value), parseInt(this.inputLeft.value) + 1);
      input.thumb.style.right = 100 - percent + '%';
      this.range.style.right = 100 - percent + '%';
    }
    input.elem.innerHTML = _this.value;
  }
  update() {
    this.setValue(this.inputLeft);
    this.setValue(this.inputRight);
  }
  run() {
    this.setValue(this.inputLeft);
    this.setValue(this.inputRight);

    setListeners(this.inputLeft);
    setListeners(this.inputRight);

    this.inputLeft.addEventListener('input', () => {
      this.setValue(this.inputLeft);
    });

    this.inputRight.addEventListener('input', () => {
      this.setValue(this.inputRight);
    });

    function setListeners(item: IRangeInput) {
      item.addEventListener('mouseover', () => {
        item.thumb.classList.add('thumb_hover');
      });
      item.addEventListener('mouseout', () => {
        item.thumb.classList.remove('thumb_hover');
      });
      item.addEventListener('mousedown', () => {
        item.thumb.classList.add('thumb_active');
      });
      item.addEventListener('mouseup', () => {
        item.thumb.classList.remove('thumb_active');
      });
    }
  }
}

export class Decor {
  name: string;
  num: string | number;
  count: string | number;
  year: string | number;
  shape: string;
  color: string;
  size: string;
  favorite: boolean;
  btn: HTMLElement;
  selected: Boolean;
  card: HTMLElement;

  constructor(data: Item) {
    this.name = data.name;
    this.num = data.num;
    this.count = data.count;
    this.year = data.year;
    this.shape = data.shape;
    this.color = data.color;
    this.size = data.size;
    this.favorite = data.favorite;
    this.selected = data.selected;
  }

  changeDataSelected(status: boolean) {
    let currentItem = this;
    let index: number = main.data.findIndex((item) => {
      if (item.num === currentItem.num) {
        return item;
      }
    });
    main.data[index].selected = status;
  }

  addChosen(evt: MouseEvent) {
    if (main.chosen.length < MAX_FVRTS) {
      this.selected = true;
      main.chosen.push(this);
      main.updateChosenAmount();
      this.card.classList.toggle('decor_selected');
      this.changeDataSelected(true);
    }
    if (main.chosen.length === MAX_FVRTS) {
      renderErrorMsg('There is maximum for favorite decorations', evt);
    }
  }

  removeChosen() {
    this.selected = false;
    main.chosen.splice(
      main.chosen.findIndex((item) => {
        item.num == this.num;
      }),
      1
    );
    main.updateChosenAmount();
    this.card.classList.toggle('decor_selected');
    this.changeDataSelected(false);
  }

  render() {
    const template = document.querySelector('.decor');
    const card = template.cloneNode(true) as HTMLElement;
    this.card = card;

    card.classList.remove('decor-template');

    this.btn = card.querySelector('.decor__fvrt');
    if (this.favorite) {
      this.btn.classList.add('decor__fvrt_active');
    }
    if (this.selected) {
      this.card.classList.add('decor_selected');
    }
    card.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.selected ? this.removeChosen() : this.addChosen(evt);
    });

    card.querySelector('.decor__title').innerHTML = this.name.charAt(0).toUpperCase() + this.name.slice(1);

    (card.querySelector('.decor__img') as HTMLImageElement).src = `../../assets/toys/${this.num}.png`;
    card.querySelector('.decor__amount').innerHTML = '' + this.count;
    card.querySelector('.decor__color').classList.add(`decor__color_${this.color}`);
    (
      card.querySelector('.decor__shape') as HTMLElement
    ).style.backgroundImage = `url("../../assets/icons/shape/${this.shape}.svg")`;
    card.querySelector('.decor__year').innerHTML = '' + this.year;
    card.querySelector('.decor__size').innerHTML = this.size;

    return card;
  }
}

export class Main {
  data: Item[];
  filter: IFilter;
  filteredData: Item[];
  search: HTMLInputElement;
  chosen: Item[];
  constructor(data: Item[]) {
    this.data = data;
    this.search = document.querySelector('.search__input');
    this.chosen = [];
    //this.filter = JSON.parse(window.localStorage.getItem(filter)) ||null;
  }

  async render() {
    return html;
  }

  async filterData(inputData: Item[]) {
    await this.getFilterData();

    if (this.filter.favorite) {
      inputData = this.data.filter((item) => {
        if (item.favorite === true) {
          return item;
        }
      });
    }
    this.filteredData = inputData.filter((item) => {
      if (
        this.filter.color.includes(item.color) &&
        this.filter.shape.includes(item.shape) &&
        this.filter.size.includes(item.size) &&
        this.filter.amount.min <= +item.count &&
        this.filter.amount.max >= +item.count &&
        this.filter.year.min <= +item.year &&
        this.filter.year.max >= +item.year
      ) {
        return item;
      }
    });

    if (this.filter.sort) {
      this.sortData();
    }
  }

  sortData() {
    switch (this.filter.sort) {
      case 'sort-by-name-direct':
        this.filteredData.sort(function (a, b) {
          return a.name.localeCompare(b.name);
        });
        break;
      case 'sort-by-name-reverse':
        this.filteredData.sort((a, b) => {
          return b.name.localeCompare(a.name);
        });
        break;
      case 'sort-by-year-direct':
        this.filteredData.sort((a, b) => {
          return +a.year - +b.year;
        });
        break;
      case 'sort-by-year-reverse':
        this.filteredData.sort((a, b) => {
          return +b.year - +a.year;
        });
        break;
    }
  }

  async renderDecors(data = this.data) {
    //await this.filterData();
    const list: HTMLElement = document.querySelector('.main__decor-list');

    document.querySelectorAll('.decor:not(.decor-template)').forEach((item) => {
      item.remove();
    });
    if (this.filteredData.length === 0) {
      list.innerHTML = '';
      let result: HTMLElement = document.createElement('li');
      result.style.cssText = `margin: 10px auto; list-style: none;`;
      result.innerHTML = `No results found. Try to change filter`;
      list.append(result);
    }
    for (let i = 0; i < data.length; i++) {
      let decor = new Decor(data[i]);
      list.appendChild(decor.render());
    }
  }

  async run() {
    this.search = document.querySelector('.search__input');

    await this.filterData(this.data);
    this.renderDecors(this.data);
    //this.getFavorite();
    this.updateChosenAmount();

    //range bars
    let amountBar = new RangeBar(document.querySelector('.filter__amount'));
    let yearBar = new RangeBar(document.querySelector('.filter__year'));
    amountBar.run();
    yearBar.run();

    let decorateBtn = document.querySelector('.btn_decorate');

    // filter listener
    const form: HTMLFormElement = document.querySelector('.filter');
    form.addEventListener('change', async () => {
      await this.filterData(this.data);
      this.renderDecors(this.filteredData);
    });

    form.addEventListener('reset', () => {
      setTimeout(() => {
        main.renderDecors(this.data);
        amountBar.update();
        yearBar.update();
      }, 0);
    });

    // search
    this.search.addEventListener('input', async () => {
      let output: Item[] = await this.searchItems();
      this.renderDecors(output);
    });

    decorateBtn.addEventListener('click', () => {
      window.localStorage.setItem('chosen', JSON.stringify(this.chosen));
      window.localStorage.setItem('data', JSON.stringify(this.data));
    });
    /*
    window.addEventListener('beforeunload', () =>{
      window.localStorage.setItem('favorite', JSON.stringify(favorite));
      window.localStorage.setItem('data', JSON.stringify(this.data))
    })

    //save filter to local storage
    window.localStorage.setItem('filter', JSON.stringify(this.filter));
    */
  }

  updateChosenAmount() {
    let chosenAmount: HTMLElement = document.querySelector('.chosen-amount');
    chosenAmount.innerHTML = '' + this.chosen.length;
  }

  async searchItems() {
    let searchRequest = this.search.value;
    let result: Item[] = this.filteredData.filter((item) => {
      if (item.name.includes(searchRequest.toLowerCase())) {
        return item;
      }
    });
    return result;
  }

  async getFilterData() {
    let shapes: string[] = [];

    document.querySelectorAll('.shape .checkbox:checked').forEach((item: HTMLElement) => {
      shapes.push(item.getAttribute('name'));
    });

    let colors: string[] = [];
    document.querySelectorAll('.color .checkbox:checked').forEach((item) => {
      colors.push(item.getAttribute('name'));
    });

    let sizes: string[] = [];
    document.querySelectorAll('.size .checkbox:checked').forEach((item) => {
      sizes.push(item.getAttribute('name'));
    });

    let filter: IFilter = {
      sort: (document.querySelector('.sort__list') as HTMLInputElement).value,
      favorite: (document.querySelector('#favorite-on') as HTMLInputElement).checked,
      amount: {
        min: parseInt((document.querySelector('#amount-start') as HTMLInputElement).value),
        max: parseInt((document.querySelector('#amount-end') as HTMLInputElement).value),
      },
      year: {
        min: parseInt((document.querySelector('#year-start') as HTMLInputElement).value),
        max: parseInt((document.querySelector('#year-end') as HTMLInputElement).value),
      },
      shape: shapes,
      color: colors,
      size: sizes,
    };
    this.filter = filter;
  }

  /*
  getFavorite() {
    //JSON.parse(window.localStorage.favorite) ||
    this.chosen = this.data.filter((item) => {
      if (item.favorite) {
        return item;
      }
    });
  }
  */
}
