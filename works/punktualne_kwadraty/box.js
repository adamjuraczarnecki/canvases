import { Easing } from '../../globals/easing.js'

export class Box {
    constructor(startx, starty, targetx, targety, totalTime, size, color, easingName) {
        this.start_x = startx
        this.start_y = starty
        this.x = startx
        this.y = starty
        this.target_x = targetx
        this.target_y = targety
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
        this.x = Easing.get(this.easingName, this.start_x, this.target_x, this.currentTime, this.totalTime)
        this.y = Easing.get(this.easingName, this.start_y, this.target_y, this.currentTime, this.totalTime)
        this.currentTime += 1000 / FPS
        this.draw()
    }
}