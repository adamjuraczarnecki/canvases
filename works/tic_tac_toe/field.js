import { Game } from './canvas.js'

export class Field {
    static count = 0
    static all = []
    static values = ['o', 'x']
    constructor() {
        if (Field.count > 8) {
            Field.count = 0
            Field.all = []
        }
        this.index = Field.count
        Field.count++
        this.gridX = (this.index % 3)
        this.gridY = Math.floor(this.index / 3)
        this.x = VAR.d * VAR.margin + VAR.field_width * this.gridX
        this.y = VAR.d * VAR.margin + VAR.field_width * this.gridY
        this.value = ' '
        Field.all.push(this)
    }
    draw() {
        // Game.ctx.fillText(this.index, this.x, this.y + VAR.field_width)
        if (this.value) {
            if (this.value === 'o') {
                Game.ctx.beginPath()
                Game.ctx.arc(
                    this.x + VAR.field_width / 2,
                    this.y + VAR.field_width / 2,
                    (VAR.field_width * (1 - VAR.margin * 3)) / 2,
                    0, 2 * Math.PI)
                Game.ctx.stroke()
            } else if (this.value === 'x') {
                Game.ctx.beginPath()
                let margin = VAR.field_width * (VAR.margin * 2)
                Game.ctx.moveTo(this.x + margin, this.y + margin)
                Game.ctx.lineTo(this.x + VAR.field_width - margin, this.y + VAR.field_width - margin)
                Game.ctx.moveTo(this.x + margin, this.y + VAR.field_width - margin)
                Game.ctx.lineTo(this.x + VAR.field_width - margin, this.y + margin)
                Game.ctx.stroke()
            } else if (Game.hoveredField === this.index) {
                Game.ctx.fillStyle = VAR.hover
                Game.ctx.fillRect(this.x, this.y, VAR.field_width, VAR.field_width)
            }
        }
    }
    static draw() {
        Game.ctx.font = `40px Arial`
        Field.all.forEach(f => {
            f.draw()
            // console.log(f)
        })

    }
}