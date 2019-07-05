var upperBodyBones = ['Spine', 'Neck', 'Head', 'Clavicle', 'UpperArm', 'Forearm', 'Hand',
    'Finger', 'Elbow', 'Bomb'];
var findAnimationArrayEnteryByFrame = function (bone, from, to) {
    var animation = bone.animations[0];
    var keys = animation._keys;
    // debugger;
    for (var i = 0; i < keys.length; i++) {
        if (keys[i].frame >= from && keys[i].frame <= to) {
            return i;
        }
    }
    return -1;
}
// var fixWalkSpineRotation = function (skeleton) {
//     var from = 96;
//     var to = 128;
//     var bone = skeleton.bones[skeleton.getBoneIndexByName('Bip01 Spine')];
//     var animation = bone.animations[0];
//     var keys = animation._keys;
//     console.log(keys[0].Matrix);
//     for (var i = from; i <= to; i++) {

//     }
// }
var createAnimation = function (skeleton) {
    var bones = skeleton.bones;
    var upperBodyBone = false;
    var sourceFrom = 0;
    var sourceTo = 64;
    var targetFrom = 96;
    var targetTo = 128;
    for (var i = 0; i < bones.length; i++) {
        var boneName = bones[i].name;
        for (var j = 0; j < upperBodyBones.length; j++) {
            if (boneName.includes(upperBodyBones[j])) {
                upperBodyBone = true;
                break;
            }
        }
        if (upperBodyBone) {
            // debugger;
            var sourceLenght = sourceTo - sourceFrom;
            var sourceFromArrayEntry = findAnimationArrayEnteryByFrame(bones[i], sourceFrom, sourceTo);
            var targetLenght = targetTo - targetFrom;
            var targetFromArrayEntry = findAnimationArrayEnteryByFrame(bones[i], targetFrom, targetTo);
            if (sourceFromArrayEntry == -1 || targetFromArrayEntry == -1)
                continue;
            for (var x = 0; x < targetLenght; x++) {
                bones[i].animations[0]._keys[targetFromArrayEntry + x] = bones[i].animations[0]._keys[sourceFromArrayEntry + x];
            }
        }
        else {
        }
        //console.log(bones[i].animations.length);
        upperBodyBone = false;
    }
}
var createCollisionMatrix = function (numberOfEnemeies) {
    for (var i = 0; i < numberOfEnemeies; i++) {
        collisionMatrix[i] = [];
        for (var j = 0; j < numberOfEnemeies; j++) {
            collisionMatrix[i][j] = null;
        }
    }
}
var createGrid = function (scene) {
    cells = [];

    for (var i = 0; i < grounSideLength / unit; i++) {
        cells[i] = [];
        for (var j = 0; j < grounSideLength / unit; j++) {
            if (i == 0) {
                cells[i][j] = 0;
            }
            else
                if (i == grounSideLength / unit - 1) {
                    cells[i][j] = 0;
                }
                else
                    if (j == 0) {
                        cells[i][j] = 0;
                    }
                    else
                        if (j == grounSideLength / unit - 1) {
                            cells[i][j] = 0;
                        }
                        else
                            cells[i][j] = 1;

        }
    }

    cells[1][13] = 100;
    cells[2][13] = 100;
    cells[3][13] = 0;
    cells[4][13] = 0;
    cells[5][13] = 100;
    cells[6][13] = 100;
    cells[7][13] = 0;
    cells[8][13] = 0;
    cells[9][13] = 100;
    cells[10][13] = 100;
    cells[11][13] = 0;

    cells[16][23] = 0;
    cells[16][24] = 0;
    cells[16][25] = 100;
    cells[16][26] = 100;
    cells[16][27] = 100;
    cells[16][28] = 0;
    cells[16][29] = 0;
    cells[16][30] = 0;

    cells[12][1] = 0;
    cells[12][2] = 0;
    cells[12][3] = 100;
    cells[12][4] = 100;
    cells[12][5] = 0;
    cells[12][6] = 0;
    cells[12][7] = 0;
    cells[12][8] = 0;
    cells[12][9] = 100;
    cells[12][10] = 100;
    cells[12][11] = 0;
    cells[12][12] = 0;
    cells[12][13] = 0;

    cells[23][8] = 0;
    cells[24][8] = 0;
    cells[25][8] = 0;
    cells[26][8] = 100;
    cells[27][8] = 100;
    cells[28][8] = 0;
    cells[29][8] = 0;
    cells[30][8] = 0;

    cells[23][9] = 0;
    cells[23][10] = 0;
    cells[23][11] = 0;
    cells[23][12] = 100;
    cells[23][13] = 100;
    cells[23][14] = 100;
    cells[23][15] = 0;
    cells[23][16] = 0;

    cells[24][16] = 0;
    cells[25][16] = 0;
    cells[26][16] = 0;
    cells[27][16] = 0;
    cells[28][16] = 0;
    cells[29][16] = 0;
    cells[30][16] = 0;

    cells[8][23] = 0;
    cells[8][24] = 0;
    cells[8][25] = 0;
    cells[8][26] = 100;
    cells[8][27] = 100;
    cells[8][28] = 0;
    cells[8][29] = 0;
    cells[8][30] = 0;

    cells[1][23] = 0;
    cells[2][23] = 0;
    cells[3][23] = 100;
    cells[4][23] = 100;
    cells[5][23] = 0;
    cells[6][23] = 0;
    cells[7][23] = 0;


}
var setNotWalledBlocks = function (scene) {
    cells[15][15] = 0;
    cells[15][16] = 0;
    cells[15][17] = 0;
    cells[16][15] = 0;
    cells[16][16] = 0;
    cells[16][17] = 0;
    cells[16][18] = 0;
    cells[17][16] = 0;
    cells[17][17] = 0;
    cells[2][11] = 0;
    cells[3][11] = 0;
    cells[2][6] = 0;
    cells[3][6] = 0;
    cells[2][3] = 0;
    cells[3][3] = 0;
    cells[26][30] = 0;
    cells[21][30] = 0;
    cells[21][1] = 0;
    cells[26][1] = 0;
    cells[30][23] = 0;
    cells[30][24] = 0;
    cells[19][19] = 0;


    graph = new Graph(cells, { diagonal: true });

    // var plane = BABYLON.MeshBuilder.CreatePlane("myPlane", { width: unit - 5, height: unit - 5 }, scene);
    // plane.rotation.x = Math.PI / 2;
    // plane.setEnabled(false);
    // for (var i = 0; i < grounSideLength / unit; i++) {
    //     for (var j = 0; j < grounSideLength / unit; j++) {
    //         var tempPlan = plane.clone();
    //         tempPlan.name = "block" + i + "_" + j;
    //         tempPlan.position = new BABYLON.Vector3((unit * i) + (unit / 2) -
    //             (grounSideLength / 2), 0.4, (unit * j) + (unit / 2) - (grounSideLength / 2));
    //         if (cells[i][j] == 0)
    //             tempPlan.material = createCellBlockTexture(i + " , " + j, scene, "red");

    //         else
    //             if (cells[i][j] == 1) {
    //                 tempPlan.material = createCellBlockTexture(i + " , " + j, scene, "white");
    //             }
    //     }
    // }
    // plane.position.y = 4;

}
var createFreeCamera = function (scene) {
    var camera = new BABYLON.FreeCamera('freeCam', new BABYLON.
        Vector3(30, 130, -40), scene);
    camera.setTarget(new BABYLON.Vector3(30, 0, -30));
    camera.speed = 3;
    // camera.rotation.y= Math.PI;
    camera.attachControl(canvas);
    return camera;
}
var createPlayerCamera = function (scene) {
    var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(-1000, 54, 1200), scene);
    //camera.fov=1.5;
    camera.keysUp = [87]; // W
    camera.keysDown = [83]; // S
    camera.keysLeft = [65]; // A
    camera.keysRight = [68]; // D
    camera.setTarget(new BABYLON.Vector3(0, 27, 0));
    camera.attachControl(canvas);
    camera.angularSensibility = mouseSensitivity;
    camera.speed = 7.0;
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.ellipsoid = new BABYLON.Vector3(30, 27, 30);

    return camera;
}
var createSkybox = function (scene) {
    var skybox1 = BABYLON.MeshBuilder.CreateBox("skyBox", { size: grounSideLength + 200 }, scene);
    var skyMaterial = new BABYLON.SkyMaterial("skyMaterial", scene);
    skyMaterial.backFaceCulling = false;
    skyMaterial.inclination = -.4;
    skybox1.material = skyMaterial;
    return skybox1;
}
var createGround = function (scene) {
    var myGround = BABYLON.MeshBuilder.CreateGround("myGround", { width: grounSideLength, height: grounSideLength, subdivsions: 4 }, scene);
    myGround.checkCollisions = true;
    var customMaterial = new BABYLON.StandardMaterial("custommat", scene);
    var customProcText = new BABYLON.CustomProceduralTexture("customtext", "/textures/ground", 1024, scene);
    customMaterial.ambientTexture = customProcText;
    customMaterial.ambientTexture.vScale = 10;
    customMaterial.ambientTexture.uScale = 10;
    customMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);
    customMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

    myGround.material = customMaterial;
}
var createWalls = function (scene) {
    var size = { width: grounSideLength, height: 320, depth: 5 };
    var wall = createWall("wall 1", scene, size, 0, 1);
    obstacles.push(wall);
    wall = createWall("wall 2", scene, size, 1, 1);
    obstacles.push(wall);
    wall = createWall("wall 3", scene, size, 0, -1);
    obstacles.push(wall);
    wall = createWall("wall 4", scene, size, 1, -1);
    obstacles.push(wall);
    return wall;
}

