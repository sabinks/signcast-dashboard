import { useEffect, useState } from 'react';
import { Canvas, Text, Rect, Circle, Triangle, Image } from 'fabric'
import { socket } from '../App';

const AddScreen = ({ editScreen }) => {
    const [canvas, setCanvas] = useState(null);
    const [formData, setFormData] = useState({
        screenId: '',
        name: '',
    });
    useEffect(() => {
        let newCanvas;
        if (editScreen) {
            setFormData({
                screenId: editScreen.screenId,
                name: editScreen.name
            });
            newCanvas = new Canvas("editor", {
                width: 1200,
                height: 650,
                backgroundColor: "#ddd",
            });
            newCanvas.loadFromJSON(editScreen.content, () => {
                newCanvas.renderAll();
            });
            // newCanvas.renderAll();
            setCanvas(newCanvas);
            return () => {
                newCanvas.dispose();
                socket.off("update-content");
            };
        } else {
            newCanvas = new Canvas("editor", {
                width: 1200,
                height: 650,
                backgroundColor: "#ddd",
            });
            setCanvas(newCanvas);
            newCanvas.renderAll();
            return () => {
                newCanvas.dispose();
                socket.off("update-content");
            };
        }

    }, [editScreen]);

    const addText = () => {
        const text = new Text("New Text", { left: 50, top: 50 });
        canvas.add(text);
    };
    const addRect = () => {
        const rect = new Rect({ width: 20, height: 50, fill: '#ff0000' });
        canvas.add(rect);
    }
    const addCircle = () => {
        const circle = new Circle({ radius: 20, startAngle: 0, endAngle: 360, counterClockwise: true });
        canvas.add(circle);
    }
    const addTriangle = () => {
        const triangle = new Triangle({ width: 20, height: 50, fill: '#ff0000' });
        canvas.add(triangle);
    }
    const addImage = () => {
        const image = Image.fromURL("https://via.placeholder.com/150", (img) => {
            img.set({
                left: 150,
                top: 150,
                scaleX: 0.5,
                scaleY: 0.5,
            });
            canvas.add(image);
        })
    }
    const syncContent = () => {
        const payload = {
            screenId: formData.screenId,
            name: formData.name,
            content: canvas.toJSON()
        }
        if (editScreen) {
            socket.emit("update-screen", { payload, id: editScreen._id });
        } else {
            socket.emit("add-screen", payload);
        }
    };

    const handleChange = (e) => {
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
                </div>
                <div className="mb-4">
                    <div className='space-x-2 mb-4'>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' onClick={addText}>Add Text</button>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' onClick={addRect}>Add Rect</button>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' onClick={addCircle}>Add Circle</button>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' onClick={addTriangle}>Add Triangle</button>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' onClick={addImage}>Add Image</button>
                    </div>
                    <canvas id="editor"></canvas>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        onClick={syncContent}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {
                            editScreen ? 'Update Screen' : 'Add Screen'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddScreen;