var animations = ['idle', 'crouch', 'walk', 'run', 'crouchWalk', 'die'];
class Enemy {
    constructor(id, mesh, skeleton, weapon, shootingRangeUnits, accuracy, scene) {
        this.id = id;
        this.shootingRangeUnits = shootingRangeUnits;
        this.accuracy = accuracy;
        this.mesh = mesh;
        // this.mesh.showBoundingBox = true;
        this.mesh.position.y -= 10;
        this.skeleton = skeleton;
        this.skeleton.enableBlending(0.075);
        this.scene = scene;
        this.activeAnim = null;
        this.activeAnimName = '';
        this.weapon = weapon;
        this.weapon.scaling = new BABYLON.Vector3(.8, .8, .8);
        this.weapon.rotation.y += Math.PI / 2;
        this.weapon.rotation.y -= .01;
        this.weapon.rotation.z += Math.PI / 2;
        // this.weapon.rotation.x += Math.PI;
        this.weapon.rotation.x += .1;
        this.weapon.attachToBone(this.skeleton.bones[20], this.mesh);
        this.weapon.position.x += 5.0;
        this.weapon.position.z += 1.0;
        this.weapon.position.y -= .1;
        this.times = 1;
        this.frontVector = new BABYLON.Vector3(1, 0, 0);
        this.speed = 0;
        this.mesh.checkCollisions = true;
        // this.mesh.position.y += 5.3;
        //this.mesh.showBoundingBox = true;
        this.mesh.actionManager = new BABYLON.ActionManager(scene);
        this.nearObstacle = false;
        this.originalRotation = this.mesh.rotation.y;
        this.animationSwitchAfter = 400;
        this.distance = 300;
        this.reactToShotDistance = 1500;
        this.ray = new BABYLON.Ray();
        this.rayHelper = new BABYLON.RayHelper(this.ray);
        this.rayHelper.attachToMesh(this.mesh, this.frontVector, new BABYLON.Vector3(33.6, 0, 0), this.reactToShotDistance);
        // this.rayHelper.show(this.scene);
        var localMeshDirection = this.frontVector;
        var localMeshOrigin = this.mesh.position;
        var length = 5;
        this.timer = 5001;
        this.enemyResult;
        this.enemy3PathBlockIndex;
        this.findPlayer;
        this.headBox = new BABYLON.MeshBuilder.CreateBox("head", { width: 10, height: 10, depth: 7 }, this.scene);
        this.headBox.parent = this.mesh;
        this.headBox.position.y += 0;
        this.headBox.position.x += 5;
        this.headBox.position.z -= 0;
        this.headBox.visibility = false;
        this.headBox.enemy = this;
        this.mesh.enemy = this;
        this.headBox.attachToBone(
            this.skeleton.bones[7], this.mesh);
        this.dead = false;
        this.deathSound = null;
        this.lastPlayerPosition = null;
        this.enemyPathBlockIndex = 0;
        this.findPlayer = true;
        this.previousBlock = null;
        this.currentBlock = null;
        this.mesh.ellipsoid = new BABYLON.Vector3(15.0, 30, 15.0);
        this.waitBeforeNextShot = 100;
        this.loopsFromLastShot = 0;
        this.health = 100;
        var enemy = this;
        this.isAvoidingCollision = false;
        this.mesh.computeWorldMatrix(true);
        this.idle();
        this.currentX = -10000;
        this.currentY = -10000;
        this.isShot = false;
        this.spine = this.skeleton.bones[2];
        this.initMat = skeleton.bones[2].getLocalMatrix().clone();
        this.spineRotationAngle = 0;
        // this.drawEllipsoid();
        this.cells = [];
        this.graph = null;
        this.generateMyGraph();
        this.dummBox = BABYLON.MeshBuilder.CreateBox("dummy", { height: 20, width: .1, depth: .1 }, this.scene);
        this.dummBox.position.y = 50;
        this.dummBox.isVisible = false;
        this.dray = new BABYLON.Ray();
        this.drayHelper = new BABYLON.RayHelper(this.dray);
        this.drayHelper.attachToMesh(this.dummBox, new BABYLON.Vector3(1, 0, 0),
            new BABYLON.Vector3(33.6, 0, 0), this.reactToShotDistance);
        // this.drayHelper.show(this.scene);

        // this.mesh.onCollide = function (mesh) {
        //     if (mesh.name.startsWith("enemy")) {
        //         console.log(mesh.name + "," + enemy.mesh.name);
        //     }
        // };
    }
}
Enemy.prototype.generateMyGraph = function () {
    for (var i = 0; i < cells.length; i++) {
        this.cells[i] = cells[i].slice();
    }
    for (var i = 0; i < this.cells.length; i++) {
        for (var j = 0; j < this.cells.length; j++) {
            if (this.cells[i][j] == 1) {
                this.cells[i][j] = Math.floor((Math.random() * 20) + 1);
            }
        }
    }
    this.graph = new Graph(this.cells);
}

