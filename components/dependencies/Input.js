class Input {
    static getmouseDown(button) {
        return Input.states["mouse"][button];
    }

    static getmouseLocation() {
        return Input.mouseLocation;
    }

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
}

Input.mouseLocation = new Vector(0, 0);
Input.states = {};
Input.tasks = {};
Input.keys = {};

Input.taskId = {
    mouseDown: 0,
    mouseUp: 1,
    mouseMove: 2,
    mouseClick: 3,
};

Input.keys.mouseLeft = 0;
Input.keys.mouseRight = 2;

window.addEventListener('mousedown', (e) => {
    if (!Input.states.hasOwnProperty("mouse")) Input.states["mouse"] = {};
    Input.states["mouse"][e.button] = true;
    Input.triggerTask(Input.taskId.mouseDown, { button: e.button, location: Input.getmouseLocation() });
});

window.addEventListener('mouseup', (e) => {
    Input.states["mouse"][e.button] = false;
    Input.triggerTask(Input.taskId.mouseUp, { location: Input.getmouseLocation() });
});

window.addEventListener('mousemove', (e) => {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    Input.mouseLocation.set(x, y);
    Input.triggerTask(Input.taskId.mouseMove, { location: Input.getmouseLocation() });
});

window.addEventListener('click', (e) => {
    Input.triggerTask(Input.taskId.mouseClick, { button: e.button, location: Input.getmouseLocation() });
});