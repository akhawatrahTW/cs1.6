var animations = ['idle', 'crouch', 'walk', 'run', 'crouchWalk', 'die'];
class Enemy {
    constructor(mesh, skeleton, weapon, scene) {
        this.mesh = mesh;
        this.mesh.position.y -= 3;
        this.skeleton = skeleton;
        this.skeleton.enableBlending(0.035);
        this.weapon = weapon;
        this.scene = scene;
        this.activeAnim = null;
        this.weapon.rotation.y = Math.PI;
        this.weapon.attachToBone(this.skeleton.bones[20], this.mesh);
        this.weapon.position.x += 3.3;
        this.weapon.position.z += 1.2;
        this.rotation = 0.01;
        this.direction = 0;
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
        this.ray = new BABYLON.Ray();
        this.rayHelper = new BABYLON.RayHelper(this.ray);
        this.rayHelper.attachToMesh(this.mesh, this.frontVector, new BABYLON.Vector3(33.6, 0, 0), 350);
        this.rayHelper.show(this.scene);
        var localMeshDirection = this.frontVector;
        var localMeshOrigin = this.mesh.position;
        var length = 5;
        this.timer = 5001;
        var headBox = new BABYLON.MeshBuilder.CreateBox("head box", { width: 10, height: 10, depth: 7 }, this.scene);
        headBox.position.x += 4;
        headBox.visibility=false;
        headBox.enemy=this;
        headBox.attachToBone(
            this.skeleton.bones[7], this.mesh);
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
            this.activeAnim = this.idle();
            break;
        case 'crouch':
            this.speed = 0;
            this.activeAnim = this.crouch();
            break;
        case 'walk':
            this.speed = 0.9;
            this.activeAnim = this.walk();
            break;
        case 'run':
            this.speed = 1.7;
            this.activeAnim = this.run();
            break;
        case 'crouchWalk':
            this.speed = 0.6;
            this.activeAnim = this.crouchWalk();
            break;
        case 'jump':
            this.speed = 1.1;
            this.activeAnim = this.jump();
            break;
        case 'die':
            this.speed = 0;
            this.activeAnim = this.die();
            break;
    }
}
Enemy.prototype.idle = function () {
    var idleAnim = this.scene.beginAnimation(this.skeleton, 0, 64, true);
    return idleAnim;
}
Enemy.prototype.crouch = function () {
    var crouchAnim = this.scene.beginAnimation(this.skeleton, 66, 95, true);
    return crouchAnim;
}
Enemy.prototype.walk = function () {
    var walkAnim = this.scene.beginAnimation(this.skeleton, 96, 128, true);
    return walkAnim;
}
Enemy.prototype.run = function () {
    var runAnim = this.scene.beginAnimation(this.skeleton, 130, 165, true, 1.5);
    return runAnim;
}
Enemy.prototype.crouchWalk = function () {
    var crouchWalkAnim = this.scene.beginAnimation(this.skeleton, 167, 196, true);
    return crouchWalkAnim;
}
Enemy.prototype.jump = function () {
    var jumpAnim = this.scene.beginAnimation(this.skeleton, 197, 256, true);
    return jumpAnim;
}
Enemy.prototype.die = function () {
    var dieAnim = this.scene.beginAnimation(this.skeleton, 695, 749, true);
    return dieAnim;
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
        console.log("heading to: " + hit.pickedMesh.name);
        return hit.pickedMesh;
    }
    return null;
}
Enemy.prototype.runBeforeRender = function () {
    // var indexBone = guerillaSkeleton.getBoneIndexByName("Bip01 Spine1");
    // var bone = guerillaSkeleton.bones[indexBone];
    // bone.rotate(BABYLON.Axis.X, rotation, BABYLON.Space.LOCAL, guerilla);
    // bone.rotate(BABYLON.Axis.Z, rotation, BABYLON.Space.LOCAL, guerilla);
    if (this.speed != 0)
        this.mesh.moveWithCollisions(this.frontVector.multiplyByFloats(this.speed, this.speed, this.speed));
    var obstacle = this.castRay();
    if (obstacle != null) {
        this.nearObstacle = true;
    }
    else {
        // this.nearObstacle = false;
        //  this.direction = 0;
    }
    if (this.nearObstacle) {
        if (this.direction == 0) {
            var num = Math.floor(Math.random() * 2);
            if (num == 0)
                this.direction = -1;
            else
                this.direction = -1;
        }
        if (this.originalRotation == -1000) {
            this.originalRotation = this.mesh.rotation.y;
        }
        this.mesh.rotation.y -= this.direction * 0.04;
        this.frontVector = new BABYLON.Vector3(Math.cos(this.mesh.rotation.y), 0, -Math.sin(this.mesh.rotation.y));
        console.log(Math.abs(this.originalRotation - this.mesh.rotation.y));

        if (Math.abs(this.originalRotation - this.mesh.rotation.y) > 0.20) {
            this.nearObstacle = false;
            this.direction = 0;
            this.originalRotation = -1000;
            console.log("avoided");
        }
    }
    this.timer++;
    if (this.timer > this.animationSwitchAfter) {
        this.timer = 0;
        this.animationSwitchAfter = 200 + Math.floor(Math.random() * 500);
        this.start(this);
    }
    // if (Math.abs(rotation) > 0.7) {
    //     direction = direction * -1;
    // }
    // if (times % 401 == 0) {
    //     if (walkAnim.weight == 0) {
    //         walkAnim.weight = 1;
    //         idleAnim.weight = 0;
    //     }
    //     else {
    //         walkAnim.weight = 0;
    //         idleAnim.weight = 1;
    //     }
    //     times = 1;
    // }
    // rotation = rotation + direction * 0.01;
    // times++;
    // for (var i = 0; i < deagleSkeleton.bones.length; i++) {
    //     var indexBone = guerillaSkeleton.getBoneIndexByName(deagleSkeleton.bones[i].name);
    //     if (indexBone != -1) {
    //         deagleSkeleton.bones[i].parent = guerillaSkeleton.bones[indexBone];
    //     }
    //     else {
    //         console.log("bone not found");
    //     }
    // }
    // scene.debugLayer.show();

    // scene.beginAnimation(guerillaSkeleton, 186, 222, true);
    //var holdGun = scene.beginWeightedAnimation(guerillaSkeleton, 703, 704, 1.0, true);
}