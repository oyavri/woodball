class Freezable {
    constructor() {
        this.freezed = false;
    }

    isFreezed() {
        return this.freezed;
    }

    freeze() {
        this.freezed = true;
        return this;
    }

    thaw() {
        this.freezed = false;
        return this;
    }
}