#!/usr/bin/python

import sys
import json
import socket

current_board = None
player = None
opposing_player = None

def get_move(playerNum, board):
    # this will assign a reference to the passed board but at a global level.
    current_board = board
   #  update player to be the player value. it doesn't matter if we do this every time since the player won't change.
    player = playerNum

    #  update opposing_player to be the player value. it doesn't matter if we do this every time since the player won't change.
    opposing_player = 2 if player == 1 else 1
    print("here")

   # TODO determine valid moves
    move_to_make = make_move()
    # TODO determine best move

    return [2, 3]

def make_move():
    # determine all of the valid moves
    all_valid_moves = determine_valid_moves()
    # Once we have all valid moves, determine the best move to make
    move_to_make = determine_best_move()
    return move_to_make
    
def determine_valid_moves():
    """
    :return: a 2D array where each sub-array contains two integers representing a valid move that this player can make,
    therefore returning all the valid moves this player can make.
    """
    # utilize set for two properties:
    # 1. No need to check for duplicate moves
    # 2. Faster look up
    # This will be a set of tuples where each tuple is a valid move
    all_moves = set()
    # we will get all potential moves and then need to filter out the real moves available
    potential_moves = set()
    for i in range(0, 8):
        row = board[i]
        for j, val in enumerate(row):
            # check to make sure the val in the space is not the current player and also is the
            # opposing player to ensure we aren't checking spaces that aren't even touching the rest
            # of the chips because that would be invalid. Have to sandwich opposing player chips.
            if val == opposing_player:
                possible_moves = moves_available_in_surrounding_spaces(val, i, j)
                potential_moves.union(possible_moves)

#     We have acquired all potential moves. Let's filter out the moves that don't have another one of our chips in
# any direction, because we need to sandwich the opponent chips by having our chips on both ends. If we choose a move
# that won't have one of our chips in any of the rows/columns/diagonals then it's an invalid move.

    print("got to end")



                    


def moves_available_in_surrounding_spaces(val, row, col):
    """
    :param val: int representing if this space has been played already, and if so, by whom.
    :param col: int for column number representing the space we want to check if it's playable.
    :param row: into for row number representing the space we want to check if it's playable.
    :return: boolean representing if this space is playable.
    """
    potential_moves = set()
    # first check if all the spaces around this piece are already filled as we don't want to waste time checking
    for i in range(-1, 2):
        for j in range(-1, 2):
            curr_space = (row + i, col + j)
            curr_row = curr_space[0]
            curr_col = curr_space[1]
            # make sure the column and rows are in bounds
            if 0 <= curr_row < 8 and 0 <= curr_col < 8:
                # make sure this spot is empty and therefor available
                if board[curr_row][curr_col] == 0:
                    # if this space is available, lets add it to the potential spaces
                    potential_moves.add(curr_space)
    return potential_moves


#     utilize try catch block and double for loops to check all 8 squares around this specific space.
# try catch block so that it'll automatically handle out of bounds exceptions with less code. Look into faster
# ways to do this
    
    


def determine_best_move():
    pass


    
    
def prepare_response(move):
    response = '{}\n'.format(move).encode()
    print('sending {!r}'.format(response))
    return response

if __name__ == "__main__":
    port = int(sys.argv[1]) if (len(sys.argv) > 1 and sys.argv[1]) else 1337
    host = sys.argv[2] if (len(sys.argv) > 2 and sys.argv[2]) else socket.gethostname()

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
      sock.connect((host, port))
      while True:
        data = sock.recv(1024)
        if not data:
          print('connection to server closed')
          break
        json_data = json.loads(str(data.decode('UTF-8')))
        board = json_data['board']
        maxTurnTime = json_data['maxTurnTime']
        player = json_data['player']
        print(player, maxTurnTime, board)
  
        move = get_move(player, board)
        response = prepare_response(move)
        sock.sendall(response)
    finally:
      sock.close()
