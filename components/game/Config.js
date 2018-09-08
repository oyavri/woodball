// Functions
const map = (value, newRatio) => (value * newRatio) / 100;

const map2 = (value, start1, stop1, start2, stop2)  => start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));

const createInstances = (proto, propsArray) => propsArray.map(props => new proto.constructor(...props));

const closestPointOnLine = (l1, l2, p, withoutL2 = false) => {
    let lineToPoint = Vector.subtract(p, l1),
        line = Vector.subtract(l2, l1),
        dot = lineToPoint.dot(line.clone().normalize()),
        closest = Vector.add(l1, Vector.multiply(line.clone().normalize(), dot));

    if (dot < 0) closest.set(l1.x, l1.y);
    if (dot > line.getMag() && !withoutL2) closest.set(l2.x, l2.y);

    return closest;
}

const checkLinesCollide = (start, end, line) => {
    let x1 = start.x,
        y1 = start.y,
        x2 = end.x,
        y2 = end.y,

        x3 = line.start.x,
        y3 = line.start.y,
        x4 = line.end.x,
        y4 = line.end.y,

        bx = x2 - x1,
        by = y2 - y1,
        dx = x4 - x3,
        dy = y4 - y3,

        b_dot_d_perp = bx * dy - by * dx,
        cx = x3 - x1,
        cy = y3 - y1,
        t = (cx * dy - cy * dx) / b_dot_d_perp,
        u = (cx * by - cy * bx) / b_dot_d_perp;

    return (b_dot_d_perp == 0 || (t < 0 || t > 1) || (u < 0 || u > 1)) ? null : new Vector(x1 + t * bx, y1 + t * by);
}

const askForMaxScore = (question = "Please enter max score.") => {
    let answer = window.prompt(question, 3);
    if (answer === null) return null;
    try {
        answer = Number.parseInt(answer);
        if (!Number.isInteger(answer) || Number.isNaN(answer) || !Number.isFinite(answer) || !Number.isSafeInteger(answer)) throw new Error();
    } catch {
        askForMaxScore("Please try to enter an acceptable number.");
    }
    return answer;
}

// Config
const config = {
    render: {},
    field: {},
    coin: {},
    goalposts: { left: {}, right: {} },
    obstacle: {},
    line: {},
};

config.maxScore;

config.context = document.getElementById("canvas").getContext("2d");
config.canvas = config.context.canvas;

config.canvas.width = window.innerWidth;
config.canvas.height = window.innerHeight;

config.goalpostHorizontal = map(4, config.canvas.width);
config.goalpostVertical = map(20, config.canvas.height);
config.midCircleRadius = map(7, config.canvas.width);
config.midDotRadius = map(0.5, config.canvas.width);
config.penaltyCircleRadius = map(6, config.canvas.width);
config.smallPenaltyAreaHorizontal = map(8, config.canvas.width);
config.smallPenaltyAreaVertical = map(30, config.canvas.height);
config.bigPenaltyAreaHorizontal = map(13, config.canvas.width);
config.bigPenaltyAreaVertical = map(45, config.canvas.height);
config.penaltyDotRadius = map(0.3, config.canvas.width);
config.cornerRadius = map(1.5, config.canvas.width);
config.fieldStartHorizontal = map(5, config.canvas.width);
config.fieldStartVertical = map(5, config.canvas.height);
config.fieldLinesWidth = map(0.5, config.canvas.width);
config.otherLinesWidth = map(0.3, config.canvas.width);

config.outlinesWidth = map(0.1, config.canvas.width);

config.buttonHorizontal = map(20, config.canvas.width);
config.buttonVertical = map(10, config.canvas.height);
config.buttonLineWidth = map(0.2, config.canvas.width);
config.buttonHoverColor = "#145909";

// Field
config.field.lineColor = "white";
config.field.backgroundColor = "#196f0C";
config.field.innerCoinColor = "#989898";
config.field.outerCoinColor = "#E9AD03";

