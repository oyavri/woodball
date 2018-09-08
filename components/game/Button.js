class Button extends Freezable {
    constructor(x, y, w, h, text, onClick, textColor = "#DCDCDC", fontSize = map(5, config.canvas.height), stroke = true) {
        super();

        this.location = new Vector(x, y);
        this.dimension = new Vector(w, h);
        this.text = text;
        this.textColor = textColor;
        this.onClick = onClick;
        this.stroke = stroke;
        this.fontSize = fontSize;

        this.mouseIsOnButton = false;
        this.mouseClickStartedOnButton = false;

        Input.registerTask(Input.taskId.mouseDown, this, (self, args) => {
            if (args.button != Input.keys.mouseLeft || self.isFreezed() || !self.mouseIsOnButton) return;

            self.mouseClickStartedOnButton = true;
        });

        Input.registerTask(Input.taskId.mouseUp, this, (self) => {
            if (!self.mouseIsOnButton || !self.mouseClickStartedOnButton || self.isFreezed()) return;

            self.mouseClickStartedOnButton = false;
            self.click();
        });

        Input.registerTask(Input.taskId.mouseMove, this, (self, args) => {
            if (self.isFreezed()) return;

            let doContain = Vector.doContain(self.location, Vector.add(self.location, self.dimension), args.location);
            self.mouseIsOnButton = (doContain) ? true : false;
        });
    }

    render() {
        Render.setLineWidth(config.buttonLineWidth);
        Render.setStrokeColor(config.field.lineColor);
        Render.setFillColor((!this.mouseIsOnButton) ? config.field.backgroundColor : config.buttonHoverColor);
        if (this.stroke) {
            Render.strokeFillRectangle(this.location.x, this.location.y, this.dimension.x, this.dimension.y);
        } else {
            Render.rectangle(this.location.x, this.location.y, this.dimension.x, this.dimension.y);
        }
        Render.text(this.text, this.location.x + this.dimension.x / 2, this.location.y + this.dimension.y * 2 / 3, this.fontSize, this.textColor);
    }

    click() {
        this.onClick();
    }
}