export const Sounds = {
    active: false,
    init: function() {
        Sounds.fx = new Howl({
            src: ['sounds.m4a'],
            sprite: {
                click: [45, 90],
                win: [215, 1596],
                lose: [2536, 4300]
            },
            onload: Sounds.loaded
        })


    },
    loaded: function() {
        Sounds.active = true
    },
    // tą metodą odtwarzamy dźwięki
    play: function(s) {
        if (Sounds.active) {
            Sounds.fx.play(s)
        }
    }
}


export const Sounds1 = {
    active: false,
    init: function() {
        Sounds1.fx = new Howl({
            src: ['ticktack.m4a'],
            sprite: {
                tick: [110, 265],
                tack: [1087, 1237],
            },
            onload: Sounds1.loaded
        })


    },
    loaded: function() {
        Sounds1.active = true
    },
    // tą metodą odtwarzamy dźwięki
    play: function(s) {
        if (Sounds1.active) {
            Sounds1.fx.play(s)
        }
    }
}