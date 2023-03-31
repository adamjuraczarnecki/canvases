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
        const firstSim = new SimBoard(Field.all.map(x => x.value))
        // console.log(firstSim)
        // console.log(firstSim.current_move)
        // console.log(firstSim.whoIsMoving)
        const goodMove = bfsMove(firstSim)
        const bestMove = minimax(firstSim)
        console.log(`best move: ${bestMove.index}, score: ${bestMove.score}`)
        // stare
        const freeFields = Field.all.filter(x => x.value === ' ').map(x => x.index)
        const chosenField = freeFields[Math.floor(Math.random() * freeFields.length)]
        return Field.all[goodMove]
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
            console.log('winner!', currentBoard)
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

function minimax(currentBoard, currentPlayer) {
    const freeFields = currentBoard.getFreeFieldsIndexes
    if (currentBoard.xWon) {
        console.log('win!')
        return { score: 10 }
    }
    if (currentBoard.oWon) {
        return { score: -10 }
    }
    if (currentBoard.isTie) {
        return { score: 0 }
    }
    const moves = []
    for (let i = 0; i < freeFields.length; i++) {
        const move = {}
        move.index = freeFields[i]
        const newBoard = new SimBoard([...currentBoard.fields])
        newBoard.fields[freeFields[i]] = currentPlayer
        if (currentPlayer == 'x') {
            const result = minimax(newBoard, 'o')
            move.score = result.score
        } else {
            const result = minimax(newBoard, 'x')
            move.score = result.score
        }

        moves.push(move)
    }
    let bestMove = null
    if (currentPlayer == 'x') {
        bestMove = moves.reduce((a, x) => {
            if (x.score > a.score) {
                return x
            } else {
                return a
            }
        }, { score: -100 })
    } else {
        bestMove = moves.reduce((a, x) => {
            if(x.score < a.score){
                return x
            } else {
                return a
            }
        }, { score: 100 })
    }
    return bestMove
}

class SimBoard {
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
        return this.fields.filter(x => x === ' ').length === 0
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