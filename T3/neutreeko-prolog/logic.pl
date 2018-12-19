/**
 * Sets a piece on the board list.
 * 
 * set_piece(+NLine, +NCol, +List, -NewList, +Piece)
 */  
set_piece(1, 1, [[_El|Rest1]|Rest2], [[Piece|Rest1]|Rest2], Piece).

set_piece(1, N, [[Elem|Rest1]|Rest2], [[Elem|Head]|Rest2], Piece):- 
	Next is N-1,
	set_piece(1, Next, [Rest1|Rest2], [Head|Rest2], Piece).

set_piece(N, NCol, [Elem |Rest1], [Elem|Out], Piece):- 
    Next is N-1,
	set_piece(Next, NCol, Rest1, Out, Piece).

/**
 * Performs a move, changing the given piece to a new position, and puts an empty piece on
 * the original one.
 *
 * move(+Move, +Board, -NewBoard)
 */
move([InitLine, InitCol, DestLine, DestCol], Player, Board, NewBoard) :-
    if_then_else(Player = 1, set(black, Piece), set(white, Piece)),
    set_piece(InitLine, InitCol, Board, TempBoard, empty),
    set_piece(DestLine, DestCol, TempBoard, NewBoard, Piece).

/**
 * Checks if a move is duplicate, meaning that it's useless in practice since the piece doesn't change places.
 * 
 * is_duplicate(+Move)
 */  
is_duplicate([InitLine,InitCol,InitLine,InitCol]).

/**
 * Discards duplicate moves.
 * 
 * discard_duplicate_moves(+Moves, -TempList, -NewList)
 */  
discard_duplicate_moves([], NewList, NewList).

discard_duplicate_moves([Head | Tail], TempList, NewList):-
        (is_duplicate(Head),discard_duplicate_moves(Tail, TempList, NewList));
        (discard_duplicate_moves(Tail, [Head | TempList], NewList)).

/**
 * Generates a list of valid moves for each piece of the current player.
 * 
 * valid_moves_piece(+Board, +Pieces , -TempMoves, -ValidMoves)
 */ 

valid_moves_piece(Board, Piece,List, ListOfMoves):-
    Init = Piece,
    Curr = Piece,
    valid_horizontal(Board, Curr, Init, List, HorMoves, -1),
    valid_vertical(Board, Curr, Init, HorMoves, HorVertMoves, -1),
    valid_diagonal(Board, Curr, Init, HorVertMoves, AllMoves, -1, -1),
    discard_duplicate_moves(AllMoves, [], ListOfMoves).

/**
 * Gets a piece from the board.
 * 
 * get_piece(+LineN, +ColN, +Board, -Piece)
 */ 
get_piece(LineN,ColN,Board,Piece):-
    nth1(LineN,Board,Line),
    nth1(ColN,Line,Piece).

/**
 * Returns the player's pieces positions on a list.
 *
 * get_pieces(+Player, -Pieces)
 */
get_pieces(Board, 1, Pieces) :-
    get_pieces_aux(Board, black, [], Pieces, 1).

get_pieces(Board, 2, Pieces) :-
    get_pieces_aux(Board, white, [], Pieces, 1).

get_pieces_row([], _, Pieces, Pieces, _, _).
get_pieces_row([Piece | T], Piece, SoFar, Pieces, Line, Col):-
    append(SoFar, [[Line, Col]], Next),
    NextCol is Col + 1,
    get_pieces_row(T, Piece, Next, Pieces, Line, NextCol).
get_pieces_row([_ | T], Piece, SoFar, Pieces, Line, Col):-
    NextCol is Col + 1,
    get_pieces_row(T, Piece, SoFar, Pieces, Line, NextCol).

get_pieces_aux([], _, Pieces, Pieces, _).
get_pieces_aux([H | T], Piece, SoFar, Pieces, Line):-
    get_pieces_row(H, Piece, SoFar, PiecesRow, Line, 1),
    NextLine is Line + 1,
    append(SoFar, PiecesRow, Next),
    get_pieces_aux(T, Piece, Next, Pieces, NextLine).


/**
 * Generates a list of the valid moves for a piece, in its line.
 * 
 * valid_horizontal(+Board, +DestPos, +InitPos, -TempMoves, -ValidMoves, +ColInc)
 */  
valid_horizontal(_Board, [_Line,_Col], [_InitLine,_InitCol] , Moves, Moves , 3).

