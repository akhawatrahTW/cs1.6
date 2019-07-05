class Player {
    constructor(leftArm, rightArm, skeleton, weapon, scene, camera) {
        this.leftArm = leftArm;
        this.rightArm = rightArm;
        this.skeleton = skeleton;
        this.weapon = weapon;
        this.scene = scene;
        this.camera = camera;
        this.weapon.position.y = 10;
        this.weapon.position = new BABYLON.Vector3(4, 1, -7.5);
        this.weapon.rotation.y = Math.PI - .1;
        this.weapon.parent = this.camera;
        this.leftArm.position.y = 10;
        this.leftArm.position = new BABYLON.Vector3(4, 1, -7.5);
        this.leftArm.rotation.y = Math.PI - .1;
        this.leftArm.parent = this.camera;
        this.rightArm.position.y = 10;
        this.rightArm.position = new BABYLON.Vector3(4, 1, -7.5);
        this.rightArm.rotation.y = Math.PI - .1;
        this.rightArm.parent = this.camera;
        this.activeAnimation = null;
        this.magCapacity = 30;
        this.ammo = this.magCapacity;
        this.bullets = 100;
        this.health = 100;
        this.speed = 0;
        this.isReloading = false;
        this.position = this.camera.position;
        this.fireButtonOn = false;
        this.shotCount = 0;
        this.spriteManager = new BABYLON.SpriteManager("spriteManager", "../images/muzzleFlash.jpg", 2, { width: 200, height: 150 }, scene);
        this.muzzleFlash = new BABYLON.Sprite("muzzleFlash", this.spriteManager);
        this.muzzleFlash.parent = this.weapon;
        this.muzzleFlash.size = 0;
        this.muzzleFlash.playAnimation(0, 1, true, 100);

        this.muzzleFlash.position.y = 20;
        this.muzzleFlash.position.x = 20;
        this.muzzleFlash.position.z = 20;
        this.muzzleFlashPlane = BABYLON.MeshBuilder.CreatePlane("bloodSplatter", { height: .1, width: .1 }, this.scene);
        this.muzzleFlashPlane.rotation.z += Math.PI / 2;
        this.muzzleFlashPlane.parent = this.camera;
        this.muzzleFlashPlane.position.z += 60;
        this.muzzleFlashPlane.position.y -= 6;
        this.muzzleFlashPlane.position.x -= 13;
        this.muzzleFlashPlane.visibility = false;
        this.shotSoundReady = false;
        this.dummyBox = BABYLON.MeshBuilder.CreateBox("player box", { height: 70, width: 40, depth: 40 }, this.scene);
        this.dummyBox.position = new BABYLON.Vector3(600, 15, 0);
        // this.dummyBox.parent = this.camera;
        this.dummyBox.visibility = false;
        var crosshairMat = new BABYLON.StandardMaterial("crosshairMat", this.scene);
        crosshairMat.diffuseColor = new BABYLON.Color3.Yellow();
        this.crosshairTop =
            BABYLON.MeshBuilder.CreateBox("crosshairTop", { height: .4, width: .04, depth: .04 }, this.scene);
        this.crosshairTop.position = new BABYLON.Vector3(0, -10, 0);
        this.crosshairTop.position.z += 20;
        this.crosshairTop.position.y += 10.3;
        this.crosshairTop.position.x -= 0;
        this.crosshairTop.isPickable = false;
        this.crosshairTop.parent = this.camera;
        this.crosshairTop.material = crosshairMat;
        this.crosshairBottom =
            BABYLON.MeshBuilder.CreateBox("crosshairBottom", { height: .4, width: .04, depth: .04 }, this.scene);
        this.crosshairBottom.position = new BABYLON.Vector3(0, -10, 0);
        this.crosshairBottom.position.z += 20;
        this.crosshairBottom.position.y += 9.7;
        this.crosshairBottom.position.x -= 0;
        this.crosshairBottom.isPickable = false;
        this.crosshairBottom.parent = this.camera;
        this.crosshairBottom.material = crosshairMat;

        this.crosshairRight =
            BABYLON.MeshBuilder.CreateBox("crosshairRight", { height: .4, width: .04, depth: .04 }, this.scene);
        this.crosshairRight.position = new BABYLON.Vector3(0, -10, 0);
        this.crosshairRight.position.z += 20;
        this.crosshairRight.position.y += 10;
        this.crosshairRight.position.x += .3;
        this.crosshairRight.rotation.z = Math.PI / 2;
        this.crosshairRight.isPickable = false;
        this.crosshairRight.parent = this.camera;
        this.crosshairRight.material = crosshairMat;

        this.crosshairLeft =
            BABYLON.MeshBuilder.CreateBox("crosshairLeft", { height: .4, width: .04, depth: .04 }, this.scene);
        this.crosshairLeft.position = new BABYLON.Vector3(0, -10, 0);
        this.crosshairLeft.position.z += 20;
        this.crosshairLeft.position.y += 10;
        this.crosshairLeft.position.x -= .3;
        this.crosshairLeft.rotation.z -= Math.PI / 2;
        this.crosshairLeft.isPickable = false;
        this.crosshairLeft.parent = this.camera;
        this.crosshairLeft.material = crosshairMat;
        this.camera.onCollide = function (mesh) {
            if (mesh.name == "ammo box") {
                if (player.bullets < 71) {
                    player.bullets += 30;
                    ammo.text = player.ammo + "| " + player.bullets;
                    mesh.dispose();
                    setTimeout(function () { player.createAmmo(); }, 3000);
                }
                else if (player.bullets < 100) {
                    player.bullets = 100;
                    ammo.text = player.ammo + "| " + player.bullets;
                    mesh.dispose();
                    setTimeout(function () { player.createAmmo(); }, 3000);
                }
            }
        }
        this.isRandomAmmoCreationEnabled = false;
        // var bloodSplatter = BABYLON.MeshBuilder.CreatePlane("bloodSplatter", { height: 160, width: 80 }, this.scene);
        // bloodSplatter.rotation.z += Math.PI / 2;
        // bloodSplatter.parent = this.camera;
        // bloodSplatter.position.z += 100;
        // var bloodSplatterMaterial = new BABYLON.StandardMaterial("bloodSplatterMaterial", this.scene);
        // bloodSplatterMaterial.diffuseTexture = new BABYLON.Texture("../images/blood_splatter.png", this.scene);
        // bloodSplatterMaterial.diffuseTexture.hasAlpha = true;
        // bloodSplatter.material = bloodSplatterMaterial;

        //create jump animation
        camera.animations = [];

        this.jumpAnimation = new BABYLON.Animation(
            "a",
            "position.y", 10,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        // Animation keys
        var keys = [];
        keys.push({ frame: 0, value: camera.position.y });
        keys.push({ frame: 5, value: camera.position.y + 45 });
        keys.push({ frame: 10, value: camera.position.y });
        this.jumpAnimation.setKeys(keys);

        var easingFunction = new BABYLON.CircleEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        this.jumpAnimation.setEasingFunction(easingFunction);

        camera.animations.push(this.jumpAnimation);

        this.jumpping = false;
        this.shouldJump = false;
        this.shouldDuck = false;
        // Sound will now follow the box mesh position
    }
}
Player.prototype.jump = function () {
    var player = this;
    if (this.jumpping)
        return;
    player.jumpping = true;
    this.scene.beginAnimation(camera, 0, 10, false, 1, function () {
        player.jumpping = false;
    });
}
Player.prototype.toggleDuck = function () {
    if (this.shouldDuck) {
        camera.position.y = 30;
        camera.ellipsoid.y = 15;
        camera.speed = 2;
        this.dummyBox.scaling.y = .6;

    }
    else {
        camera.position.y = 54;
        camera.ellipsoid.y = 27;
        camera.speed = 7;
        this.dummyBox.scaling.y = 1;

    }
    camera.animations = [];
    var keys = [];
    keys.push({ frame: 0, value: camera.position.y });
    keys.push({ frame: 5, value: camera.position.y + 45 });
    keys.push({ frame: 10, value: camera.position.y });
    camera.animations.push(this.jumpAnimation);
    this.jumpAnimation.setKeys(keys);
}
Player.prototype.animate = function (animation) {
    if (this.activeAnim != null) {
        this.activeAnim.stop();

    }
    switch (animation) {
        case 'shoot':
            this.speed = 0;
            this.activeAnim = this.startShootAnimation();
            break;
        case 'reload':
            this.speed = 0;
            this.activeAnim = this.startReloadAnimation();
            break;
    }
}
Player.prototype.startShootAnimation = function () {
    var shootAnim = this.scene.beginAnimation(this.skeleton, 170, 186, false, 1, function () {}, false);
    return shootAnim;
}
Player.prototype.reload = function () {
    if (this.bullets == 0)
        return;
    if (this.ammo == this.magCapacity)
        return;
    if (this.bullets < this.magCapacity - this.ammo) {
        this.ammo += this.bullets;
        this.bullets = 0;
        this.isReloading = true;
    }
    else
        if (this.bullets < this.magCapacity) {
            this.bullets = this.bullets - (this.ammo);
            this.ammo = this.bullets;
            this.isReloading = true;
        }
        else {
            this.bullets = this.bullets - (this.magCapacity - this.ammo);
            this.ammo = this.magCapacity;
            this.isReloading = true;
        }

    this.animate('reload');
    if (!this.isRandomAmmoCreationEnabled) {
        this.isRandomAmmoCreationEnabled = true;
        this.createAmmo();
    }
}

Player.prototype.startReloadAnimation = function () {
    var player = this;
    var reloadAnim;
    reloadAnim = this.scene.beginAnimation(this.skeleton, 70, 170, false, 1, function () {
        player.isReloading = false;
        ammo.text = player.ammo + "| " + player.bullets;

    });
    return reloadAnim;
}
Player.prototype.shoot = function () {
    if (this.isReloading)
        return;

    if (audioEnabled)
        playerShooting.play();
    this.ammo--;
    ammo.text = this.ammo + "| " + this.bullets;
    this.animate('shoot');
    this.muzzleFlash.size = 20;

    var width = this.scene.getEngine().getRenderWidth();
    var height = this.scene.getEngine().getRenderHeight();
    var predicate = function (mesh) {
        if (mesh.name == 'player box')
            return false;
        return true;
    }
    var pickInfo = this.scene.pick(width / 2, height / 2, predicate, false, this.camera);
    if (pickInfo.pickedMesh && pickInfo.pickedMesh.name == 'head') {
        var enemy = pickInfo.pickedMesh.enemy;
        enemy.gotHit(101);
    }
    else
        if (pickInfo.pickedMesh && pickInfo.pickedMesh.name.startsWith('enemy')) {
            var enemy = pickInfo.pickedMesh.enemy;
            enemy.gotHit(30);
        }
    if (this.ammo <= 0) {
        this.reload();
        this.muzzleFlash.size = 0;
        return;
    }
}
Player.prototype.hit = function (shotImpact) {
    this.health -= shotImpact;
    if (this.health <= 1) {
        this.health = 0;
        this.die();
    }
    health.text = Math.floor(this.health) + "";
}
Player.prototype.die = function () {
    gameStarted = false;
    killsCount.text = "Keep on trying, practice makes perfect.";
    this.leftArm.isVisible = false;
    this.rightArm.isVisible = false;
    this.weapon.isVisible = false;
    this.crosshairTop.isVisible = false;
    this.crosshairBottom.isVisible = false;
    this.crosshairLeft.isVisible = false;
    this.crosshairRight.isVisible = false;
    this.muzzleFlash.isVisible = false;
    this.fireButtonOn = false;
    playerDied = true;
    camera.inputs.clear();
    document.exitPointerLock();
    isLocked = false;
    if (respawn) {
        respawnPanel.isVisible = true;
        var respawnCountdown = function () {
            if (respawnCounter > 1) {
                respawnCounter--;
            }
            else {
                respawnCounter = 3;
                clearInterval(respawnCountDownIntervalId);
                startPlaying();
                respawnPanel.isVisible = false;
            }
            respawnCounterText.text = "" + respawnCounter;
        };
        respawnCountDownIntervalId = setInterval(respawnCountdown, 1000);
    }
    else {
        menuControlsPanel.isVisible = true;
    }
}

Player.prototype.createAmmo = function () {
    var ammoBox = BABYLON.MeshBuilder.CreateBox("ammo box", { width: 20, height: 1, depth: 20 }, this.scene);
    var cellIndex = Math.floor((Math.random() * randomAmmoLocations.length));
    var cell = randomAmmoLocations[cellIndex];
    var ammoPos = new BABYLON.Vector3(cell.x * unit - 1650,
        1, cell.y * unit - 1650);
    ammoBox.position = ammoPos;
    var weapon = deagle.clone();
    weapon.position = new BABYLON.Vector3(0, 0, 0);
    weapon.rotation.z += Math.PI / 2;
    weapon.parent = ammoBox;
    weapon.checkCollisions = false;
    ammoBox.checkCollisions = true;
    ammoBox.isVisible = false;
    var player = this;

}
Player.prototype.runBeforeRender = function () {
    if (playerDied)
        return;
    if (this.shouldJump)
        this.jump();
    this.dummyBox.position = camera.position.clone();
    this.dummyBox.position.y -= 10;
    this.muzzleFlash.angle += 0.01;
    this.muzzleFlash.position = this.muzzleFlashPlane.getAbsolutePosition();
    this.position = this.camera.position;
    if (this.fireButtonOn) {
        if (this.shotCount < 12)
            this.shotCount++;
        else {
            this.shoot();
            this.shotCount = 0;
        }
    }
    else {
        this.shotCount = 0;
        this.muzzleFlash.size = 0;
    }
}