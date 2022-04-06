import { Easing } from '../../globals/easing.js'

export class Box {
    constructor(startx, starty, target_r, start_a, totalTime, size, color, easingName) {
        this.start_x = startx
        this.start_y = starty
        this.r = 0
        this.target_r = target_r
        this.start_a = start_a
        this.currentTime = 0
        this.totalTime = totalTime
        this.h = size
        this.color = color
        this.easingName = easingName
        this.draw()
    }

    draw() {
        ctx.fillStyle = `rgb(${this.color[0]},${this.color[1]},${this.color[2]})`
        ctx.fillRect(this.x - this.h / 2, this.y, this.h, this.h)
    }

    oneStep() {
        this.r = Easing.get(this.easingName, 0, canvas.height * this.target_r, this.currentTime, this.totalTime)
        this.a = Easing.get(this.easingName, this.start_a, this.start_a + 180, this.currentTime, this.totalTime)
        this.x = Math.sin(Math.PI / 180 * this.a) * this.r + canvas.width * this.start_x
        this.y = Math.cos(Math.PI / 180 * this.a) * this.r + canvas.height * this.start_y
        this.currentTime += 1000 / FPS
        this.draw()
    }
}