import React, { useState, useEffect, useRef } from 'react';
import { Save, Trash2, ArrowLeft, ArrowRight, Smile, Download } from 'lucide-react';
import CharacterDisplay from '../CharacterDisplay';
import { DialogueLine } from '../../types';

interface DrawTogetherProps {
  onScoreUpdate: (player: 'player1' | 'player2', points: number) => void;
}

const DrawTogether: React.FC<DrawTogetherProps> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [currentPlayer, setCurrentPlayer] = useState<'player1' | 'player2'>('player1');
  const [drawings, setDrawings] = useState<string[]>([]);
  const [currentDrawingIndex, setCurrentDrawingIndex] = useState(-1);
  const [dialogue, setDialogue] = useState<DialogueLine[]>([]);
  const [drawingPrompt, setDrawingPrompt] = useState<string>('');
  
  // Drawing context
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  // Load characters from localStorage
  const character1 = JSON.parse(localStorage.getItem('character1') || '{"id":"player1","name":"Player 1","hairColor":"#6B3FA0","skinColor":"#FFD3B6","outfitColor":"#FF8BA7","accessory":"glasses"}');
  const character2 = JSON.parse(localStorage.getItem('character2') || '{"id":"player2","name":"Player 2","hairColor":"#3A86FF","skinColor":"#F9DCC4","outfitColor":"#8BD3DD","accessory":"hat"}');
  
  // Drawing prompts
  const prompts = [
    "A sunset at the beach",
    "A cozy cabin in the woods",
    "Your dream vacation",
    "A funny animal",
    "Your favorite food",
    "A magical creature",
    "A futuristic city",
    "A beautiful garden",
    "Your ideal date",
    "A fantasy castle"
  ];
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;
    
    // Set up context
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    contextRef.current = context;
    
    // Clear canvas
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Initialize dialogue
    setDialogue([
      { character: 'player1', text: "Let's create something beautiful together!", emotion: 'happy' },
      { character: 'player2', text: "I can't wait to see what we draw!", emotion: 'happy' }
    ]);
    
    // Set random prompt
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setDrawingPrompt(randomPrompt);
    
  }, []);
  
  // Start drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      const rect = canvas.getBoundingClientRect();
      clientX = e.touches[0].clientX - rect.left;
      clientY = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      const rect = canvas.getBoundingClientRect();
      clientX = e.clientX - rect.left;
      clientY = e.clientY - rect.top;
    }
    
    context.beginPath();
    context.moveTo(clientX, clientY);
  };
  
  // Draw
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      const rect = canvas.getBoundingClientRect();
      clientX = e.touches[0].clientX - rect.left;
      clientY = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      const rect = canvas.getBoundingClientRect();
      clientX = e.clientX - rect.left;
      clientY = e.clientY - rect.top;
    }
    
    context.lineTo(clientX, clientY);
    context.stroke();
  };
  
  // Finish drawing
  const finishDrawing = () => {
    if (!isDrawing) return;
    
    const context = contextRef.current;
    if (!context) return;
    
    context.closePath();
    setIsDrawing(false);
  };
  
  // Change color
  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    
    const context = contextRef.current;
    if (!context) return;
    
    context.strokeStyle = newColor;
  };
  
  // Change brush size
  const handleBrushSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    setBrushSize(newSize);
    
    const context = contextRef.current;
    if (!context) return;
    
    context.lineWidth = newSize;
  };
  
  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
    
    setDialogue([
      { 
        character: currentPlayer, 
        text: "Let's start over!", 
        emotion: 'happy' 
      }
    ]);
  };
  
  // Save drawing
  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL('image/png');
    
    // Add to drawings array
    setDrawings(prev => [...prev, dataURL]);
    setCurrentDrawingIndex(drawings.length);
    
    // Clear canvas for next drawing
    clearCanvas();
    
    // Switch players
    setCurrentPlayer(prev => prev === 'player1' ? 'player2' : 'player1');
    
    // Update dialogue
    setDialogue([
      { 
        character: currentPlayer, 
        text: "I'm finished with my part!", 
        emotion: 'happy' 
      },
      { 
        character: currentPlayer === 'player1' ? 'player2' : 'player1', 
        text: "Now it's my turn to add to our masterpiece!", 
        emotion: 'happy' 
      }
    ]);
    
    // Give points for completing a drawing
    onScoreUpdate(currentPlayer, 3);
    
    // Set new random prompt if this is a new drawing
    if (drawings.length % 2 === 0) {
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      setDrawingPrompt(randomPrompt);
    }
  };
  
  // Download drawing
  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'couples-drawing.png';
    link.href = dataURL;
    link.click();
    
    // Add achievement dialogue
    setDialogue([
      { 
        character: 'player1', 
        text: "We should frame this!", 
        emotion: 'happy' 
      },
      { 
        character: 'player2', 
        text: "It's our first masterpiece together!", 
        emotion: 'happy' 
      }
    ]);
  };
  
  // Navigate drawings
  const navigateDrawings = (direction: 'prev' | 'next') => {
    if (drawings.length === 0) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = Math.max(0, currentDrawingIndex - 1);
    } else {
      newIndex = Math.min(drawings.length - 1, currentDrawingIndex + 1);
    }
    
    setCurrentDrawingIndex(newIndex);
    
    // Load drawing
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    
    const img = new Image();
    img.onload = () => {
      // Clear canvas
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
      
      // Draw image
      context.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2);
    };
    img.src = drawings[newIndex];
  };
  
  return (
    <div className="w-full">
      {/* Game instructions */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold text-lg mb-2">How to Play:</h3>
        <p className="text-gray-700">
          Take turns adding to the drawing based on the prompt. One player starts, then the other continues. Save your drawings to create a gallery of your artwork together!
        </p>
      </div>
      
      {/* Current player & prompt */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <div className={`p-2 rounded-lg ${currentPlayer === 'player1' ? 'bg-pink-100 ring-2 ring-pink-300' : 'bg-gray-50'}`}>
            <CharacterDisplay 
              character={currentPlayer === 'player1' ? character1 : character2} 
              size="small" 
              speaking={true}
            />
          </div>
          <div className="text-center">
            <div className="font-medium">{currentPlayer === 'player1' ? character1.name : character2.name}'s Turn</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-lg">
          <Smile className="text-pink-500" size={20} />
          <span className="font-medium">Prompt: {drawingPrompt}</span>
        </div>
      </div>
      
      {/* Dialogue */}
      {dialogue.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
          {dialogue.map((line, index) => (
            <div key={index} className="flex items-start gap-3 mb-2 last:mb-0">
              <CharacterDisplay 
                character={line.character === 'player1' ? character1 : character2} 
                size="small"
                emotion={line.emotion || 'happy'}
                speaking={true}
              />
              <div className="bg-white p-3 rounded-lg shadow-sm flex-1">
                <p>{line.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Drawing canvas */}
      <div className="mb-6">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={finishDrawing}
          onMouseLeave={finishDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={finishDrawing}
          className="w-full h-64 md:h-80 rounded-lg border-2 border-gray-300 touch-none"
          style={{ background: 'white' }}
        />
      </div>
      
      {/* Drawing controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Color and brush size */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium mb-3">Drawing Tools</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {['#000000', '#FF5252', '#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#795548'].map((colorOption) => (
                <button
                  key={colorOption}
                  onClick={() => handleColorChange(colorOption)}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    color === colorOption ? 'ring-2 ring-offset-2 ring-gray-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: colorOption }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brush Size: {brushSize}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={handleBrushSizeChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
        
        {/* Actions */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium mb-3">Actions</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={clearCanvas}
              className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
              <span>Clear</span>
            </button>
            
            <button
              onClick={saveDrawing}
              className="flex items-center justify-center gap-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
            
            <button
              onClick={downloadDrawing}
              className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Gallery navigation */}
      {drawings.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Your Gallery</h4>
            <div className="text-sm text-gray-600">
              {currentDrawingIndex + 1} / {drawings.length}
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigateDrawings('prev')}
              disabled={currentDrawingIndex <= 0}
              className={`p-2 rounded-full ${
                currentDrawingIndex <= 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft size={16} />
            </button>
            
            <button
              onClick={() => navigateDrawings('next')}
              disabled={currentDrawingIndex >= drawings.length - 1}
              className={`p-2 rounded-full ${
                currentDrawingIndex >= drawings.length - 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawTogether;