/**
 * @author MicMetzger /
 * @original Mugen87 / https://github.com/Mugen87
 */

import * as THREE   from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {dumpObject} from "../etc/utilities.js";



class AssetManager {

    constructor() {

        this.loadingManager = new THREE.LoadingManager();

        this.audioLoader = new THREE.AudioLoader(this.loadingManager);

        this.fontLoader = new THREE.FontLoader(this.loadingManager);

        this.gltfLoader = new GLTFLoader(this.loadingManager);

        this.listener = new THREE.AudioListener();


        this.audios = new Map();

        this.textures = new Map();

        this.fonts = new Map();

        this.models = new Map();


        this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {

            console.log(`Loading file: ${url}. ${itemsLoaded} of ${itemsTotal} files loaded.`);

        }

        this.loadingManager.onError = (url) => {

            console.log(`There was an error loading ${url}`);

        }

        this.loadingManager.onLoad = () => {

            console.log('Loading complete!');
            this.ItemsLoaded();


        }

        this.loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {

            console.log(`Loading file: ${url}. ${itemsLoaded} of ${itemsTotal} files loaded.`);

        }

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


    ItemsLoaded() {

        console.log("Items Loaded");
        document.getElementById("loading").style.display = "none";

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

        const source = this.models.get(id);

        console.log(source);

        return source;

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


    _loadFonts() {

        const fontLoader = this.fontLoader;
        const fonts      = this.fonts;

        fontLoader.load('./fonts/helvetiker_regular.typeface.json', font => fonts.set('helvetiker', font));
        fontLoader.load('./fonts/gentilis_bold.typeface.json', font => fonts.set('gentilis', font));

    }


    _loadModels() {

        const gltfLoader = this.gltfLoader;
        const models     = this.models;


        // Ship model
        gltfLoader.load('./models/ship.glb', (gltf) => {
            var geometry = new THREE.BufferGeometry();
            var material = new THREE.MeshPhongMaterial();
            gltf.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    geometry.merge(child.geometry, child.matrix);
                }
                if (child instanceof THREE.MeshPhongMaterial) {
                    material = child;
                }
            });

            const ship = new THREE.Mesh(geometry, material);
            ship.scale.set(0.5, 0.5, 0.5);
            ship.position.set(0, 0, 0);
            ship.rotation.set(0, Math.PI, 0);
            ship.castShadow    = true;
            ship.receiveShadow = true;
            ship.doubleSided   = true;
            ship.name          = 'ship';

            models.set('ship', ship);
        });


        // Swat Officer model
        gltfLoader.load('./models/swat.gltf', (gltf) => {
            var geometry = new THREE.BufferGeometry();
            gltf.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    geometry.merge(child.geometry, child.matrix);
                }
            });

            const swat = new THREE.Mesh(geometry);
            swat.scale.set(0.5, 0.5, 0.5);
            swat.position.set(0, 0, 0);
            swat.rotation.set(0, Math.PI, 0);
            swat.castShadow       = true;
            swat.receiveShadow    = true;
            swat.matrixAutoUpdate = false;
            swat.doubleSided      = true;
            swat.name             = 'guard';

            models.set('guard', swat);
        });


        // Robot model
        gltfLoader.load('./models/robot.glb', (gltf) => {
            var geometry = new THREE.BufferGeometry();
            var material = new THREE.MeshPhongMaterial();
            gltf.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    geometry.merge(child.geometry, child.matrix);
                }
                if (child instanceof THREE.MeshPhongMaterial) {
                    material = child;
                }
            });

            const robot = new THREE.Mesh(geometry, material);
            robot.scale.set(0.5, 0.5, 0.5);
            robot.position.set(0, 0, 0);
            robot.rotation.set(0, Math.PI, 0);
            robot.castShadow    = true;
            robot.receiveShadow = true;
            robot.doubleSided   = true;
            robot.name          = 'robot';

            models.set('robot', robot);
        });


        // Alien model
        gltfLoader.load('./models/alien.glb', (gltf) => {
            var geometry = new THREE.BufferGeometry();
            var material = new THREE.MeshPhongMaterial();
            gltf.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    geometry.merge(child.geometry, child.matrix);
                }
                if (child instanceof THREE.MeshPhongMaterial) {
                    material = child;
                }
            });

            const alien = new THREE.Mesh(geometry, material);
            alien.scale.set(0.5, 0.5, 0.5);
            alien.position.set(0, 0, 0);
            alien.rotation.set(0, Math.PI, 0);
            alien.castShadow    = true;
            alien.receiveShadow = true;
            alien.doubleSided   = true;
            alien.name          = 'alien';

            models.set('alien', alien);
        });



        // Astronaut model
        gltfLoader.load('./models/astronaut.glb', (gltf) => {
            var geometry = new THREE.BufferGeometry();
            var material = new THREE.MeshPhongMaterial();
            gltf.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    geometry.merge(child.geometry, child.matrix);
                }
                if (child instanceof THREE.MeshPhongMaterial) {
                    material = child;
                }
            });

            const astronaut = new THREE.Mesh(geometry, material);
            astronaut.scale.set(0.5, 0.5, 0.5);
            astronaut.position.set(0, 0, 0);
            astronaut.rotation.set(0, Math.PI, 0);
            astronaut.castShadow    = true;
            astronaut.receiveShadow = true;
            astronaut.doubleSided   = true;
            astronaut.name          = 'astronaut';

            models.set('astronaut', astronaut);
        });


        // Wanderer model
        gltfLoader.load('./models/wanderer.glb', (gltf) => {
            var geometry = new THREE.BufferGeometry();
            var material = new THREE.MeshPhongMaterial();
            gltf.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    geometry.merge(child.geometry, child.matrix);
                }
                if (child instanceof THREE.MeshPhongMaterial) {
                    material = child;
                }
            });

            const wanderer = new THREE.Mesh(geometry, material);
            wanderer.scale.set(0.5, 0.5, 0.5);
            wanderer.position.set(0, 0, 0);
            wanderer.rotation.set(0, Math.PI, 0);
            wanderer.castShadow    = true;
            wanderer.receiveShadow = true;
            wanderer.doubleSided   = true;
            wanderer.name          = 'wanderer';

            models.set('wanderer', wanderer);
        });


        // Droid model
        gltfLoader.load('./models/droid.glb', (gltf) => {
            var geometry = new THREE.BufferGeometry();
            var material = new THREE.MeshPhongMaterial();
            gltf.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    geometry.merge(child.geometry, child.matrix);
                }
                if (child instanceof THREE.MeshPhongMaterial) {
                    material = child;
                }
            });

            const droid = new THREE.Mesh(geometry, material);
            droid.scale.set(0.5, 0.5, 0.5);
            droid.position.set(0, 0, 0);
            droid.rotation.set(0, Math.PI, 0);
            droid.castShadow    = true;
            droid.receiveShadow = true;
            droid.doubleSided   = true;
            droid.name          = 'droid';

            models.set('droid', droid);
        });


    }


}



export {AssetManager};
