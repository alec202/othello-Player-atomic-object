#!/usr/bin/python

import sys
import json
import socket

current_board = None
player = None
def get_move(playerNum, board):
    # this will assign a reference to the passed board but at a global level.
    current_board = board
   #  update player to be the player value. it doesn't matter if we do this everytime since the player won't change.
    player = playerNum
   # TODO determine valid moves
    move_to_make = make_move()
    # TODO determine best move
    return move_to_make

def make_move():
    # determine all of the valid moves
    all_valid_moves = determine_valid_moves(player, board)
    # Once we have all valid moves, determine the best move to make
    move_to_make = determine_best_move()
    return move_to_make
    
def determine_valid_moves():
    """
    :return: a 2D array where each sub-array contains two integers representing a valid move that this player can make,
    therefore returning all the valid moves this player can make.
    """
    for i in range(0, 8):
        row = board[i]
        for j, val in enumerate(row):
            if val != player:
                is_valid_space(val, j, i)


def is_valid_space(val, col, row):
    """
    :param val: int representing if this space has been played already, and if so, by whom.
    :param col: int for column number representing the space we want to check if it's playable.
    :param row: into for row number representing the space we want to check if it's playable.
    :return: boolean representing if this space is playable.
    """
    # first check if all the spaces around this piece are already filled as we don't want to waste time checking
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
