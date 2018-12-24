:- use_module(library(random)).

:- dynamic(currPlayer/1).
:- dynamic(currMax/1).
:- dynamic(currMaxBoard/1).
:- dynamic(currRoot/1).
:- dynamic(lost/1).
:- dynamic(previousMax/1).
:- dynamic(previousMaxBoard/1).

/**
 * Useful data.
 */ 
currPlayer(0).
currMax(-2000).
currMaxBoard([]).
previousMax(-2000).
previousMaxBoard([]).
currRoot([]).
lost(0).

/**
 * player_piece(+Player, -Piece)
 */ 
player_piece(1, black).
player_piece(2, white).

/**
 * True if P2 is the next player to play after P1.
 * 
 * nextPlayer(+P1, +P2)
 */ 
nextPlayer(1, 2).
nextPlayer(2, 1).

/**
 * choose_move(+Board, +Depth, -NextBoard)
 */
choose_move(Board, Depth, Player, NextBoard):-
    retract(currPlayer(_)),
    assert(currPlayer(Player)),
    retract(currMax(_)),
    assert(currMax(-2000)),
    retract(currMaxBoard(_)),
    assert(currMaxBoard([])),
    retract(previousMax(_)),
    assert(previousMax(-2000)),
    retract(previousMaxBoard(_)),
    assert(previousMaxBoard([])),
    retract(currRoot(_)),
    assert(currRoot([])),
    retract(lost(_)),
    assert(lost(0)),
    choose_move_aux([Player,play,Board], Depth, Depth),
    currMaxBoard(NextBoard).

/**
 * Checks if in the current board, the game has ended.
 * This predicate is needed because the one already implemented makes use of
 * outside values to check the pieces positions.
 * 
 * game_over_ai(+Board, -Winner).
 */
game_over_ai(Board, Winner):-
    game_over_row(Board, Winner).

game_over_ai(Board, Winner):-
    game_over_col(Board, Winner).

game_over_ai(Board, Winner):-
    game_over_diag(Board, Winner).

/**
 * Checks if two pieces are consecutive.
 * 
 * are_consecutive_ai(+Pieces)
 */
are_consecutive_ai(Pieces):-
    are_consecutive_ai_hor(Pieces).

are_consecutive_ai(Pieces):-
    are_consecutive_ai_ver(Pieces).

are_consecutive_ai(Pieces):-
    are_consecutive_ai_diag(Pieces).

/**
 * Checks if two pieces are consecutive in the same line.
 * 
 * are_consecutive_ai_hor(+Pieces)
 */
are_consecutive_ai_hor([[F1,F2], [F1,S2]]):-
    are_numbers_consecutive([F2, S2]).

/**
 * Checks if two pieces are consecutive in the same column.
 * 
 * are_consecutive_ai_ver(+Pieces)
 */
are_consecutive_ai_ver([[F1,F2], [S1,F2]]):-
    are_numbers_consecutive([F1, S1]).

/**
 * Checks if two pieces are consecutive in the same diagonal.
 * 
 * are_consecutive_ai_diag(+Pieces)
 */ 
are_consecutive_ai_diag([[F1,F2], [S1,S2]]):-
    are_numbers_consecutive([F1, S1]),
    are_numbers_consecutive([F2, S2]).
    
/**
 * Evaluates the board according to the pieces positions.
 * 
 * value(+Board, -Value, +Depth).
 */ 
value(Board,Val, Depth):-
    currPlayer(P), 
    nextPlayer(P,NextP),
    (
        ( 
            check_win(P,Board,Depth,Val)
            ;
            (
                check_win(NextP,Board,Depth,ValL), 

                Val is 0 - ValL,
                retract(lost(_)),
                assert(lost(1))
            )
        )
        ;
        (   
            Depth =:= 1,
            value_aux(P,Board,Val1),
            value_aux(NextP,Board,Val2),
            Val is Val1 - Val2
        )
        ;
        Val is -2000
    ).

/**
 * Checks if the Player has won in this board, and returns the appropriate value
 * according to the tree Depth.
 * 
 * check_win(+Player, +Board, +Depth, -Val)
 */ 
check_win(Player,Board, Depth,Val):- 
    game_over_ai(Board,Player),
    Val is 100 * Depth.

/**
 * Player has advantage (2 consecutive pieces).
 * 
 * value_aux(+Player, +Board, -Value)
 */ 
value_aux(Player, Board, 10):-
    get_pieces(Board, Player, [[F1,F2], [S1,S2], [T1,T2]]),
    are_consecutive_ai([[F1,F2], [S1,S2]]);
    are_consecutive_ai([[F1,F2], [T1,T2]]);
    are_consecutive_ai([[S1,S2], [T1,T2]]).

