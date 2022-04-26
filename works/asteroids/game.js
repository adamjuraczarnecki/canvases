import { Ship } from './ship.js'
import { Bullet } from './bullet.js'
import { Rock } from './rock.js'
import { Dot } from './dot.js'
import { Sounds } from './sounds.js'


export const Game = {
    init: () => {
        Game.canvas = document.querySelector('#main')
        Game.hit_canvas = document.createElement('canvas')
        // Game.hit_canvas.id = 'hit_canvas'
        Game.ctx = Game.canvas.getContext("2d")
        Game.hit_ctx = Game.hit_canvas.getContext("2d")
        // Game.canvas.parentNode.appendChild(Game.hit_canvas)
        Game.layout()
        Game.clearCanvas()
        Sounds.init()
        Game.ship = new Ship()
        window.addEventListener('keydown', Game.onKey, false)
        window.addEventListener('keyup', Game.onKey, false)
        for (let r = 0; r < 3; r++) {
            new Rock(VAR.rand(1, 2))
        }
        Game.animaitonLoop()
    },
    layout: () => {
        const computedStyle = getComputedStyle(Game.canvas.parentNode)
        let elementWidth = Game.canvas.parentNode.clientWidth
        elementWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)
        Game.canvas.height = elementWidth
        Game.canvas.width = elementWidth
        Game.hit_canvas.height = elementWidth
        Game.hit_canvas.width = elementWidth
        Game.hit_ctx.fillStyle = 'red'
        console.log(elementWidth)
        VAR.w = elementWidth
        VAR.h = elementWidth
        VAR.d = Math.min(VAR.h, VAR.w)
        Game.ctx.fillStyle = 'white'
        Game.ctx.strokeStyle = 'white'
        Game.ctx.lineWidth = 3
        Game.ctx.lineJoin = 'round'
    },
    clearCanvas: () => {
        Game.ctx.fillStyle = "#000";
        Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);
        Game.ctx.fillStyle = 'white'
    },
    animaitonLoop: (time) => {
        requestAnimationFrame(Game.animaitonLoop)
        if (time - VAR.lastTime >= 1000 / VAR.fps) {
            VAR.lastTime = time
            Game.clearCanvas()
            Game.ship.draw()
            Rock.draw()
            Bullet.draw()
            Dot.draw()
        }
    },
    onKey: (e) => {
        if ([32, 40, 37, 38, 39].includes(e.keyCode)) {
            e.preventDefault()
            if (e.type == 'keydown' && !Game['key_' + e.keyCode]) {

                Game['key_' + e.keyCode] = true
                if (e.keyCode == 37) {
                    Game.key_39 = false
                } else if (e.keyCode == 39) {
                    Game.key_37 = false
                } else if (e.keyCode == 32) {
                    new Bullet()
                }
            } else if (e.type === 'keyup') {
                Game['key_' + e.keyCode] = false
            }
            // console.log(e.keyCode, Game.key_32, Game.key_37, Game.key_38, Game.key_39, Game.key_40)
        }
    },
    stop: () => {
        window.removeEventListener('keydown', Game.onKey, false)
        window.removeEventListener('keyup', Game.onKey, false)
    }
}