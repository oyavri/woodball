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

        this.cursorIsOnButton = false;
        this.cursorDownOnButton = false;

        let checkIsOnButton = (self, args) => {
            if (self.isFreezed()) return;

            let doContain = Vector.doContain(self.location, Vector.add(self.location, self.dimension), args.location);
            self.cursorIsOnButton = (doContain) ? true : false;
        },
            checkStartedOnButton = (self, args) => {
                if (args.hasOwnProperty("button") && args.button != Input.keys.mouseLeft) return;
                if (self.isFreezed()) return;

                self.cursorDownOnButton = (self.cursorIsOnButton) ? true : false;
            },
            clickButton = (self) => {
                if (!self.cursorIsOnButton || !self.cursorDownOnButton || self.isFreezed()) return;

                self.cursorDownOnButton = false;
                self.click();
            };

        Input.registerTask(Input.taskId.mouseMove, this, checkIsOnButton);
        Input.registerTask(Input.taskId.mouseDown, this, checkStartedOnButton);
        Input.registerTask(Input.taskId.mouseUp, this, clickButton);

        Input.registerTask(Input.taskId.touchMove, this, checkIsOnButton);
        Input.registerTask(Input.taskId.touchStart, this, checkIsOnButton);
        Input.registerTask(Input.taskId.touchStart, this, checkStartedOnButton);
        Input.registerTask(Input.taskId.touchEnd, this, clickButton);
    }

    render() {
        Render.setLineWidth(config.buttonLineWidth);
        Render.setStrokeColor(config.field.lineColor);
        Render.setFillColor((!this.cursorIsOnButton) ? config.field.backgroundColor : config.buttonHoverColor);
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