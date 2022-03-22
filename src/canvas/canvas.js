const canvas = document.querySelector('#main')
// dostosowywanie rozmiaru canvas
const computedStyle = getComputedStyle(canvas.parentNode)
let elementWidth = canvas.parentNode.clientWidth
elementWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)
canvas.height = elementWidth
canvas.width = elementWidth
console.log(elementWidth)
// clear canvas
const ctx = canvas.getContext("2d");
const clearCanvas = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000'
}
clearCanvas()

// For animation:
const FPS = 90

const theLloop = (time) => {
    requestAnimationFrame(theLloop)
    if (time - lastTime >= 1000 / FPS) {
        lastTime = time
        clearCanvas()
        // render stuff
        // boxes.forEach(x => x.oneStep())
    }

}
// initiation of the loop
let lastTime = 0
loop()
