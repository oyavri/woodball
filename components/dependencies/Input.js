class Input {
    static registerTask(id, customArgs, callback) {
        if (!Input.tasks.hasOwnProperty(id)) Input.tasks[id] = [];
        Input.tasks[id].push({ customArgs, callback });
    }

    static triggerTask(id, triggerArgs) {
        if (Input.tasks.hasOwnProperty(id)) {
            Input.tasks[id].forEach(task => {
                task.callback(task.customArgs, triggerArgs);
            });
        }
    }

    static setCursorLocation(e, rect) {
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        Input.cursorLocation.set(x, y);
    }
}

Input.cursorLocation = new Vector(0, 0);
Input.states = {};
Input.tasks = {};
Input.keys = {};

Input.taskId = {
    mouseDown: 0,
    mouseUp: 1,
    mouseMove: 2,
    mouseClick: 3,
    touchStart: 4,
    touchEnd: 5,
    touchCancel: 6,
    touchMove: 7
};

Input.keys.mouseLeft = 0;
Input.keys.mouseRight = 2;

if (!("ontouchstart" in document.documentElement)) {
    window.addEventListener("mousedown", (e) => {
        Input.triggerTask(Input.taskId.mouseDown, { button: e.button, location: Input.cursorLocation });
    });

    window.addEventListener("mouseup", () => {
        Input.triggerTask(Input.taskId.mouseUp, { location: Input.cursorLocation });
    });

    window.addEventListener("mousemove", (e) => {
        Input.setCursorLocation(e, config.canvas.getBoundingClientRect());
        Input.triggerTask(Input.taskId.mouseMove, { location: Input.cursorLocation });
    });
} else {
    window.addEventListener("touchstart", (e) => {
        Input.setCursorLocation(e.touches[0], config.canvas.getBoundingClientRect());
        Input.triggerTask(Input.taskId.touchStart, { location: Input.cursorLocation });
    });

    window.addEventListener("touchend", () => {
        Input.triggerTask(Input.taskId.touchEnd, { location: Input.cursorLocation });
    });

    window.addEventListener("touchcancel", () => {
        Input.triggerTask(Input.taskId.touchCancel, {});
    });

    window.addEventListener("touchmove", (e) => {
        Input.setCursorLocation(e.touches[0], config.canvas.getBoundingClientRect());
        Input.triggerTask(Input.taskId.touchMove, { location: Input.cursorLocation });
    });
}