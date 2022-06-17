export interface urlRequest {
  main: string;
  decorate: string;
}

export const Utils = {
  parseRequestURL: () => {
    const url: string = location.hash.slice(1).toLowerCase() || '/';

    const r: string[] = url.split('/');

    const request: urlRequest = {
      main: null,
      decorate: null,
    };

    request.main = r[1];
    request.decorate = r[2];

    return request;
  },

  /*
  getData: async() => {
    const response = await fetch('components/content/decorations.json');
    const items = await response.json();
    return items;
  },

  shuffle: async(array)=> {
    return array.sort(() => Math.random() - 0.5);
  },
   getRandomInt: async(max)=> {
    return Math.floor(Math.random() * max);
  },

  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  */
};

export default Utils;