valid_horizontal(Board, [Line,Col] , [InitLine,InitCol] , List, Moves , Inc):- 
    NextCol is Col + Inc,
    (
        /*if*/((NextCol = 0 ; NextCol = 6),
                Move = [InitLine, InitCol,Line,Col],
                NextInc is Inc + 2, 
                Next_Col is InitCol,
                append(List,[Move],NewList),
                valid_horizontal(Board, [Line,Next_Col] , [InitLine,InitCol] , NewList , Moves, NextInc)
              );
    get_piece(Line,NextCol,Board,Piece),
    /*else if*/((Piece = black ; Piece = white), 
                Move = [InitLine, InitCol,Line,Col], 
                NextInc is Inc + 2,
                Next_Col is InitCol,
                append(List,[Move],NewList),
                valid_horizontal(Board, [Line,Next_Col] , [InitLine,InitCol] , NewList , Moves, NextInc)
               );
    /*else*/(valid_horizontal(Board, [Line,NextCol], [InitLine,InitCol] , List, Moves , Inc))
    ).    

/**
 * Generates a list of the valid moves for a piece, in its column.
 * 
 * valid_vertical(+Board, +DestPos, +InitPos, -TempMoves, -ValidMoves, +LineInc)
 */  
valid_vertical(_Board, [_Line,_Col], [_InitLine,_InitCol] , Moves, Moves , 3).

valid_vertical(Board, [Line,Col] , [InitLine,InitCol] , List, Moves , Inc):- 
    NextLine is Line + Inc,
    (
        /*if*/((NextLine = 0 ; NextLine = 6),
                Move = [InitLine, InitCol,Line,Col],
                NextInc is Inc + 2, 
                Next_Line is InitLine,
                append(List,[Move],NewList),
                valid_vertical(Board, [Next_Line,Col] , [InitLine,InitCol] , NewList , Moves, NextInc)
              );
    get_piece(NextLine,Col,Board,Piece),
    /*else if*/((Piece = black ; Piece = white),
                Move = [InitLine, InitCol,Line,Col], 
                NextInc is Inc + 2, 
                Next_Line is InitLine,
                append(List,[Move],NewList),
                valid_vertical(Board, [Next_Line,Col] , [InitLine,InitCol] , NewList, Moves , NextInc)
               );
    /*else*/(valid_vertical(Board, [NextLine,Col], [InitLine,InitCol] , List, Moves , Inc))
    ).

/**
 * Generates a list of the valid moves for a piece, in its diagonal.
 * 
 * valid_diagonal(+Board, +DestPos, +InitPos, -TempMoves, -ValidMoves, +LineInc, +ColInc)
 */  
valid_diagonal(_Board, [_Line,_Col], [_InitLine,_InitCol] ,Moves, Moves , 3,3).

valid_diagonal(Board, [Line,Col] , [InitLine,InitCol] , List, Moves , LineInc,ColInc):- 
    NextLine is Line + LineInc,
    NextCol  is Col + ColInc,
    (
        /*if*/((NextLine = 0 ; NextLine = 6; NextCol = 0 ; NextCol = 6),
                Move = [InitLine, InitCol,Line,Col],
                (
                 (ColInc < 0 , LineInc < 0,NextColInc is ColInc + 2, NextLineInc is LineInc);
                 (ColInc > 0 , LineInc < 0,NextLineInc is LineInc + 2, NextColInc is ColInc - 2);
                 (ColInc < 0 , LineInc > 0,NextColInc is ColInc + 2, NextLineInc is LineInc);
                 (ColInc > 0 , LineInc > 0,NextLineInc is LineInc + 2, NextColInc is ColInc + 2)
                ),
                Next_Line is InitLine,
                Next_Col is InitCol,
                append(List,[Move],NewList),
                valid_diagonal(Board, [Next_Line,Next_Col] , [InitLine,InitCol] , NewList , Moves, NextLineInc, NextColInc)
              );
    get_piece(NextLine,NextCol,Board,Piece),
    /*else if*/((Piece = black ; Piece = white),
                Move = [InitLine, InitCol,Line,Col], 
                (
                 (ColInc < 0 , LineInc < 0,NextColInc is ColInc + 2, NextLineInc is LineInc);
                 (ColInc > 0 , LineInc < 0,NextLineInc is LineInc + 2, NextColInc is ColInc - 2);
                 (ColInc < 0 , LineInc > 0,NextColInc is ColInc + 2, NextLineInc is LineInc);
                 (ColInc > 0 , LineInc > 0,NextLineInc is LineInc + 2, NextColInc is ColInc + 2)
                ),
                Next_Line is InitLine,
                Next_Col is InitCol,
                append(List,[Move],NewList),
                valid_diagonal(Board, [Next_Line,Next_Col] , [InitLine,InitCol] , NewList ,Moves, NextLineInc, NextColInc)
               );
    /*else*/(valid_diagonal(Board, [NextLine,NextCol], [InitLine,InitCol] , List, Moves , LineInc,ColInc))
    ).

