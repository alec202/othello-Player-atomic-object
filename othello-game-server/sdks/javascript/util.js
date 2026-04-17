// const { init } = require("next/dist/compiled/webpack/webpack");

let board;
let player;
let opposing_player;

class SetOfTuples extends Set {

    add(tuple) {
        super.add(JSON.stringify(tuple));
        return this;
    }

    has(tuple) {
        return super.has(JSON.stringify(tuple));
    }

    getVal() {
        return JSON.parse(this.set.values().next().value);

    }
}

function getMove(playerNum, currentBoard) {
    // TODO: Determine valid moves
    // Update global reference.
    board = currentBoard;
    // update player to be the player value. it doesn't matter if we do this every time since the player won't change.
    player = playerNum;
    // update opposing_player to be the player value. it doesn't matter if we do this every time since the player won't change.
    opposing_player = player === 2 ? 1 : 2

    const move_to_make = determine_move();
    // TODO: Determine best move
    return [2, 3];
}

function determine_move() {
    // determine all of the valid moves
    const all_valid_moves = determine_all_valid_moves();
    // const best_move = determine_best_move();
}

function determine_all_valid_moves() {
    /**
     * @returns {SetOfTuples} - SetOfTuples where each sub-array contains two integers representing a valid move that this player can make,
    therefore returning all the valid moves this player can make.
     */

    /* utilize sets for two properties:
    1. No need to check for duplicate moves
    2. Faster look up
    */

    /** @type {set} */
    let potential_moves = new SetOfTuples();
    // we will get all potential moves and then need to filter out the real moves available
    for (let i = 0; i < 8; i++) {
        const row = board[i]
        for (let j = 0; j < 8; j++) {
            const val_at_col = board[i][j];
            /*
            check to make sure the val in the space is not the current player and also is the
            opposing player to ensure we aren't checking spaces that aren't even touching the rest
            of the chips because that would be invalid. Have to sandwich opposing player chips.
            */
            if (val_at_col === opposing_player) {
                const possible_moves = moves_next_to_this_opponent_chip(i, j);
                console.log("possible moves found");
                console.log(possible_moves)
                potential_moves = potential_moves.union(possible_moves);
            }
        }
    }
    /*
We have acquired all potential moves (without checking for sandwhich rule). 
Let's filter out the moves that don't have another one of our chips in
any direction, because we need to sandwich the opponent chips by having our chips 
on both ends. If we choose a move that won't have one of our chips in any 
of the rows/columns/diagonals then it's an invalid move.

One thing to watch out for: the values stored in the set are still JSON strings,
so if you iterate the set directly you'll get strings back. May want to also 
override values(), forEach(), etc. to parse them back into list items. HOWEVER
THIS MAY NOT MATTER SINCE THE PREPARE RESPONSE FUNCTION TURNS MY MOVE INTO A STRING 
ANYWAYS, SO ONLY IF WE NEED THE SET ITEM AS A LIST INTERNALLY WILL IT MATTER.
*/

}

function moves_next_to_this_opponent_chip(opponent_chip_row, opponent_chip_col) {
    /**
     * @param {number} opponent_chip_row - number of row in the board
     * @param {number} opponent_chip_col - column number for the board we are checking pieces for
     */
    const potential_moves = new SetOfTuples()
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            curr_space = ([opponent_chip_row + i, opponent_chip_col + j]);
            curr_row = curr_space[0];
            curr_col = curr_space[1];
            // make sure the column and rows are in bounds
            if ((0 <= curr_row && curr_row < 7) && (0 <= curr_col && curr_col < 8)) {
                // make sure this spot is empty and therefore available
                if (board[curr_row][curr_col] === 0) {
                    // if this space is available, lets add it to the potential spaces
                    potential_moves.add(curr_space)
                }
            }
        }
    }

    return potential_moves;
}

function prepareResponse(move) {
    const response = `${JSON.stringify(move)}\n`;
    console.log(`Sending response ${response}`);
    return response;
}

function codeTest() {
    const initial_received = {
        "board":
            [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 2, 0, 0, 0],
                [0, 0, 0, 2, 1, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0]
            ],
        "maxTurnTime": 15000,
        "player": 1
    }

    getMove(initial_received.player, initial_received.board)

}

codeTest();

module.exports = { getMove, prepareResponse };
