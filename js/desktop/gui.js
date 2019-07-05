var ammo = new BABYLON.GUI.TextBlock();
var health = new BABYLON.GUI.TextBlock();
var killsCount = new BABYLON.GUI.TextBlock();
var menuControlsPanel = new BABYLON.GUI.Rectangle();
var respawnPanel = new BABYLON.GUI.Rectangle();
var respawnCounterText = new BABYLON.GUI.TextBlock();
var controlInstructionsPanel = new BABYLON.GUI.StackPanel();
var advancedTexture;
var levels = ["Can I play daddy?", "Don't hurt me!", "Bring 'em on!", "Suicidal"];
var mouse = ["Slow", "Slow", "Fast", "Fast"];

var createMainMenu = function () {
    advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var style = advancedTexture.createStyle();
    style.fontSize = 26;
    style.fontStyle = "bold";
    var verticalPadding = "10px";
    // style.fontStyle = "italic";
    // style.fontFamily = "Verdana";
    var smallTextStyle = advancedTexture.createStyle();
    smallTextStyle.fontSize = 10;
    smallTextStyle.fontStyle = "bold";

    ammo.text = "30| 100";
    ammo.width = "170px"
    ammo.height = "50px";
    ammo.color = "orange";
    ammo.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    ammo.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    ammo.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    ammo.paddingRight = "60px";
    ammo.paddingTop = verticalPadding;
    ammo.style = style;
    advancedTexture.addControl(ammo);

    killsCount.text = "Kills " + kills;
    killsCount.width = "570px"
    killsCount.height = "50px";
    killsCount.color = "orange";
    killsCount.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    killsCount.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    killsCount.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    killsCount.paddingTop = verticalPadding;
    killsCount.style = style;
    advancedTexture.addControl(killsCount);

    health.text = "100";
    health.width = "150px"
    health.height = "50px";
    health.color = "orange";
    health.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    health.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    health.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    health.paddingLeft = "60px";
    health.paddingTop = verticalPadding;

    health.style = style;

    advancedTexture.addControl(health);

    var healthSign = new BABYLON.GUI.Image("health", "images/health.png");
    healthSign.width = "50px";
    healthSign.height = "50px";
    healthSign.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    healthSign.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    healthSign.paddingLeft = "10px";
    healthSign.paddingTop = verticalPadding;
    advancedTexture.addControl(healthSign);

    var bullet = new BABYLON.GUI.Image("health", "images/bullet.png");
    bullet.width = "50px";
    bullet.height = "50px";
    bullet.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    bullet.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    bullet.paddingRight = "20px";
    bullet.paddingTop = verticalPadding;

    advancedTexture.addControl(bullet);

    var pause = BABYLON.GUI.Button.CreateImageOnlyButton("health", "images/pause.png");
    pause.width = "50px";
    pause.height = "100px";
    pause.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    pause.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    pause.paddingRight = "10px";
    pause.paddingTop = "50px";
    pause.thickness = 0;
    pause.onPointerUpObservable.add(function () {
        if (!gameStarted)
            return;
        paused = !paused;
        if (paused) {
            killsCount.color = "black";
            killsCount.text = "Game Paused";
            setTimeout(function () { engine.stopRenderLoop(); }, 200);
        }
        else {
            killsCount.color = "orange";
            killsCount.text = "Kills " + kills;
            engine.runRenderLoop(function () {
                globalScene.render();
                divFps.innerHTML = engine.getFps().toFixed() + " fps";
            });
        }
    });
    advancedTexture.addControl(pause);

    var pauseKB = new BABYLON.GUI.TextBlock();
    pauseKB.text = "CTL + P";
    pauseKB.width = "110px"
    pauseKB.height = "50px";
    pauseKB.color = "orange";
    pauseKB.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    pauseKB.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    pauseKB.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    pauseKB.paddingRight = "50px";
    pauseKB.paddingTop = "100px";
    pauseKB.style = smallTextStyle;
    advancedTexture.addControl(pauseKB);

    var fullScreenButton = new BABYLON.GUI.Image("health", "images/fullscreen.png");
    fullScreenButton.width = "40px";
    fullScreenButton.height = "120px";
    fullScreenButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    fullScreenButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    fullScreenButton.paddingRight = "20px";
    fullScreenButton.paddingTop = "100px";
    fullScreenButton.thickness = 0;
    fullScreenButton.onPointerUpObservable.add(function () {
        if (!gameStarted)
            return;
        fullScreen = !fullScreen;
        if (fullScreen) {
            BABYLON.Tools.RequestFullscreen(canvas);
        } else {
            BABYLON.Tools.ExitFullscreen();
        }
    });
    advancedTexture.addControl(fullScreenButton);

    var fullScreenKB = new BABYLON.GUI.TextBlock();
    fullScreenKB.text = "CTL + F";
    fullScreenKB.width = "110px"
    fullScreenKB.height = "50px";
    fullScreenKB.color = "orange";
    fullScreenKB.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    fullScreenKB.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    fullScreenKB.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    fullScreenKB.paddingRight = "50px";
    fullScreenKB.paddingTop = "170px";
    fullScreenKB.style = smallTextStyle;
    advancedTexture.addControl(fullScreenKB);

    var restartButton = new BABYLON.GUI.Image("restart", "images/restart.png");
    restartButton.width = "52px";
    restartButton.height = "100px";
    restartButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    restartButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    restartButton.paddingLeft = "12px";
    restartButton.paddingTop = "60px";
    restartButton.thickness = 0;

    restartButton.onPointerUpObservable.add(function () {
        if (!gameStarted)
            return;
        location.reload();
        globalScene.dispose();
        engine.dispose();
        loadIt();
        canvas.blur();
    });
    advancedTexture.addControl(restartButton);
    var restartKB = new BABYLON.GUI.TextBlock();
    restartKB.text = "CTL + N";
    restartKB.width = "110px"
    restartKB.height = "50px";
    restartKB.color = "orange";
    restartKB.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    restartKB.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    restartKB.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    restartKB.paddingLeft = "60px";
    restartKB.paddingTop = "110px";
    restartKB.style = smallTextStyle;
    advancedTexture.addControl(restartKB);

    var audioButton = new BABYLON.GUI.Image("audio", "images/audio.png");
    audioButton.width = "56px";
    audioButton.height = "150px";
    audioButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    audioButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    audioButton.paddingLeft = "16px";
    audioButton.paddingTop = "110px";
    audioButton.thickness = 0;

    audioButton.onPointerUpObservable.add(function () {
        if (!gameStarted)
            return;
        toggleAudio();
    });
    advancedTexture.addControl(audioButton);

    var audiotKB = new BABYLON.GUI.TextBlock();
    audiotKB.text = "CTL + A";
    audiotKB.width = "110px"
    audiotKB.height = "50px";
    audiotKB.color = "orange";
    audiotKB.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    audiotKB.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    audiotKB.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    audiotKB.paddingLeft = "60px";
    audiotKB.paddingTop = "210px";
    audiotKB.style = smallTextStyle;
    advancedTexture.addControl(audiotKB);

    var replayButton = BABYLON.GUI.Button.CreateSimpleButton("replay button", "PLAY");
    replayButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    replayButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    replayButton.width = "190px"
    replayButton.height = "80px";
    replayButton.color = "orange";
    replayButton.background = "black";
    replayButton.style = style;
    replayButton.paddingBottom = "10px";
    replayButton.onPointerUpObservable.add(function () {
        startPlaying();
        menuControlsPanel.isVisible = false;

    });

    // menuControlsPanel.adaptWidthToChildren = true;
    menuControlsPanel.height = "500px";
    menuControlsPanel.width = "500px";
    menuControlsPanel.color = "orange";
    menuControlsPanel.thickness = 5;
    menuControlsPanel.background = "orange";
    menuControlsPanel.alpha = .9;

    menuControlsPanel.addControl(replayButton);
    var panel = new BABYLON.GUI.StackPanel();
    panel.width = "500px";
    panel.isVertical = true;
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    panel.addControl(createRespawnCheckbox());
    panel.addControl(createInfiniteCheckbox());
    panel.addControl(createLevelSlider());
    panel.addControl(createMouseSlider());
    panel.addControl(createControlInstructions());
    menuControlsPanel.addControl(panel);

    advancedTexture.addControl(menuControlsPanel);
    advancedTexture.isForeground = true;
    advancedTexture.addControl(createRespawnPanel(advancedTexture));

    // gameStarted = true;
    //     menuControlsPanel.isVisible=false;
}
var createRespawnPanel = function (advancedTexture) {
    var style = advancedTexture.createStyle();
    style.fontSize = 26;
    style.fontStyle = "bold";
    var verticalPadding = "10px";
    respawnPanel.height = "100px";
    respawnPanel.width = "200px";
    respawnPanel.color = "orange";
    respawnPanel.thickness = 5;
    respawnPanel.background = "orange";
    respawnPanel.alpha = .9;
    var respawnCbText = new BABYLON.GUI.TextBlock();
    respawnCbText.text = "Respawning";
    respawnCbText.width = "190px";
    respawnCbText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    respawnCbText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    respawnCbText.color = "black";
    respawnCbText.paddingLeft = "3";
    respawnCbText.height = "30px";
    respawnCbText.style = style;
    respawnPanel.addControl(respawnCbText);
    respawnCounterText.text = "" + respawnCounter;
    respawnCounterText.width = "190px";
    respawnCounterText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    respawnCounterText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    respawnCounterText.color = "black";
    respawnCounterText.paddingLeft = "3";
    respawnCounterText.paddingTop = "80";

    respawnCounterText.height = "30px";
    respawnCounterText.style = style;
    respawnPanel.addControl(respawnCounterText);
    respawnPanel.isVisible = false;
    return respawnPanel;
}
var createRespawnCheckbox = function () {
    var respawnCb = new BABYLON.GUI.Checkbox();
    respawnCb.width = "20px";
    respawnCb.height = "20px";
    respawnCb.isChecked = respawn;
    respawnCb.color = "orange";

    respawnCb.onIsCheckedChangedObservable.add(function (value) {
        respawn = !respawn;
    });
    var respawnCbText = new BABYLON.GUI.TextBlock();
    respawnCbText.text = "Respawn";
    respawnCbText.width = "180px";
    respawnCbText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    respawnCbText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    respawnCbText.color = "black";
    respawnCbText.paddingLeft = "3";
    respawnCbText.height = "30px";

    var panel = new BABYLON.GUI.StackPanel();
    panel.width = "200px";
    panel.isVertical = false;
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    panel.addControl(respawnCb);
    panel.addControl(respawnCbText);
    panel.adaptHeightToChildren = true;
    return panel;

}
var createInfiniteCheckbox = function () {
    var infiniteCb = new BABYLON.GUI.Checkbox();
    infiniteCb.width = "20px";
    infiniteCb.height = "20px";
    infiniteCb.isChecked = infiniteMode;
    infiniteCb.color = "orange";

    infiniteCb.onIsCheckedChangedObservable.add(function (value) {
        infiniteMode = !infiniteMode;
    });
    var infiniteCbText = new BABYLON.GUI.TextBlock();
    infiniteCbText.text = "Keep 'em comming";
    infiniteCbText.width = "180px";
    infiniteCbText.height = "30px";
    infiniteCbText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    infiniteCbText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    infiniteCbText.color = "black";
    infiniteCbText.paddingLeft = "3";

    var panel = new BABYLON.GUI.StackPanel();
    panel.width = "200px";
    panel.isVertical = false;
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    panel.addControl(infiniteCb);
    panel.addControl(infiniteCbText);
    panel.adaptHeightToChildren = true;
    return panel;

}
var startPlaying = function () {
    gameStarted = true;
    audioEnabled = false;
    toggleAudio();
    canvas.requestPointerLock();
    if (playerDied) {
        var cellIndex = Math.floor((Math.random() * randomAmmoLocations.length));
        var cell = randomAmmoLocations[cellIndex];
        var playerPos = new BABYLON.Vector3(cell.x * unit - 1650,
            camera.position.y, cell.y * unit - 1650);
        camera.position = playerPos;
        camera.setTarget(new BABYLON.Vector3(0, 25, 0));
        camera.inputs.addMouse();
        camera.inputs.addKeyboard();
        player.leftArm.isVisible = true;
        player.rightArm.isVisible = true;
        player.weapon.isVisible = true;
        player.crosshairTop.isVisible = true;
        player.crosshairBottom.isVisible = true;
        player.crosshairLeft.isVisible = true;
        player.crosshairRight.isVisible = true;
        player.muzzleFlash.isVisible = true;
        player.health = 100;
        player.bullets = 100;
        player.ammo = 30;
        player.shouldJump = false;
        player.shouldDuck = false;
        ammo.text = player.ammo + "| " + player.bullets;
        health.text = Math.floor(player.health) + "";
        playerDied = false;
        player.toggleDuck();
        camera.keysUp = [87]; // W
        camera.keysDown = [83]; // S
        camera.keysLeft = [65]; // A
        camera.keysRight = [68]; // D
        if (!respawn) {
            kills = 0;
            killsCount.text = "Kills " + kills;
            lastEnemyId = 0;
            for (var i = enemies.length - 1; i >= 0; i--) {
                enemies[i].remove(false);
            }
            createFirstRoundEnemies(globalScene);
        }
    }
    else
        if (newEnemiesRound) {
            kills = 0;
            killsCount.text = "Kills " + kills;
            lastEnemyId = 0;
            createFirstRoundEnemies(globalScene);
            newEnemiesRound = false;
            camera.inputs.addMouse();
            camera.inputs.addKeyboard();
            player.health = 100;
            player.bullets = 100;
            player.ammo = 30;
            player.shouldJump = false;
            player.shouldDuck = false;
            player.toggleDuck();
            ammo.text = player.ammo + "| " + player.bullets;
            health.text = Math.floor(player.health) + "";
            camera.keysUp = [87]; // W
            camera.keysDown = [83]; // S
            camera.keysLeft = [65]; // A
            camera.keysRight = [68]; // D
        }
}
var createLevelSlider = function () {
    var smallTextStyle = advancedTexture.createStyle();
    smallTextStyle.fontSize = 12;
    smallTextStyle.fontStyle = "bold";
    var header = new BABYLON.GUI.TextBlock();
    header.text = "Level: " + levels[0];
    header.height = "30px";
    header.color = "black";
    header.style = smallTextStyle;
    var slider = new BABYLON.GUI.Slider();
    slider.minimum = 0;
    slider.maximum = 7;
    slider.value = 0;
    slider.step = 5;
    slider.height = "20px";
    slider.width = "150px";
    slider.background = "black";
    slider.onValueChangedObservable.add(function (value) {
        var level = Math.floor(value / 2);
        header.text = "Level: " + levels[level];
        difficulty = level + 1;
    });
    var panel = new BABYLON.GUI.StackPanel();
    panel.width = "500px";
    panel.isVertical = true;
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    panel.addControl(createInstructionLine(" "));
    panel.addControl(header);
    panel.addControl(slider);
    return panel;
}
var createMouseSlider = function () {
    var smallTextStyle = advancedTexture.createStyle();
    smallTextStyle.fontSize = 12;
    smallTextStyle.fontStyle = "bold";
    var header = new BABYLON.GUI.TextBlock();
    header.text = "Mouse Sensitivity: " + mouse[3];
    header.height = "30px";
    header.color = "black";
    header.style = smallTextStyle;
    var slider = new BABYLON.GUI.Slider();
    slider.minimum = 0;
    slider.maximum = 7;
    slider.value = 7;
    slider.step = 5;
    slider.height = "20px";
    slider.width = "150px";
    slider.background = "black";
    slider.onValueChangedObservable.add(function (value) {
        var mouseValue = Math.floor(value / 2);
        header.text = "Mouse Sensitivity: " + mouse[mouseValue];
        mouseSensitivity = 2000 + (1000 * (1 - (value / 7)));
        camera.angularSensibility = mouseSensitivity;
    });
    var panel = new BABYLON.GUI.StackPanel();
    panel.width = "500px";
    panel.isVertical = true;
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    panel.addControl(createInstructionLine(" "));
    panel.addControl(header);
    panel.addControl(slider);
    return panel;
}
var createControlInstructions = function () {
    controlInstructionsPanel.width = "500px";
    controlInstructionsPanel.isVertical = true;
    controlInstructionsPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    controlInstructionsPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    controlInstructionsPanel.isVisible = true;
    controlInstructionsPanel.addControl(createInstructionLine(" "));
    controlInstructionsPanel.addControl(createInstructionLine(" "));
    controlInstructionsPanel.addControl(createInstructionLine(" "));

    controlInstructionsPanel.addControl(createInstructionLine("W          Forward"));
    controlInstructionsPanel.addControl(createInstructionLine("S           Backward"));
    controlInstructionsPanel.addControl(createInstructionLine("A           Left"));
    controlInstructionsPanel.addControl(createInstructionLine("D           Right"));
    controlInstructionsPanel.addControl(createInstructionLine("R           Reload"));
    controlInstructionsPanel.addControl(createInstructionLine("Shift     Jump"));
    controlInstructionsPanel.addControl(createInstructionLine("Ctrl       Duck"));

    controlInstructionsPanel.addControl(createInstructionLine(" "));

    controlInstructionsPanel.addControl(createInstructionLine("CTL+F-  Fullscreen"));
    controlInstructionsPanel.addControl(createInstructionLine("CTL+M-  Audio"));
    controlInstructionsPanel.addControl(createInstructionLine("CTL+P-  Pause"));
    controlInstructionsPanel.addControl(createInstructionLine("CTL+N-  New"));

    return controlInstructionsPanel;
}
var createInstructionLine = function (text) {
    var smallTextStyle = advancedTexture.createStyle();
    smallTextStyle.fontSize = 14;
    smallTextStyle.fontStyle = "bold";
    var line = new BABYLON.GUI.TextBlock();
    line.style = smallTextStyle;
    line.text = text;
    line.width = "500px";
    line.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    line.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    line.color = "black";
    line.paddingLeft = "3";
    line.height = "15px";
    return line;
}