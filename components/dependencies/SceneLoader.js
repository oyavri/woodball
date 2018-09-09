class SceneLoader {
    static addScene(name, properties) {
        if (SceneLoader.scenes.hasOwnProperty(name)) return;

        SceneLoader.scenes[name] = new Scene(name, properties);
    }

    static getScene(name) {
        if (!SceneLoader.scenes.hasOwnProperty(name)) return null;

        return SceneLoader.scenes[name];
    }

    static loadScene(name) {
        if (!SceneLoader.scenes.hasOwnProperty(name) || !SceneLoader.scenes[name] instanceof Scene) return;

        if (SceneLoader.getScene(SceneLoader.currentScene) instanceof Scene)
            SceneLoader.getScene(SceneLoader.currentScene).freeze();

        SceneLoader.getScene(name).thaw();
        SceneLoader.currentScene = name;
    }

    static startUpdatingScene() {
        if (!SceneLoader.getScene(SceneLoader.currentScene) instanceof Scene) throw new Error("No scene loaded yet");

        SceneLoader.getScene(SceneLoader.currentScene).update();
        requestAnimationFrame(SceneLoader.startUpdatingScene);
    }
}

SceneLoader.scenes = {};
SceneLoader.currentScene = null;

SceneLoader.addScene("menu", {
    objects: {
        playButton: new Button(
            config.canvas.width / 2 - config.buttonHorizontal / 2,
            config.canvas.height / 2 - config.buttonVertical,
            config.buttonHorizontal,
            config.buttonVertical,
            "Play",
            () => {
                config.maxScore = askForMaxScore();
                if (config.maxScore === null) return;
                SceneLoader.getScene("inGame").objects.coin.reset();
                SceneLoader.getScene("inGame").objects.leftScore = 0;
                SceneLoader.getScene("inGame").objects.rightScore = 0;
                SceneLoader.loadScene("inGame");
            }
        ),
        aboutButton: new Button(
            config.canvas.width / 2 - config.buttonHorizontal / 2,
            config.canvas.height / 2 + config.buttonVertical / 2,
            config.buttonHorizontal,
            config.buttonVertical,
            "About",
            () => { SceneLoader.loadScene("about"); }
        ),
    },
    onUpdate: (objects) => {
        Render.background(config.field.backgroundColor);
        Render.text("Woodball", config.canvas.width / 2, config.canvas.height / 4, map(20, config.canvas.height));
        objects.playButton.render();
        objects.aboutButton.render();
    },
    onFreeze: (objects) => {
        objects.playButton.freeze();
        objects.aboutButton.freeze();
    },
    onThaw: (objects) => {
        objects.playButton.thaw();
        objects.aboutButton.thaw();
    }
});

SceneLoader.addScene("inGame", {
    objects: {
        pauseButton: new Button(
            config.canvas.width - config.fieldStartHorizontal * 3 / 4 + config.otherLinesWidth,
            0,
            config.fieldStartHorizontal * 3 / 4 - config.otherLinesWidth,
            config.buttonVertical * 3 / 4,
            "||",
            () => { SceneLoader.loadScene("pause"); },
            "#DCDCDC",
            map(4, config.canvas.height),
            false
        ),
        obstacles: createInstances(Obstacle.prototype, config.obstacle.locations),
        lines: createInstances(Line.prototype, config.line.locations),
        coin: new Coin(canvas.width / 2, canvas.height / 2, config.coin.radius),
        leftGoalpost: new Goalpost(...config.goalposts.left.locations),
        rightGoalpost: new Goalpost(...config.goalposts.right.locations),
        leftScore: 0,
        rightScore: 0,
        field: new Field(),
    },
    onUpdate: (objects) => {
        objects.coin.checkAndResponseCollisions(objects.lines, objects.obstacles);
        if (objects.leftGoalpost.checkForCoin(objects.coin)) {
            objects.rightScore += 1;
            objects.coin.reset();
        }
        else if (objects.rightGoalpost.checkForCoin(objects.coin)) {
            objects.leftScore += 1;
            objects.coin.reset();
        }
        objects.coin.update();

        Render.background(config.field.backgroundColor);
        objects.field.renderField();
        objects.coin.render();
        objects.obstacles.forEach(obstacle => { obstacle.render() });
        objects.pauseButton.render();
        Render.text(`${objects.leftScore}`, config.fieldStartHorizontal / 2, config.canvas.height - map(5, config.canvas.height), map(5, config.canvas.height), "#DCDCDC", "center")
        Render.text(`${objects.rightScore}`, config.canvas.width - config.fieldStartHorizontal / 2, config.canvas.height - map(5, config.canvas.height), map(5, config.canvas.height), "#DCDCDC", "center")

        if (objects.leftScore == config.maxScore) {
            SceneLoader.getScene("winner").objects.winner = "left side";
            SceneLoader.loadScene("winner");
        }
        if (objects.rightScore == config.maxScore) {
            SceneLoader.getScene("winner").objects.winner = "right side";
            SceneLoader.loadScene("winner");
        }
    },
    onFreeze: (objects) => {
        objects.coin.freeze();
        objects.pauseButton.freeze();
    },
    onThaw: (objects) => {
        objects.coin.thaw();
        objects.pauseButton.thaw();
    }
});