/**
 * Checks if there's a winner and returns it. A game is over if someone connected its
 * three pieces horizontally, vertically or diagonally.
 *
 * game_over(-Winner)
 */ 
game_over(Board, Winner) :- 
    game_over_row(Board, Winner).
game_over(Board, Winner) :- 
    game_over_col(Board, Winner).
game_over(Board, Winner) :- 
    game_over_diag(Board, Winner).
game_over(Board, Winner):-
    game_over_draw(Board, Winner).

/**
 * Checks if the same board configuration has happened 3 times (three-fold repetition),
 * in which case a draw occurs.
 * 
 * game_over_draw(-Winner)
 */
game_over_draw(-1, Count):-
    member(3, Count).

game_over_draw(0).

/**
 * Checks if a player has three consecutive pieces in a same row, thus winning the game.
 * 
 * game_over_row(-Winner)
 */
game_over_row(Board, 2) :-
    get_pieces(Board, 2, Pieces),
    are_consecutive_hor(Pieces).

game_over_row(Board, 1) :-
    get_pieces(Board, 1, Pieces),
    are_consecutive_hor(Pieces).

/**
 * Checks if a player has three consecutive pieces in a same diagonal, thus winning the game.
 *
 * game_over_diag(-Winner)
 */
game_over_diag(Board, 1) :-
    get_pieces(Board, 1, Pieces),
    are_consecutive_diag(Pieces).

game_over_diag(Board, 2) :-
    get_pieces(Board, 2, Pieces),
    are_consecutive_diag(Pieces).

/**
 * Checks if a player has three consecutive pieces in a same column, thus winning the game.
 *
 * game_over_col(-Winner)
 */
game_over_col(Board, 1) :-
    get_pieces(Board, 1, Pieces),
    are_consecutive_ver(Pieces).

game_over_col(Board, 2) :-
    get_pieces(Board, 2, Pieces),
    are_consecutive_ver(Pieces).

/**
 * Checks if three given pieces are consecutive in a board line.
 *
 * are_consecutive_hor(+Pieces)
 */ 
are_consecutive_hor([[F1,F2], [F1,S2], [F1, T2]]) :-
    are_numbers_consecutive([F2, S2, T2]).

/**
 * Checks if three given pieces are consecutive in a board column.
 *
 * are_consecutive_ver(+Pieces)
 */
are_consecutive_ver([[F1,F2], [S1,F2], [T1, F2]]) :-
    are_numbers_consecutive([F1, S1, T1]).

/**
 * Checks if three given pieces are consecutive in a board diagonal.
 *
 * are_consecutive_diag(+Pieces)
 */
are_consecutive_diag([[F1,F2], [S1,S2], [T1, T2]]) :-
    not(duplicate([[F1,F2], [S1,S2], [T1, T2]])),
    sort_by_x([[F1,F2], [S1,S2], [T1, T2]],Sorted),
    nth1(1,Sorted,First),
    nth1(2,Sorted,Middle),
    nth1(3,Sorted,Last),
    check_final_cond(First,Middle,Last).

/**
 * Check final condition to assure that 3 pieces are consecutive in the same diagonal.
 * 
 * check_final_cond(+First, +Middle, +Last)
 */ 
check_final_cond([X1,MinY],[X2,MiddleY],[X3,MaxY]):-
    (MaxY - MinY) =:= 2,
    MiddleY > MinY,
    MaxY > MiddleY,
    abs(X2 - X1) =:= 1,
    abs(X3 - X2) =:= 1,
    abs(X3 - X1) =:= 2.

/**
 * Updates draw related variables, at the end of each game turn. If the current board is new,
 * then it is appended to the board's list and a new element is added to the count list (1).
 * Else, the boards lists remains unaltered and the corresponding count is incremented.
 *
 * handle_draw(+NewBoard, +Boards, +CountOcurrences) 
 */
handle_draw(NewBoard, Boards, CountOcurrences) :-
    if_then_else(member(NewBoard, Boards), handle_draw_inc(NewBoard, Boards, CountOcurrences), handle_draw_add(NewBoard, Boards, CountOcurrences)).

/**
 * handle_draw_inc(+NewBoard, +Boards, +CountOcurrences) 
 */
handle_draw_inc(NewBoard, Boards, CountOcurrences, NewCountOcurrences):-
    nth0(Index, Boards, NewBoard),
    nth0(Index, CountOcurrences, Count),
    NewCount is Count+1,
    replace(CountOcurrences, Index, NewCount, NewCountOcurrences).

/**
 * handle_draw_add(+NewBoard, +Boards, +CountOcurrences) 
 */
handle_draw_add(NewBoard, Boards, CountOcurrences, NewBoards, NewCountOcurrences):-
    append(Boards, [NewBoard], NewBoards),
    append(CountOcurrences, [1], NewCountOcurrences).