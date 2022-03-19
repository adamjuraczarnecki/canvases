const canvas = document.querySelector('#main')
const ctx = canvas.getContext("2d");
const clearCanvas = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000'
}
clearCanvas()
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']

const drawBoxesRL = (margin, boxSize, step) => {   
    let i = 0
    let start = margin
    do {
        start += step
        ctx.strokeStyle = colors[i % colors.length];
        ctx.strokeRect(start, start, boxSize, boxSize)
        i++
    } while ( canvas.width - (start + boxSize) > margin )
    ctx.fillRect(margin, margin, boxSize, boxSize)
}

const drawBoxesLR = (margin, boxSize, step) => {
    let i = 0
    const start0x = canvas.width - margin- boxSize
    const start0y = margin
    let startx = canvas.width - margin- boxSize
    let starty = margin
    do {
        startx -= step
        starty += step
        ctx.strokeStyle = colors[i % colors.length];
        ctx.strokeRect(startx, starty, boxSize, boxSize)
        i++
    } while ( startx > margin )
    ctx.fillRect(start0x, start0y, boxSize, boxSize)
}

for(let i=1; i < 11; i++){
    drawBoxesRL(30, 10*i, 6)
    drawBoxesLR(30, 10*i, 6)
}