Enemy.prototype.getDeltaDegressToTarget = function (rotatingObject, pointToRotateTo) {
    // a directional vector from one object to the other one
    var direction = pointToRotateTo.subtract(rotatingObject.position);

    var v1 = this.frontVector.normalize();
    var v2 = direction;

    // caluculate the angel for the new direction
    var angle = Math.acos(BABYLON.Vector3.Dot(v1, v2.normalize()));

    //console.log(angle);

    // decide it the angle has to be positive or negative
    if (direction.z > 0) angle = angle * -1;


    // calculate both angles in degrees
    var angleDegrees = Math.floor(angle * 180 / Math.PI);
    var playerRotationDegress = Math.floor(rotatingObject.rotation.y * 180 / Math.PI);
    var deltaDegrees = playerRotationDegress - angleDegrees;
    if (deltaDegrees > 180) {
        deltaDegrees = deltaDegrees - 360;
    } else if (deltaDegrees < -180) {
        deltaDegrees = deltaDegrees + 360;
    }
    return deltaDegrees;
}



Enemy.prototype.start = function (enemy) {
    var num = Math.floor(Math.random() * (animations.length - 1));
    enemy.animate(animations[num]);
}
Enemy.prototype.animate = function (animation) {
    if (this.activeAnim != null) {
        this.activeAnim.stop();
    }

    switch (animation) {
        case 'idle':
            this.speed = 0;
            this.activeAnim = this.animateIdle(true);
            break;
        case 'crouch':
            this.speed = 0;
            this.activeAnim = this.crouch();
            break;
        case 'walk':
            this.speed = 0.9;
            this.activeAnim = this.animateWalk(true);
            break;
        case 'run':
            this.speed = 1.7;
            this.activeAnim = this.animateRun(true);
            break;
        case 'crouchWalk':
            this.speed = 0.6;
            this.activeAnim = this.animateCrouchWalk(true);
            break;
        case 'jump':
            this.speed = 1.1;
            this.activeAnim = this.jump();
            break;
        case 'die':
            this.speed = 0;
            this.activeAnim = this.animateDie(false);
            break;
    }
}
Enemy.prototype.animateIdle = function (loop) {
    var idleAnim = this.scene.beginAnimation(this.skeleton, 0, 64, loop);
    return idleAnim;
}
Enemy.prototype.crouch = function (loop) {
    var crouchAnim = this.scene.beginAnimation(this.skeleton, 66, 95, loop);
    return crouchAnim;
}
Enemy.prototype.animateWalk = function (loop) {
    var walkAnim = this.scene.beginAnimation(this.skeleton, 96, 128, loop);
    return walkAnim;
}
Enemy.prototype.animateRun = function (loop) {
    var runAnim = this.scene.beginAnimation(this.skeleton, 130, 165, loop, 2);
    return runAnim;
}
Enemy.prototype.animateCrouchWalk = function (loop) {
    var crouchWalkAnim = this.scene.beginAnimation(this.skeleton, 167, 196, loop, 1.5);
    return crouchWalkAnim;
}
Enemy.prototype.jump = function (loop) {
    var jumpAnim = this.scene.beginAnimation(this.skeleton, 197, 256, loop);
    return jumpAnim;
}
Enemy.prototype.animateDie = function (loop) {
    var enemy = this;
    kills++;
    killsCount.text = "Kills " + kills;
    if (this.currentX != -10000 && this.currentY != -10000) {
        // var block = this.scene.getMeshByName("block" + this.currentX + "_" + this.currentY);
        // block.material.diffuseColor = new BABYLON.Color3.White();
        this.populateCellValueChange(1, this.currentX, this.currentY);
        cellEnemy[this.currentX + "_" + this.currentY] = null;
    }
    enemy.mesh.checkCollisions = false;
    enemy.headBox.checkCollisions = false;
    var dieAnim = this.scene.beginAnimation(this.skeleton, 695, 749, loop, 1, function () {
        if (infiniteMode) {
            var findingValidRandomLocationAttempts = 5;
            var attemptsCount = 0;
            while (attemptsCount < findingValidRandomLocationAttempts) {
                var cellIndex = Math.floor((Math.random() * randomAmmoLocations.length));
                var cell = randomAmmoLocations[cellIndex];
                var enemyPos = new BABYLON.Vector3(2 * unit - 1650,
                    enemy.mesh.position.y, 3 * unit - 1650);
                if (cells[cell.x][cell.y] != 0) {
                    enemy.remove();
                    enemyPos = new BABYLON.Vector3(3 * unit - 1650,
                        160, 4 * unit - 1650);
                    cloneGuerilla("enemy", guerilla, guerillaSkeleton, deagle, enemy.scene,
                        enemyPos, 4, 1);
                    break;
                }
                attemptsCount++;
            }

        }
        else {
            enemy.remove();

        }

    });
    return dieAnim;
}
Enemy.prototype.remove = function (checkIfAllEnmiesAreDead = true) {
    if (this.currentX != -10000 && this.currentY != -10000) {
        // var block = this.scene.getMeshByName("block" + this.currentX + "_" + this.currentY);
        // block.material.diffuseColor = new BABYLON.Color3.White();
        this.populateCellValueChange(1, this.currentX, this.currentY);
        cellEnemy[this.currentX + "_" + this.currentY] = null;
    }
    this.mesh.dispose();
    this.headBox.dispose();
    this.weapon.dispose();
    this.dead = true;
    // enemy.deathSound.dispose();
    var enemyIndex = -1;
    var i = 0;
    for (; i < enemies.length; i++) {
        if (enemies[i].id == this.id) {
            enemyIndex = i;
            break;
        }
    }
    enemies.splice(i, 1);
    if (checkIfAllEnmiesAreDead && enemies.length < 1) {
        gameStarted = false;
        killsCount.text = "Well done!";
        newEnemiesRound = true;
        camera.inputs.clear();
        document.exitPointerLock();
        menuControlsPanel.isVisible = true;
        createDomMenu();
    }

}
Enemy.prototype.gotHit = function (shotImpact) {
    this.health -= shotImpact;
    var distance = Math.floor(BABYLON.Vector3.Distance(this.mesh.position, player.position));
    if (distance <= this.reactToShotDistance)
        this.isShot = true;
    if (this.health < 0) {
        this.die();
    }
}
Enemy.prototype.die = function () {
    if (this.dead) {
        return;
    }
    if (audioEnabled) {
        if (this.deathSound == null) {
            this.deathSound = enemyDeath.clone();
        }
        this.deathSound.setPosition(this.mesh.position);
        this.deathSound.play();
    }
    this.dead = true;
    this.animate('die');
}
Enemy.prototype.walk = function () {
    this.animate('walk');
}
Enemy.prototype.run = function () {
    if (this.activeAnimName == 'run')
        return;
    this.activeAnimName = 'run';
    this.animate('run');
}
Enemy.prototype.idle = function () {
    if (this.activeAnimName == 'idle')
        return;
    this.activeAnimName = 'idle';
    this.animate('idle');
}
Enemy.prototype.crouchWalk = function () {
    if (this.activeAnimName == 'crouchWalk')
        return;
    this.activeAnimName = 'crouchWalk';
    this.animate('crouchWalk');
}

Enemy.prototype.setBlending = function () {
    this.skeleton.bones.forEach(function (bone) {
        bone.animations.forEach(function (animation) {
            animation.enableBlending = true;
            animation.blendingSpeed = 1.75;
        });
    });
}

Enemy.prototype.predicate = function (mesh) {
    if (mesh.name.startsWith("wall") || (this.mesh.name != mesh.name && mesh.name.startsWith("enemy"))) {
        return true;
    }
    return false;
}

Enemy.prototype.castRay = function (ray) {
    var hit = this.scene.pickWithRay(ray, function (mesh) {
        if (mesh.name == "player box") {
            return true;
        }
        //now this always returns true to check if there are obstacles between me and player
        return true;
    });
    if (hit.pickedMesh && hit.pickedMesh.name == "player box") {
        this.destination = 600;
        return hit.pickedMesh;
    }

    return null;
}
Enemy.prototype.lookAtPlayer = function () {
    var deltaDegrees = this.getDeltaDegressToTarget(this.mesh, player.position);
    var mat = this.skeleton.bones[2].getLocalMatrix().copyFrom(this.initMat);
    this.spineRotationAngle = deltaDegrees * Math.PI / 180;
    this.dummBox.rotation.y = this.spineRotationAngle;
    mat.multiplyToRef(BABYLON.Matrix.RotationX(this.spineRotationAngle), mat);
    this.skeleton.bones[2].markAsDirty();
    this.pointDummyBoxToPlayer();
}
Enemy.prototype.populateCellValueChange = function (value, x, y) {
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].cells[x][y] = value;
    }
    cells[x][y] = value;
}
Enemy.prototype.pointDummyBoxToPlayer = function () {
    var deltaDegrees = this.getDeltaDegressToTarget(this.dummBox, player.position);
    if (Math.abs(deltaDegrees) > 1) {
        this.facePoint(this.dummBox, player.position, deltaDegrees, 1);
    }
    var hitMesh = this.castRay(this.dray);
    if (hitMesh != null) {
        this.fireShot(0);
    }
}

Enemy.prototype.runBeforeRender = function () {
    if (!gameStarted) {
        this.idle();
        return;
    }
    if (this.dead)
        return;
    this.dummBox.position = this.mesh.position;
    var currentX = Math.floor(this.mesh.position.x / unit) + cells.length / 2;
    var currentY = Math.floor(this.mesh.position.z / unit) + cells.length / 2;
    if (this.currentX == -10000) {
        this.currentX = currentX;
    }
    if (this.currentY == -10000) {
        this.currentY = currentY;
    }
    if (this.currentX != currentX || this.currentY != currentY) {
        // var block = this.scene.getMeshByName("block" + this.currentX + "_" + this.currentY);
        // block.material.diffuseColor = new BABYLON.Color3.White();
        this.populateCellValueChange(Math.floor((Math.random() * 8) + 2), this.currentX, this.currentY);
        cellEnemy[currentX + "_" + currentY] = null;

    }
    else {
        // var block = this.scene.getMeshByName("block" + currentX + "_" + currentY);
        // block.material.diffuseColor = new BABYLON.Color3.Yellow();
        this.populateCellValueChange(0, currentX, currentY);
        cellEnemy[currentX + "_" + currentY] = this.id;
    }
    this.currentX = currentX;
    this.currentY = currentY;


    var target = player.position.clone();
    var distance = Math.floor(BABYLON.Vector3.Distance(this.mesh.position, target));


    if (this.playerMoved() && !this.findPlayer) {
        this.findPath();
    }
    if (!this.isShot && this.findPlayer && distance > this.distance) {
        if (this.enemyResult && this.enemyPathBlockIndex < this.enemyResult.length && this.findPlayer) {
            var cell = this.cells[this.enemyResult[this.enemyPathBlockIndex].x][this.enemyResult[this.enemyPathBlockIndex].y];
            if (cell == 0 && cellEnemy[this.enemyResult[this.enemyPathBlockIndex].x + "_" +
                this.enemyResult[this.enemyPathBlockIndex].y] != this.id) {
                this.lookAtPlayer();
                this.idle();
                this.findPath();
                return;
            }
            var newPos = new BABYLON.Vector3((this.enemyResult[this.enemyPathBlockIndex].x) * unit - 1650,
                this.mesh.position.y, (this.enemyResult[this.enemyPathBlockIndex].y) * unit - 1650);
            //Not sure why this correction is needed
            newPos.x += unit;
            newPos.z += unit;

            deltaDegrees = this.getDeltaDegressToTarget(this.mesh, newPos);
            if (Math.abs(deltaDegrees) > 1) {
                this.facePoint(this.mesh, newPos, deltaDegrees, 8);
            }
            this.lookAtPlayer();
            this.moveToTarget(this.mesh, newPos, this.speed);

            if (BABYLON.Vector3.Distance(this.mesh.position, newPos) < 20) {
                this.enemyPathBlockIndex++;
            }
        }
        if (distance > this.distance + (this.distance / 4)) {
            this.run();
        }
        else
            if (distance > this.distance + 20) {
                this.run();
            }
    }
    else {
        this.findPlayer = false;
        this.idle();
        var deltaDegrees = this.getDeltaDegressToTarget(this.mesh, target);
        this.lookAtPlayer();
        if (Math.abs(deltaDegrees) > 0.5) {
            this.facePoint(this.mesh, target, deltaDegrees, 8);
        }
        var hitMesh = this.castRay(this.ray);
        if (hitMesh != null) {
            this.fireShot(distance);
        }

    }
}
Enemy.prototype.fireShot = function (distance) {
    if (playerDied)
        return;
    if (this.dead)
        return;
    if (this.loopsFromLastShot >= this.waitBeforeNextShot) {
        if (audioEnabled) {
            var soundTurn = Math.floor((Math.random() * 3) + 1);
            if (soundTurn % 2 == 0)
                whizz.play();
            else
                enemyShooting.play();
        }
        if (distance != 0) {
            player.hit(Math.floor((Math.random() * ((difficulty / 4) * 3000)) + ((difficulty / 4) * 1000)) / distance);
        }
        else {
            player.hit(Math.floor((Math.random() * ((difficulty / 4) * 10)) + ((difficulty / 4) * 3)));
        }
        this.loopsFromLastShot = 0;
    }
    else {
        this.loopsFromLastShot++;
    }
}

