/**
 * @author MicMetzger /
 * @original Mugen87 / https://github.com/Mugen87
 */

import * as THREE   from 'three';
import {FBXLoader}  from "three/examples/jsm/loaders/FBXLoader.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";



class AssetManager {

    constructor() {

        this.loadingManager = new THREE.LoadingManager();

        this.audioLoader = new THREE.AudioLoader(this.loadingManager);

        this.fontLoader = new THREE.FontLoader(this.loadingManager);

        this.textureLoader = new THREE.TextureLoader(this.loadingManager);

        this.listener = new THREE.AudioListener();

        this.gltfLoader = new GLTFLoader(this.loadingManager);

        this.fbxLoader = new FBXLoader(this.loadingManager);


        this.audios = new Map();

        this.textures = new Map();

        this.fonts = new Map();

        this.gltfs = new Map();

        this.fbxs = new Map();

    }


    init() {

        this._loadAudios();

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


    _loadGltfs() {

        const gltfLoader = this.gltfLoader;
        const gltfs      = this.gltfs;

        // Ship model
        gltfLoader.load('./models/ship.glb', gltf => gltfs.set('ship', gltf));
        // Swat Officer model
        gltfLoader.load('./models/swat.glb', gltf => gltfs.set('swat', gltf));
        // Robot model
        gltfLoader.load('./models/robot.glb', gltf => gltfs.set('robot', gltf));
        // Alien model
        gltfLoader.load('./models/alien.glb', gltf => gltfs.set('alien', gltf));
        // Core model
        gltfLoader.load('./models/core.glb', gltf => gltfs.set('core', gltf));
        // Astronaut model
        gltfLoader.load('./models/astronaut.glb', gltf => gltfs.set('astronaut', gltf));
        // Wanderer model
        gltfLoader.load('./models/wanderer.glb', gltf => gltfs.set('wanderer', gltf));
        // Drone model
        gltfLoader.load('./models/drone.glb', gltf => gltfs.set('drone', gltf));
        // Droid model
        gltfLoader.load('./models/droid.glb', gltf => gltfs.set('droid', gltf));
        // Asteroid model
        gltfLoader.load('./models/asteroid.glb', gltf => gltfs.set('asteroid', gltf));

    }


    _loadFbxs() {

        const fbxLoader = this.fbxLoader;
        const fbxs      = this.fbxs;



    }

}



export {AssetManager};
