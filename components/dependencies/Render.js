class Render {
    static setFillColor(color) {
        config.context.fillStyle = color;
    }

    static setStrokeColor(color) {
        config.context.strokeStyle = color;
    }

    static setLineWidth(n) {
        config.context.lineWidth = n;
    }

    static background(color) {
        config.context.beginPath();
        config.context.fillStyle = color;
        config.context.fillRect(0, 0, config.canvas.width, config.canvas.height);
        config.context.closePath();
    }

    static circle(x, y, radius, stroke = false, startAngle = 0, endAngle = 360) {
        config.context.beginPath();
        config.context.arc(x, y, radius, (Math.PI * startAngle) / 180, (Math.PI * endAngle) / 180);
        if (stroke) config.context.stroke(); else config.context.fill();
        config.context.closePath();
    }

    static strokeFillCircle(x, y, radius, startAngle = 0, endAngle = 360) {
        config.context.beginPath();
        config.context.arc(x, y, radius, (Math.PI * startAngle) / 180, (Math.PI * endAngle) / 180);
        config.context.stroke();
        config.context.fill();
        config.context.closePath();
    }

    static rectangle(x, y, width, height, stroke = false) {
        config.context.beginPath();
        config.context.rect(x, y, width, height);
        if (stroke) config.context.stroke(); else config.context.fill();
        config.context.closePath();
    }

    static strokeFillRectangle(x, y, width, height) {
        config.context.beginPath();
        config.context.fillRect(x, y, width, height);
        config.context.rect(x, y, width, height);
        config.context.stroke();
        config.context.closePath();
    }

    static line(x1, y1, x2, y2) {
        config.context.beginPath();
        config.context.moveTo(x1, y1);
        config.context.lineTo(x2, y2);
        config.context.stroke();
        config.context.closePath();
    }

    static text(text, x, y, fontSize, color = "#DCDCDC", align = "center") {
        config.context.font = `${fontSize}px Helvetica`;
        config.context.fillStyle = color;
        config.context.textAlign = align;
        config.context.fillText(text, x, y);
    }
}