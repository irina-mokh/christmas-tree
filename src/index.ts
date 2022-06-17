'use strict';

import './scss/style.scss';

import { Start } from './pages/start';
import { Main } from './pages/main';
import { Decorate } from './pages/decorate';
import { Error404 } from './pages/error404';

import { Header } from './core/components/header';
import { Footer } from './core/components/footer';

import { Utils } from './core/utils/utils';
import { data } from './assets/data';
// import Types
import { urlRequest } from './core/utils/utils';

export const header = new Header();
export const footer = new Footer();
export const start = new Start();
export const main = new Main(data);
export const decorate = new Decorate();
export const error404 = new Error404();

interface content {
  render: Function;
  run: Function;
}

const routes: Record<string, any> = {
  '/': start,
  '/main': main,
  '/decorate': decorate,
};

export const router = async () => {
  let headerElem = document.querySelector('.header') as HTMLElement;
  let mainElem = document.querySelector('.main') as HTMLElement;
  let footerElem = document.querySelector('.footer') as HTMLElement;

  headerElem.innerHTML = await header.render();
  footerElem.innerHTML = await footer.render();
  await header.run();
  await footer.run();

  const request: urlRequest = Utils.parseRequestURL();
  const parsedURL: string =
    (request.main ? `/${request.main}` : '/') + (request.decorate ? `/${request.decorate}` : '');

  const page: content = routes[parsedURL] ? routes[parsedURL] : error404;
  mainElem.innerHTML = await page.render();

  await page.run();
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

console.log(`
Самооценка: 
165	баллов
	Вёрстка страниц приложения и навигация между ними +30
10	стартовая страница содержит название приложения и кнопку "Начать игру" или аналогичную. Выполняются требования к вёрстке +10
10	на странице с ёлкой есть меню с настройками, слоты с добавленными в избранное игрушками, ёлка. Выполняются требования к вёрстке +10
10	в header приложения есть навигация, которая позволяет с каждой страницы приложения перейти на две другие страницы +10
	Меню с настройками +50
	У пользователя есть возможность:
10	выбрать один из нескольких (минимум 8) фонов +10
10	выбрать одну из нескольких (минимум 4) ёлок +10
10	включить/отключить падающий снег +10
10	включить/отключить новогоднюю музыку +10
	выбранные настройки сохраняются в local storage и отображаются при перезагрузке страницы. Если музыка сохранилась включённой, она начинает играть при первом клике. Есть кнопка сброса настроек, которая очищает local storage +10
	Гирлянда +40
	Гирлянда реализуется средствами css без использования изображений
	Гирлянда на ёлку добавляется динамически средствами JavaScript (на кросс-чеке этот пункт не проверяется)
	У пользователя есть возможность:
20	добавить на ёлку мерцающую разноцветную гирлянду +20
10	выбрать один из нескольких (минимум 4) цветов лампочек гирлянды или оставить её разноцветной +10
10	внешний вид гирлянды соответствует предложенному образцу или является его улучшенной версией +10
	Игрушки в избранном +80
10	в слотах находятся игрушки, которые были добавлены в избранное на странице с игрушками +10
10	если в избранное не была добавлена ни одна игрушка, в слотах отображаются первые 20 игрушек коллекции исходных данных +10
10	игрушки из слотов с игрушками можно перетянуть на ёлку используя drag and drop +10
10	если в процессе перетягивания игрушку отпускают за пределами ёлки, она возвращается в свой слот +10
	повешенные на ёлку игрушки можно перетягивать в пределах ёлки +10
	повешенные на ёлку игрушки можно снимать с ёлки, при этом они возвращаются в свой слот +10
10	возле слота с каждой игрушкой указывается количество игрушек в слоте равное количеству экземпляров игрушки в массиве с исходными данными +10
5	когда игрушку "вешают на ёлку" количество игрушек в слоте уменьшается, когда игрушку "снимают с ёлки", количество игрушек в слоте увеличивается, когда все экземпляры игрушки помещаются на ёлку, отображается пустой слот +10
0	Доп функционал +20
`)

