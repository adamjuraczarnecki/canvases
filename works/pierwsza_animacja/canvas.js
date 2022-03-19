const canvas = document.querySelector('#main')
const ctx = canvas.getContext("2d");
const clearCanvas = () => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const resetCanvas = () => {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000'
}
resetCanvas()
const FPS = 120

class Box {
    constructor(startx, starty, size = 40, color, step = 2, direction) {
        this.x = startx
        this.y = starty
        this.h = size
        this.color = color
        this.step = step
        this.direction = direction
        this.draw()
    }

    draw() {

        if (this.direction === 1) {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x - this.h / 2, this.y - this.h / 2, this.h, this.h)
        } else {
            ctx.strokeStyle = this.color
            ctx.strokeRect(this.x - this.h / 2, this.y - this.h / 2, this.h, this.h)
        }
    }

    oneStep() {
        this.x += this.step * this.direction
        this.y += this.step * this.direction
        if (this.x > canvas.width && this.direction === 1) {
            this.x = 0
            this.y = 0
        }
        if (this.x < 0 && this.direction === -1) {
            this.x = canvas.width
            this.y = canvas.height
        }

        clearCanvas()
        this.draw()
    }
}

const box1 = new Box(canvas.width / 2, canvas.height / 2, 40, color = 'red', step = 2, direction = 1)
const box2 = new Box(canvas.width / 3, canvas.height / 3, 40, color = 'blue', step = 4, direction = 1)
const box3 = new Box(0, 0, 40, color = 'pink', step = 1, direction = 1)
const box4 = new Box(canvas.width / 2, canvas.height / 2, 40, color = 'red', step = 2, direction = -1)
const box5 = new Box((canvas.width / 3) * 2, (canvas.height / 3) * 2, 40, color = 'blue', step = 4, direction = -1)
const box6 = new Box(0, canvas.height, 40, color = 'pink', step = 1, direction = -1)
const loop = (time) => {
    requestAnimationFrame(loop)
    if (time - lastTime >= 1000 / FPS) {
        lastTime = time
        clearCanvas()
        box1.oneStep()
        box2.oneStep()
        box3.oneStep()
        box4.oneStep()
        box5.oneStep()
        box6.oneStep()
    }
}
let lastTime = 0
loop()
// setInterval(loop, 1000 / FPS)