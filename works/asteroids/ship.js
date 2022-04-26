import { Game } from './game.js'
import { Rock } from './rock.js'
import { Sounds } from './sounds.js'

export class Ship {
    constructor() {
        this.r = 0.04
        this.rear_a = 50
        this.a = 0
        this.x = VAR.w / 2
        this.y = VAR.h / 2
        this.modX = 0
        this.modY = 0
        this.acc = 0.0004
        this.maxMod = 0.019
        this.points = [{ id: 1 }, { id: 2 }, { id: 3 }]
    }

    draw() {
        if (!this.detroyed) {
            this.hitTest()
            if (Game.key_37 || Game.key_39) {
                this.a = this.a + 7 * (Game.key_37 ? -1 : 1)
            }
            if (Game.key_38) {
                this.modX = Math.max(-this.maxMod * VAR.d, Math.min(this.maxMod * VAR.d, this.modX + Math.sin(VAR.rad(this.a)) * this.acc * VAR.d))
                this.modY = Math.max(-this.maxMod * VAR.d, Math.min(this.maxMod * VAR.d, this.modY - Math.cos(VAR.rad(this.a)) * this.acc * VAR.d))
            } else if (Game.key_40) {
                this.modX *= 0.90
                this.modY *= 0.90

            } else {
                this.modX *= 0.99
                this.modY *= 0.99
            }
            this.modX = Math.abs(this.modX) < 0.01 ? 0 : this.modX
            this.modY = Math.abs(this.modY) < 0.01 ? 0 : this.modY

            this.x += this.modX
            this.y += this.modY

            Game.ctx.beginPath()
            this.points.forEach((point, i) => {
                this.temp_a = i === 0 ? this.a : (this.a + 180 + (i === 1 ? this.rear_a : -this.rear_a))
                this.temp_r = i === 0 ? this.r : this.r * 0.6
                point.x = Math.sin(VAR.rad(this.temp_a)) * this.temp_r * VAR.d + this.x
                point.y = -Math.cos(VAR.rad(this.temp_a)) * this.temp_r * VAR.d + this.y
                Game.ctx[i === 0 ? 'moveTo' : 'lineTo'](point.x, point.y)
            })
            Game.ctx.closePath()
            Game.ctx.stroke()

            // Game.ctx.beginPath()
            // Game.ctx.arc(this.x, this.y, this.r * VAR.d, VAR.rad(0), VAR.rad(360), true)
            // Game.ctx.stroke()

            if (Game.key_38 && this.draw_thrust) {
                this.draw_thrust = false
                Game.ctx.beginPath()
                Game.ctx.strokeStyle = 'red'
                for (let i = 0; i < 3; i++) {
                    this.tmp_a = i != 1 ? this.a + 180 + (i === 0 ? -this.rear_a + 14 : this.rear_a - 14) : this.a + 180
                    this.tmp_r = i == 1 ? this.r : this.r * 0.5;
                    Game.ctx[i === 0 ? 'moveTo' : 'lineTo'](
                        (Math.sin(VAR.rad(this.tmp_a)) * this.tmp_r * VAR.d) + this.x,
                        (-Math.cos(VAR.rad(this.tmp_a)) * this.tmp_r * VAR.d) + this.y
                    );
                }
                Game.ctx.stroke()
                Game.ctx.strokeStyle = 'white'
            } else if (Game.key_38 && !this.draw_thrust) {
                this.draw_thrust = true;
            }
            if (Game.key_40 && this.draw_thrust && (this.modX || this.modY)) {
                this.draw_thrust = false
                Game.ctx.strokeStyle = 'orange'
                for (let i = 0; i < 2; i++) {
                    Game.ctx.beginPath()
                    Game.ctx.moveTo(
                        Math.sin(VAR.rad(this.a + (i ? 30 : -30))) * this.r * 0.5 * VAR.d + this.x,
                        -Math.cos(VAR.rad(this.a + (i ? 30 : -30))) * this.r * 0.5 * VAR.d + this.y
                    )
                    Game.ctx.lineTo(
                        Math.sin(VAR.rad(this.a + (i ? 30 : -30))) * this.r * VAR.d + this.x,
                        -Math.cos(VAR.rad(this.a + (i ? 30 : -30))) * this.r * VAR.d + this.y
                    )
                    Game.ctx.stroke()
                }
                Game.ctx.strokeStyle = 'white'
            } else if (Game.key_40 && !this.draw_thrust) {
                this.draw_thrust = true;
            }

            if (Game.key_38 && (!Game.thrust_sound || Game.thrust_sound <= 0)) {
                // ustaw oĻóźnienie na 60
                Game.thrust_sound = 60
                // odtwórz dźwięk
                Sounds.play('thrust')
            } else if (Game.key_38 && Game.thrust_sound) { // jeśli gracz wciska gaz ale thrust_sound jest większy niż zero zmniejsz go o ilość milisekund mieszczącą się w jednej klatce
                Game.thrust_sound -= 1000 / VAR.fps
            } else if (!Game.key_38) { // jeśli gracz nie wciska gazu ustaw thrust_sound na false
                Game.thrust_sound = false
            }

            // wychodzenie za krawędź
            if (this.points.map(x => x.x).every(x => x < 0)) {
                this.x += VAR.w - Math.min(...this.points.map(x => x.x)) * 0.9
            } else if (this.points.map(x => x.x).every(x => x > VAR.w)) {
                this.x -= VAR.w - (VAR.w - Math.max(...this.points.map(x => x.x))) * 0.9
            }
            if (this.points.map(x => x.y).every(x => x < 0)) {
                this.y += VAR.h - Math.min(...this.points.map(x => x.y)) * 0.9
            } else if (this.points.map(x => x.y).every(x => x > VAR.h)) {
                this.y -= VAR.h - (VAR.h - Math.max(...this.points.map(x => x.y))) * 0.9
            }
        }
    }

    hitTest() {
        this.points.forEach((point, i) => {
            return Object.entries(Rock.all).some(([id, rock]) => {
                if (rock.hitTest(point.x, point.y)) {
                    console.log(point)
                    rock.remove()
                    this.detroyed = true
                    Game.stop()
                }
            })
        })
    }

}