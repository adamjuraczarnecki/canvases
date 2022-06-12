import { Game } from './game.js'

document.querySelector('section').style.display = 'block'
document.querySelector('section h3').innerText = 'Extra Controls'
const controlsWrapper = document.querySelector('section div')
const chechboxWrapper = document.createElement('div')
chechboxWrapper.style.display = 'grid'
chechboxWrapper.style.gridTemplateColumns = 'repeat(4, 1fr)'
chechboxWrapper.style.gridGap = '0.6em';
[{ name: 'Grid Width', value: VAR.gridWidth, id: 'gw' }, { name: 'Export Pixel Size', value: VAR.exportPixelSize, id: 'eps' }].forEach(x => {
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
    range.max =  x.value * (x.id === 'eps' ? 20 : 2)
    range.min = x.value / 5
    range.value = x.value
    range.style.gridColumn = '2 / span 2'
    slider.appendChild(range)
    const output = document.createElement('output')
    output.style.gridColumn = '4 / span 1'
    output.value = x.value
    slider.appendChild(output);
    chechboxWrapper.appendChild(slider);
})
controlsWrapper.appendChild(chechboxWrapper)

const changeGrid = (event) => {
    VAR.gridWidth = parseInt(event.target.value)
    document.querySelector('#gw output').value = VAR.gridWidth
    Game.init()
}

const changePixelSize = (event) => {
    VAR.exportPixelSize = parseInt(event.target.value)
    document.querySelector('#eps output').value = VAR.exportPixelSize
}

window.onload = function() {
    Game.init()
    window.addEventListener('resize', Game.layout, false)
    document.querySelector('#gw input').addEventListener('change', changeGrid, false)
    document.querySelector('#eps input').addEventListener('change', changePixelSize, false)
}