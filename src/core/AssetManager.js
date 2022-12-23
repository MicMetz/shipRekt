/**
 * @author MicMetzger /
 * @original Mugen87 / https://github.com/Mugen87
 */

import * as THREE            from 'three';
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {GLTFLoader}          from 'three/examples/jsm/loaders/GLTFLoader.js';
import {dumpObject}          from '../etc/Utilities.js';



class AssetManager {

   constructor() {

      this.loadingManager = new THREE.LoadingManager();

      this.audioLoader   = new THREE.AudioLoader(this.loadingManager);
      this.fontLoader    = new THREE.FontLoader(this.loadingManager);
      this.textureLoader = new THREE.TextureLoader(this.loadingManager);
      this.listener      = new THREE.AudioListener();
      this.gltfLoader    = new GLTFLoader(this.loadingManager);

      this.animationMixer = new THREE.AnimationMixer();

      this.animations = new Map();
      this.audios     = new Map();
      this.textures   = new Map();
      this.fonts      = new Map();
      this.models     = new Map();


      this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => { console.log(`Loading file: ${url}. ${itemsLoaded} of ${itemsTotal} files loaded.`); };

      this.loadingManager.onError = (url) => { console.log(`There was an error loading ${url}`); };

      this.loadingManager.onLoad = () => { console.log('Loading complete!'); };

      this.loadingManager.onStart = (url, itemsLoaded, itemsTotal) => { console.log(`Loading file: ${url}. ${itemsLoaded} of ${itemsTotal} files loaded.`); };

   }


   init() {

      // this._itemsLoading();
      this._loadAudios();
      this._loadModels();

      const loadingManager = this.loadingManager;

      return new Promise((resolve) => {

         loadingManager.onLoad = () => {
            // this._itemsLoaded();

            setTimeout(() => {

               resolve();

            }, 100);

         };

      });

   }


   _itemsLoading() {

      console.log('Items Loading');
      document.getElementById('loading-screen').classList.remove('loaded');
      document.getElementById('loading-screen').classList.add('loading');

   }


   _itemsLoaded() {

      console.log('Items Loaded');
      document.getElementById('loading-screen').classList.remove('loading');
      document.getElementById('loading-screen').classList.add('loaded');

   }


