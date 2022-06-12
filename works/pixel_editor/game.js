import { Field } from './field.js'
import { Colors } from './colors.js'
import { Sounds } from './sounds.js'

globalThis.VAR = {
    fps: 75,
    w: 0,
    h: 0,
    d: 0,
    lastTime: 0,
    lastUpdate: -1,
    margin: 0.12,
    background: '#fff',
    borders: '#000',
    hover: 'rgba(57,255,20,0.7)',
    sounds: Sounds,
    fields: Field.all,
    gridWidth: 30,
    invertColor: (color_string) => {
        const [r, g, b] = color_string.split(',')
        return `${255-r},${255-g},${255-b}`
    },
    buttons: [{
        text: 'Load',
        function: 'load',
        textOffset: 2
    }, {
        text: 'Save',
        function: 'save',
        textOffset: 2
    }, {
        text: 'Grid off',
        function: 'gridSwitch',
        textOffset: 1.5
    }, {
        text: 'Export',
        function: 'export',
        textOffset: 1.7
    }],
    exportPixelSize: 5
}

export const Game = {
    init: () => {
        Game.canvas = document.querySelector('#main')
        Game.ctx = Game.canvas.getContext("2d")
        // flags
        Field.count = 0
        Field.all = []
        Game.current_color = 0
        Game.hoveredField = undefined
        Game.hoveredColor = undefined
        Game.grid = true
        // events
        Game.canvas.addEventListener('mousemove', Game.onMove, false)
        Game.canvas.addEventListener('mouseout', Game.mouseOut, false)
        Game.canvas.addEventListener('mousedown', Game.click, false)
        // start game
        Sounds.init()
        Game.layout()
        for (let f = 0; f < VAR.numberOfFields; f++) {
            new Field()
        }
        Game.animaitonLoop()
    },
    layout: () => {
        const computedStyle = getComputedStyle(Game.canvas.parentNode)
        let elementWidth = Game.canvas.parentNode.clientWidth
        elementWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)
        Game.canvas.height = elementWidth
        Game.canvas.width = elementWidth
        console.log(elementWidth)
        VAR.w = elementWidth
        VAR.h = elementWidth
        VAR.d = Math.min(VAR.h, VAR.w)
        VAR.board_width = VAR.d - (VAR.d * VAR.margin) * 2
        VAR.field_width = VAR.board_width / VAR.gridWidth
        VAR.numberOfFields = Math.pow(VAR.gridWidth, 2)
        // pallete box sizeing 
        VAR.palleteMargin = (VAR.d - VAR.board_width) * VAR.margin
        VAR.colorSize = (VAR.d - VAR.palleteMargin * 2) / Colors.length
        Field.recalculatePositions()
        Game.calculateButtons()
    },
    drawColorPalete: () => {
        Game.ctx.lineWidth = VAR.palleteMargin * VAR.margin * 2
        for (let i = 0; i < Colors.length; i++) {
            Game.ctx.fillStyle = `rgb(${Colors[i].rgb})`
            Game.ctx.fillRect(VAR.palleteMargin + (VAR.colorSize * i), VAR.palleteMargin, VAR.colorSize, VAR.colorSize)
            if (i === Game.hoveredColor || i === Game.current_color) {
                Game.ctx.strokeStyle = i != 0 ? `rgb(${VAR.invertColor(Colors[i].rgb)})` : VAR.hover
                Game.ctx.strokeRect(VAR.palleteMargin + (VAR.colorSize * i), VAR.palleteMargin, VAR.colorSize, VAR.colorSize)
            }
        }
    },
    calculateButtons: () => {
        const y = VAR.board_width + (VAR.d * VAR.margin) + VAR.palleteMargin * 1.5
        let x = VAR.palleteMargin
        VAR.buttons.forEach(button => {
            button.x = x
            button.y = y
            button.x_end = x + 3 * VAR.colorSize
            button.y_end = y + VAR.colorSize
            x += VAR.palleteMargin + 3 * VAR.colorSize
        })
    },
    drawControls: () => {
        Game.ctx.fillStyle = VAR.borders
        Game.ctx.font = `${18*(VAR.d / 698)}px minecraft`
        let y = VAR.board_width + (VAR.d * VAR.margin) + VAR.palleteMargin
        Game.ctx.fillText(`Current color: ${Colors[Game.current_color].name}`, VAR.palleteMargin, y)
        VAR.buttons.forEach(button => {
            Game.drawButton(button.text, button.x, button.y, button.textOffset)
        })
    },
    drawButton: (text, x, y, text_offset) => {
        Game.ctx.fillStyle = '#f1f1f0'
        Game.ctx.fillRect(x - VAR.palleteMargin * VAR.margin * 2, y - VAR.palleteMargin * VAR.margin * 2, VAR.colorSize * 3, VAR.colorSize)
        Game.ctx.fillStyle = '#000'
        Game.ctx.fillRect(x + VAR.palleteMargin * VAR.margin * 2, y + VAR.palleteMargin * VAR.margin * 2, VAR.colorSize * 3, VAR.colorSize)
        Game.ctx.fillStyle = '#c6c6c6'
        Game.ctx.fillRect(x, y, VAR.colorSize * 3, VAR.colorSize)
        Game.ctx.fillStyle = '#000'
        Game.ctx.fillText(text, x + VAR.palleteMargin * text_offset, y + VAR.colorSize * 0.65)
    },
    drawBoard: () => {
        if (Game.grid) {
            Game.ctx.lineWidth = (15 * 3 / VAR.gridWidth) * (VAR.d / 698)
            Game.ctx.strokeStyle = VAR.borders
            Game.ctx.beginPath()
            let start = 0 + VAR.w * VAR.margin
            Game.ctx.moveTo(start, 0 + VAR.h * VAR.margin)
            Game.ctx.lineTo(start, VAR.h - (VAR.h * VAR.margin))
            Game.ctx.moveTo(0 + VAR.w * VAR.margin, start)
            Game.ctx.lineTo(VAR.h - (VAR.h * VAR.margin), start)
            for (let i = 1; i < VAR.gridWidth + 1; i++) {
                start = start + VAR.field_width
                Game.ctx.moveTo(start, 0 + VAR.h * VAR.margin)
                Game.ctx.lineTo(start, VAR.h - (VAR.h * VAR.margin))
                Game.ctx.moveTo(0 + VAR.w * VAR.margin, start)
                Game.ctx.lineTo(VAR.h - (VAR.h * VAR.margin), start)

            }
            Game.ctx.stroke()
        }

    },
    wipe: () => {
        Game.ctx.fillStyle = VAR.background
        Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height)
    },
    animaitonLoop: (time) => {
        requestAnimationFrame(Game.animaitonLoop)
        if (time - VAR.lastTime >= 1000 / VAR.fps) {
            VAR.lastTime = time
            Game.wipe()
            Field.draw()
            Game.drawColorPalete()
            Game.drawBoard()
            Game.drawControls()
        }
    },
    onMove: (e) => {
        const rect = e.target.getBoundingClientRect()
        if ((e.clientX - rect.left) > VAR.d * VAR.margin &&
            e.clientY - rect.top > VAR.d * VAR.margin &&
            e.clientX - rect.left < VAR.w - VAR.d * VAR.margin &&
            e.clientY - rect.top < VAR.h - VAR.d * VAR.margin) {
            const source_x = Math.floor((e.clientX - (rect.left + (VAR.w - VAR.board_width) / 2)) / VAR.field_width)
            const source_y = Math.floor((e.clientY - (rect.top + (VAR.h - VAR.board_width) / 2)) / VAR.field_width)
            const hoveredField = source_x > -1 && source_y > -1 ? source_x + source_y * VAR.gridWidth : undefined
            if (hoveredField < VAR.numberOfFields) {
                if (hoveredField != Game.hoveredField) {
                    Sounds.play('click')
                }
                Game.hoveredField = hoveredField
            }
            Game.hoveredColor = undefined
        } else if (e.clientX - rect.left > VAR.palleteMargin &&
            e.clientY - rect.top > VAR.palleteMargin &&
            e.clientX - rect.left < VAR.d - VAR.palleteMargin &&
            e.clientY - rect.top < VAR.palleteMargin + VAR.colorSize) {
            const source_x = Math.floor((e.clientX - (rect.left + VAR.palleteMargin)) / VAR.colorSize)
            const hoveredColor = source_x > -1 ? source_x : undefined
            if (hoveredColor < Colors.length) {
                if (hoveredColor != Game.hoveredColor) {
                    Sounds.play('click')
                }
                Game.hoveredColor = hoveredColor
            }
            Game.hoveredField = undefined
        } else {
            Game.hoveredField = undefined
            Game.hoveredColor = undefined
        }
    },
    mouseOut: (e) => {
        Game.hoveredField = undefined
        Game.hoveredColor = undefined
    },
    click: (e) => {
        const rect = e.target.getBoundingClientRect()
        if (e.clientX - rect.left > VAR.d * VAR.margin &&
            e.clientY - rect.top > VAR.d * VAR.margin &&
            e.clientX - rect.left < VAR.w - VAR.d * VAR.margin &&
            e.clientY - rect.top < VAR.h - VAR.d * VAR.margin) {
            const source_x = Math.floor((e.clientX - (rect.left + (VAR.w - VAR.board_width) / 2)) / VAR.field_width)
            const source_y = Math.floor((e.clientY - (rect.top + (VAR.h - VAR.board_width) / 2)) / VAR.field_width)
            const clickedField = source_x + source_y * VAR.gridWidth
            Game.move(clickedField)
        } else if (e.clientX - rect.left > VAR.palleteMargin &&
            e.clientY - rect.top > VAR.palleteMargin &&
            e.clientX - rect.left < VAR.d - VAR.palleteMargin &&
            e.clientY - rect.top < VAR.palleteMargin + VAR.colorSize) {
            const source_x = Math.floor((e.clientX - (rect.left + VAR.palleteMargin)) / VAR.colorSize)
            const current_color = source_x > -1 ? source_x : undefined
            if (current_color < Colors.length) {
                if (current_color != Game.current_color) {
                    Sounds.play('win')
                }
                Game.current_color = current_color
            }
        } else {
            for (let i = 0; i < VAR.buttons.length; i++) {
                if (e.clientX - rect.left > VAR.buttons[i].x &&
                    e.clientY - rect.top > VAR.buttons[i].y &&
                    e.clientX - rect.left < VAR.buttons[i].x_end &&
                    e.clientY - rect.top < VAR.buttons[i].y_end) {
                    Sounds.play('win')
                    Game[VAR.buttons[i].function](VAR.buttons[i])
                }
            }
        }
    },
    move: (clickedField) => {
        Field.all[clickedField].color = Colors[Game.current_color].rgb
    },
    gridSwitch: (button) => {
        Game.grid = !Game.grid
        button.text = button.text.includes('off') ? 'Grid on' : 'Grid off'
    },
    save: (button) => {
        const fields = Field.all.map(x => x.color ? x.color : '255,255,255')
        saveAsJSON('save_file.json', fields)
    },
    load: () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json'
        input.onchange = e => {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.readAsText(file, 'UTF-8')

            reader.onload = readerEvent => {
                const content = readerEvent.target.result
                const loads = JSON.parse(content)
                const colorTest = /\d+,\d+,\d+/
                VAR.gridWidth = Math.sqrt(loads.length)
                document.querySelector('#gw output').value = VAR.gridWidth
                document.querySelector('#gw input').value = VAR.gridWidth
                Game.init()
                console.log(loads)
                console.log(loads.filter(x => !colorTest.test(x)))
                if (Field.all.length === loads.length && loads.every(x => colorTest.test(x))) {
                    loads.forEach((x, i) => {
                        Field.all[i].color = x
                    })
                }
            }
        }
        input.click()
    },
    export: () => {
        Game.exportCanvas = document.createElement('canvas')
        Game.exportCanvas.width = VAR.gridWidth * VAR.exportPixelSize
        Game.exportCanvas.height = VAR.gridWidth * VAR.exportPixelSize
        Game.exportCtx = Game.exportCanvas.getContext('2d')
        Field.export()
        savePNG('export.png', Game.exportCanvas.toDataURL("image/png"))
    }
}

const saveAsJSON = (filename, dataObjToWrite) => {
    const blob = new Blob([JSON.stringify(dataObjToWrite)], { type: "text/json" })
    const link = document.createElement("a")

    link.download = filename
    link.href = window.URL.createObjectURL(blob)
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(":")

    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    })
    link.dispatchEvent(evt)
    link.remove()
}


const savePNG = (filename, url) => {
    const link = document.createElement("a")
    link.download = filename
    link.href = url
    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    })
    link.dispatchEvent(evt)
    link.remove()
}

const openFileDialog = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = e => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.readAsText(file, 'UTF-8')

        reader.onload = readerEvent => {
            const content = readerEvent.target.result
            console.log(content)
            return JSON.parse(content)
        }
    }
    input.click()
}