const canvas = document.querySelector('#main')
const ctx = canvas.getContext("2d");
const clearCanvas = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000'
}
clearCanvas()

ctx.fillRect(30, 30, 100, 100)
ctx.strokeRect(140, 30, 50, 50)
ctx.clearRect(50, 50, 250, 50)

ctx.beginPath()
ctx.moveTo(30, 140)
ctx.lineTo(100, 140)
ctx.lineTo(60, 250)
ctx.lineTo(10, 150)
ctx.closePath()

ctx.fill()