class Coin extends Freezable {
    constructor(x, y, radius) {
        super();

        this.initialLocation = new Vector(x, y);
        this.location = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.radius = radius;

        this.aimVelocity = new Vector(0, 0);
        this.aimIndicator = new Vector(0, 0);
        this.isPlayerAiming = false;
        this.indicatorColor = 0;

        let startUpdatingIndicator = (self, args) => {
            if (args.hasOwnProperty("button") && args.button != Input.keys.mouseLeft) return;
            if (self.isFreezed()) return;
            if (args.location.distance(self.location) < self.radius && self.velocity.getMag() == 0) self.isPlayerAiming = true;
        },
            updateIndicator = (self, args) => {
                if (self.isPlayerAiming) {
                    let aim = Vector.subtract(args.location, self.location),
                        velocity = aim.clone().divide(-10).limit(config.coin.ballLaunchVelocityLimit),
                        indicator = Vector.multiply(velocity, 2.72),
                        color = map2(indicator.getMag(), 0, config.coin.ballLaunchVelocityLimit * 2.72, 110, 0);

                    self.aimVelocity.set(velocity.x, velocity.y);
                    self.aimIndicator.set(indicator.x, indicator.y);
                    self.indicatorColor = color;
                }
            },
            launch = (self) => {
                if (self.isPlayerAiming) {
                    self.velocity.add(self.aimVelocity);

                    self.isPlayerAiming = false
                    self.aimVelocity.set(0, 0);
                    self.aimIndicator.set(0, 0);
                };
            },
            cancelLaunch = (self, args) => {
                if (args.hasOwnProperty("button") && args.button != Input.keys.mouseRight) return;
                if (!self.isPlayerAiming || self.isFreezed()) return;

                self.isPlayerAiming = false;
                self.aimVelocity.set(0, 0);
                self.aimIndicator.set(0, 0);
            }

        Input.registerTask(Input.taskId.mouseDown, this, startUpdatingIndicator);
        Input.registerTask(Input.taskId.mouseMove, this, updateIndicator);
        Input.registerTask(Input.taskId.mouseUp, this, launch);
        Input.registerTask(Input.taskId.mouseDown, this, cancelLaunch);

        Input.registerTask(Input.taskId.touchStart, this, startUpdatingIndicator);
        Input.registerTask(Input.taskId.touchMove, this, updateIndicator);
        Input.registerTask(Input.taskId.touchEnd, this, launch);
        Input.registerTask(Input.taskId.touchCancel, this, cancelLaunch);
    }

