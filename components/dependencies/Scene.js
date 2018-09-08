class Scene extends Freezable {
    constructor(name, properties) {
        super();

        this.name = name;
        this.objects = properties.objects || {};
        this.onUpdate = properties.onUpdate || (() => { });
        this.onFreeze = properties.onFreeze || (() => { });
        this.onThaw = properties.onThaw || (() => { });

        this.freeze();
    }

    update() {
        this.onUpdate(this.objects);
    }

    freeze() {
        this.freezed = true;
        this.onFreeze(this.objects);
        return this;
    }

    thaw() {
        this.freezed = false;
        this.onThaw(this.objects);
        return this;
    }
}