Enemy.prototype.avoidCollision = function (dir, collidingEnemy) {
    this.isAvoidingCollision = true;
    this.mesh.rotation.y = dir * this.mesh.rotation.y;
    this.collidingEnemy = collidingEnemy;


}
Enemy.prototype.findPath = function () {
    var start = this.graph.grid[Math.floor((this.mesh.position.x + (grounSideLength / 2)) / unit)][Math.floor((this.mesh.position.z + (grounSideLength / 2)) / unit)];
    var end = this.graph.grid[Math.floor((player.position.x + (grounSideLength / 2)) / unit)][Math.floor((player.position.z + (grounSideLength / 2)) / unit)];
    this.enemyResult = astar.search(this.graph, start, end, { heuristic: astar.heuristics.diagonal });
    if (this.enemyResult.length > 2) {
        this.enemyPathBlockIndex = 0;
        this.findPlayer = true;
        this.isShot = false;
    }
}
Enemy.prototype.playerMoved = function () {
    if (this.lastPlayerPosition == null) {
        this.lastPlayerPosition = player.position.clone();
        this.lastPlayerPosition = player.position.clone();
        this.findPlayer = false;
        return true;
    }
    var playerMovement = Math.floor(BABYLON.Vector3.Distance(this.lastPlayerPosition, player.position));
    if (playerMovement / unit > 1) {
        this.lastPlayerPosition = player.position.clone();
        this.findPlayer = false;
        return true;
    }
    return false
}
Enemy.prototype.facePoint = function (rotatingObject, pointToRotateTo, deltaDegrees, factor) {
    var rotationSpeed = Math.abs(deltaDegrees) / factor;
    if (deltaDegrees > 0) {
        rotatingObject.rotation.y -= rotationSpeed * Math.PI / 180;
        if (rotatingObject.rotation.y < -Math.PI) {
            rotatingObject.rotation.y = Math.PI;
        }
    }
    if (deltaDegrees < 0) {
        rotatingObject.rotation.y += rotationSpeed * Math.PI / 180;
        if (rotatingObject.rotation.y > Math.PI) {
            rotatingObject.rotation.y = -Math.PI;
        }
    }
}

