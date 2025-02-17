import { useEffect, useRef, useState } from 'react';
import { Canvas, Circle, Line, Rect, Textbox, Triangle } from 'fabric'
import { v4 as uuidv4 } from 'uuid';
import { ErrorsProps, screenProps } from '../types';
import { socket } from './layout';
import { handleCreateScreen } from '../api';
import { useNavigate } from 'react-router-dom';

import { createArrow, createCube } from '../shapes';
import { TrashIcon } from '@heroicons/react/24/outline';

const AddScreen = () => {
    const navigate = useNavigate();
    const [canvas, setCanvas] = useState<Canvas | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<screenProps>({
        screenId: '',
        name: ''
    });
    const [errors, setErrors] = useState<ErrorsProps[]>([]);
    useEffect(() => {
        if (canvasRef.current && canvasContainerRef.current) {
            const newCanvas: Canvas = new Canvas(canvasRef.current, {
                width: canvasContainerRef.current.clientWidth,
                height: canvasContainerRef.current.clientHeight,
                backgroundColor: "#ddd",
            });
            setCanvas(newCanvas);
            newCanvas.renderAll();
            return () => {
                newCanvas.dispose();
                socket.off("update-content");
            };
        }
    }, []);
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Delete") {
                if (canvas) {
                    const activeObject = canvas.getActiveObject();
                    if (activeObject) {
                        canvas.remove(activeObject);
                        canvas.discardActiveObject();
                        canvas.requestRenderAll();
                    }
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [canvas]);
    const handleShapeAdd = (shape: string) => {
        if (canvas) {
            switch (shape) {
                case 'grid': {
                    const cellSize = 100;
                    for (let i = 0; i < 8; i++) {
                        for (let j = 0; j < 5; j++) {
                            const rect = new Rect({
                                left: i * cellSize,
                                top: j * cellSize,
                                width: cellSize,
                                height: cellSize,
                                fill: "white",
                                stroke: "gray",
                                strokeWidth: 1,
                                selectable: false,
                            });
                            canvas.add(rect);
                        }
                    }
                    break;
                }
                case 'text': {
                    const text = new Textbox("Edit Text", { left: 50, top: 50 });
                    canvas.add(text);
                    break;
                }
                case 'rect': {
                    const rect = new Rect({
                        left: 100,
                        top: 100,
                        fill: 'lightgray',
                        width: 100,
                        height: 100,
                        stroke: 'black',
                        strokeWidth: 2
                    });
                    canvas.add(rect);
                    break;
                }
                case 'triangle': {
                    const triangle = new Triangle({ width: 20, height: 50, fill: '#ff0000' });
                    canvas.add(triangle);
                    break;
                }
                case 'circle': {
                    const circle = new Circle({ radius: 40, startAngle: 0, endAngle: 360, counterClockwise: true });
                    canvas.add(circle);
                    break;
                }
                case 'halfCircle': {
                    const halfCircle = new Circle({ radius: 40, startAngle: 0, endAngle: 180, counterClockwise: true });
                    canvas.add(halfCircle);
                    break;
                }
                case 'cube': {
                    const cube = createCube();
                    canvas.add(cube);
                    break;
                }
                case 'line': {
                    const line = new Line([50, 50, 200, 50], {
                        stroke: 'black',
                        strokeWidth: 5
                    });
                    canvas.add(line);
                    break;
                }

                case 'arrow': {
                    const arrow = createArrow();
                    arrow.set('objectId', uuidv4())
                    canvas.add(arrow);
                    break;
                }
                default:
                    break;
            }
            canvas.renderAll()
        }
    }
    const deleteAllObjects = () => {
        if (canvas) {
            canvas.clear();
            canvas.set({ backgroundColor: "#ddd" });
        }
    };
    const syncContent = async () => {
        const payload = {
            screenId: formData.screenId,
            name: formData.name,
            content: canvas ? canvas.toJSON() : {},
            width: canvas ? canvas.width : 0,
            height: canvas ? canvas.height : 0
        }
        try {
            await handleCreateScreen(payload);
            socket.emit("get-all-screens", () => { });
            navigate('/screens');
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const { status, data } = (error as { response: { status: number; data: ErrorsProps[] } }).response;
                if (status == 422) {
                    setErrors(data)
                }
            }
        }
        // if (editScreen) {
        //     socket.emit("update-screen", { payload, id: editScreen._id });
        // }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <div className="container mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-5">Add New Screen</h2>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="screenId">
                        Screen ID
                    </label>
                    <input
                        type="text"
                        name="screenId"
                        id="screenId"
                        value={formData.screenId}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {
                        errors.find((error: ErrorsProps) => error.key === 'screenId') && <p className='text-red-500 text-xs italic'>{
                            errors.find((error: ErrorsProps) => error.key === 'screenId')?.message}</p>
                    }
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Screen Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {
                        errors.find((error: ErrorsProps) => error.key === 'name') && <p className='text-red-500 text-xs italic'>{
                            errors.find((error: ErrorsProps) => error.key === 'name')?.message}</p>
                    }
                </div>
                <div className="flex justify-between mb-2">
                    <div className='space-x-2'>
                        <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300' onClick={() => handleShapeAdd('text')}>Text</button>
                        <button className='bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300' onClick={() => handleShapeAdd('rect')}>Rect</button>
                        <button className='bg-lime-500 hover:bg-lime-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300' onClick={() => handleShapeAdd('triangle')}>Triangle</button>
                        <button className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300' onClick={() => handleShapeAdd('circle')}>Circle</button>
                        <button className='bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300' onClick={() => handleShapeAdd('halfCircle')}>Half Circle</button>
                        <button className='bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300' onClick={() => handleShapeAdd('cube')}>Cube</button>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300' onClick={() => handleShapeAdd('line')}>Line</button>
                        <button className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300' onClick={() => handleShapeAdd('arrow')}>Arrow</button>
                    </div>
                    <div className="">
                        <button className='bg-red-500 hover:bg-red-700 text-white font-bold p-1 rounded text-sm transition duration-300' onClick={() => deleteAllObjects()}><TrashIcon className='w-5 h-5' /></button>
                    </div>
                </div>
                <div className="mb-4 flex" id="canvas-container" ref={canvasContainerRef}>
                    <canvas ref={canvasRef} className='w-full' />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        onClick={syncContent}
                        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300"
                    >
                        Add Screen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddScreen;