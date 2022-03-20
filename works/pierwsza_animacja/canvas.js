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
}

const resetCanvas = () => {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000'
}
resetCanvas()
const FPS = 120

class Box {
    constructor(startx, starty, size, color, step, direction, stroke) {
        this.x = startx
        this.y = starty
        this.h = size
        this.color = color
        this.step = step
        this.direction = direction
        this.stroke = stroke
        this.draw()
    }

    draw() {
        if (this.stroke) {
            ctx.strokeStyle = this.color
            ctx.strokeRect(this.x - this.h / 2, this.y, this.h, this.h)
        } else {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x - this.h / 2, this.y, this.h, this.h)
        }
    }

    oneStep() {
        this.x += this.step * this.direction
        if ((this.x - this.h / 2) > canvas.width && this.direction === 1) {
            this.x = 0
        }
        if (this.x + this.h / 2 < 0 && this.direction === -1) {
            this.x = canvas.width
        }
        this.draw()
    }
}

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)


const cenerateBoxes = (numOfBoxes) => {
    const colors = ['#390099', '#9E0059', '#FF0054', '#FF5400', '#FFBD00']
    const boxTopMargin = canvas.height / (7 * numOfBoxes + 1)
    const boxSize = 6 * boxTopMargin

    let y = boxTopMargin
    const boxes = []
    for (let i = 0; i < numOfBoxes; i++) {
        const color = colors[i % colors.length]
        const boxesInRow = randomBetween(1, numOfBoxes/2)
        for (let ii = 0; ii < boxesInRow; ii++) {
            boxes.push(new Box(randomBetween(0, canvas.width), y, boxSize, color,
                randomBetween(1,6), [1, -1][Math.floor(Math.random() * 2)],
                Math.random() < 0.5))
        }
        y += boxSize + boxTopMargin
    }

    return boxes
}
const MAX_NUM_OF_ROWS = 50
let boxes = cenerateBoxes(randomBetween(3, MAX_NUM_OF_ROWS))
const loop = (time) => {
    requestAnimationFrame(loop)
    // if (time - lastTime >= 1000 / FPS) {
    clearCanvas()
    boxes.forEach(x => x.oneStep())
    // }
}
const resetScene = () => {
    boxes.forEach(x => delete x)
    resetCanvas()
    boxes = cenerateBoxes(randomBetween(3, MAX_NUM_OF_ROWS))
    // loop() <-- ta linika z każdym resetem przyspieszy animację. Za każdym razem zostanie dodatkowo wywołana.
}

let lastTime = 0
loop()
setInterval(resetScene, 3000)