var animations = ['idle', 'crouch', 'walk', 'run', 'crouchWalk', 'die'];
class Enemy {
    constructor(mesh, skeleton, weapon, shootingRangeUnits, accuracy, scene) {
        this.shootingRangeUnits = shootingRangeUnits;
        this.accuracy = accuracy;
        this.mesh = mesh;
        // this.mesh.showBoundingBox = true;
        this.mesh.position.y -= 10;
        this.skeleton = skeleton;
        this.skeleton.enableBlending(0.065);
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

        this.speed = 1.7;
        this.mesh.checkCollisions = true;
        // this.mesh.position.y += 5.3;
        //this.mesh.showBoundingBox = true;
        this.mesh.actionManager = new BABYLON.ActionManager(scene);
        this.nearObstacle = false;
        this.originalRotation = this.mesh.rotation.y;
        this.animationSwitchAfter = 400;
        // this.ray = new BABYLON.Ray();
        // this.rayHelper = new BABYLON.RayHelper(this.ray);
        // this.rayHelper.attachToMesh(this.mesh, this.frontVector, new BABYLON.Vector3(33.6, 0, 0), 350);
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
        this.headBox.attachToBone(
            this.skeleton.bones[7], this.mesh);
        this.dead = false;
        this.deathSound = new BABYLON.Sound("Violons", "../sounds/death.wav", scene, null, { loop: false, autoplay: false });
        this.deathSound.attachToMesh(this.mesh);
        this.deathSound.maxDistance = -1;
        this.lastPlayerPosition = new BABYLON.Vector3(-20000, -20000, -20000);
        this.enemyPathBlockIndex = 0;
        this.findPlayer = true;
        this.previousBlock = null;
        this.currentBlock = null;
        this.mesh.ellipsoid = new BABYLON.Vector3(15.0, 30, 15.0);
        this.stop = false;
        var enemy = this;
        this.mesh.onCollide = function (mesh) {
            console.log(mesh.name);
            enemy.stop = true;
        };
        this.idle();
        this.drawEllipsoid();

    }
}

Enemy.prototype.getEnemeyPlayerDelta = function (rotatingObject, pointToRotateTo) {
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

Enemy.prototype.facePoint = function (rotatingObject, pointToRotateTo, deltaDegrees) {
    var rotationSpeed = Math.abs(deltaDegrees) / 7;
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
    // console.log(moveVector.length())
    moveVector.y = 0;
    if (objectToMove != player) {
        if (slowDown && BABYLON.Vector3.Distance(objectToMove.position, pointToMoveTo) < 150) {
            speed = 0;
        }
        else
            if (slowDown && BABYLON.Vector3.Distance(objectToMove.position, pointToMoveTo) < 250) {
                speed = speed / 3;
            }
    }
    if (moveVector.length() > speed) {
        moveVector = moveVector.normalize();
        moveVector = moveVector.scale(speed);
        objectToMove.moveWithCollisions(moveVector);
    } else if (objectToMove === player) {
        i++;
        if (i == points.length)
            i = 0;
    }
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
    var runAnim = this.scene.beginAnimation(this.skeleton, 130, 165, loop, 1.5);
    return runAnim;
}
Enemy.prototype.animateCrouchWalk = function (loop) {
    var crouchWalkAnim = this.scene.beginAnimation(this.skeleton, 167, 196, loop);
    return crouchWalkAnim;
}
Enemy.prototype.jump = function (loop) {
    var jumpAnim = this.scene.beginAnimation(this.skeleton, 197, 256, loop);
    return jumpAnim;
}
Enemy.prototype.animateDie = function (loop) {
    var enemy = this;
    var dieAnim = this.scene.beginAnimation(this.skeleton, 695, 749, loop, 1, function () {
        setTimeout(function () { enemy.mesh.dispose(); enemy.headBox.dispose(); enemy.weapon.dispose(); }, 1000);

    });
    return dieAnim;
}
Enemy.prototype.die = function () {
    this.deathSound.play();
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
Enemy.prototype.addCollisionAction = function (wall) {
    // this.mesh.actionManager.registerAction(new BABYLON.SetValueAction(
    //     { trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: wall },
    //     this.mesh, "scaling", new BABYLON.Vector3(1.2, 1.2, 1.2)));
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

Enemy.prototype.castRay = function () {
    var thisName = this.mesh.name;
    var hit = this.scene.pickWithRay(this.ray, function (mesh, thisName) {
        if (mesh.name.startsWith("wall") || (thisName != mesh.name && mesh.name.startsWith("enemy"))) {
            return true;
        }
        return false;
    });
    if (hit.pickedMesh) {
        return hit.pickedMesh;
    }
    return null;
}

Enemy.prototype.runBeforeRender = function () {
    if(this.stop){
        return;
    }
    if (this.dead)
        return;
    var distance = Math.floor(BABYLON.Vector3.Distance(this.mesh.position, player.position));
    var playerMovement = Math.floor(BABYLON.Vector3.Distance(this.lastPlayerPosition, player.position));
    console.log(playerMovement);
    if (Math.abs(playerMovement / unit) > 1) {
        this.lastPlayerPosition = player.position.clone();
        var start = graph.grid[Math.floor((this.mesh.position.x + (grounSideLength / 2)) / unit)][Math.floor((this.mesh.position.z + (grounSideLength / 2)) / unit)];
        var end = graph.grid[Math.floor((player.position.x + (grounSideLength / 2)) / unit)][Math.floor((player.position.z + (grounSideLength / 2)) / unit)];
        this.enemyResult = astar.search(graph, start, end, { heuristic: astar.heuristics.diagonal });
        if (this.enemyResult.length > this.shootingRangeUnits) {
            this.enemyPathBlockIndex = 0;
            this.findPlayer = true;
            this.run();
        }
    }
    if (Math.abs(distance / unit) < 2) {
        this.findPlayer = false;
        this.idle();
    }
    if (this.enemyResult && this.enemyPathBlockIndex < this.enemyResult.length && this.findPlayer) {
        var newPos = new BABYLON.Vector3((this.enemyResult[this.enemyPathBlockIndex].x) * unit - (grounSideLength / 2) + unit / 2,
            -2, (this.enemyResult[this.enemyPathBlockIndex].y) * unit - (grounSideLength / 2) + unit / 2);
        var deltaDegrees = this.getEnemeyPlayerDelta(this.mesh, newPos);
        if (Math.abs(deltaDegrees) > 2) {
            this.facePoint(this.mesh, newPos, deltaDegrees);
        }
        console.log(this.scene.getMeshByName("block" + this.enemyResult[this.enemyPathBlockIndex].x +
            "_" + this.enemyResult[this.enemyPathBlockIndex].y));

        this.moveToTarget(this.mesh, newPos, 1.6);
        if (BABYLON.Vector3.Distance(this.mesh.position, newPos) < unit) {
            // if (this.previousBlock != null) {
            //     this.previousBlock.material.diffuseColor = new BABYLON.Color3.White();
            // }
            // this.previousBlock = this.currentBlock;
            // this.currentBlock = this.scene.getMeshByName("block" + this.enemyResult[this.enemyPathBlockIndex ].x +
            //     "_" + this.enemyResult[this.enemyPathBlockIndex ].y);
            // this.currentBlock.material.diffuseColor = new BABYLON.Color3.Yellow();
            this.enemyPathBlockIndex++;
        }
    }
    else {
        var deltaDegrees = this.getEnemeyPlayerDelta(this.mesh, player.position);
        if (Math.abs(deltaDegrees) > .5) {
            this.facePoint(this.mesh, player.position, deltaDegrees);
        }
        this.idle();
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