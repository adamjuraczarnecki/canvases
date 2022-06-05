import { Field } from './field.js'
import { ai } from './ai.js'
import { Sounds, Sounds1 } from './sounds.js'

globalThis.VAR = {
    fps: 75,
    w: 0,
    h: 0,
    d: 0,
    lastTime: 0,
    lastUpdate: -1,
    margin: 0.1,
    background: '#fff',
    fill: '#000',
    hover: 'rgba(57,255,20,0.7)',
    wining: [
        [0, 4, 8],
        [2, 4, 6],
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8]
    ],
    sounds: Sounds
}

export const Game = {
    init: () => {
        Game.canvas = document.querySelector('#main')
        Game.ctx = Game.canvas.getContext("2d")
        // flags
        Game.current_move = 0
        Game.hoveredField = undefined
        Game.ended = false
        // events
        Game.canvas.addEventListener('mousemove', Game.onMove, false)
        Game.canvas.addEventListener('mouseout', Game.mouseOut, false)
        Game.canvas.addEventListener('mousedown', Game.click, false)
        Game.canvas.addEventListener('touchstart', Game.click, false)
        // start game
        Sounds.init()
        Sounds1.init()
        Game.layout()
        for (let f = 0; f < 9; f++) {
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
        VAR.field_width = VAR.board_width / 3
        Field.recalculatePositions()
    },
    drawBoard: () => {
        Game.ctx.beginPath()
        let start = 0 + VAR.w * VAR.margin + VAR.board_width / 3
        Game.ctx.moveTo(start, 0 + VAR.h * VAR.margin)
        Game.ctx.lineTo(start, VAR.h - (VAR.h * VAR.margin))
        Game.ctx.moveTo(0 + VAR.w * VAR.margin, start)
        Game.ctx.lineTo(VAR.h - (VAR.h * VAR.margin), start)
        start = start + VAR.board_width / 3
        Game.ctx.moveTo(start, 0 + VAR.h * VAR.margin)
        Game.ctx.lineTo(start, VAR.h - (VAR.h * VAR.margin))
        Game.ctx.moveTo(0 + VAR.w * VAR.margin, start)
        Game.ctx.lineTo(VAR.h - (VAR.h * VAR.margin), start)
        Game.ctx.stroke()

    },
    wipe: () => {
        Game.ctx.fillStyle = VAR.background
        Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height)
        Game.ctx.fillStyle = VAR.fill
        Game.ctx.lineWidth = 15*(VAR.d/698)
        Game.ctx.lineCap = 'round'
    },
    animaitonLoop: (time) => {
        requestAnimationFrame(Game.animaitonLoop)
        if (time - VAR.lastTime >= 1000 / VAR.fps) {
            VAR.lastTime = time
            Game.wipe()
            Field.draw()
            Game.drawBoard()
            if (Game.ended) { Game.endScreen() }
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
            const hoveredField = source_x > -1 && source_y > -1 ? source_x + source_y * 3 : undefined
            if (hoveredField > -1 && hoveredField < 9) {
                if (hoveredField != Game.hoveredField) {
                    Sounds.play('click')
                }
                Game.hoveredField = hoveredField
            }
        } else {
            Game.hoveredField = undefined
        }
    },
    mouseOut: (e) => {
        Game.hoveredField = undefined
    },
    click: (e) => {
        if (!Game.ended) {
            const rect = e.target.getBoundingClientRect()
            if ((e.clientX - rect.left) > VAR.d * VAR.margin &&
                e.clientY - rect.top > VAR.d * VAR.margin &&
                e.clientX - rect.left < VAR.w - VAR.d * VAR.margin &&
                e.clientY - rect.top < VAR.h - VAR.d * VAR.margin) {
                const source_x = Math.floor((e.clientX - (rect.left + (VAR.w - VAR.board_width) / 2)) / VAR.field_width)
                const source_y = Math.floor((e.clientY - (rect.top + (VAR.h - VAR.board_width) / 2)) / VAR.field_width)
                const clickedField = source_x + source_y * 3
                if (Field.all[clickedField].value === ' ') {
                    Game.move(clickedField)
                }

            }
        } else {
            Game.init()
        }
    },
    move: (clickedField) => {
        Field.all[clickedField].value = Field.values[Game.current_move % 2]
        Sounds1.play('tick')
        Game.playerWon = Game.whoWon()
        if (Game.playerWon || Game.current_move >= 8) {
            Game.ended = true
            Game.stop()
        } else {
            Game.current_move++
            Game.canvas.removeEventListener('mousedown', Game.click, false)
            Game.canvas.removeEventListener('touchstart', Game.click, false)
            setTimeout(ai.move, 1500)
        }
    },
    whoWon: () => {
        if (Game.current_move > -1) {
            const winingDiag = Field.values[Game.current_move % 2]
            return VAR.wining.some(x => x.every(i => Field.all[i].value === winingDiag))
        }
    },
    stop: () => {
        Game.canvas.removeEventListener('mousemove', Game.onMove, false)
        Game.canvas.removeEventListener('mouseout', Game.mouseOut, false)
        Game.stripeWiningRow()
        if (Game.playerWon) {
            Sounds.play('win')
        } else {
            Sounds.play('lose')
        }
    },
    stripeWiningRow: () => {

    },
    endScreen: () => {
        Game.ctx.fillStyle = 'rgba(150,150,150,0.7)'
        Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height)
        Game.ctx.fillStyle = VAR.background
        Game.ctx.font = `${40*(VAR.d/698)}px Arial`
        Game.ctx.textAlign = 'center'
        if (Game.playerWon || Game.aiWon) {
            Game.ctx.fillText(`" ${Field.values[Game.current_move % 2].toUpperCase()} " won`, VAR.d / 2, VAR.d / 3)
        } else {
            Game.ctx.fillText(`It is a tie!`, VAR.d / 2, VAR.d / 3)
        }
        Game.ctx.fillText(`Wanna plan again? Just click`, VAR.d / 2, VAR.d * 2 / 3)
    }
}

window.onload = function() {
    Game.init()
    window.addEventListener('resize', Game.layout, false)
}