SceneLoader.addScene("pause", {
    objects: {
        resumeButton: new Button(
            config.canvas.width / 2 - config.buttonHorizontal / 2,
            config.canvas.height / 2 - config.buttonVertical,
            config.buttonHorizontal,
            config.buttonVertical,
            "Resume",
            () => { SceneLoader.loadScene("inGame"); }
        ),
        menuButton: new Button(
            config.canvas.width / 2 - config.buttonHorizontal / 2,
            config.canvas.height / 2 + config.buttonVertical / 2,
            config.buttonHorizontal,
            config.buttonVertical,
            "Main Menu",
            () => { SceneLoader.loadScene("menu"); }
        )
    },
    onUpdate: (objects) => {
        Render.background(config.field.backgroundColor);
        Render.text("Paused", config.canvas.width / 2, config.canvas.height / 4, map(5, config.canvas.width));
        objects.resumeButton.render();
        objects.menuButton.render();
    },
    onFreeze: (objects) => {
        objects.resumeButton.freeze();
        objects.menuButton.freeze();
    },
    onThaw: (objects) => {
        objects.resumeButton.thaw();
        objects.menuButton.thaw();
    }
});

SceneLoader.addScene("about", {
    objects: {
        menuButton: new Button(
            config.canvas.width / 2 - config.buttonHorizontal / 2,
            config.canvas.height / 2,
            config.buttonHorizontal,
            config.buttonVertical,
            "Main Menu",
            () => { SceneLoader.loadScene("menu"); }
        )
    },
    onUpdate: (objects) => {
        Render.background(config.field.backgroundColor);
        Render.text("Written in pure JS", config.canvas.width / 2, config.canvas.height / 2 - config.buttonVertical - map(5, config.canvas.height), map(4, config.canvas.height), "#DCDCDC", "center");
        Render.text("Made by github.com/oyavri and github.com/brkydnc", config.canvas.width / 2, config.canvas.height / 2 - config.buttonVertical, map(4, config.canvas.height), "#DCDCDC", "center");
        objects.menuButton.render();

    },
    onFreeze: (objects) => {
        objects.menuButton.freeze();
    },
    onThaw: (objects) => {
        objects.menuButton.thaw();
    }
});

SceneLoader.addScene("winner", {
    objects: {
        menuButton: new Button(
            config.canvas.width / 2 - config.buttonHorizontal / 2,
            config.canvas.height / 2,
            config.buttonHorizontal,
            config.buttonVertical,
            "Main Menu",
            () => { SceneLoader.loadScene("menu"); }
        ),
        winner: null
    },
    onUpdate: (objects) => {
        Render.background(config.field.backgroundColor);
        Render.text(`The winner is ${objects.winner}`, config.canvas.width / 2, config.canvas.height / 2 - config.buttonVertical - map(8, config.canvas.height), map(7, config.canvas.height), "#DCDCDC", "center");
        Render.text(`${SceneLoader.getScene("inGame").objects.leftScore} - ${SceneLoader.getScene("inGame").objects.rightScore}`, config.canvas.width / 2, config.canvas.height / 2 - config.buttonVertical, map(7, config.canvas.height), "#DCDCDC", "center");
        objects.menuButton.render();
    },
    onFreeze: (objects) => {
        objects.menuButton.freeze();
    },
    onThaw: (objects) => {
        objects.menuButton.thaw();
    }
});

SceneLoader.loadScene("menu");
SceneLoader.startUpdatingScene();