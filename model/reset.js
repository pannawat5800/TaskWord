
let board = {
    grid: [
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
    ],
    description: ' 0 is blank area, 1 is the shipe of defender , x is the sank ship ',
    ships: [
        { name: 'Battleship', amount: 0, position: []},
        { name: 'Cruisers', amount: 0, position: [] },
        { name: 'Destroyers', amount: 0, position:[] },
        { name: 'Submarines', amount: 0, position:[]}
    ],
    total_ship:0,
    full_ship: 10,
    number_shot_total: 12,
    number_shot_actual: 0,
    number_missing_total:3,
    number_missing_actual:0
}

module.exports = board