import { Game } from './game.js'

globalThis.VAR = {
    fps: 180,
    w: 0,
    h: 0,
    lastTime: 0,
    lastUpdate: -1,
    rand: (min, max) => Math.floor(Math.random() * (max - min + 1) + min),              
    rad: (deg) => Math.PI / 180 * deg
}


window.onload = function() {
    // INICJALIZACJA
    Game.init()
    window.addEventListener('resize', Game.layout, false)
}