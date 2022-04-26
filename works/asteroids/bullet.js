import { Game } from './game.js'
import { Rock } from './rock.js'
import { Sounds } from './sounds.js'

export class Bullet {
    static max = 5
    static all = {}
    static speed = 0.022
    static count = 0;
    static activeCount = 0
    static life = 70

    constructor(x, y, a) {
        if (Bullet.activeCount < Bullet.max) {
            Bullet.count++
            Bullet.activeCount++
            this.id = Bullet.count.toString()
            Bullet.all[this.id] = this
            this.life = 0
            this.a = Game.ship.a
            this.x = Game.ship.x
            this.y = Game.ship.y
            this.modX = Math.sin(VAR.rad(this.a)) * Bullet.speed * VAR.d
            this.modY = -Math.cos(VAR.rad(this.a)) * Bullet.speed * VAR.d
            Sounds.play('laser')
        }
    }
    static draw() {
        Object.entries(Bullet.all).forEach(([id, bullet]) => {
            if (bullet.life < Bullet.life) {
                Object.entries(Rock.all).forEach(([id, rock]) => {
                    if (rock.hitTest(bullet.x, bullet.y)) {
                        bullet.life += Bullet.life
                        Rock.all[id].remove()
                    }
                })


                bullet.life++
                bullet.x += bullet.modX
                bullet.y += bullet.modY
                Game.ctx.beginPath()
                Game.ctx.arc(bullet.x, bullet.y, 3, 0, VAR.rad(360))
                Game.ctx.fill()
            } else {
                delete Bullet.all[id]
                Bullet.activeCount--
            }

            if (bullet.x < 0) {
                bullet.x += VAR.w
            } else if (bullet.x > VAR.w) {
                bullet.x -= VAR.w
            }
            if (bullet.y < 0) {
                bullet.y += VAR.h
            } else if (bullet.y > VAR.h) {
                bullet.y -= VAR.h
            }
        })
    }
}