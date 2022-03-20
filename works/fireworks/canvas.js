const canvas = document.querySelector('#main')
// dostosowywanie rozmiaru canvas
const computedStyle = getComputedStyle(canvas.parentNode)
let elementWidth = canvas.parentNode.clientWidth
elementWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)
canvas.height = elementWidth
canvas.width = elementWidth
console.log(elementWidth)
const ctx = canvas.getContext("2d");
const clearCanvas = () => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000'
    // ctx.fillRect(canvas.width / 2, 0, 1, canvas.height)
    // ctx.fillRect(0, canvas.height * 0.3, canvas.width, 1)
}

const resetCanvas = () => {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineJoin = 'round'
    ctx.fillStyle = '#000'
}
resetCanvas()

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

class Box {
    constructor(startx, starty, size, color, speedX, speedY) {
        this.x = startx
        this.y = starty
        this.h = size
        this.color = color
        this.speedX = speedX
        this.speedY = speedY
        this.draw()
    }

    draw() {
        ctx.strokeStyle = `rgb(${this.color[0]},${this.color[1]},${this.color[2]})`
        ctx.lineWidth = this.h*0.8
        ctx.lineJoin = 'round'
        ctx.strokeRect(this.x - this.h / 2, this.y, this.h, this.h)
    }

    oneStep() {
        this.x += this.speedX
        this.y += this.speedY
        // pseudo grawitacja
        this.speedY += 0.35
        this.speedX *= 0.99
        // stopniowe wypalanie do bialego
        this.color = this.color.map(x => Math.min(255, x + 5))
        this.draw()
    }
}

const isVisible = (x) => {
    return (x.x + x.h / 2 > 0 && x.x - x.h / 2 < canvas.width) && // widoczny x
        (x.y + x.h / 2 > 0 && x.y - x.h / 2 < canvas.height) && // widoczny y
        x.color.some(x => x < 255) // kolor nie-biały
}

let allBoxes = []
const loop = () => {
    requestAnimationFrame(loop)
    clearCanvas()
    for (let i = 0; i < 150; i++) {
        allBoxes.push(new Box(
            canvas.width * 0.5,
            canvas.height * 0.3,
            randomBetween(1, 2),
            [255, randomBetween(0, 240), randomBetween(0, 100)],
            randomBetween(-1000, 1000) / 100,
            randomBetween(-1000, 1000) / 100
        ))
    }
    allBoxes.forEach(x => x.oneStep())
    allBoxes = allBoxes.filter(isVisible)

}
loop()