value_aux(_,_Board, 0).

/**
 * Generate list with all valid positions starting from Pos [Player, State, Board].
 * 
 * moves(+Pos, -PosList)
 */  
moves([Player, _State, Board], PosList):-
    get_pieces(Board, Player, Pieces),
    valid_moves(Board, Pieces,[],Moves),
    generate_pos_list([Player, play, Board], Moves, _TempPosList, PosList).

/**
 * Generate list with all valid positions starting from Pos.
 * 
 * generate_pos_list(+Pos, Moves, -TempPosList, -PosList)
 */ 
generate_pos_list([_Player, _State, _Board], [], PosList, PosList).

generate_pos_list([Player, State, Board], [Head | Tail], TempPosList,PosList):-
    move_ai([Player, State, Board], Head, NewPos),
    append(TempPosList, [NewPos], NewPosList),
    generate_pos_list([Player, State, Board], Tail, NewPosList,PosList).

/**
 * Current Player wins with this move.
 * 
 * move_ai(+Pos, +Move, -NextPos)
 */ 
move_ai([Player, play, Board], Move, [NextPlayer, win, NewBoard]):-
    nextPlayer(Player, NextPlayer),
    move_ai_aux(Move, Board, NewBoard,Player),
    game_over_ai(NewBoard, Player), !.

/**
 * Game ends in draw with this move.
 */ 
move_ai([Player, play, Board], Move, [NextPlayer, draw, NewBoard]):-
    nextPlayer(Player, NextPlayer),
    move_ai_aux(Move, Board, NewBoard,Player),
    game_over_ai(NewBoard, -1), !.

/**
 * Game continues with this move.
 */
move_ai([Player, play, Board], Move, [NextPlayer, play, NewBoard]):-
    nextPlayer(Player, NextPlayer),
    move_ai_aux(Move, Board, NewBoard, Player).

/**
 * move_ai_aux(+Move, +Board, -NewBoard, +Player)
 */ 
move_ai_aux([InitLine, InitCol, DestLine, DestCol], Board, NewBoard, Player) :-
    player_piece(Player, Piece),
    set_piece(InitLine, InitCol, Board, TempBoard, empty), 
    set_piece(DestLine, DestCol, TempBoard, NewBoard, Piece).

/**
 * random_shuffle(+PosList, -List, -Moves)
 */ 
random_shuffle([],List,List).

random_shuffle(PosList,List,NewMoves):-
    length(PosList,L),
    random(0,L,Random),
    nth0(Random,PosList,Move),
    delete(PosList, Move,TempMoves),
    append(List,[Move], AnotherList),
    random_shuffle(TempMoves,AnotherList,NewMoves).

/**
 * choose_move_aux(+Pos, +Depth)
 */ 
choose_move_aux([_Player,_State,Board], Depth, Diff):-
    Depth =:= Diff - 1,
    retract(currRoot(_)),
    assert(currRoot(Board)),
    lost(L),
    (
        (
            L =:= 1,
            previousMax(PMax),
            previousMaxBoard(PMaxBoard),
            retract(lost(_)),
            retract(currMax(_)),
            retract(currMaxBoard(_)),
            assert(lost(0)),
            assert(currMax(PMax)),
            assert(currMaxBoard(PMaxBoard))
        )
        ;
        (   
            currMax(Max),
            currMaxBoard(MaxBoard),
            retract(previousMax(_)),
            retract(previousMaxBoard(_)),
            assert(previousMax(Max)),
            assert(previousMaxBoard(MaxBoard))
        )     
    ),
    fail.

choose_move_aux([_Player,_State,Board], Depth, Diff):-
    Depth \= Diff,
    value(Board, Val, Depth),
    currMax(Max),
    currRoot(Root),
    (
        (
            Val > Max,
            retract(currMax(_)),
            retract(currMaxBoard(_)),
            assert(currMax(Val)),
            assert(currMaxBoard(Root))
        )
        ;
        true
    ),
    fail.

choose_move_aux([Player,State,Board], Depth, Diff) :-
    (
        Depth > 1,
        moves([Player,State,Board], PosList),!,
        random_shuffle(PosList,[],NewMoves),
        best(NewMoves, Depth, Diff)
    )
    ;
    true.

/**
 * best(+PosList, +Depth)
 */ 
best([],_, _).

best([Pos | PosList], Depth, Diff):-
    NextDepth is Depth - 1, 
    choose_move_aux(Pos, NextDepth, Diff),
    best(PosList, Depth, Diff).