import { Game } from './game.js'
import { Colors } from './colors.js'

export class Field {
    static count = 0
    static all = []
    constructor() {
        if (Field.count > VAR.numberOfFields) {
            Field.count = 0
            Field.all = []
        }
        this.index = Field.count
        Field.count++
        this.gridX = (this.index % VAR.gridWidth)
        this.gridY = Math.floor(this.index / VAR.gridWidth)
        this.x = VAR.d * VAR.margin + VAR.field_width * this.gridX
        this.y = VAR.d * VAR.margin + VAR.field_width * this.gridY
        this.color = undefined
        Field.all.push(this)
    }
    recalculatePositions() {
        this.x = VAR.d * VAR.margin + VAR.field_width * this.gridX
        this.y = VAR.d * VAR.margin + VAR.field_width * this.gridY
    }
    draw() {
        // Game.ctx.fillText(this.index, this.x, this.y + VAR.field_width)
        if (this.color) {
            Game.ctx.fillStyle = `rgb(${this.color})`
            Game.ctx.fillRect(this.x, this.y, VAR.field_width, VAR.field_width)
        }
        if (Game.hoveredField === this.index) {
            Game.ctx.fillStyle = `rgba(${Colors[Game.current_color].rgb},0.7)`
            Game.ctx.fillRect(this.x, this.y, VAR.field_width, VAR.field_width)
        }
    }
    export () {
        Game.exportCtx.fillStyle = this.color ? `rgb(${this.color})` : 'rgb(255,255,255)'
        Game.exportCtx.fillRect(VAR.exportPixelSize + this.gridX * VAR.exportPixelSize, VAR.exportPixelSize + this.gridY * VAR.exportPixelSize, VAR.exportPixelSize, VAR.exportPixelSize)
    }
    static draw() {
        Field.all.forEach(f => {
            f.draw()
        })

    }
    static export() {
        Field.all.forEach(f => {
            f.export()
        })

    }
    static recalculatePositions() {
        Game.ctx.font = `40px Arial`
        Field.all.forEach(f => {
            f.recalculatePositions()
        })

    }

}