   getAnimation(type, name) {
      var result;
      this.animations.get(type).forEach((animation) => {
         if (animation.name === name) {
            result = animation;
         }
      });
      if (result == null) {
         console.error("animation: " + name + " cannot be found!")
      }
      return result
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


   _loadTextures() {

      const textureLoader = this.textureLoader;

      const textures = this.textures;

      textures.set('star', textureLoader.load('assets/textures/star.png'));
      textures.set('quad', textureLoader.load('assets/textures/quad.png'));

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

      const gltfLoader    = this.gltfLoader;
      const textureLoader = this.textureLoader;
      const models        = this.models;
      const animations    = this.animations;


      // Pickup Health
      gltfLoader.load('./models/PickupHealth.glb', (gltf) => {
         const healthpackMesh            = gltf.scene.getObjectByName('Pickup_Health').children[0];
         healthpackMesh.matrixAutoUpdate = false;
         models.set('pickupHealth', healthpackMesh);
      });


      // Ship model
      gltfLoader.load('./models/ship.glb', (gltf) => {
         const shipMesh = gltf.scene.getObjectByName('Spaceship5').children[0];
         shipMesh.name  = 'Spaceship';
         models.set('Spaceship', shipMesh);
      });


      // Swat Officer model
      gltfLoader.load('./models/swat.glb', (gltf) => {
         const model  = gltf.scene;
         var geometry = new THREE.Mesh();
         let geoms    = [];
         let meshes   = [];
         let mats     = [];


         model.updateMatrixWorld();
         model.traverse(e => e.isMesh && meshes.push(e) && (geoms.push((e.geometry.index) ? e.geometry.toNonIndexed() : e.geometry().clone())));
         geoms.forEach((g, i) => g.applyMatrix4(meshes[i].matrixWorld));


         let swat = BufferGeometryUtils.mergeBufferGeometries(geoms);
         swat.computeVertexNormals();
         swat.applyMatrix4(model.matrix.clone().invert());
         swat.userData.materials = meshes.map(m => m.material);

         const swatMesh = new THREE.Mesh(swat, new THREE.MeshStandardMaterial({color: 0x000000}));
         swatMesh.name  = 'SwatOfficer';

         let swatAnimations = null
         if (model.animations.length > 0) {
            swatAnimations = model.animations;
         }

         models.set('SwatOfficer', swatMesh);
         animations.set('SwatOfficer', swatAnimations);

      });


      // Robot model
      // gltfLoader.load('./models/robot.glb', (gltf) => {
      //     const model   = gltf.scene;
      //     var geometry  = new THREE.Mesh();
      //     let geoms     = []
      //     let meshes    = []
      //     let materials = []
      //
      //
      //     model.updateMatrixWorld()
      //     model.traverse(e => e.isMesh && meshes.push(e) && (geoms.push((e.geometry.index) ? e.geometry.toNonIndexed() : e.geometry().clone())))
      //     geoms.forEach((g, i) => g.applyMatrix4(meshes[i].matrixWorld));
      //
      //     let robot = BufferGeometryUtils.mergeBufferGeometries(geoms);
      //     robot.computeVertexNormals();
      //     robot.applyMatrix4(model.matrix.clone().invert());
      //     robot.userData.materials = meshes.map(m => m.material)
      //
      //     const robotMesh = new THREE.Mesh(robot, new THREE.MeshStandardMaterial({color: 0x000000}));
      //     robotMesh.name  = 'Boom Bot';
      //
      //     models.set('BoomBot', robotMesh);
      // });


      // Alien model
      gltfLoader.load('./models/alien.glb', (gltf) => {
         const model   = gltf.scene;
         var geometry  = new THREE.Mesh();
         let geoms     = [];
         let meshes    = [];
         let materials = [];


         model.updateMatrixWorld();
         model.traverse(e => e.isMesh && meshes.push(e) && (geoms.push((e.geometry.index) ? e.geometry.toNonIndexed() : e.geometry().clone())));
         geoms.forEach((g, i) => g.applyMatrix4(meshes[i].matrixWorld));

         let alien = BufferGeometryUtils.mergeBufferGeometries(geoms);
         alien.computeVertexNormals();
         alien.applyMatrix4(model.matrix.clone().invert());
         alien.userData.materials = meshes.map(m => m.material);

         const alienMesh = new THREE.Mesh(alien, new THREE.MeshStandardMaterial({color: 0x000000}));
         alienMesh.name  = 'BlubAlien';

         let alienAnimations = null
         if (model.animations.length > 0) {
            alienAnimations = model.animations;
         }

         models.set('BlubAlien', alienMesh);
         animations.set('BlubAlien', alienAnimations);
      });


      // Astronaut model
      gltfLoader.load('./models/astronaut.glb', (gltf) => {
         const model   = gltf.scene;
         var geometry  = new THREE.Mesh();
         let geoms     = [];
         let meshes    = [];
         let materials = [];


         model.updateMatrixWorld();
         model.traverse(e => e.isMesh && meshes.push(e) && (geoms.push((e.geometry.index) ? e.geometry.toNonIndexed() : e.geometry().clone())));
         geoms.forEach((g, i) => g.applyMatrix4(meshes[i].matrixWorld));

         let astronaut = BufferGeometryUtils.mergeBufferGeometries(geoms);
         astronaut.computeVertexNormals();
         astronaut.applyMatrix4(model.matrix.clone().invert());
         astronaut.userData.materials = meshes.map(m => m.material);

         const astronautMesh = new THREE.Mesh(astronaut, new THREE.MeshStandardMaterial({color: 0x000000}));
         astronautMesh.name  = 'FighterPilotRed';

         let astronautAnimations = null
         if (model.animations.length > 0) {
            astronautAnimations = model.animations;
         }

         models.set('FighterPilotRed', astronautMesh);
         animations.set('FighterPilotRed', astronautAnimations);
      });


      // Wanderer model
      gltfLoader.load('./models/wanderer.glb', (gltf) => {
         const model   = gltf.scene;
         var geometry  = new THREE.Mesh();
         let geoms     = [];
         let meshes    = [];
         let materials = [];


         model.updateMatrixWorld();
         model.traverse(e => e.isMesh && meshes.push(e) && (geoms.push((e.geometry.index) ? e.geometry.toNonIndexed() : e.geometry().clone())));
         geoms.forEach((g, i) => g.applyMatrix4(meshes[i].matrixWorld));

         var wanderer = geoms[0];
         for (var i = 1; i < geoms.length; i++) {
            // if (geoms[i] !== undefined) {
            //     MergeSkinnedGeometry(wanderer, geoms[i]);
            // }
            wanderer.merge(geoms[i]);
         }
         // let wanderer = BufferGeometryUtils.mergeBufferGeometries(geoms);
         wanderer.computeVertexNormals();
         wanderer.applyMatrix4(model.matrix.clone().invert());
         wanderer.userData.materials = meshes.map(m => m.material);

         const wandererMesh = new THREE.Mesh(wanderer, new THREE.MeshStandardMaterial({color: 0x000000}));
         wandererMesh.name  = 'Wanderer';

         let wandererAnimations = null
         if (model.animations.length > 0) {
            wandererAnimations = model.animations;
         }

         models.set('Wanderer', wandererMesh);
         animations.set('Wanderer', wandererAnimations);
      });


      // Droid model
      gltfLoader.load('./models/droid.glb', (gltf) => {
         const model   = gltf.scene;
         var geometry  = new THREE.Mesh();
         let geoms     = [];
         let meshes    = [];
         let materials = [];

         model.updateMatrixWorld();
         model.traverse(e => e.isMesh && meshes.push(e) && (geoms.push((e.geometry.index) ? e.geometry.toNonIndexed() : e.geometry().clone())));
         geoms.forEach((g, i) => g.applyMatrix4(meshes[i].matrixWorld));

         let droid = BufferGeometryUtils.mergeBufferGeometries(geoms);
         droid.computeVertexNormals();
         droid.applyMatrix4(model.matrix.clone().invert());
         droid.userData.materials = meshes.map(m => m.material);

         const droidMesh = new THREE.Mesh(droid, new THREE.MeshStandardMaterial({color: 0x000000}));
         droidMesh.name  = 'Boom Droid';

         let droidAnimations = null
         if (model.animations.length > 0) {
            droidAnimations = model.animations;
         }

         models.set('droid', droidMesh);
         animations.set('droid', droidAnimations);
      });

   }


}



//
//    _loadAnimations() {
//
//       const animations = this.animations;
//
//       // manually create some keyframes for testing
//
//       let positionKeyframes, rotationKeyframes;
//       let q0, q1, q2;
//
//
//    }
//
//
// }



function MergeSkinnedGeometry(geo1, geo2) {
   var attributes  = ['normal', 'position', 'skinIndex', 'skinWeight'];
   var dataLengths = [3, 3, 4, 4];
   var geo         = new THREE.BufferGeometry();
   for (var attIndex = 0; attIndex < attributes.length; attIndex++) {
      var currentAttribute = attributes[attIndex];
      var geo1Att          = geo1.getAttribute(currentAttribute);
      var geo2Att          = geo2.getAttribute(currentAttribute);
      var currentArray     = null;
      if (currentAttribute === 'skinIndex') currentArray = new Uint16Array(geo1Att.array.length + geo2Att.array.length);
      else currentArray = new Float32Array(geo1Att.array.length + geo2Att.array.length);
      var innerCount = 0;
      geo1Att.array.map((item) => {
         currentArray[innerCount] = item;
         innerCount++;
      });
      geo2Att.array.map((item) => {
         currentArray[innerCount] = item;
         innerCount++;
      });
      geo1Att.array = currentArray;
      geo1Att.count = currentArray.length / dataLengths[attIndex];
      geo.setAttribute(currentAttribute, geo1Att);
   }
   return geo;
}



export {AssetManager};