// Coin
config.coin.radius = map(1.4, config.canvas.width);
config.coin.ballLaunchVelocityLimit = map(2, config.canvas.width);
config.coin.indicatorLineWidth = map(0.2, canvas.width);

// Goalposts
config.goalposts.left.locations = [
    config.fieldStartHorizontal - config.goalpostHorizontal,
    config.canvas.height / 2 - config.goalpostVertical / 2,
    config.fieldStartHorizontal,
    config.canvas.height / 2 + config.goalpostVertical / 2
]

config.goalposts.right.locations = [
    config.canvas.width - config.fieldStartHorizontal,
    config.canvas.height / 2 - config.goalpostVertical / 2,
    config.canvas.width - config.fieldStartHorizontal + config.goalpostHorizontal,
    config.canvas.height / 2 + config.goalpostVertical / 2
]

// Obstacle
config.obstacle.radius = map(0.9, config.canvas.width);
config.obstacle.color = "#808080";
config.obstacle.innerColor = "#C0C0C0";
config.obstacle.locations = [
    // Left Side
    [config.fieldStartHorizontal - config.obstacle.radius + config.fieldLinesWidth / 2, config.canvas.height / 2 - config.goalpostVertical / 2 - config.obstacle.radius + config.fieldLinesWidth / 2, true],
    [config.fieldStartHorizontal - config.obstacle.radius + config.fieldLinesWidth / 2, config.canvas.height / 2 + config.goalpostVertical / 2 + config.obstacle.radius - config.fieldLinesWidth / 2, true],
    [(config.fieldStartHorizontal + config.smallPenaltyAreaHorizontal) / 2, config.canvas.height / 2],
    [config.fieldStartHorizontal + config.smallPenaltyAreaHorizontal, config.canvas.height / 2 - 3 * (config.bigPenaltyAreaVertical - config.smallPenaltyAreaVertical) / 2 - config.fieldStartVertical],
    [config.fieldStartHorizontal + config.smallPenaltyAreaHorizontal, config.canvas.height / 2 + 3 * (config.bigPenaltyAreaVertical - config.smallPenaltyAreaVertical) / 2 + config.fieldStartVertical],
    [config.fieldStartHorizontal + config.bigPenaltyAreaHorizontal + config.fieldStartHorizontal / 2, config.canvas.height / 2 - config.smallPenaltyAreaVertical / 2],
    [config.fieldStartHorizontal + config.bigPenaltyAreaHorizontal + config.fieldStartHorizontal / 2, config.canvas.height / 2 + config.smallPenaltyAreaVertical / 2],
    [config.fieldStartHorizontal + config.bigPenaltyAreaHorizontal + config.fieldStartHorizontal / 2, config.fieldStartVertical * 2.5],
    [config.fieldStartHorizontal + config.bigPenaltyAreaHorizontal + config.fieldStartHorizontal / 2, config.canvas.height - (config.fieldStartVertical * 2.5)],
    [config.fieldStartHorizontal + config.bigPenaltyAreaHorizontal + config.fieldStartHorizontal / 2 + config.smallPenaltyAreaHorizontal, config.canvas.height / 2 - config.bigPenaltyAreaVertical / 2 - config.fieldStartHorizontal],
    [config.fieldStartHorizontal + config.bigPenaltyAreaHorizontal + config.fieldStartHorizontal / 2 + config.smallPenaltyAreaHorizontal, config.canvas.height / 2 + config.bigPenaltyAreaVertical / 2 + config.fieldStartHorizontal],
    [config.fieldStartHorizontal + config.bigPenaltyAreaHorizontal + config.fieldStartHorizontal * 1.5, config.canvas.height / 2],
    [config.canvas.width / 2 - config.midCircleRadius, config.fieldStartVertical * 2],
    [config.canvas.width / 2 - config.midCircleRadius, config.canvas.height - (config.fieldStartVertical * 2)],
    [config.canvas.width / 2 - config.midCircleRadius - config.fieldStartHorizontal * 2, config.canvas.height / 2 - config.fieldStartVertical * 2],
    [config.canvas.width / 2 - config.midCircleRadius - config.fieldStartHorizontal * 2, config.canvas.height / 2 + config.fieldStartVertical * 2],
    [config.canvas.width / 2 - config.midCircleRadius - config.fieldStartHorizontal, config.canvas.height / 2 - config.bigPenaltyAreaVertical / 2 - config.fieldStartVertical],
    [config.canvas.width / 2 - config.midCircleRadius - config.fieldStartHorizontal, config.canvas.height / 2 + config.bigPenaltyAreaVertical / 2 + config.fieldStartVertical],
    [config.canvas.width / 2 - config.fieldStartVertical * 2, config.canvas.height / 2 - config.fieldStartVertical * 4],
    [config.canvas.width / 2 - config.fieldStartVertical * 2, config.canvas.height / 2 + config.fieldStartVertical * 4],
    [config.canvas.width / 2 - config.midCircleRadius, config.canvas.height / 2],
    // Right Side
    [config.canvas.width - (config.fieldStartHorizontal - config.obstacle.radius + config.fieldLinesWidth / 2), config.canvas.height / 2 - config.goalpostVertical / 2 - config.obstacle.radius + config.fieldLinesWidth / 2, true],
    [config.canvas.width - (config.fieldStartHorizontal - config.obstacle.radius + config.fieldLinesWidth / 2), config.canvas.height / 2 + config.goalpostVertical / 2 + config.obstacle.radius - config.fieldLinesWidth / 2, true],
    [config.canvas.width - (config.fieldStartHorizontal + config.smallPenaltyAreaHorizontal) / 2, config.canvas.height / 2],
    [config.canvas.width - (config.fieldStartHorizontal + config.smallPenaltyAreaHorizontal), config.canvas.height / 2 - 3 * (config.bigPenaltyAreaVertical - config.smallPenaltyAreaVertical) / 2 - config.fieldStartVertical],
    [config.canvas.width - (config.fieldStartHorizontal + config.smallPenaltyAreaHorizontal), config.canvas.height / 2 + 3 * (config.bigPenaltyAreaVertical - config.smallPenaltyAreaVertical) / 2 + config.fieldStartVertical],
    [config.canvas.width - (config.fieldStartHorizontal + config.bigPenaltyAreaHorizontal + config.fieldStartHorizontal / 2), config.canvas.height / 2 - config.smallPenaltyAreaVertical / 2],
    [config.canvas.width - (config.fieldStartHorizontal + config.bigPenaltyAreaHorizontal + config.fieldStartHorizontal / 2), config.canvas.height / 2 + config.smallPenaltyAreaVertical / 2],
    [config.canvas.width - (config.fieldStartHorizontal + config.bigPenaltyAreaHorizontal + config.fieldStartHorizontal / 2), config.fieldStartVertical * 2.5],
    [config.canvas.width - (config.fieldStartHorizontal + config.bigPenaltyAreaHorizontal + config.fieldStartHorizontal / 2), config.canvas.height - (config.fieldStartVertical * 2.5)],
    [config.canvas.width - (config.fieldStartHorizontal + config.bigPenaltyAreaHorizontal + config.fieldStartHorizontal / 2 + config.smallPenaltyAreaHorizontal), config.canvas.height / 2 - config.bigPenaltyAreaVertical / 2 - config.fieldStartHorizontal],
    [config.canvas.width - (config.fieldStartHorizontal + config.bigPenaltyAreaHorizontal + config.fieldStartHorizontal / 2 + config.smallPenaltyAreaHorizontal), config.canvas.height / 2 + config.bigPenaltyAreaVertical / 2 + config.fieldStartHorizontal],
    [config.canvas.width - (config.fieldStartHorizontal + config.bigPenaltyAreaHorizontal + config.fieldStartHorizontal * 1.5), config.canvas.height / 2],
    [config.canvas.width / 2 + config.midCircleRadius, config.fieldStartVertical * 2],
    [config.canvas.width / 2 + config.midCircleRadius, config.canvas.height - (config.fieldStartVertical * 2)],
    [config.canvas.width / 2 + config.midCircleRadius + config.fieldStartHorizontal * 2, config.canvas.height / 2 - config.fieldStartVertical * 2],
    [config.canvas.width / 2 + config.midCircleRadius + config.fieldStartHorizontal * 2, config.canvas.height / 2 + config.fieldStartVertical * 2],
    [config.canvas.width / 2 + config.midCircleRadius + config.fieldStartHorizontal, config.canvas.height / 2 - config.bigPenaltyAreaVertical / 2 - config.fieldStartVertical],
    [config.canvas.width / 2 + config.midCircleRadius + config.fieldStartHorizontal, config.canvas.height / 2 + config.bigPenaltyAreaVertical / 2 + config.fieldStartVertical],
    [config.canvas.width / 2 + config.fieldStartVertical * 2, config.canvas.height / 2 - config.fieldStartVertical * 4],
    [config.canvas.width / 2 + config.fieldStartVertical * 2, config.canvas.height / 2 + config.fieldStartVertical * 4],
    [config.canvas.width / 2 + config.midCircleRadius, config.canvas.height / 2]
];

