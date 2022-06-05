import { Game } from './canvas.js'
import { Field } from './field.js'
import { Sounds1 } from './sounds.js'

export const ai = {
    move: () => {
        ai.choseField().value = Field.values[Game.current_move % 2]
        Sounds1.play('tack')
        Game.aiWon = Game.whoWon()
        if (Game.aiWon || Game.current_move >= 8) {
            Game.ended = true
            Game.stop()
            Game.canvas.addEventListener('mousedown', Game.click, false)
            Game.canvas.addEventListener('touchstart', Game.click, false)
        } else {
            Game.current_move++
            Game.canvas.addEventListener('mousedown', Game.click, false)
            Game.canvas.addEventListener('touchstart', Game.click, false)
        }
    },
    choseField: () => {
        const freeFields = Field.all.filter(x => x.value === ' ').map(x => x.index)
        return Field.all[freeFields[Math.floor(Math.random() * freeFields.length)]]
    }
}