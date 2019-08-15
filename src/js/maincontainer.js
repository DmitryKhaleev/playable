import {
  Container,
  Graphics,
  AnimatedSprite,
  Text,
} from 'pixi.js';

import Tween from "./tweenjs.js";


class mainContainer extends Container {
  constructor() {
    super();

    this.first = new Container();
    this.buildOverlay(0.5, 200);
    this.buildHUD();
  }

  buildHUD() {

    //this.numbers = game.createSpriteSheet('numbers');
//    this.numbers = utils.createTimerSpriteSheet('numbers');
    this.addChild(this.first);

  }


  buildOverlay(alpha = 0.5, fadeInDuration = 0, color = 0x000) {
    if (this.overlay) {
      this.destroyOverlay();
    }

    this.overlay = new Graphics()
      .beginFill(color, alpha)
      .drawRect(0, 0, 3000, 3000);
    this.addChild(this.overlay);

    if (fadeInDuration) {
      this.overlay.alpha = 0;
      Tween.get(this.overlay)
        .to({ alpha }, fadeInDuration)
        .wait(2000).call(() => {
        });
    }
  }

  destroyOverlay() {
    this.removeChild(this.overlay);
    this.overlay = null;
  }

}

export default mainContainer;
