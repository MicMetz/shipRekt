/**
 * @author MicMetzger /
 * @original Mugen87 / https://github.com/Mugen87
 */

import * as THREE    from 'three';
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader.js";
import {FBXLoader}   from "three/examples/jsm/loaders/FBXLoader.js";
import {GLTFLoader}  from "three/examples/jsm/loaders/GLTFLoader.js";
import {dumpObject}  from "../etc/utilities.js";



class AssetManager {

    constructor() {

        this.loadingManager = new THREE.LoadingManager();

        this.audioLoader = new THREE.AudioLoader(this.loadingManager);

        this.fontLoader = new THREE.FontLoader(this.loadingManager);

        this.textureLoader = new THREE.TextureLoader(this.loadingManager);

        this.listener = new THREE.AudioListener();

        this.gltfLoader = new GLTFLoader(this.loadingManager);

        // this.fbxLoader = new FBXLoader(this.loadingManager);


        this.audios = new Map();

        this.textures = new Map();

        this.fonts = new Map();

        this.models = new Map();

        // this.fbxsModels = new Map();

    }


    init() {

        this._loadAudios();
        this._loadModels();

        const loadingManager = this.loadingManager;

        return new Promise((resolve) => {

            loadingManager.onLoad = () => {

                setTimeout(() => {

                    resolve();

                }, 100);

            };

        });

    }


    cloneAudio(id) {

        const source = this.audios.get(id);

        const audio  = new source.constructor(source.listener);
        audio.buffer = source.buffer;
        audio.setRefDistance(source.getRefDistance());
        audio.setVolume(source.getVolume());

        return audio;

    }


    cloneModel(id) {

        const gltf = this.models.get(id);

        return gltf.clone();

    }


    _loadAudios() {

        const audioLoader = this.audioLoader;
        const audios      = this.audios;
        const listener    = this.listener;

        const refDistance = 20;

        const playerShot = new THREE.PositionalAudio(listener);
        playerShot.setRefDistance(refDistance);
        const playerHit = new THREE.PositionalAudio(listener);
        playerHit.setRefDistance(refDistance);
        const playerExplode = new THREE.PositionalAudio(listener);
        playerExplode.setRefDistance(refDistance);
        const enemyShot = new THREE.PositionalAudio(listener);
        enemyShot.setRefDistance(refDistance);
        enemyShot.setVolume(0.3);
        const enemyHit = new THREE.PositionalAudio(listener);
        enemyHit.setRefDistance(refDistance);
        const coreExplode = new THREE.PositionalAudio(listener);
        coreExplode.setRefDistance(refDistance);
        const coreShieldHit = new THREE.PositionalAudio(listener);
        coreShieldHit.setRefDistance(refDistance);
        const coreShieldDestroyed = new THREE.PositionalAudio(listener);
        coreShieldDestroyed.setRefDistance(refDistance);
        const enemyExplode = new THREE.PositionalAudio(listener);
        enemyExplode.setRefDistance(refDistance);

        const buttonClick = new THREE.Audio(listener);
        buttonClick.setVolume(0.5);

        audioLoader.load('./audio/playerShot.ogg', buffer => playerShot.setBuffer(buffer));
        audioLoader.load('./audio/playerHit.ogg', buffer => playerHit.setBuffer(buffer));
        audioLoader.load('./audio/playerExplode.ogg', buffer => playerExplode.setBuffer(buffer));
        audioLoader.load('./audio/enemyShot.ogg', buffer => enemyShot.setBuffer(buffer));
        audioLoader.load('./audio/enemyHit.ogg', buffer => enemyHit.setBuffer(buffer));
        audioLoader.load('./audio/coreExplode.ogg', buffer => coreExplode.setBuffer(buffer));
        audioLoader.load('./audio/coreShieldHit.ogg', buffer => coreShieldHit.setBuffer(buffer));
        audioLoader.load('./audio/coreShieldDestroyed.ogg', buffer => coreShieldDestroyed.setBuffer(buffer));
        audioLoader.load('./audio/enemyExplode.ogg', buffer => enemyExplode.setBuffer(buffer));
        audioLoader.load('./audio/buttonClick.ogg', buffer => buttonClick.setBuffer(buffer));

        audios.set('playerShot', playerShot);
        audios.set('playerHit', playerHit);
        audios.set('playerExplode', playerExplode);
        audios.set('enemyShot', enemyShot);
        audios.set('enemyHit', enemyHit);
        audios.set('coreExplode', coreExplode);
        audios.set('coreShieldHit', coreShieldHit);
        audios.set('coreShieldDestroyed', coreShieldDestroyed);
        audios.set('enemyExplode', enemyExplode);
        audios.set('buttonClick', buttonClick);

    }


