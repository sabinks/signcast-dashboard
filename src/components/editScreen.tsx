import { useEffect, useRef, useState } from 'react';
import { Canvas, Rect, Circle, Triangle, Textbox, } from 'fabric'
import { ErrorsProps, screenProps } from '../types';
import { socket } from './layout';
import { useAppContext } from '../hooks/appContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleEditScreen } from '../api';
import { toast } from 'react-toastify';
import { classNames } from '../utils';

const EditScreen = () => {
    const { screens } = useAppContext()
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    let screenId = ''
    let edit = false
    for (const entry of searchParams.entries()) {
        const [param, value] = entry;
        if (param == 'screenId') {
            screenId = value
        }
        if (param == 'edit') {
            edit = value == "false" ? false : true
        }
    }
    const [canvas, setCanvas] = useState<Canvas | null>(null);
    const [formData, setFormData] = useState<screenProps>({
        screenId: '',
        name: ''
    });
    const [errors, setErrors] = useState<ErrorsProps[]>([]);
    const canvasRef = useRef(null);
    const editScreen: screenProps | undefined = screens.find(screen => screen.screenId === screenId)

    useEffect(() => {
        if (canvasRef.current && editScreen && editScreen.content) {
            setFormData({
                screenId: editScreen.screenId,
                name: editScreen.name
            });
            const newCanvas: Canvas = new Canvas(canvasRef.current, {
                width: 1200,
                height: 650,
                backgroundColor: "#ddd",
            });
            newCanvas.loadFromJSON(editScreen.content);
            newCanvas.requestRenderAll();

            setCanvas(newCanvas);
            return () => {
                newCanvas.dispose();
                socket.off("update-content");
            };
        }
    }, [editScreen]);

    const addText = () => {
        const text = new Textbox("New Text", { left: 50, top: 50 });
        if (canvas) {
            canvas.add(text);
        }
    };
    const addRect = () => {
        const rect = new Rect({ width: 20, height: 50, fill: '#ff0000' });
        if (canvas) {
            canvas.add(rect);
        }
    }
    const addCircle = () => {
        const circle = new Circle({ radius: 20, startAngle: 0, endAngle: 360, counterClockwise: true });
        if (canvas) {
            canvas.add(circle);
        }
    }
    const addTriangle = () => {
        const triangle = new Triangle({ width: 20, height: 50, fill: '#ff0000' });
        if (canvas) {
            canvas.add(triangle);
        }
    }
    const addImage = () => {

    }
    // const addImage = () => {
    //     const image = Image.fromURL("https://via.placeholder.com/150", (img) => {
    //         img.set({
    //             left: 150,
    //             top: 150,
    //             scaleX: 0.5,
    //             scaleY: 0.5,
    //         });
    //         canvas.add(image);
    //     })
    // }
    const syncContent = async () => {
        const payload = {
            screenId: formData.screenId,
            name: formData.name,
            content: canvas ? canvas.toJSON() : {}
        }
        try {
            if (editScreen && editScreen._id) {
                await handleEditScreen(payload, editScreen._id);
                navigate('/screens');
            } else {
                toast.error('Screen not found', { autoClose: 2000 });
            }
        } catch (error: any) {
            const { status, data } = error.response;
            if (status == 422) {
                setErrors(data)
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
                        disabled
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />

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
                <div className="mb-4">
                    <div className='space-x-2 mb-4'>
                        <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300' onClick={addText}><></>Add Text</button>
                        <button className='bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300' onClick={addRect}>Add Rect</button>
                        <button className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300' onClick={addCircle}>Add Circle</button>
                        <button className='bg-lime-500 hover:bg-lime-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300' onClick={addTriangle}>Add Triangle</button>
                        <button className='bg-lime-500 hover:bg-lime-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300' onClick={addImage}>Add Image</button>
                        {/* <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' onClick={addImage}>Add Image</button> */}
                    </div>
                    <canvas ref={canvasRef} />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        onClick={syncContent}
                        disabled={!edit}
                        className={
                            classNames(edit ? "bg-purple-500 hover:bg-purple-700 transition duration-300" : "bg-gray-500 cursor-not-allowed",
                                "text-white font-bold py-1 px-3 rounded text-sm ",
                            )
                        }
                    >
                        Update Screen
                    </button>
                </div>
            </div>
        </div >
    );
};

export default EditScreen;