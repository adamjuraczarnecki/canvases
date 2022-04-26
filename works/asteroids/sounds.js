export const Sounds = {
    active: false,
    init: function() {
        Sounds.fx = new Howl({
            src: ['asteroids.m4a'],
            sprite: {
                bum1: [0, 1100],
                bum2: [1125, 1000],
                laser: [2150, 290],
                win: [2475, 575],
                thrust: [3100, 290]
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