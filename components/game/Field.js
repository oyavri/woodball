class Field {
    constructor() { }

    renderField() {
        // PAIN ~oyavri
        // SO MUCH PAIN ~brkydnc

        // Goalposts
        Render.setLineWidth(config.otherLinesWidth);
        Render.setStrokeColor(config.field.lineColor);
        Render.rectangle(config.fieldStartHorizontal, config.canvas.height / 2 - config.goalpostVertical / 2, -config.goalpostHorizontal, config.goalpostVertical, true);
        Render.rectangle(config.canvas.width - config.fieldStartHorizontal, config.canvas.height / 2 - config.goalpostVertical / 2, config.goalpostHorizontal, config.goalpostVertical, true);

        // Midfield
        Render.circle(config.canvas.width / 2, config.canvas.height / 2, config.midCircleRadius, true, 0, 360);
        Render.setFillColor(config.field.lineColor)
        Render.circle(config.canvas.width / 2, config.canvas.height / 2, config.midDotRadius, false, 0, 360);
        Render.setFillColor(config.field.backgroundColor)
        Render.line(config.canvas.width / 2, config.fieldStartVertical, config.canvas.width / 2, config.canvas.height - config.fieldStartVertical);

        // Penalty Areas
        Render.circle(config.fieldStartHorizontal + config.smallPenaltyAreaHorizontal + (config.bigPenaltyAreaHorizontal - config.smallPenaltyAreaHorizontal) / 2, config.canvas.height / 2, config.penaltyCircleRadius, true, 270, 90);
        Render.strokeFillRectangle(config.fieldStartHorizontal, config.canvas.height / 2 - config.bigPenaltyAreaVertical / 2, config.bigPenaltyAreaHorizontal, config.bigPenaltyAreaVertical);
        Render.rectangle(config.fieldStartHorizontal, config.canvas.height / 2 - config.smallPenaltyAreaVertical / 2, config.smallPenaltyAreaHorizontal, config.smallPenaltyAreaVertical, true);

        Render.circle(config.canvas.width - (config.fieldStartHorizontal + config.smallPenaltyAreaHorizontal + (config.bigPenaltyAreaHorizontal - config.smallPenaltyAreaHorizontal) / 2), config.canvas.height / 2, config.penaltyCircleRadius, true, 90, 270);
        Render.strokeFillRectangle(config.canvas.width - config.fieldStartHorizontal, config.canvas.height / 2 - config.bigPenaltyAreaVertical / 2, -config.bigPenaltyAreaHorizontal, config.bigPenaltyAreaVertical);
        Render.rectangle(config.canvas.width - config.fieldStartHorizontal, config.canvas.height / 2 - config.smallPenaltyAreaVertical / 2, -config.smallPenaltyAreaHorizontal, config.smallPenaltyAreaVertical, true);

        Render.setFillColor(config.field.lineColor)
        Render.circle(config.fieldStartHorizontal + config.smallPenaltyAreaHorizontal + (config.bigPenaltyAreaHorizontal - config.smallPenaltyAreaHorizontal) / 2, config.canvas.height / 2, config.penaltyDotRadius, false, 0, 360)
        Render.circle(config.canvas.width - (config.fieldStartHorizontal + config.smallPenaltyAreaHorizontal + (config.bigPenaltyAreaHorizontal - config.smallPenaltyAreaHorizontal) / 2), config.canvas.height / 2, config.penaltyDotRadius, false, 0, 360)
        Render.setFillColor(config.field.backgroundColor)

        // Corners                        
        Render.circle(config.fieldStartHorizontal, config.fieldStartVertical, config.cornerRadius, true, 0, 90);
        Render.circle(config.fieldStartHorizontal, config.canvas.height - config.fieldStartVertical, config.cornerRadius, true, 270, 0);
        Render.circle(config.canvas.width - config.fieldStartHorizontal, config.fieldStartVertical, config.cornerRadius, true, 90, 180);
        Render.circle(config.canvas.width - config.fieldStartHorizontal, config.canvas.height - config.fieldStartVertical, config.cornerRadius, true, 180, 270);

        // Main field
        Render.setLineWidth(config.fieldLinesWidth);
        Render.rectangle(config.fieldStartHorizontal, config.fieldStartVertical, config.canvas.width - config.fieldStartHorizontal * 2, config.canvas.height - config.fieldStartVertical * 2, true);
    }
}