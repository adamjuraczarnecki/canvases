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
        const level = document.querySelector('input:checked').value
        const firstSim = new SimBoard(Field.all.map(x => x.value))
        let nextMove = undefined
        if (level === 'Easy') {
            nextMove = firstSim.getFreeFieldsIndexes[Math.floor(Math.random() * firstSim.getFreeFieldsIndexes.length)]
        }
        if (level === 'Medium') {
            nextMove = bfsMove(firstSim)
        }
        if (level === 'Hard') {
            nextMove = miniMax(firstSim, firstSim.getFreeFieldsIndexes[0], true, firstSim.getFreeFieldsIndexes.length).index
        }
        return Field.all[nextMove]
    }
}

function bfsMove(newSimBoard) {
    const initFreeIndexes = newSimBoard.getFreeFieldsIndexes
    // inicjalizacja kolejki
    let queue = []
    initFreeIndexes.forEach(x => {
        const sim = new SimBoard([...newSimBoard.fields])
        sim.fields[x] = 'x'
        queue.push({
            first: x,
            board: sim,
            move: sim.current_move
        })
    })

    while (queue.length) {
        const currentBoard = queue.shift()
        const currentWinner = currentBoard.board.whoWon
        if (currentWinner === 'x') {
            return currentBoard.first
        }
        currentBoard.board.getFreeFieldsIndexes.forEach(x => {
            const sim = new SimBoard([...currentBoard.board.fields])
            sim.fields[x] = sim.whoIsMoving
            if (sim.whoWon != 'o') {
                queue.push({
                    first: currentBoard.first,
                    board: sim,
                    move: sim.current_move
                })
            }
        })
    } // while
    return initFreeIndexes[Math.floor(Math.random() * initFreeIndexes.length)]
}


const miniMax = (
    currentBoard, index, isMax, depth
) => {
    const player = isMax ? 'x' : 'o';
    const best = {
        score: isMax ? -Infinity : Infinity,
        index: index
    }
    const nextDepth = depth ? depth - 1 : undefined;

    if (currentBoard.whoWon === 'x') {
        return { score: 1, index: index };
    }
    if (currentBoard.whoWon === 'o') {
        return { score: -1, index: index };
    }
    if (currentBoard.whoWon === ' ') {
        return { score: 0, index: index };
    }
    if (depth === 0) {
        return best;
    }
    const freeFields = currentBoard.getFreeFieldsIndexes
    freeFields.forEach((freeField) => {
        currentBoard.fields[freeField] = player
        const score = miniMax(new SimBoard(structuredClone(currentBoard.fields)), freeField, !isMax, nextDepth).score
        // console.log(`score ${score}`)
        currentBoard.fields[freeField] = ' '
        if (isMax) {
            if (score > best.score) {
                // console.log(`better score ${score}, index ${freeField}`)
                best.score = score
                best.index = freeField
            }
        } else {
            if (score < best.score) {
                // console.log(`worser score ${score}, index ${freeField}`)
                best.score = score
                best.index = freeField
            }
        }
    })
    // debugger
    return best
}

export class SimBoard {
    constructor(fields) {
        this.fields = fields
    }
    print() {
        const rows = []
        for (let i = 0; this.fields[i]; i += 3) {
            rows.push(this.fields.slice(i, i + 3).join(''))
        }
        console.log(rows.join('\n'))
    }
    get getFreeFieldsIndexes() {
        return this.fields.reduce((a, x, i) => {
            if (x === ' ') { a.push(i) };
            return a
        }, [])
    }
    get current_move() {
        return this.fields.reduce((a, x) => { if (x != ' ') { a++ } return a }, 0)
    }
    get xWon() {
        return globalThis.VAR.wining.some(x => x.every(i => this.fields[i] === 'x'))
    }
    get oWon() {
        return globalThis.VAR.wining.some(x => x.every(i => this.fields[i] === 'o'))
    }
    get isTie() {
        return this.fields.filter(x => x === ' ').length === 0 && !(this.xWon || this.oWon)
    }
    get whoWon() {
        if (this.xWon) {
            return 'x'
        }
        if (this.oWon) {
            return 'o'
        }
        if (this.isTie) {
            return ' '
        }
    }
    get whoIsMoving() {
        return Field.values[this.current_move % 2]
    }
}

function deepCopy(obj) {

}