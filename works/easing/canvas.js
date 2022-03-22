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
const listOfEasings = [
    'easeInOutQuad',
    'easeInOutCubic',
    'easeInOutQuart',
    'easeInOutQuint',
    'easeInOutSine',
    'easeInOutExpo',
    'easeInOutCirc',
    'easeInOutBack',
    'easeInOutBounce'
]


const colors = ['#390099', '#9E0059', '#FF0054', '#FF5400', '#FFBD00']
const MARGIN = canvas.width / (10 * (listOfEasings.length + 1))
const boxSize = MARGIN * 6
const FPS = 90
ctx.font = `${MARGIN*1.6}px Arial`
// END CONFIG
const clearCanvas = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000'
    ctx.fillText('Without easing', MARGIN, MARGIN * 2)
    listOfEasings.forEach((x, i) => {
        ctx.fillText(`With ${x}`, MARGIN, MARGIN * (6 + (4 * i)) + boxSize * (i + 1))
    })
}
clearCanvas()

class Box {
    constructor(startx, starty, size, color, easing, easingType) {
        this.startx = startx
        this.x = startx
        this.y = starty
        this.h = size
        this.color = color
        this.forward = true
        this.easing = easing
        this.totalTime = 1000
        this.currentTime = 0
        this.easingType = easingType
        this.s = 5
        this.step = (canvas.width - (MARGIN * 2) - this.h) / (this.totalTime / (1000 / FPS))
        console.log(this)
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
                this.totalTime,
                this.s
            )
        } else {
            if (this.forward) { this.x += this.step } else { this.x -= this.step }
        }
        if (this.currentTime >= this.totalTime) {
            this.forward = !this.forward
            this.currentTime = 0
        }
        this.currentTime += 1000 / FPS
        this.draw()
    }
}



const boxes = listOfEasings.map((x, i) => {
    return new Box(
        MARGIN,
        MARGIN * (7 + (4 * i)) + boxSize * (i + 1),
        boxSize,
        colors[(i + 1) % colors.length],
        true,
        x
    )
})
boxes.push(new Box(MARGIN, MARGIN * 3, boxSize, colors[0], false, ''))

const loop = (time) => {
    requestAnimationFrame(loop)
    if (time - lastTime >= 1000 / FPS) {
        lastTime = time
        clearCanvas()
        boxes.forEach(x => x.oneStep())
    }
    boxes.forEach(x => x.oneStep())
}

let lastTime = 0
loop()