var createWall = function (name, scene, size, rotation, dir) {
    var wall = BABYLON.MeshBuilder.CreateBox(name, size, scene);
    var customMaterial = new BABYLON.StandardMaterial("custommat", scene);
    var customProcText = new BABYLON.CustomProceduralTexture("customtext", "/textures/wall", 1024, scene);
    customMaterial.ambientTexture = customProcText;
    customMaterial.ambientTexture.vScale = 1;
    customMaterial.ambientTexture.uScale = 8;
    customMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);
    customMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    wall.material = customMaterial;
    if (rotation == 0) {
        wall.position.z = dir * size.width / 2 - dir * 100;
    }
    else {
        wall.position.x = dir * size.width / 2 - dir * 100;
    }
    wall.position.y = size.height / 2;
    wall.rotation.y = rotation * Math.PI / 2;
    var ghostWall = wall.clone();
    ghostWall.name = "ghost " + name;
    if (rotation == 0) {
        ghostWall.position.z = wall.position.z - dir * 10;
    }
    else {
        ghostWall.position.x = wall.position.x - dir * 10;
    }
    ghostWall.checkCollisions = true;
    ghostWall.visibility = false;
    // wall.visibility = false;
    return ghostWall;
}
var createInnerWalls = function (scene) {
    var size = { width: unit, height: 320, depth: .5 };
    var wall = createWallBlock(size, scene);
    var doorWall = createWallWithDoorBlock(size, scene);
    for (var i = 0; i < grounSideLength / unit; i++) {
        for (var j = 0; j < grounSideLength / unit; j++) {
            if (i > 0 && j > 0 && i < grounSideLength / unit - 1 && j < grounSideLength / unit - 1)
                if (cells[i][j] == 0) {
                    var wall2 = wall.clone();
                    wall2.position = new BABYLON.Vector3((unit * i) + (unit / 2) -
                        (grounSideLength / 2), size.height / 2, (unit * j) + (unit / 2) - (grounSideLength / 2));
                }
                else
                    if (cells[i][j] == 100) {
                        var wall2 = doorWall.clone();
                        wall2.position = new BABYLON.Vector3((unit * i) + (unit / 2) -
                            (grounSideLength / 2), size.height / 2, (unit * j) + (unit / 2) - (grounSideLength / 2));
                        cells[i][j] = 1;
                    }

        }
    }
    wall.visibility = false;
    doorWall.visibility = false;
}
var createWallBlock = function (size, scene) {
    var customMaterial = new BABYLON.StandardMaterial("custommat", scene);
    var customProcText = new BABYLON.CustomProceduralTexture("customtext", "/textures/wall", 264, scene);
    customMaterial.ambientTexture = customProcText;
    customMaterial.ambientTexture.vScale = 1;
    // customMaterial.ambientTexture.uScale = .5;
    customMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);
    customMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

    var wall1 = BABYLON.MeshBuilder.CreateBox(name, size, scene);
    wall1.material = customMaterial;
    wall1.checkCollisions = true;
    wall1.rotation.y = Math.PI / 2;
    wall1.position.x += size.width / 2;
    wall1.position.y += size.height / 4;
    var wall2 = wall1.clone();
    wall2.rotation.y += Math.PI / 2;
    wall2.position.z += size.width / 2;
    wall2.position.x -= size.width / 2;

    var wall3 = wall1.clone();
    wall3.rotation.y += Math.PI / 2;
    wall3.position.z -= size.width / 2;
    wall3.position.x -= size.width / 2;

    var wall4 = wall1.clone();
    wall4.rotation.y = Math.PI / 2;
    wall4.position.x -= size.width;

    var mesh = BABYLON.Mesh.MergeMeshes([wall1, wall2, wall3, wall4]);

    return mesh;

}
var createWallWithDoorBlock = function (size, scene) {
    var customMaterial = new BABYLON.StandardMaterial("custommat", scene);
    var customProcText = new BABYLON.CustomProceduralTexture("customtext", "/textures/wall", 264, scene);
    customMaterial.ambientTexture = customProcText;
    customMaterial.emissiveTexture = customProcText;

    customMaterial.ambientTexture.vScale = .5;
    customMaterial.ambientTexture.uScale = .7;
    customMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);
    customMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    size.height = size.height / 2;
    var wall1 = BABYLON.MeshBuilder.CreateBox(name, size, scene);
    wall1.material = customMaterial;
    wall1.checkCollisions = true;
    wall1.rotation.y = Math.PI / 2;
    wall1.position.x += size.width / 2;
    wall1.position.y += size.height;

    var wall2 = wall1.clone();
    wall2.rotation.y += Math.PI / 2;
    wall2.position.z += size.width / 2;
    wall2.position.x -= size.width / 2;

    var wall3 = wall1.clone();
    wall3.rotation.y += Math.PI / 2;
    wall3.position.z -= size.width / 2;
    wall3.position.x -= size.width / 2;

    var wall4 = wall1.clone();
    wall4.rotation.y = Math.PI / 2;
    wall4.position.x -= size.width;

    var wall5 = wall1.clone();
    wall5.rotation.x -= Math.PI / 2;
    wall5.position.y -= size.height / 2 + .5;
    wall5.position.x -= size.width / 2;
    wall5.scaling.y = 0.629;
    var mesh = BABYLON.Mesh.MergeMeshes([wall1, wall2, wall3, wall4, wall5]);

    return mesh;

}
var fillRandomAmmoLocationsArray = function () {
    randomAmmoLocations[0] = { x: 28, y: 13 };
    randomAmmoLocations[1] = { x: 21, y: 4 };
    randomAmmoLocations[2] = { x: 16, y: 5 };
    randomAmmoLocations[3] = { x: 6, y: 4 };
    randomAmmoLocations[4] = { x: 9, y: 10 };
    randomAmmoLocations[5] = { x: 6, y: 6 };
    randomAmmoLocations[6] = { x: 10, y: 21 };
    randomAmmoLocations[7] = { x: 6, y: 29 };
    randomAmmoLocations[8] = { x: 13, y: 27 };
    randomAmmoLocations[9] = { x: 22, y: 27 };
    randomAmmoLocations[10] = { x: 25, y: 24 };
    randomAmmoLocations[11] = { x: 23, y: 21 };
    randomAmmoLocations[12] = { x: 20, y: 17 };


}
var registerEvents = function (scene, camera, canvas) {
    scene.onPointerDown = function (evt) {
        if (!gameStarted)
            return;
        if ((event.x < 80 && event.y < 150) || (event.x > canvas.width - 80 && event.y < 150))
            return;
        //true/false check if we're locked, faster than checking pointerlock on each single click.
        if (!isLocked) {
            canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock || false;
            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
            }
        }

        //continue with shooting requests or whatever :P
        //evt === 0 (left mouse click)
        //evt === 1 (mouse wheel click (not scrolling))
        //evt === 2 (right mouse click)
    };

    // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
    var pointerlockchange = function () {
        var controlEnabled = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || false;

        // If the user is already locked
        if (!controlEnabled) {
            camera.detachControl(canvas);
            isLocked = false;

        } else {
            camera.attachControl(canvas);
            isLocked = true;
        }
    };
    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mspointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    var onPointerDown = function (evt) {
        if (playerDied || evt.button !== 0) {
            return;
        }
        player.shoot();
        player.fireButtonOn = true;

    }
    canvas.addEventListener("mousedown", onPointerDown);

    var onPointerUp = function (evt) {
        if (evt.button !== 0) {
            return;
        }
        player.fireButtonOn = false;
    }
    canvas.addEventListener("mouseup", onPointerUp);
    document.addEventListener('keyup', function (event) {
        if (gameStarted && event.key == "Shift") {
            player.shouldJump = false;
        }
        if (gameStarted && event.key == "Control") {
            player.shouldDuck = false;
            player.toggleDuck();

        }
    }
    );
    document.addEventListener('keydown', function (event) {
        if (event.shiftKey && gameStarted) {
            player.shouldJump = true;
        }
        if (event.ctrlKey && gameStarted) {
            player.shouldDuck = true;
            player.toggleDuck();
        }
        if (event.code == 'KeyN' && event.ctrlKey && gameStarted) {
            location.reload();
            // globalScene.dispose();
            // engine.dispose();
            // loadIt();
            // document.exitPointerLock();
            // canvas.blur();
            // console.log(document.activeElement);
        }
        else
            if (event.code == 'KeyF' && event.ctrlKey) {
                fullScreen = !fullScreen;
                if (fullScreen) {
                    BABYLON.Tools.RequestFullscreen(canvas);
                } else {
                    BABYLON.Tools.ExitFullscreen();
                }
            }
            else
                if (event.code == 'KeyP' && event.ctrlKey && gameStarted) {
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
                }
                else
                    if (event.code == 'KeyM' && event.ctrlKey) {
                        toggleAudio();
                    }
                    else
                        if (event.code == 'KeyR' && gameStarted) {
                            player.reload();
                        }

    });
}
var createCellBlockTexture = function (text, scene, bgColor) {
    var textureGround = new BABYLON.DynamicTexture("dynamic texture", { width: 512, height: 256 }, scene);
    var textureContext = textureGround.getContext();

    var materialGround = new BABYLON.StandardMaterial("Mat", scene);
    materialGround.diffuseTexture = textureGround;

    //Add text to dynamic texture
    var font = "bold 60px Arial";
    textureGround.drawText(text, 200, 150, font, "black", bgColor, true, true);
    return materialGround;
}

var toggleAudio = function () {
    audioEnabled = !audioEnabled;
    if (audioEnabled) {
        if (enemyShooting == null) {
            playerShooting = new BABYLON.Sound("shot", "../sounds/ak47-1.wav", globalScene);
            playerShooting.setVolume(.2);
            enemyDeath = new BABYLON.Sound("deathSound", "../sounds/death.wav", globalScene, null, { loop: false, autoplay: false, maxDistance: 50 });
            enemyDeath.setVolume(.2);

            whizz = new BABYLON.Sound("shot", "../sounds/whizz5.wav", globalScene);

            enemyShooting = new BABYLON.Sound("shot", "../sounds/ak47-1.wav", globalScene);

            var volume = 0.1;
            var playbackRate = 0.2;
            whizz.setVolume(volume);
            whizz.playbackRate = 0.02;
            enemyShooting.setVolume(0.06);
            enemyShooting.playbackRate = playbackRate;
        }
    }
}