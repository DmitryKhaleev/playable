import {
  Texture,
  BaseTexture,
} from 'pixi.js';

const resources = {
  pixi: new Texture(new BaseTexture("/images/pixi.png")),
  bg: new Texture(new BaseTexture("/images/bg.png")),
  // map: new Texture(new BaseTexture("/images/map.jpg")),
  // settings: new Texture(new BaseTexture("/images/settings.png")),
  // sound: new Texture(new BaseTexture("/images/sound.png")),
  // settingsBut: new Texture(new BaseTexture("/images/settingsBut.png")),
  // start: new Texture(new BaseTexture("/images/start.png")),
  // offline: new Texture(new BaseTexture("/images/offline.png")),
  // setbg: new Texture(new BaseTexture("/images/setbg.png")),
  // girl: new Texture(new BaseTexture("/images/girl.png")),
}

export default resources;