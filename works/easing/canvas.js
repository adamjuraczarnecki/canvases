import { Easing } from '../../globals/easing.js'
import { Box } from './box.js'

globalThis.canvas = document.querySelector('#main')
// dostosowywanie rozmiaru canvas
const computedStyle = getComputedStyle(canvas.parentNode)
let elementWidth = canvas.parentNode.clientWidth
elementWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)
canvas.height = elementWidth
canvas.width = elementWidth
console.log(elementWidth)
globalThis.ctx = canvas.getContext("2d")
// CONFIG CONSTS
const colors = ['#390099', '#9E0059', '#FF0054', '#FF5400', '#FFBD00']
let regenerateBoxes = true
let listOfEasings = []
globalThis.totalTime = 1000
globalThis.FPS = 90
// create controls:
document.querySelector('section').style.display = 'block'
document.querySelector('section h3').innerText = 'Controls'
const controlsWrapper = document.querySelector('section div')
const allEasings = Object.keys(Easing).filter(x => !x.startsWith('get'))
const easingChunks = allEasings.reduce((a, x, i) => {
    const chunkIndex = Math.floor(i / 3)
    if (!a[chunkIndex]) {
        a[chunkIndex] = []
    }
    a[chunkIndex].push(x)
    return a
}, [])

const chechboxWrapper = document.createElement('div')
chechboxWrapper.style.display = 'grid'
chechboxWrapper.style.gridTemplateColumns = 'repeat(4, 1fr)'
chechboxWrapper.style.gridGap = '0.6em';
// sliders
[{ name: 'Total Time', value: totalTime, id: 'tt' }, { name: 'FPS', value: FPS, id: 'fps' }].forEach(x => {
    const slider = document.createElement('label')
    slider.style.gridColumn = '1 / span 4'
    slider.style.display = 'grid'
    slider.style.gridTemplateColumns = 'repeat(4, 1fr)'
    slider.style.gridGap = '0.6em';
    slider.id = x.id
    const span = document.createElement('span')
    span.innerText = x.name
    span.style.gridColumn = '1 / span 1'
    slider.appendChild(span)
    const range = document.createElement('input')
    range.type = 'range'
    range.max = x.value * 2
    range.min = x.value / 10
    range.value = x.value
    range.style.gridColumn = '2 / span 2'
    slider.appendChild(range)
    const output = document.createElement('output')
    output.style.gridColumn = '4 / span 1'
    output.value = x.value
    slider.appendChild(output);
    chechboxWrapper.appendChild(slider);
});

// checkboxes header row
['', 'In', 'Out', 'InOut'].forEach(x => {
    const strong = document.createElement('strong')
    strong.innerText = x
    chechboxWrapper.appendChild(strong)
})
// checkboxes
easingChunks.forEach(chunk => {
    const strong = document.createElement('strong')
    strong.innerText = chunk[0].replace('easeIn', '')
    chechboxWrapper.appendChild(strong)

    chunk.forEach(x => {
        const label = document.createElement('label')
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.value = x
        checkbox.checked = x.includes('InOut')
        label.appendChild(checkbox)
        const span = document.createElement('span')
        span.innerText = x
        label.appendChild(span)
        chechboxWrapper.appendChild(label)
    })
});
// buttons
['Clear', 'all In', 'all Out', 'all InOut'].forEach(x => {
    const button = document.createElement('button')
    button.innerText = x
    button.value = x
    chechboxWrapper.appendChild(button)
})
controlsWrapper.appendChild(chechboxWrapper)
const buttons = document.querySelectorAll('button')
buttons.forEach(x => {
    x.addEventListener('click', (e) => {
        const task = e.target.value
        const boxs = document.querySelectorAll('input[type="checkbox"]')
        if (task === 'Clear') {
            boxs.forEach(bx => {
                bx.checked = false
            })
        } else if (task === 'all In') {
            boxs.forEach(bx => {
                bx.checked = (bx.value.includes('In') && !bx.value.includes('Out'))
            })
        } else if (task === 'all Out') {
            boxs.forEach(bx => {
                bx.checked = (!bx.value.includes('In') && bx.value.includes('Out'))
            })
        } else {
            boxs.forEach(bx => {
                bx.checked = bx.value.includes('InOut')
            })
        }
    })
})
// END controls

const readGlobals = () => {
    const newEasings = [...document.querySelectorAll('input[type="checkbox"]')].reduce((a, x) => {
        if (x.checked) { a.push(x.value) }
        return a
    }, [])

    const newFPS = document.querySelector('#fps input').value
    document.querySelector('#fps output').value = newFPS
    const newTotalTime = document.querySelector('#tt input').value
    document.querySelector('#tt output').value = newTotalTime
    regenerateBoxes = (newTotalTime != totalTime) || (FPS != newFPS) || (listOfEasings.join() != newEasings.join())
    totalTime = newTotalTime
    FPS = newFPS
    listOfEasings = newEasings

    globalThis.MARGIN = canvas.width / (10 * (listOfEasings.length + 1))
    globalThis.boxSize = MARGIN * 6
    ctx.font = `${MARGIN*1.6}px Arial`

}
const clearCanvas = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000'
    ctx.fillText('Without easing', MARGIN, MARGIN * 2)
    listOfEasings.forEach((x, i) => {
        ctx.fillText(`With ${x}`, MARGIN, MARGIN * (6 + (4 * i)) + boxSize * (i + 1))
    })
}
const createBoxes = () => {
    globalThis.boxes = listOfEasings.map((x, i) => {
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
}

readGlobals()
clearCanvas()
createBoxes()


const loop = (time) => {
    requestAnimationFrame(loop)
    if (time - lastTime >= 1000 / FPS) {
        lastTime = time
        readGlobals()
        clearCanvas()
        if (regenerateBoxes) { createBoxes() }
        boxes.forEach(x => x.oneStep())
    }
}

let lastTime = 0
loop()