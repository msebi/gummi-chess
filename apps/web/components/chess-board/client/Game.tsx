import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { CustomDialog } from "@/components/chess-board/client/components/CustomDialog";

function Game({ players, room, orientation, cleanup}) {
    const chess = useMemo(() => new Chess(), []); 
    const [fen, setFen] = useState(chess.fen());
    const [over, setOver] = useState("");

    // onDrop function 
    function onDrop(sourceSquare, targetSquare) {
        const moveData = {
            from: sourceSquare,
            to: targetSquare,
            color: chess.turn(), // reutrns 'w' or 'b' current color to move
            // promotion: 'q'
        };

        const move = makeAMove(moveData);

        // illegal move
        if (move === null) return false;

        return true;
    }

    const makeAMove = useCallback(
        (move) => {
            try {
                const result = chess.move(move); // update Chess instance 
                setFen(chess.fen()); // update fen state to trigger a re-render
                
                console.log("ove, checkmate", chess.isGameOver(), chess.isCheckmate());

                if (chess.isGameOver()) { // check if move led to game over 
                    if (chess.isCheckmate()) { // if reason for game over is checkmate 
                        setOver(
                            `Checkmate! ${chess.turn() === 'w' ? 'black' : 'white'} wins!`
                        );
                        // Determine the winner by which side made the last move                        
                    } else if (chess.isDraw()) { // if it is a draw
                        setOver("Draw");
                    } else {
                        setOver("Game Over");
                    }
                }

                return result;
            } catch (e) {
                console.error("Error making move:", e);
                return null;
            }
        },
        [chess]
    );

    
    return (
        <>
            <div className="board">
                <Chessboard position={fen} onPieceDrop={onDrop} />
            </div>        
            <CustomDialog 
                open={Boolean(over)}
                title={over}
                contentText={over}
                handleContinue={() => {
                    setOver("")
                }}
            />
        </>
    ); 
}

