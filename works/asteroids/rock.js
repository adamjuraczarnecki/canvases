import { Game } from './game.js'
import { Dot } from './dot.js'
import { Sounds } from './sounds.js'


export class Rock {
    static count = 0
    static all = {}
    static data = [
        { r: 0.025, speed: 0.0005, minAngle: 60, maxAngle: 90 },
        { r: 0.08, speed: 0.00025, minAngle: 50, maxAngle: 70 },
        { r: 0.2, speed: 0.0006, minAngle: 30, maxAngle: 45 }
    ]
    constructor(size, x, y) {
        Rock.count++
        this.id = Rock.count.toString()
        Rock.all[this.id] = this
        this.size = size ?? 2
        this.x = x ?? (VAR.rand(0, 1) ? VAR.rand(0, 3) / 100 : VAR.rand(7, 10) / 10) * VAR.w
        this.y = y ?? (VAR.rand(0, 1) ? VAR.rand(0, 3) / 100 : VAR.rand(7, 10) / 10) * VAR.h
        this.r = Rock.data[this.size].r
        // mod
        this.modX = Rock.data[this.size].speed * VAR.rand(1, 10) * (VAR.rand(0, 1) ? 1 : -1)
        this.modY = Rock.data[this.size].speed * VAR.rand(1, 10) * (VAR.rand(0, 1) ? 1 : -1)
        // points
        this.points = []
        let a = 0
        while (a < 360) {
            a += VAR.rand(Rock.data[this.size].minAngle, Rock.data[this.size].maxAngle)
            // fix na pryszcze na kamieniach
            if (a > 360) { a = 360 }
            this.points.push({
                x: Math.sin(VAR.rad(a)) * this.r,
                y: Math.cos(VAR.rad(a)) * this.r
            })
        }
    }
    draw() {
        this.x += this.modX * VAR.d
        this.y += this.modY * VAR.d

        if (this.x + this.r * VAR.d < 0) {
            this.x += (VAR.d * this.r * 2) + VAR.w;
        } else if (this.x - this.r * VAR.d > VAR.w) {
            this.x -= (VAR.d * this.r * 2) + VAR.w;
        }
        if (this.y + this.r * VAR.d < 0) {
            this.y += (VAR.d * this.r * 2) + VAR.h;
        } else if (this.y - this.r * VAR.d > VAR.h) {
            this.y -= (VAR.d * this.r * 2) + VAR.h;
        }
        Game.ctx.beginPath()
        this.points.forEach((point, i) => {
            Game.ctx[i === 0 ? 'moveTo' : 'lineTo'](point.x * VAR.d + this.x, point.y * VAR.d + this.y)
        })
        Game.ctx.closePath()
        Game.ctx.stroke()
    }
    hitTest(x, y) {
        if (this.x - this.r * VAR.d < x && this.x + this.r * VAR.d > x && this.y - this.r * VAR.d < y && this.y + this.r * VAR.d > y) {
            Game.hit_ctx.clearRect(this.x - this.r * VAR.d, this.y - this.r * VAR.d, this.r * VAR.d * 2, this.r * VAR.d * 2)
            Game.hit_ctx.beginPath()
            this.points.forEach((point, i) => {
                Game.hit_ctx[i === 0 ? 'moveTo' : 'lineTo'](point.x * VAR.d + this.x, point.y * VAR.d + this.y)
            })
            Game.hit_ctx.closePath()
            Game.hit_ctx.fill()
            return Game.hit_ctx.getImageData(x, y, 1, 1).data[0] === 255
        }
    }

    remove() {
        if (this.size > 0) {
            for (let i = 0; i < 4; i++) {
                new Rock(this.size - 1, this.x, this.y)
            }
        }
        Dot.add(this.x, this.y)
        Sounds.play(`bum${VAR.rand(1,2)}`)
        delete Rock.all[this.id]

    }
    static draw() {
        Rock.num = 0
        Object.entries(Rock.all).forEach(([id, rock]) => {
            Rock.num++
            rock.draw()
        })

        if (Rock.num === 0 && !Game.success) {
            Game.success = true;
            Sounds.play('win')
            console.log('gewonen')
        }
    }
}