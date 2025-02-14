import { useState, useEffect } from "react";
import { Canvas, Text, Rect, Circle, Triangle, Image } from 'fabric'
import io from "socket.io-client";

const App = () => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL
    const socket = io(SOCKET_URL);
    const [canvas, setCanvas] = useState(null);

    useEffect(() => {
        const newCanvas = new Canvas("editor", {
            width: 1200,
            height: 650,
            backgroundColor: "#ddd",
        });

        setCanvas(newCanvas);
        newCanvas.renderAll();

        // Load stored content
        socket.on("update-content", (content) => {
            newCanvas.loadFromJSON(content);
        });

        return () => {
            newCanvas.dispose();
            socket.off("update-content");
        };
    }, []);

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
        const content = canvas.toJSON();
        socket.emit("sync-content", content);
    };

    return (
        <div>
            <h1>Digital Signage CMS</h1>
            <button onClick={addText}>Add Text</button>
            <button onClick={addRect}>Add Rect</button>
            <button onClick={addCircle}>Add Circle</button>
            <button onClick={addTriangle}>Add Triangle</button>
            <button onClick={addImage}>Add Image</button>
            <button onClick={syncContent}>Sync Content</button>
            <canvas id="editor"></canvas>
        </div>
    );
};

export default App;