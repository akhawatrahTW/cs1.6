var guerilla;
var guerillaSkeleton;
var deagle;
var deagleSkeleton;
var guerilla2;
var guerilla3;
var camera;
var createFirstRoundEnemies = function (scene) {
    cloneGuerilla("enemy", guerilla, guerillaSkeleton, deagle, scene,
        new BABYLON.Vector3(grounSideLength / 6 - unit * 3, guerilla.position.y + 3, grounSideLength / 6 - unit * 3), 2, 2);
    cloneGuerilla("enemy", guerilla, guerillaSkeleton, deagle, scene,
        new BABYLON.Vector3(grounSideLength / 6 - unit * 3, guerilla.position.y + 3, -grounSideLength / 6 + unit * 3), 4, 2);
    cloneGuerilla("enemy", guerilla, guerillaSkeleton, deagle, scene,
        new BABYLON.Vector3(-grounSideLength / 6 + unit * 3, guerilla.position.y + 3, grounSideLength / 6 - unit * 3), 2, 5);
    cloneGuerilla("enemy", guerilla, guerillaSkeleton, deagle, scene,
        new BABYLON.Vector3(-grounSideLength / 6 + unit * 3, guerilla.position.y + 3, -grounSideLength / 6 + unit * 3), 4, 1);

    cloneGuerilla("enemy", guerilla, guerillaSkeleton, deagle, scene,
        new BABYLON.Vector3(grounSideLength / 4 - unit * 3, guerilla.position.y + 3, grounSideLength / 4 - unit * 3), 6, 2);
    cloneGuerilla("enemy", guerilla, guerillaSkeleton, deagle, scene,
        new BABYLON.Vector3(grounSideLength / 4 - unit * 3, guerilla.position.y + 3, -grounSideLength / 4 + unit * 3), 4, 2);
    // cloneGuerilla("enemy", guerilla, guerillaSkeleton, deagle, scene,
    //     new BABYLON.Vector3(-grounSideLength / 4 + unit * 3, guerilla.position.y + 3, grounSideLength / 4 - unit * 3), 2, 5);
    // cloneGuerilla("enemy", guerilla, guerillaSkeleton, deagle, scene,
    //     new BABYLON.Vector3(-grounSideLength / 4 + unit * 3, guerilla.position.y + 3, -grounSideLength / 4 + unit * 3), 4, 1);
    // var ambiance = new BABYLON.Sound("ambiance", "../sounds/ambiance.wav", scene, null, { loop: true, autoplay: true });
}
var createEnemy = function (id, enemy, skeleton, weapon, shootingRangeUnits, accuracy, scene) {
    let mesh = new Enemy(id, enemy, skeleton, weapon, shootingRangeUnits, accuracy, scene);
    return mesh;
}
var cloneGuerilla = function (name, guerilla, guerillaSkeleton, deagle, scene, position, shootingRangeUnits, accuracy) {
    lastEnemyId++;
    var tempEnemy = guerilla.clone("guerilla2");
    tempEnemy.name = name + " " + lastEnemyId;
    tempEnemy.position = position;
    tempEnemy.skeleton = guerillaSkeleton.clone("clonedSkeleton");
    var weapon = deagle.clone();
    var enemy = createEnemy(lastEnemyId, tempEnemy, tempEnemy.skeleton, weapon, shootingRangeUnits, accuracy, scene);
    enemies.push(enemy);
    scene.registerBeforeRender(function () {
        enemy.runBeforeRender();
    });

}
var createScene = function () {
    canvas = document.getElementById("canvas"); // Get the canvas element 
    engine = new BABYLON.Engine(canvas, true, null, false); // Generate the BABYLON 3D engine
    divFps = document.getElementById('fps');
    // Create the scene space
    var scene = new BABYLON.Scene(engine);
    // Create the scene space
    scene.collisionsEnabled = true;
    // Add lights to the scene
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 611, 0), scene);
    // var light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), scene);
    light.intensity = 2;

    // var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);
    // This is where you create and manipulate meshes
    // var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene);

    return scene;

};
var loadIt = function () {
    window.oncontextmenu = function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
   };
    kills = 0;
    var scene = createScene(); //Call the createScene function
    // createFreeCamera(scene);
    camera = createVjsCamera(scene);
    dummyCamera = createDummyCamera(scene);
    camera.inputs.removeByType("FreeCameraVirtualJoystickInput");
    createSkybox(scene);
    createGround(scene);
    createGrid(scene);
    var assetsManager = new BABYLON.AssetsManager(scene);

    var guerillaTask = assetsManager.addMeshTask("guerilla task", "", "obj/guerilla/", "guerilla_trimmed2.babylon");
    guerillaTask.onSuccess = function (task) {
        guerilla = task.loadedMeshes[0];
        guerillaSkeleton = task.loadedSkeletons[0];
        task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
    }

    var deagleTask = assetsManager.addMeshTask("deagle task", "", "obj/ak/", "ak74.babylon");
    deagleTask.onSuccess = function (task) {
        deagle = task.loadedMeshes[0];
        deagleSkeleton = task.loadedSkeletons[0];
        task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
    }

    var playerTask = assetsManager.addMeshTask("player task", "", "obj/player/", "me.babylon");
    playerTask.onSuccess = function (task) {
        var ak = task.loadedMeshes[0];
        var leftArm = task.loadedMeshes[1];
        var rightArm = task.loadedMeshes[2];
        var playerSkeleton = task.loadedSkeletons[0];
        player = new Player(leftArm, rightArm, playerSkeleton, ak, scene, camera);
    }
    var carTask = assetsManager.addMeshTask("car task", "", "obj/car/", "untitled.babylon");
    carTask.onSuccess = function (task) {
        var car = task.loadedMeshes[0];
        car.checkCollisions = true;
        var car2 = car.clone();
        car2.position = new BABYLON.Vector3(120, car.position.y, 100);
        car2.rotation.y += .6;
        var car3 = car.clone();
        car3.position = new BABYLON.Vector3(40, car.position.y, 210);
        car3.rotation.y += Math.PI;
        car3.rotation.y += .5;
        var boundingBox = BABYLON.MeshBuilder.CreateBox("car bounding box", { width: 90, height: 50, depth: 250 }, scene);
        boundingBox.material = new BABYLON.StandardMaterial("cbb material", scene);
        boundingBox.material.wireframe = true;
        boundingBox.parent = car;
        boundingBox.position.y += 50 / 2;
        boundingBox.checkCollisions = true;
        var boundingBox2 = boundingBox.clone();
        boundingBox2.parent = car2;
        var boundingBox3 = boundingBox.clone();
        boundingBox3.parent = car3;
        boundingBox.visibility = false;
        boundingBox2.visibility = false;
        boundingBox3.visibility = false;

    }
    var dumpsterTask = assetsManager.addMeshTask("dumpster task", "", "obj/dumpster/", "dumpster.babylon");
    dumpsterTask.onSuccess = function (task) {
        var dumpster = task.loadedMeshes[0];
        dumpster.position = new BABYLON.Vector3(grounSideLength / 4 + 250, dumpster.position.y, grounSideLength / 2 - 150);
        // dumpster.rotation.y=+Math.PI/2;
        // dumpster.showBoundingBox = true;
        dumpster.checkCollisions = true;
        var dumpster2 = dumpster.clone();
        dumpster2.position = new BABYLON.Vector3(grounSideLength / 4 - 250, dumpster.position.y, grounSideLength / 2 - 150);
        var dumpster3 = dumpster.clone();
        var dumpster5 = dumpster.clone();
        dumpster3.position = new BABYLON.Vector3(grounSideLength / 4 - 250, dumpster.position.y, -grounSideLength / 2 + 150);
        dumpster5.position = new BABYLON.Vector3(grounSideLength / 4 + 250, dumpster.position.y, -grounSideLength / 2 + 150);
    }
    var trashTask = assetsManager.addMeshTask("trash task", "", "obj/trash/", "trash.babylon");
    trashTask.onSuccess = function (task) {
        var trash = task.loadedMeshes[0];
        trash.position = new BABYLON.Vector3(360, 0, 340);
        var boundingBox = BABYLON.MeshBuilder.CreateBox("trash bounding box", { width: 60, height: 40, depth: 60 }, scene);
        boundingBox.parent = trash;
        boundingBox.position.y += 40 / 2;
        boundingBox.checkCollisions = true;
        boundingBox.visibility = false;
    }
    var truckTask = assetsManager.addMeshTask("truck task", "", "obj/truck/", "truck.babylon");
    truckTask.onSuccess = function (task) {
        var truck = task.loadedMeshes[0];
        // truck.showBoundingBox = true;
        truck.checkCollisions = true;
        truck.position = new BABYLON.Vector3(-300, 0, -300);
        truck.rotation.y -= Math.PI / 2;
        truck.position.x = -grounSideLength / 2 + 300;
        truck.position.z = -grounSideLength / 2 + 350;
        var truck2 = truck.clone();
        truck2.position.z += 300;

        var truck4 = truck2.clone();
        truck4.position.z += 500;
    }
    var rubbleTask = assetsManager.addMeshTask("rubble task", "", "obj/rubble/", "rubble.babylon");
    rubbleTask.onSuccess = function (task) {
        var rubble = task.loadedMeshes[0];
        rubble.position = new BABYLON.Vector3(grounSideLength / 2 - 160, rubble.position.y, grounSideLength / 4);
        rubble.checkCollisions = true;
        rubble.rotation.y = Math.PI / 2;
        var boundingBox = BABYLON.MeshBuilder.CreateBox("car bounding box", { width: 250, height: 50, depth: 90 }, scene);
        boundingBox.material = new BABYLON.StandardMaterial("cbb material", scene);
        boundingBox.material.wireframe = true;
        boundingBox.parent = rubble;
        boundingBox.position.y += 50 / 2;
        boundingBox.checkCollisions = true;
        boundingBox.visibility = false;

        // var rubble2 = rubble.clone();
        // rubble2.position = new BABYLON.Vector3(180, rubble.position.y, 180);
        // rubble2.rotation.y += Math.PI;


    }
    assetsManager.onFinish = function (tasks) {
        // console.log(guerilla.getBoundingInfo().boundingBox);
        scene.render();

        guerilla.rotation.y = 0;
        guerilla.position.y = guerilla.getBoundingInfo().boundingBox.maximum.y + 11;
        // createAnimation(guerillaSkeleton);
        guerilla.setEnabled(false);
        deagle.setEnabled(false);


        createCollisionMatrix(4);
        var wall = createWalls(scene);
        createInnerWalls(scene);
        setNotWalledBlocks(scene);
        fillRandomAmmoLocationsArray();
        createFirstRoundEnemies(scene);
        globalScene = scene;
        window.setTimeout(function () { createDomMenu(); }, 500);
        engine.runRenderLoop(function () {
            scene.render();
            divFps.innerHTML = engine.getFps().toFixed() + " fps";
        });
        playerBeforeRenderFunction = function () { player.runBeforeRender(); }
        //mesh.rotation.x = Math.PI * .25;
        scene.registerBeforeRender(playerBeforeRenderFunction);
    };

    assetsManager.load();

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });
}
document.addEventListener("DOMContentLoaded", function (event) {
    loadIt();
});
