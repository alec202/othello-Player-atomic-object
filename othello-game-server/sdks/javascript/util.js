let board;
let player;
let opposing_player;

class SetofTuples {
    constructor() {
        this.set = new Set()
    }

    add(tuple) {
        this.set.add(JSON.stringify(tuple));
    }

    has(tuple) {
        this.set.has(JSON.stringify(tuple));
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
}

function determine_all_valid_moves() {
    /**
     * @returns {array} - 2D array where each sub-array contains two integers representing a valid move that this player can make,
    therefore returning all the valid moves this player can make.
     */

    /* utilize sets for two properties:
    1. No need to check for duplicate moves
    2. Faster look up
    */

    /** @type {set} */
    const all_moves = new SetofTuples();
    const potential_moves = new SetofTuples();
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
                potential_moves.union(possible_moves);
            }
            /*
            We have acquired all potential moves. Let's filter out the moves that don't have another one of our chips in
            any direction, because we need to sandwich the opponent chips by having our chips on both ends. If we choose a move
            that won't have one of our chips in any of the rows/columns/diagonals then it's an invalid move.
            */
        }
    }
}

function moves_next_to_this_opponent_chip(row, col) {
    /**
     * @param {number} row - number of row in the board
     * @param {number} col - column number for the board we are checking pieces for
     */
    const potential_moves = new SetofTuples()
    // first check if all the spaces around this piece are already filled as we don't want to waste time checking
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            curr_space = ([row + i, col + j]);
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

    console.log("potential moves are: ");
    console.log(potential_moves);
    return JSON.parse(potential_moves[0]);
}

function prepareResponse(move) {
    const response = `${JSON.stringify(move)}\n`;
    console.log(`Sending response ${response}`);
    return response;
}

module.exports = { getMove, prepareResponse };
