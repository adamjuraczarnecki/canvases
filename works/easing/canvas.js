const canvas = document.querySelector('#main')
// dostosowywanie rozmiaru canvas
const computedStyle = getComputedStyle(canvas.parentNode)
let elementWidth = canvas.parentNode.clientWidth
elementWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)
canvas.height = elementWidth
canvas.width = elementWidth
console.log(elementWidth)
const ctx = canvas.getContext("2d")
// CONFIG CONSTS
const MARGIN = canvas.width / 20
const boxSize = MARGIN * 6
ctx.font = `${MARGIN*2}px Arial`
const clearCanvas = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000'
    ctx.fillText('Without easing', MARGIN, MARGIN * 2)
    ctx.fillText('With easing', MARGIN, MARGIN * 6 + boxSize)
}
clearCanvas()

class Box {
    constructor(startx, starty, size, color, easing) {
        this.x = startx
        this.y = starty
        this.h = size
        this.color = color
        this.speed = MARGIN * 0.3
        this.easing = easing
        this.draw()
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.h, this.h)
    }

    oneStep() {
        this.x += this.speed
        if ((this.x + this.h + MARGIN > canvas.width) ||
            (this.x - MARGIN < 0)) {
            this.speed *= -1
        }
        this.draw()
    }
}


const boxes = []
boxes.push(new Box(MARGIN, MARGIN * 3, boxSize, '#000', false))
boxes.push(new Box(MARGIN, MARGIN * 7 + boxSize, boxSize, '#000', true))

const loop = () => {
    requestAnimationFrame(loop)
    clearCanvas()
    boxes.forEach(x => x.oneStep())
}

loop()