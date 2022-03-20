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
// kierunek kreślenia ma znaczenie w wycinaniu

const rad = (deg) => Math.PI / 180 * deg
clearCanvas()


ctx.beginPath()
// pierwszy - usta
ctx.moveTo(40, 300)
ctx.lineTo(440, 300)
ctx.bezierCurveTo(400, 500, 60, 500, 40, 300)

// kolejne w tej samej śćieżce - zęby
let toothTop = 320
const toothH = 30
const toothW = 25
let toothStart = 80
const toothGap = 15
for (let i = 0; i < 8; i++) {
  ctx.moveTo(toothStart, toothTop)
  ctx.lineTo(toothStart, toothTop + toothH)
  ctx.lineTo(toothStart + toothW, toothTop + toothH)
  ctx.lineTo(toothStart + toothW, toothTop)
  ctx.lineTo(toothStart, toothTop)
  toothStart += toothGap + toothW
}
toothTop += toothH + toothGap
toothStart = 100
for (let i = 0; i < 7; i++) {
  ctx.moveTo(toothStart, toothTop)
  ctx.lineTo(toothStart, toothTop + toothH)
  ctx.lineTo(toothStart + toothW, toothTop + toothH)
  ctx.lineTo(toothStart + toothW, toothTop)
  ctx.lineTo(toothStart, toothTop)
  toothStart += toothGap + toothW
}
ctx.fill()

// lewe oko
ctx.beginPath()
ctx.arc(120, 120, 100, rad(0), rad(360), true)
ctx.arc(125, 150, 50, rad(0), rad(360), false)
ctx.fill()
// prawe oko
ctx.beginPath()
ctx.arc(380, 120, 100, rad(0), rad(360), true)
ctx.arc(375, 150, 50, rad(0), rad(360), false)
ctx.fill()