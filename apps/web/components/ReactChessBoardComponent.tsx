import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
// TODO: define stockfish type
// import { type StockfishInstance } from '@/types/stockfish';
// The stockfish.js might not have default TypeScript types, use a require 
import stockfish from 'stockfish.js';


import { ToggleSwitch} from 'flowbite-react';
import TooltipIcon from './ui/TooltipIcon';
import { ControlButton } from './ui/ui-controllers/ControlButton';

// You are using the older CommonJS require syntax. When a bundler like 
// Webpack (or Turbopack) processes this, it often wraps the ES module in an 
// object. So, the stockfish variable doesn't become the function you want 
// to call. Instead, it becomes an object that looks like this:

// {
//   default: function() { /* the actual stockfish function */ }
// }
// const stockfish = require('stockfish');

interface StockfishInstance {
  postMessage: (command: string) => void;
  addEventListener: (type: 'message', listener: (e: MessageEvent) => void) => void;
  terminate: () => void;
}

type ReactChessBoardComponentProps = {
    initialFen: string | null;
    onFenNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
};

const ReactChessBoardComponent: React.FC<ReactChessBoardComponentProps> = ({ initialFen, onFenNavigate }) => {
    // useMemo ensures that the chess.js instance is created only once
    const game = useMemo(() => new Chess(), []);
    // FEN string represents the board's position
    const [fen, setFen] = useState(initialFen || 'start');
    const [analysisFen, setAnalysisFen] = useState(initialFen || 'start');
    // FEN for what the user sees on the board
    const [boardFen, setBoardFen] = useState(fen); 

    // Store analysis as an array of move arrays (e.g. [['e2e4', 'e7e5'], ['d2'd4']])
    const [analysisLines, setAnalysisLines] = useState<string[][]>([]);
    const [selectedLineIndex, setSelectedLineIndex] = useState<number>(0);
    const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(-1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [orientation, setOrientation] = useState<'white' | 'black'>('white');
    const engine = useRef<StockfishInstance | null>(null);
    const analysisBoxRef = useRef<HTMLDivElement>(null);
    
    // SVG definitions for arrows
    const arrowUp = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14l5-5 5 5z"/></svg>;
    const arrowDown = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>;
    const arrowLeft = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14 7l-5 5 5 5z"/></svg>;
    const arrowRight = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 17l5-5-5-5z"/></svg>;

    // Sync internal FEN state with the prop from the parent
    useEffect(() => {
        //  This updates the visual board's state. It's safe
        // to use here
        setFen(initialFen || 'start');        
        setAnalysisFen(initialFen || 'start');
        setBoardFen(initialFen || 'start');
        if (initialFen && initialFen !== 'start') {            
            game.load(initialFen || 'start');
        } else {
            game.reset();
        }
        setAnalysisLines([]);
        setSelectedLineIndex(0);
        setCurrentMoveIndex(-1);
    }, [initialFen, game]);

    // Initialize Stockfish
    useEffect(() => {
        // Use Web Worker to run stockfish
        const worker = new Worker('/stockfish.wasm.js');
        engine.current = worker;

        worker.addEventListener('message', (e: MessageEvent) => {
            const message: string = e.data;
            console.log("stockfish message: ", message);
            // Filter for the analysis lines we care about
            if (message.startsWith('info depth') && message.includes(' multipv ') && message.includes(' pv ')) {
                const parts = message.split(' ');
                const multipvIndex = parts.indexOf('multipv');
                const pvIndex = parts.indexOf('pv');

                if (multipvIndex !== -1 && pvIndex !== -1) {
                    const pvNumber = parseInt(parts[multipvIndex + 1], 10);
                    const moves = parts.slice(pvIndex + 1);

                    setAnalysisLines(prevLines => {
                        const newLines = [...prevLines];
                        newLines[pvNumber - 1] = moves; // Correctly update the specific line
                        return newLines;
                    });
                }
            } else if (message.startsWith('bestmove')) {
                setIsAnalyzing(false); // Stop the loading indicator
            }
        });

        // The cleanup function will run when the component unmounts
        return () => {
            engine.current?.terminate();
        };
    }, []); // Run only on mount

    // Handler to enforce legal moves on the board
    const onPieceDrop = (sourceSquare: string, targetSquare: string) => {
        // Operate on current position
        const gameCopy = new Chess(boardFen);
        try {
            const move = gameCopy.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q', // Promote to queen always
            });

            // If the move is illegal, chess.js will throw an error
            if (move === null) {
                return false; 
            }

            const newFen = gameCopy.fen();
            // If move legal, update FEN state
            setFen(newFen);
            setBoardFen(newFen);
            setAnalysisFen(newFen);
            setAnalysisLines([]);
            return true;
        } catch (error) {
            console.log("Invalid move:", error);
            return false; 
        }
    };

    const handleAnalyzePosition = () => {
        if (!engine.current) return;
        setAnalysisLines([]);
        setSelectedLineIndex(0);
        setCurrentMoveIndex(-1);
        setIsAnalyzing(true);

        engine.current.postMessage('uci');
        engine.current.postMessage(`position fen ${fen}`);
        engine.current.postMessage('setoption name multipv value 4');
        engine.current.postMessage('go depth 15 multipv 4'); // First 4 best lines, 15 moves deep

        // TODO: adjust, remove
        // setTimeout(() => {
        //     engine.current?.postMessage('stop');
        //     setIsAnalyzing(false);
        // }, 20000); // 20 seconds
    };

    const handleLineSelection = (index: number) => {
        setSelectedLineIndex(index);
        setCurrentMoveIndex(-1);
        // Reset board to base fen when selecting a new line
        setBoardFen(analysisFen);

        // TODO: Remove?
        // Reorder lines to bring the selected one to the top
        // setAnalysisLines(prev => {
        //     if (!prev[index]) return prev;
        //     const newOrder = [prev[index], ...prev.slice(0, index), ...prev.slice(index + 1)];
        //     return newOrder;
        // });

        // The selected index is now 0 after reordering
        // setSelectedLineIndex(0);
    };

    // TODO: remove
    // const navigate = (direction: LinePadDirection) => {
    //     if (direction === 'left' || direction === 'right') {
    //         navigateMove(direction);
    //         return;
    //     }

    //     if (direction === 'up' || direction === 'down') {
    //         navigateLine(direction);
    //         return;
    //     }

    //     console.log(`Invalid direction of clicked button controller: ${direction}`);
    //     throw new Error(`Invalid direction of clicked button controller: ${direction}`);
    // };

    const navigateMove = (direction: 'forward' | 'backward') => {
        if (analysisLines.length === 0) 
            return;

        const line = analysisLines[selectedLineIndex];
        if (!line) 
            return;
        let newMoveIndex = currentMoveIndex;

        if (direction === 'forward' && newMoveIndex < line.length - 1) {
            newMoveIndex++;
        } else if (direction === 'backward' && newMoveIndex > -1) {
            newMoveIndex--;
        } else if (direction === 'backward' && newMoveIndex === -1) {
            return; // Can't go back further
        } else {
            // Reset if going back from the first move
            newMoveIndex = -1;
        }

        // Reset to the base position and apply moves up to the new index
        if (analysisFen === 'start') {
            setAnalysisFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        }            
        const tempGame = new Chess(analysisFen);
        for (let i = 0; i <= newMoveIndex; i++) {
            tempGame.move(line[i]);
        }

        setCurrentMoveIndex(newMoveIndex);
        setBoardFen(tempGame.fen());
    };

    const navigateLine = (direction: 'up' | 'down') => {
        if (analysisLines.length === 0) return;
        let newIndex = selectedLineIndex;
        if (direction === 'up') {
            newIndex = (selectedLineIndex - 1 + analysisLines.length) % analysisLines.length;
        } else {
            newIndex = (selectedLineIndex + 1) % analysisLines.length;
        }
        handleLineSelection(newIndex);
    };

    const handleBoardSwitch = () => {
        setIsToggled(!isToggled);
        setOrientation(o => o === 'white' ? 'black' : 'white');
    };

    const handleAnalysisDpad = (direction: string) => {
        switch (direction) {
            case 'up': 
                navigateLine('up'); 
                break; 
            case 'down':
                navigateLine('down');
                break;
            case 'backward': 
                navigateMove('backward');
                break;
            case 'forward':
                navigateMove('forward');
                break;
        }
    };

    // Switch players toggle button
    const [isToggled, setIsToggled] = useState(false);

    return (
        <div className="p-4 flex flex-col gap-4">
            <Chessboard position={boardFen} boardOrientation={orientation}  onPieceDrop={onPieceDrop} />

            <div>
                <label htmlFor="fenInput" className="block text-sm font-medium text-gray-600">
                    Set FEN Position
                </label>
                <input type="text" id="fenInput" value={boardFen} onChange={(e) => { 
                    setFen(e.target.value); 
                    setAnalysisFen(e.target.value);
                    setBoardFen(e.target.value); }}
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
                />
            </div>

            {/* This centers the control buttons, the analyze button as well as the switch board position 
            button */}
            <div className="flex flex-col items-center gap-4 mt-4">

                {/* This div now acts as the alignment container for the buttons */}
                <div className="flex flex-col items-center gap-3">
                
                    {/* Row 1: FEN Navigation */}
                    <div className="relative flex items-center">
                        {/* The Tooltip is positioned absolutely relative to this container */}
                        <div className="absolute right-full mr-2">
                            <TooltipIcon tooltipText="Navigate FEN positions from the video." />
                        </div>
                        <div className="flex gap-2">
                            <ControlButton onClick={() => onFenNavigate('up')}>{arrowUp}</ControlButton>
                            <ControlButton onClick={() => onFenNavigate('down')}>{arrowDown}</ControlButton>
                            <ControlButton onClick={() => onFenNavigate('left')}>{arrowLeft}</ControlButton>
                            <ControlButton onClick={() => onFenNavigate('right')}>{arrowRight}</ControlButton>
                        </div>
                    </div>

                    {/* Row 2: Analysis Navigation */}
                    <div className="relative flex items-center">
                        <div className="absolute right-full mr-2">
                            <TooltipIcon tooltipText="Use these controls to navigate the analysis lines below." />
                        </div>
                        <div className="flex gap-2">
                            <ControlButton onClick={() => handleAnalysisDpad('up')}>{arrowUp}</ControlButton>
                            <ControlButton onClick={() => handleAnalysisDpad('down')}>{arrowDown}</ControlButton>
                            <ControlButton onClick={() => handleAnalysisDpad('backward')}>{arrowLeft}</ControlButton>
                            <ControlButton onClick={() => handleAnalysisDpad('forward')}>{arrowRight}</ControlButton>
                        </div>
                    </div>
                </div>

                {/* Analyze Position Button */}
                <button
                onClick={handleAnalyzePosition}
                disabled={isAnalyzing}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
                >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Position'}
                </button>

                {/* Flip Board Toggle */}
                <div className="flex items-center gap-2">
                <span className="font-bold">Flip Board:</span>
                <ToggleSwitch 
                    id="flip-board-toggle" 
                    checked={orientation === 'black'} 
                    onChange={handleBoardSwitch} 
                />
                </div>
            </div>      

            <div>
                <h3 className="font-bold">Attack Lines:</h3>
                <div ref={analysisBoxRef} className="border rounded-md bg-white mt-2 h-40 overflow-y-auto">
                    {analysisLines.map((line, index) => (
                        <div
                            key={index}
                            onClick={() => handleLineSelection(index)}
                            className={`p-2 cursor-pointer font-mono text-xs 
                                        ${selectedLineIndex === index ? 'bg-blue-200' : ''}`}
                        >
                        <span className="font-bold mr-2 text-gray-500">{index + 1}.</span>
                        {line.map((move, moveIdx) => (
                            <span key={moveIdx} className={selectedLineIndex === index && currentMoveIndex === moveIdx ? 'font-extrabold text-blue-900 underline' : ''}>
                            {move}{' '}
                            </span>
                        ))}
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
    );
};

export default ReactChessBoardComponent;
