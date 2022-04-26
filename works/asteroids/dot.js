import { Game } from './game.js'

export class Dot {
    static count = 0
    static all = {}
    static maxD = 25
    constructor(x, y) {
        Dot.count++
        this.id = Dot.count
        Dot.all[this.id] = this
        this.x = x
        this.y = y
        this.d = 0
        this.modX = VAR.rand(3, 7) * (VAR.rand(0, 1) ? 1 : -1)
        this.modY = VAR.rand(3, 7) * (VAR.rand(0, 1) ? 1 : -1)
    }
    draw() {
        this.x += this.modX
        this.y += this.modY
        this.d++
        Game.ctx.fillRect(this.x, this.y, 3, 3)
        if (this.d > Dot.maxD) {
            delete Dot[this.id]
        }
    }

    static add(x, y) {
        const n = VAR.rand(10, 20)
        for (let i = 0; i < n; i++) {
            new Dot(x, y)
        }
    }
    static draw() {
        Object.entries(Dot.all).forEach(([id, dot]) => {
            dot.draw()
        })
    }
}