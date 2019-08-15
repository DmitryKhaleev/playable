import {
  Application,
  utils,
  Texture,
  Sprite,
  BaseTexture,
  Text,
  Container
} from 'pixi.js';

import Tween from "./tweenjs.js";

import res from './resources';
import MainContainer from './maincontainer';

document.addEventListener("DOMContentLoaded", () => {
	let game = new Game();
	window.game = game;
});

class Game {
  constructor() {
    window.addEventListener("resize", () => {
  	  this.updateResoultion();
      this.onRotate();
    });
  
    this.emmiter = new utils.EventEmitter();

  	this.canvas = document.getElementById('canvas');
	  this.app = new Application({ view: this.canvas });

	  this.container = new MainContainer(this);
	  this.app.stage.addChild(this.container);
    this.updateResoultion();

    this.contField = new Container();
    this.container.addChild(this.contField);

    this.ArrayOfPlaces = [[-320, -380], [-80, -380], [150, -380],
     [-320, -155], [-80, -155], [150, -155], [-320, 70], [-80, 70], [150, 70]];

    let bg = new Texture(new BaseTexture("/images/bg3.jpg"));
    this.bg = new Sprite(bg);
    this.bg.anchor.x = this.bg.anchor.y = 0.5;
    this.bg.scale.x = this.bg.scale.y = 2;
    this.contField.addChild(this.bg);

    this.ArrayOfNumbers = [];
    let list = [0,1,2,3,4,5,6,7,8];
    let delta;
    for (let i = 1; i < 9; i += 1) {
      this.ArrayOfNumbers[i] = new Text(`${i}`, {fontFamily : 'Arial', fontSize: 280, fill : 0xFF0000, dropShadow: true, dropShadowAngle: 1.5, dropShadowDistance: 5});
      let k = Math.round(Math.random() * (list.length - 1));
      this.ArrayOfNumbers[i].place = list[k];
      list.splice(k,1);
      this.ArrayOfNumbers[i].x = this.ArrayOfPlaces[this.ArrayOfNumbers[i].place][0];
      this.ArrayOfNumbers[i].y = this.ArrayOfPlaces[this.ArrayOfNumbers[i].place][1];
      this.ArrayOfNumbers[i].interactive = true;
      const list1 = [0, 1, 3, 4, 6, 7];
      const listMinus1 = [1, 2, 4, 5, 7, 8];
      const list3 = [0, 3, 1, 4, 2, 5];
      const listMinus3 = [3, 6, 4, 7, 5, 8]
      this.ArrayOfNumbers[i].on('pointerdown', () => {
        delta = this.emptyField - this.ArrayOfNumbers[i].place;
        if (delta === 1 && list1.includes(this.ArrayOfNumbers[i].place) 
          || (delta === -1 && listMinus1.includes(this.ArrayOfNumbers[i].place))) {
            Tween.removeTweens(this.ArrayOfNumbers[i]);
            Tween.get(this.ArrayOfNumbers[i])
              .to({x: this.ArrayOfPlaces[this.emptyField][0]}, 300);
            [this.ArrayOfNumbers[i].place, this.emptyField] = [this.emptyField, this.ArrayOfNumbers[i].place]; 
        }
        if (delta === 3 && list3.includes(this.ArrayOfNumbers[i].place) 
          || (delta === -3 && listMinus3.includes(this.ArrayOfNumbers[i].place))) {
            Tween.removeTweens(this.ArrayOfNumbers[i]);
            Tween.get(this.ArrayOfNumbers[i])
              .to({y: this.ArrayOfPlaces[this.emptyField][1]}, 300);
            [this.ArrayOfNumbers[i].place, this.emptyField] = [this.emptyField, this.ArrayOfNumbers[i].place]; 
        }

        if (this.ArrayOfNumbers[i].place + 1 === Number(this.ArrayOfNumbers[i].text)) {
          if(this.checkEndGame()) {
            console.log('CONGRATULATIONS!!! :)')
          }
        }
      })

      this.contField.addChild(this.ArrayOfNumbers[i]);
    }
    
    this.emptyField = list[0];
    list = null;
    this.contField.x = this.width / 2;
    this.contField.y = this.height / 2;

  }

  checkEndGame() {
    let end = true;
    for (let i = 1; i < 9; i +=1) {
      if (this.ArrayOfNumbers[i].place + 1 !== Number(this.ArrayOfNumbers[i].text)) {
        end = false;
        break;
      }
    }
    return end;
  }

  updateResoultion() {
  	this.res = 0;
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;

    this.previousHeight = height;
    this.previousWidth = width;

    this.canvas.width = width * window.devicePixelRatio;
    this.canvas.height = height * window.devicePixelRatio;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    const ratio = width / height;
    if (ratio <= 1) {
      this.res = 1;
      this.container.scale.x = this.canvas.width / 1080;
      this.container.scale.y = this.canvas.height / (1080 / ratio);
      this.width = 1080;
      this.height = 1080 / ratio;
    } else {
      this.res = 0;
      this.container.scale.x = this.canvas.width / (1080 * ratio);
      this.container.scale.y = this.canvas.height / 1080;
      this.width = 1080 * ratio;
      this.height = 1080;
    }

    this.app.renderer.resize(this.canvas.width, this.canvas.height);
    this.emmiter.emit('resize');
  }

  
  onRotate() {
    this.contField.x = this.width / 2;
    this.contField.y = this.height / 2;
  }
}
