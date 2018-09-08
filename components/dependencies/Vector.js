class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // Methods
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    getMag() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    setMag(n) {
        return this.normalize().multiply(n);
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    multiply(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }

    divide(n) {
        this.x /= n;
        this.y /= n;
        return this;
    }

    limit(n) {
        if (this.getMag() > n) {
            this.setMag(n);
        }
        return this;
    }

    normalize() {
        return this.divide(this.getMag());
    }

    distance(vector) {
        return Math.sqrt(Math.pow(vector.x - this.x, 2) + Math.pow(vector.y - this.y, 2));
    }

    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    static add(a, b) {
        return new Vector(a.x + b.x, a.y + b.y);
    }

    static subtract(a, b) {
        return new Vector(a.x - b.x, a.y - b.y);
    }

    static multiply(a, n) {
        return new Vector(a.x * n, a.y * n);
    }

    static divide(a, n) {
        return new Vector(a.x / n, a.y / n);
    }

    static doContain(vector1, vector2, vector3) {
        if (vector1.x < vector3.x && vector2.x > vector3.x && vector1.y < vector3.y && vector2.y > vector3.y) return true; else return false;
    }
}
