import { Easing } from '../../globals/easing.js'


export class Box {
    constructor(startx, starty, size, color, easing, easingType) {
        this.startx = startx
        this.x = startx
        this.y = starty
        this.h = size
        this.color = color
        this.forward = true
        this.easing = easing
        this.currentTime = 0
        this.easingType = easingType
        this.s = 0.3
        this.step = (canvas.width - (MARGIN * 2) - this.h) / (totalTime / (1000 / FPS))
        this.draw()
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.h, this.h)
    }

    oneStep() {
        if (this.easing) {
            this.x = Easing.get(this.easingType,
                this.forward ? this.startx : canvas.width - this.h - MARGIN,
                !this.forward ? this.startx : canvas.width - this.h - MARGIN,
                this.currentTime,
                totalTime,
                this.s
            )
        } else {
            if (this.forward) { this.x += this.step } else { this.x -= this.step }
        }
        if (this.currentTime >= totalTime) {
            this.forward = !this.forward
            this.currentTime = 0
        }
        this.currentTime += 1000 / FPS
        this.draw()
    }
}
