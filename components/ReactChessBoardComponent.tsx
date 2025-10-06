import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
// TODO: define stockfish type
// import { type StockfishInstance } from '@/types/stockfish';
import { Dpad } from './ui/Dpad';


// The stockfish.js might not have default TypeScript types, use a require 
import stockfish from 'stockfish.js';

// TODO: cleanup
// import ToggleSwitch from './ui/ToggleSwitch';
// import TestToggleSwitch from './ui/TestToggleSwitch';

import { ToggleSwitch} from 'flowbite-react';
import TooltipIcon from './ui/TooltipIcon';
import { LinePad } from './ui/LinePad';

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

type AttackLine = string[];

const ReactChessBoardComponent: React.FC<{ initialFen: string | null}> = ({ initialFen }) => {
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

        // Reorder lines to bring the selected one to the top
        setAnalysisLines(prev => {
            if (!prev[index]) return prev;
            const newOrder = [prev[index], ...prev.slice(0, index), ...prev.slice(index + 1)];
            return newOrder;
        });

        // The selected index is now 0 after reordering
        setSelectedLineIndex(0);
    };

    const navigateMove = (direction: 'forward' | 'backward') => {
        if (analysisLines.length === 0) 
            return;

        const line = analysisLines[selectedLineIndex];
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
                    setFen(e.target.value); setBoardFen(e.target.value) }}
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
                />
            </div>



            <div className="flex justify-center items-center mt-4 gap-4">
                <LinePad onButtonClick={handleDpadClick} />
            </div>

            <button 
                onClick={handleAnalyzePosition} 
                disabled={isAnalyzing} 
                className="mt-4 w-full bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
                Analyze Position
            </button>

            <div className="mt-4">
                <h3 className="font-bold">Attack Lines:</h3>
                <div className="border rounded-md bg-white mt-2 h-40 overflow-y-auto">
                    {analysisLines.map((line, index) => (
                        <div
                            key={index}
                            onClick={() => { 
                                setSelectedLineIndex(index);                                 
                            }}
                            className={`p-2 cursor-pointer ${selectedLineIndex === index ? 'bg-blue-100' : ''}`}
                        >
                            <span className="font-bold mr-2">{index + 1}.</span>
                            {line.map((move, moveIdx) => (
                                <span key={moveIdx} className={selectedLineIndex === index && currentMoveIndex === moveIdx ? 'font-bold text-red-500' : ''}>
                                    {move}{' '}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <ToggleSwitch checked={isToggled} onChange={setIsToggled} />
            {/* <TestToggleSwitch /> */}
            <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold">Flip Board:</span>
                    <label className="inline-flex items-center cursor-pointer">
                        {/* <ToggleSwitch 
                            id="switch-players"
                            checked={isToggled}
                            onChange={
                                (e) => {
                                    setIsToggled(e.target.checked);
                                    setOrientation(o => o === 'white' ? 'black' : 'white');
                                }
                            }
                        /> */}
                        {/* <input type="checkbox" className="sr-only peer" onChange={() => setOrientation(o => o === 'white' ? 'black' : 'white')} />
                        <div className="relative w-11 h-6 bg-gray-100 rounded-full peer 
                                        peer-checked:after: translate-x-full 
                                        peer-checked:after:border-white after:content-[''] 
                                        after:absolute after:top-0.5 after:start-[2px] 
                                        after:bg-white after:border-gray-200 after:border 
                                        after:rounded-full after:h-5 after:w-5 after:transition-all 
                                        peer-checked:bg-blue-500">                            
                        </div> */}
                    </label>
            </div>
        </div>
    );
 
    // useEffect() here keeps the chess.js engine in sync when the FEN is changed manually
    // useEffect(() => {
    //     try {
    //         game.load(fen);
    //     } catch (error) {
    //         console.log(`Error invalid FEN: ${fen}. Error: ${error}`, fen, error);
    //     }
    // }, [fen, game]);

    // return (
    //     <div className="p-4">
    //         <Chessboard
    //             position={fen}
    //             onPieceDrop={onPieceDrop}
    //             arePiecesDraggable={true} 
    //         />

    //         <div className="mt-2">
    //             <label htmlFor="fenInput" className="block text-sm font-medium text-gray-700">
    //                 Set Fen Position
    //             </label>
    //             <input 
    //                 type="text"
    //                 id="fenInput"
    //                 value={fen}
    //                 onChange={(e) => setFen(e.target.value)}
    //                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-400 focus:ring-indigo-400 sm:text-sm"
    //             />
    //         </div>

    //         <div className="mt-4 p-4 border bg-gray-50 rounded h-48 font-mono text-sm overflow-y-auto">
    //             <h3 className="font-sans font-bold text-lg mb-2">
    //                 Stockfish Analysis 
    //             </h3>
    //             {isAnalyzing && <p>Analyzing...</p>}
    //             {analysis.map((line, index) => (
    //                 <p key={index} className="whitespace-pre-wrap text-xs">{line}</p>
    //             ))}
    //         </div>

    //         <button 
    //             onClick={handleAnalyzePosition}
    //             disabled={isAnalyzing}
    //             className="mt-4 w-full bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
    //         >
    //             {isAnalyzing ? 'Analyzing...' : 'Analyze Position'}
    //         </button>
    //     </div>
    // );
};

export default ReactChessBoardComponent;