// Line
config.line.locations = [
    // Top
    [config.fieldStartHorizontal, config.fieldStartVertical, config.canvas.width - config.fieldStartHorizontal, config.fieldStartVertical],
    [config.fieldStartHorizontal, config.fieldStartVertical, config.fieldStartHorizontal, config.canvas.height / 2 - config.goalpostVertical / 2],
    [config.canvas.width - config.fieldStartHorizontal, config.fieldStartVertical, config.canvas.width - config.fieldStartHorizontal, config.canvas.height / 2 - config.goalpostVertical / 2],
    // Bottom 
    [config.fieldStartHorizontal, config.canvas.height - config.fieldStartVertical, config.canvas.width - config.fieldStartHorizontal, config.canvas.height - config.fieldStartVertical],
    [config.fieldStartHorizontal, canvas.height - config.fieldStartVertical, config.fieldStartHorizontal, config.canvas.height / 2 + config.goalpostVertical / 2],
    [config.canvas.width - config.fieldStartHorizontal, config.canvas.height - config.fieldStartVertical, config.canvas.width - config.fieldStartHorizontal, config.canvas.height / 2 + config.goalpostVertical / 2],
    // Left goalpost
    [config.fieldStartHorizontal, config.canvas.height / 2 - config.goalpostVertical / 2, config.fieldStartHorizontal - config.goalpostHorizontal, config.canvas.height / 2 - config.goalpostVertical / 2],
    [config.fieldStartHorizontal - config.goalpostHorizontal, config.canvas.height / 2 - config.goalpostVertical / 2, config.fieldStartHorizontal - config.goalpostHorizontal, config.canvas.height / 2 + config.goalpostVertical / 2],
    [config.fieldStartHorizontal, config.canvas.height / 2 + config.goalpostVertical / 2, config.fieldStartHorizontal - config.goalpostHorizontal, config.canvas.height / 2 + config.goalpostVertical / 2],
    // Right goalpost
    [config.canvas.width - config.fieldStartHorizontal, config.canvas.height / 2 - config.goalpostVertical / 2, config.canvas.width - config.fieldStartHorizontal + config.goalpostHorizontal, config.canvas.height / 2 - config.goalpostVertical / 2],
    [config.canvas.width - config.fieldStartHorizontal + config.goalpostHorizontal, config.canvas.height / 2 - config.goalpostVertical / 2, config.canvas.width - config.fieldStartHorizontal + config.goalpostHorizontal, config.canvas.height / 2 + config.goalpostVertical / 2],
    [config.canvas.width - config.fieldStartHorizontal, config.canvas.height / 2 + config.goalpostVertical / 2, config.canvas.width - config.fieldStartHorizontal + config.goalpostHorizontal, config.canvas.height / 2 + config.goalpostVertical / 2],
];