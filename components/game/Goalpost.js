class Goalpost {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    checkForCoin(coin) {
        if (coin.location.x - coin.radius >= this.x1 && coin.location.x + coin.radius <= this.x2 && coin.location.y - coin.radius >= this.y1 && coin.location.y + coin.radius <= this.y2) {
        return true;
        }
    }
}