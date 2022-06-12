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
