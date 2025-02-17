import { Canvas, Group, Line, Polygon, Rect, Textbox, Triangle } from "fabric";

// Create a cube-like rectangle
export function createCube() {
    const rectangle = new Rect({
        left: 100,
        top: 100,
        fill: 'lightgray',
        width: 100,
        height: 100,
        stroke: 'black',
        strokeWidth: 2
    });
    const topFace = new Polygon([
        { x: 100, y: 100 },
        { x: 150, y: 70 },
        { x: 250, y: 70 },
        { x: 200, y: 100 }
    ], {
        fill: 'gray',
        stroke: 'black',
        strokeWidth: 2
    });
    const sideFace = new Polygon([
        { x: 200, y: 100 },
        { x: 250, y: 70 },
        { x: 250, y: 170 },
        { x: 200, y: 200 }
    ], {
        fill: 'darkgray',
        stroke: 'black',
        strokeWidth: 2
    });
    return new Group([rectangle, topFace, sideFace]);
}
export function createArrow(x1: number = 1, y1: number = 1, x2: number = 4, y2: number = 1) {
    const line = new Line([x1 + 20, y1 + 20, x2 + 40, y2 + 20], {
        stroke: 'black',
        strokeWidth: 5
    });

    // Create an arrowhead (triangle)
    const arrow = new Triangle({
        left: x2 + 10,
        top: y2 + 10,
        originX: 'center',
        originY: 'center',
        angle: Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI) + 90, // Rotate towards the line
        width: 15,
        height: 20,
        fill: 'black'
    });
    arrow.set({ left: line.x2, top: line.y2, originX: 'center', originY: 'center' });
    return new Group([line, arrow], { selectable: true }); // Group them together
}

export function createChart(canvas: Canvas) {
    const data = [30, 80, 45, 60, 90, 55]; // Sample values
    const labels = ["A", "B", "C", "D", "E", "F"];
    const barWidth = 50;
    const spacing = 20;
    const startX = 100;
    const baseY = 400;

    // Draw bars
    data.forEach((value, index) => {
        const bar = new Rect({
            left: startX + index * (barWidth + spacing),
            top: baseY - value * 3, // Scale the height
            width: barWidth,
            height: value * 3,
            fill: "blue",
            selectable: false,
        });
        canvas.add(bar);

        // Add labels
        const label = new Textbox(labels[index], {
            left: startX + index * (barWidth + spacing) + 15,
            top: baseY + 10,
            fontSize: 14,
            fill: "black",
        });
        canvas.add(label);
    });

    // Draw X & Y axis
    const xAxis = new Line([80, baseY, 600, baseY], {
        stroke: "black",
        strokeWidth: 2,
        selectable: false,
    });
    canvas.add(xAxis);

    const yAxis = new Line([80, 100, 80, baseY], {
        stroke: "black",
        strokeWidth: 2,
        selectable: false,
    });
    canvas.add(yAxis);
    return new Group([xAxis, yAxis]);
}