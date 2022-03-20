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

const boxSize = 100
const boxGap = 20

// pierwszy rząd
ctx.fillStyle = '#84e8ee'
ctx.fillRect(boxGap, boxGap, boxSize, boxSize)
ctx.fillStyle = 'rgb(231, 79, 156)'
ctx.fillRect(boxGap * 2 + boxSize, boxGap, boxSize, boxSize)
ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
ctx.fillRect(boxGap * 3 + boxSize * 2, boxGap, boxSize, boxSize)
ctx.fillStyle = 'pink'
ctx.fillRect(boxGap * 4 + boxSize * 3, boxGap, boxSize, boxSize)

// drugi rząd
ctx.strokeStyle = '#84e8ee'
ctx.strokeRect(boxGap, boxSize + boxGap * 2, boxSize, boxSize)
ctx.strokeStyle = 'rgb(231, 79, 156)'
ctx.strokeRect(boxGap * 2 + boxSize, boxSize + boxGap * 2, boxSize, boxSize)
ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'
ctx.strokeRect(boxGap * 3 + boxSize * 2, boxSize + boxGap * 2, boxSize, boxSize)
ctx.strokeStyle = 'pink'
ctx.strokeRect(boxGap * 4 + boxSize * 3, boxSize + boxGap * 2, boxSize, boxSize)

// trzeci rząd
ctx.globalAlpha = 0.5
ctx.fillStyle = '#84e8ee'
ctx.fillRect(boxGap, boxGap * 3 + boxSize * 2, boxSize, boxSize)
ctx.fillStyle = 'rgb(231, 79, 156)'
ctx.fillRect(boxGap * 2 + boxSize, boxGap * 3 + boxSize * 2, boxSize, boxSize)
ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
ctx.fillRect(boxGap * 3 + boxSize * 2, boxGap * 3 + boxSize * 2, boxSize, boxSize)
ctx.fillStyle = 'pink'
ctx.fillRect(boxGap * 4 + boxSize * 3, boxGap * 3 + boxSize * 2, boxSize, boxSize)
ctx.globalAlpha = 1

// czwarty rząd
ctx.strokeStyle = '#84e8ee'
ctx.lineWidth = 14
ctx.strokeRect(boxGap, boxGap * 4 + boxSize * 3, boxSize, boxSize)
ctx.lineJoin = 'round'
ctx.strokeStyle = 'rgb(231, 79, 156)'
ctx.strokeRect(boxGap * 2 + boxSize, boxGap * 4 + boxSize * 3, boxSize, boxSize)
ctx.lineJoin = 'bever'
ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'
ctx.strokeRect(boxGap * 3 + boxSize * 2, boxGap * 4 + boxSize * 3, boxSize, boxSize)
ctx.strokeStyle = 'pink'
ctx.strokeRect(boxGap * 4 + boxSize * 3, boxGap * 4 + boxSize * 3, boxSize, boxSize)

// zygzaki
const strokeGap = 27
const strokeStart = 150

// nie przekroczony limit
ctx.strokeStyle = '#39ff14'
ctx.lineJoin = 'miter'
ctx.miterLimit = 15
ctx.beginPath()
ctx.moveTo(strokeStart, 100)
ctx.lineTo(strokeStart + strokeGap, 400)
ctx.lineTo(strokeStart + strokeGap*2, 100)
ctx.lineTo(strokeStart + strokeGap*3, 400)
ctx.stroke()
// przekroczony limit
ctx.miterLimit = 9
ctx.beginPath()
ctx.strokeStyle = '#fff01f'
ctx.moveTo(strokeStart + strokeGap*4, 100)
ctx.lineTo(strokeStart + strokeGap*5, 400)
ctx.lineTo(strokeStart + strokeGap*6, 100)
ctx.lineTo(strokeStart + strokeGap*7, 400)
ctx.stroke()