    _loadTextures() {

        const textureLoader = this.textureLoader;
        const textures      = this.textures;



    }


    _loadFonts() {

        const fontLoader = this.fontLoader;
        const fonts      = this.fonts;

        fontLoader.load('./fonts/helvetiker_regular.typeface.json', font => fonts.set('helvetiker', font));
        fontLoader.load('./fonts/gentilis_bold.typeface.json', font => fonts.set('gentilis', font));

    }


    _loadModels() {

        const gltfLoader    = this.gltfLoader;
        // const gltfLoader    = new GLTFLoader()/* .setDRACOLoader(new DRACOLoader()); */
        const textureLoader = this.textureLoader;
        const models        = this.models;

        // Ship model
        var shipModel = new THREE.Mesh();
        gltfLoader.load('./models/ship/ship.gltf', (gltf) => {
            gltf.scene.traverse((child) => {
                if (child.name === 'Spaceship5') {
                    shipModel = child;
                }
            });

            shipModel.scale.multiplyScalar(0.5);
            shipModel.castShadow    = true;
            shipModel.receiveShadow = true;
            models.set('ship', shipModel);

        });


        // Swat Officer model
        var swatOfficerModel = new THREE.Mesh();
        gltfLoader.load('./models/swat.glb', (gltf) => {
            gltf.scene.traverse((child) => {
                if (child.name === 'swat') {
                    swatOfficerModel = child;
                }
            });

            swatOfficerModel.scale.multiplyScalar(0.5);
            swatOfficerModel.castShadow    = true;
            swatOfficerModel.receiveShadow = true;
            models.set('guard', swatOfficerModel);
        });

        // Robot model
        var robotModel = new THREE.Mesh();
        gltfLoader.load('./models/robot.glb', (gltf) => {
            gltf.scene.traverse((child) => {
                if (child.name === 'robot') {
                    robotModel = child;
                }
            });

            robotModel.scale.multiplyScalar(0.5);
            robotModel.castShadow    = true;
            robotModel.receiveShadow = true;
            models.set('robot', robotModel);
        });

        // Alien model
        var alienModel = new THREE.Mesh();
        gltfLoader.load('./models/alien.glb', (gltf) => {
            gltf.scene.traverse((child) => {
                if (child.name === 'alien') {
                    alienModel.scale.multiplyScalar(0.5);
                    alienModel.castShadow    = true;
                    alienModel.receiveShadow = true;
                    models.set('alien', alienModel);
                }
            });
        });

        // Core model
        // gltfLoader.load('./models/core.glb', gltf => models.set('core', gltf.scene));

        // Astronaut model
        var astronautModel = new THREE.Mesh();
        gltfLoader.load('./models/astronaut.glb', (gltf) => {
            gltf.scene.traverse((child) => {
                if (child.name === 'astronaut') {
                    astronautModel = child;
                }
            });

            astronautModel.scale.multiplyScalar(0.5);
            astronautModel.castShadow    = true;
            astronautModel.receiveShadow = true;
            models.set('astronaut', astronautModel);
        });

        // Wanderer model
        var wandererModel = new THREE.Mesh();
        gltfLoader.load('./models/wanderer.glb', (gltf) => {
            gltf.scene.traverse((child) => {
                if (child.name === 'wanderer') {
                    wandererModel = child;
                }
            });

            wandererModel.scale.multiplyScalar(0.5);
            wandererModel.castShadow    = true;
            wandererModel.receiveShadow = true;
            models.set('wanderer', wandererModel);
        });

        // Drone model
        // var droneModel = new THREE.Mesh();
        // gltfLoader.load('./models/drone.glb', gltf => models.set('drone', gltf.scene));

        // Droid model
        var droidModel = new THREE.Mesh();
        gltfLoader.load('./models/droid.glb', (gltf) => {
            gltf.scene.traverse((child) => {
                if (child.name === 'droid') {
                    droidModel = child;
                }
            });

            droidModel.scale.multiplyScalar(0.5);
            droidModel.castShadow    = true;
            droidModel.receiveShadow = true;
            models.set('droid', droidModel);
        });

        // Asteroid model
        // var asteroidModel = new THREE.Mesh();
        // gltfLoader.load('./models/asteroid.glb', gltf => models.set('asteroid', gltf.scene));

    }



}



export {AssetManager};
