class Obstacle {
    constructor(x, y, invisible = false) {
        this.location = new Vector(x, y);
        this.radius = config.obstacle.radius;
        this.invisible = invisible;
    };

    render() {
        if (this.invisible) return;

        Render.setFillColor(config.obstacle.color);
        Render.setLineWidth(config.obstacle.radius / 5);
        Render.setStrokeColor(config.obstacle.innerColor);

        Render.circle(this.location.x, this.location.y, this.radius);
        Render.line(this.location.x - this.radius / 2.5, this.location.y - this.radius / 2.5, this.location.x + this.radius / 2.5, this.location.y + this.radius / 2.5);
        Render.line(this.location.x - this.radius / 2.5, this.location.y + this.radius / 2.5, this.location.x + this.radius / 2.5, this.location.y - this.radius / 2.5);
    }
}