    checkAndResponseCollisions(lines, obstacles) {
        if (this.isFreezed()) return;
        // ¯\_(ツ)_/¯
        while (true) {
            let vectorGroups = [],
                closestCollidingLine = null,
                closestCollidingPoint = null;

            // Line
            lines.forEach((line, index, lines) => {
                let collidePoint = checkLinesCollide(this.location, Vector.add(this.location, this.velocity), line),
                    closestToVelocityEnd = closestPointOnLine(line.start, line.end, Vector.add(this.location, this.velocity));

                if (collidePoint != null &&
                    (closestCollidingLine == null || this.location.distance(collidePoint) < this.location.distance(closestCollidingPoint))) {

                    closestCollidingLine = lines[index];
                    closestCollidingPoint = collidePoint;
                } else if (Vector.add(this.location, this.velocity).distance(closestToVelocityEnd) < this.radius &&
                    (closestCollidingLine == null || this.location.distance(closestToVelocityEnd) < this.location.distance(closestCollidingPoint))) {

                    closestCollidingLine = lines[index];
                    closestCollidingPoint = closestToVelocityEnd;
                }
            });

            if (closestCollidingLine != null) {
                let collidePoint = checkLinesCollide(this.location, Vector.add(this.location, this.velocity), closestCollidingLine),
                    closestToVelocityEnd = closestPointOnLine(closestCollidingLine.start, closestCollidingLine.end, Vector.add(this.location, this.velocity));

                if (collidePoint != null) {
                    // New location
                    let n = Vector.subtract(this.location, closestPointOnLine(closestCollidingLine.start, closestCollidingLine.end, this.location, true)),
                        d = this.location.distance(collidePoint),
                        c = d * (1 - this.radius / n.getMag()),
                        // New velocity
                        v = Vector.add(this.location, this.velocity),
                        v_n = Vector.add(n, Vector.subtract(closestPointOnLine(closestCollidingLine.start, closestCollidingLine.end, v, true), v)).multiply(2),

                        newLocation = Vector.add(this.location, this.velocity.clone().setMag(c)),
                        newVelocity = Vector.add(this.velocity, v_n).multiply(.97);

                    vectorGroups.push({
                        location: newLocation,
                        velocity: newVelocity
                    });
                } else if (Vector.add(this.location, this.velocity).distance(closestToVelocityEnd) < this.radius) {
                    // New location
                    let n1 = Vector.subtract(this.location, closestPointOnLine(closestCollidingLine.start, closestCollidingLine.end, this.location)),
                        n2 = Vector.subtract(Vector.add(this.location, this.velocity), closestToVelocityEnd),
                        d = this.velocity.getMag(),
                        l = d * (1 - (this.radius - n2.getMag()) / (n1.getMag() - n2.getMag())),
                        // New velocity
                        h = n1.getMag() - n2.getMag(),
                        v_n = n1.clone().setMag(h).multiply(2),

                        newLocation = Vector.add(this.location, this.velocity.clone().setMag(l)),
                        newVelocity = Vector.add(this.velocity, v_n).multiply(.97);

                    vectorGroups.push({
                        location: newLocation,
                        velocity: newVelocity
                    });
                }
            }

            // Obstacle     
            let closestCollidingObstacle = null;
            obstacles.forEach((obstacle, index, obstacles) => {
                let closestPoint = closestPointOnLine(this.location, Vector.add(this.location, this.velocity), obstacle.location),
                    dot = Vector.subtract(obstacle.location, this.location).dot(this.velocity);

                if (closestPoint.distance(obstacle.location) < this.radius + obstacle.radius && dot > 0 &&
                    (closestCollidingObstacle == null || this.location.distance(closestCollidingObstacle.location) > this.location.distance(obstacle.location))) {
                    closestCollidingObstacle = obstacles[index];
                }
            });

            if (closestCollidingObstacle != null) {
                // New location
                let closest = closestPointOnLine(this.location, Vector.add(this.location, this.velocity), closestCollidingObstacle.location, true),
                    hypotenus = this.radius + closestCollidingObstacle.radius,
                    height = Vector.subtract(closest, closestCollidingObstacle.location).getMag(),
                    width = Math.sqrt((hypotenus ** 2) - (height ** 2)),
                    // New velocity
                    normal = Vector.subtract(this.location, closestCollidingObstacle.location).normalize(),
                    mass = 30,
                    p = 2 * (this.velocity.x * normal.x + this.velocity.y * normal.y) / (mass * 2),

                    newLocation = Vector.add(
                        this.location,
                        this.velocity.clone().setMag(Vector.subtract(closest, this.location).getMag() - width)
                    ),
                    newVelocity = new Vector(
                        this.velocity.x - p * mass * normal.x - p * mass * normal.x,
                        this.velocity.y - p * mass * normal.y - p * mass * normal.y
                    ).multiply(.97);

                vectorGroups.push({
                    location: newLocation,
                    velocity: newVelocity
                });
            }

            if (vectorGroups.length == 0) break;

            let groupToApply = null;
            vectorGroups.forEach((group, index, groups) => {
                if (groupToApply == null || this.location.distance(group.location) < this.location.distance(groupToApply.location)) {
                    groupToApply = groups[index];
                }
            });

            this.location.set(groupToApply.location.x, groupToApply.location.y);
            this.velocity.set(groupToApply.velocity.x, groupToApply.velocity.y);
        }
    }

    update() {
        if (this.isFreezed()) return;

        this.velocity.multiply((this.velocity.getMag() < 0.1) ? 0 : 0.96);
        this.location.add(this.velocity);
    }

    render() {
        Render.setFillColor(config.field.outerCoinColor);
        Render.circle(this.location.x, this.location.y, this.radius);
        Render.setFillColor(config.field.innerCoinColor)
        Render.circle(this.location.x, this.location.y, map(65, this.radius));

        if (this.isPlayerAiming) {
            let offset = this.aimIndicator.clone().setMag(this.radius),
                aimStart = Vector.add(this.location, offset),
                aimEnd = Vector.add(this.location, (Vector.add(this.aimIndicator, offset)));

            Render.setStrokeColor(`hsl(${this.indicatorColor}, 100%, 50%)`);
            Render.setLineWidth(config.coin.indicatorLineWidth);
            Render.line(aimStart.x, aimStart.y, aimEnd.x, aimEnd.y);
        }
    }

    reset() {
        this.location.set(this.initialLocation.x, this.initialLocation.y);
        this.isPlayerAiming = false;
        this.aimVelocity.set(0, 0);
        this.aimIndicator.set(0, 0);
        this.velocity.multiply(0);
    }
}