Enemy.prototype.moveToTarget = function (objectToMove, pointToMoveTo, speed, slowDown) {
    var moveVector = pointToMoveTo.subtract(objectToMove.position);
    moveVector.y = 0;
    if (moveVector.length() > speed) {
        moveVector = moveVector.normalize();
        moveVector = moveVector.scale(speed);
        moveVector.y = -9.8;
        objectToMove.moveWithCollisions(moveVector);
    }
}

Enemy.prototype.checkCollisions = function () {
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].mesh.name != this.mesh.name) {
            if (this.mesh.intersectsMesh(enemies[i].mesh, false)) {
                collisionHandler(this.mesh, enemies[i].mesh);
            }
        }
    }
}

Enemy.prototype.drawEllipsoid = function () {
    var mesh = this.mesh;
    mesh.computeWorldMatrix(true);
    var ellipsoidMat = mesh.getScene().getMaterialByName("__ellipsoidMat__");
    if (!ellipsoidMat) {
        ellipsoidMat = new BABYLON.StandardMaterial("__ellipsoidMat__", mesh.getScene());
        ellipsoidMat.wireframe = true;
        ellipsoidMat.emissiveColor = BABYLON.Color3.Green();
        ellipsoidMat.specularColor = BABYLON.Color3.Black();
    }
    var ellipsoid = BABYLON.Mesh.CreateSphere("__ellipsoid__", 9, 1, mesh.getScene());
    ellipsoid.scaling = mesh.ellipsoid.clone();
    ellipsoid.scaling.y *= 2;
    ellipsoid.scaling.x *= 2;
    ellipsoid.scaling.z *= 2;
    ellipsoid.material = ellipsoidMat;
    ellipsoid.parent = mesh;
    ellipsoid.computeWorldMatrix(true);
}
var clearCollision = function (mesh1, mesh2) {
    var index1 = -1;
    var index2 = -1;
    if (mesh1.enemy.id < mesh2.enemy.id) {
        index1 = mesh1.enemy.id - 1;
        index2 = mesh2.enemy.id - 1;
    }
    else {
        index2 = mesh1.enemy.id - 1;
        index1 = mesh2.enemy.id - 1;
    }
    collisionMatrix[index1][index2] = null;
}
var collisionHandler = function (mesh1, mesh2) {
    var index1 = -1;
    var index2 = -1;
    if (mesh1.enemy.id < mesh2.enemy.id) {
        index1 = mesh1.enemy.id - 1;
        index2 = mesh2.enemy.id - 1;
    }
    else {
        index2 = mesh1.enemy.id - 1;
        index1 = mesh2.enemy.id - 1;
    }
    var collisionMatrixEntry = collisionMatrix[index1][index2];
    if (collisionMatrixEntry == null) {
        collisionMatrix[index1][index2] = mesh1;
        var delta = mesh1.enemy.getDeltaDegressToTarget(mesh1, mesh2.position);

        mesh1.enemy.avoidCollision(1, mesh2);
        mesh2.enemy.avoidCollision(-1, mesh1);

    }
    else {
        setTimeout(function () { collisionMatrix[index1][index2] = null; }, 2000);
    }

}
