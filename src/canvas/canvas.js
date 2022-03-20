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
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000'
}
clearCanvas()
