/**
 * @author MicMetzger /
 */

import * as THREE            from 'three';
import {OBJLoader}           from "three/examples/jsm/loaders/OBJLoader.js";
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {GLTFLoader}          from 'three/examples/jsm/loaders/GLTFLoader.js';
import {dumpObject}          from '../etc/Utilities.js';



class AssetManager {
   /**
    *
    *
    */
   constructor() {

      this.loadingManager = new THREE.LoadingManager();

      this.objectLoader  = new OBJLoader(this.loadingManager);
      this.gltfLoader    = new GLTFLoader(this.loadingManager);
      this.jsonLoader    = new THREE.FileLoader(this.loadingManager);
      this.audioLoader   = new THREE.AudioLoader(this.loadingManager);
      this.fontLoader    = new THREE.FontLoader(this.loadingManager);
      this.textureLoader = new THREE.TextureLoader(this.loadingManager);
      this.listener      = new THREE.AudioListener();

      this.animations = new Map();
      this.mixers     = new Map();
      this.audios     = new Map();
      this.textures   = new Map();
      this.fonts      = new Map();

      this.characterModels = new Map();
      this.items           = new Map();
      this.weapons         = new Map();
      this.props           = new Map();
      this.interiors       = new Map();

      this.descriptors = new Map();

   }


   init() {

      this._loadAudios();
      this._loadFonts();
      this._loadCharacterModels();
      this._loadItemModels();
      this._loadWeaponModels();
      this._loadPropModels();
      this._loadInteriorModels();

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


   _assetsLoading() {

      console.log('Items Loading');
      document.getElementById('loading-screen').classList.remove('loaded');
      document.getElementById('loading-screen').classList.add('loading');

   }


   _assetsLoaded() {

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

      const source = this.characterModels.get(id);

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
      const playerSwing = new THREE.PositionalAudio(listener);
      playerSwing.setRefDistance(refDistance);
      const playerHeavySwing = new THREE.PositionalAudio(listener);
      playerHeavySwing.setRefDistance(refDistance);
      const playerRoll = new THREE.PositionalAudio(listener);
      playerRoll.setRefDistance(refDistance);
      // const fleshHit = new THREE.PositionalAudio(listener);
      // fleshHit.setRefDistance(refDistance);

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
      audioLoader.load('./audio/playerSwing.ogg', buffer => playerSwing.setBuffer(buffer));
      audioLoader.load('./audio/playerHeavySwing.ogg', buffer => playerHeavySwing.setBuffer(buffer));
      audioLoader.load('./audio/playerRoll.ogg', buffer => playerRoll.setBuffer(buffer));
      // audioLoader.load('./audio/fleshHit.ogg', buffer => fleshHit.setBuffer(buffer));

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
      audios.set('playerSwing', playerSwing);
      audios.set('playerHeavySwing', playerHeavySwing);
      audios.set('playerRoll', playerRoll);
      // audios.set('fleshHit', fleshHit);

   }


   _loadFonts() {

      const fontLoader = this.fontLoader;
      const fonts      = this.fonts;

      fontLoader.load('./fonts/helvetiker_regular.typeface.json', font => fonts.set('helvetiker', font));
      fontLoader.load('./fonts/gentilis_bold.typeface.json', font => fonts.set('gentilis', font));

   }


   _loadCharacterModels() {

      const gltfLoader    = this.gltfLoader;
      const textureLoader = this.textureLoader;
      const models        = this.characterModels;
      const animations    = this.animations;


      // Swat Officer model
      gltfLoader.load('./models/npc/swat.glb', (gltf) => {
         const clone = {
            animations: gltf.animations,
            scene     : gltf.scene.clone(true)
         }

         const cloneBones         = {};
         const cloneSkinnedMeshes = {};

         clone.scene.traverse(node => {
            if (node.isBone) {
               cloneBones[node.name] = node;
            }

            if (node.isSkinnedMesh) {
               cloneSkinnedMeshes[node.name] = node;
            }
         });

         for (let name in cloneSkinnedMeshes) {
            // const SMesh      = skinnedMeshes[name];
            const cloneSMesh = cloneSkinnedMeshes[name];
            const skeleton   = cloneSMesh.skeleton;

            const orderedCloneBone = [];

            for (let i = 0; i < skeleton.bones.length; i++) {
               const cloneBone = cloneBones[skeleton.bones[i].name];
               orderedCloneBone.push(cloneBone);
            }

            cloneSMesh.bind(
              new THREE.Skeleton(orderedCloneBone, skeleton.boneInverses),
              cloneSMesh.matrixWorld
            );
         }

         const mixer      = new THREE.AnimationMixer(clone.scene);
         const animations = new Map();
         // const animations = {};

         const deathClip   = clone.animations[0];
         const deathAction = mixer.clipAction(deathClip);
         deathAction.play();
         deathAction.enabled = false;

         const shootClip   = clone.animations[1];
         const shootAction = mixer.clipAction(shootClip);
         shootAction.play();
         shootAction.enabled = false;

         const hitClip   = clone.animations[2];
         const hitAction = mixer.clipAction(hitClip);
         hitAction.play();
         hitAction.enabled = false;

         const idleClip   = clone.animations[4];
         const idleAction = mixer.clipAction(idleClip);
         idleAction.play();
         idleAction.enabled = false;

         const idleGunPointClip   = clone.animations[6];
         const idleGunPointAction = mixer.clipAction(idleGunPointClip);
         idleGunPointAction.play();
         idleGunPointAction.enabled = false;

         const idleGunShootClip   = clone.animations[7];
         const idleGunShootAction = mixer.clipAction(idleGunShootClip);
         idleGunShootAction.play();
         idleGunShootAction.enabled = false;

         const idleMeleeClip   = clone.animations[9];
         const idleMeleeAction = mixer.clipAction(idleMeleeClip);
         idleMeleeAction.play();
         idleMeleeAction.enabled = false;

         const interactClip   = clone.animations[10];
         const interactAction = mixer.clipAction(interactClip);
         interactAction.play();
         interactAction.enabled = false;

         const rollClip   = clone.animations[15];
         const rollAction = mixer.clipAction(rollClip);
         rollAction.play();
         rollAction.enabled = false;

         const runClip   = clone.animations[16];
         const runAction = mixer.clipAction(runClip);
         runAction.play();
         runAction.enabled = false;

         const runBackClip   = clone.animations[17];
         const runBackAction = mixer.clipAction(runBackClip);
         runBackAction.play();
         runBackAction.enabled = false;

         const runLeftClip   = clone.animations[18];
         const runLeftAction = mixer.clipAction(runLeftClip);
         runLeftAction.play();
         runLeftAction.enabled = false;

         const runRightClip   = clone.animations[19];
         const runRightAction = mixer.clipAction(runRightClip);
         runRightAction.play();
         runRightAction.enabled = false;

         const runShootClip   = clone.animations[20];
         const runShootAction = mixer.clipAction(runShootClip);
         runShootAction.play();
         runShootAction.enabled = false;

         const slashClip   = clone.animations[21];
         const slashAction = mixer.clipAction(slashClip);
         slashAction.play();
         slashAction.enabled = false;

         const walkClip   = clone.animations[22];
         const walkAction = mixer.clipAction(walkClip);
         walkAction.play();
         walkAction.enabled = false;

         animations.set('idle', {clip: idleClip, action: idleAction});
         animations.set('shoot', {clip: shootClip, action: shootAction});
         animations.set('die', {clip: deathClip, action: deathAction});
         animations.set('hit', {clip: hitClip, action: hitAction});
         animations.set('idleGunPoint', {clip: idleGunPointClip, action: idleGunPointAction});
         animations.set('idleGunShoot', {clip: idleGunShootClip, action: idleGunShootAction});
         animations.set('idleMelee', {clip: idleMeleeClip, action: idleMeleeAction});
         animations.set('interact', {clip: interactClip, action: interactAction});
         animations.set('roll', {clip: rollClip, action: rollAction});
         animations.set('run', {clip: runClip, action: runAction});
         animations.set('runBack', {clip: runBackClip, action: runBackAction});
         animations.set('runLeft', {clip: runLeftClip, action: runLeftAction});
         animations.set('runRight', {clip: runRightClip, action: runRightAction});
         animations.set('runShoot', {clip: runShootClip, action: runShootAction});
         animations.set('slash', {clip: slashClip, action: slashAction});
         animations.set('walk', {clip: walkClip, action: walkAction});


         clone.name = 'assault_guard';
         this.animations.set('assault_guard', animations);
         this.mixers.set('assault_guard', mixer);
         this.characterModels.set('assault_guard', clone.scene);

      });


      // Alien model
      gltfLoader.load('./models/npc/alien.glb', (gltf) => {
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
      gltfLoader.load('./models/player/astronaut.glb', (gltf) => {
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



      // Wanderer Player model
      gltfLoader.load('./models/player/wanderer.glb', (gltf) => {
         const skinnedMeshes = {};
         const clone         = {
            animations: gltf.animations,
            scene     : gltf.scene.clone(true)
         }
         gltf.scene.traverse(node => {
            if (node.isSkinnedMesh) {
               skinnedMeshes[node.name] = node;
            }
         })

         const cloneBones         = {};
         const cloneSkinnedMeshes = {};

         clone.scene.traverse(node => {
            if (node.isBone) {
               cloneBones[node.name] = node;
            }

            if (node.isSkinnedMesh) {
               cloneSkinnedMeshes[node.name] = node;
            }
         });

         for (let name in skinnedMeshes) {
            const SMesh      = skinnedMeshes[name];
            const skeleton   = SMesh.skeleton;
            const cloneSMesh = cloneSkinnedMeshes[name];

            const orderedCloneBone = [];

            for (let i = 0; i < skeleton.bones.length; i++) {
               const cloneBone = cloneBones[skeleton.bones[i].name];
               orderedCloneBone.push(cloneBone);
            }

            cloneSMesh.bind(
              new THREE.Skeleton(orderedCloneBone, skeleton.boneInverses),
              cloneSMesh.matrixWorld
            );
         }

         const mixer      = new THREE.AnimationMixer(clone.scene);
         const animations = new Map();

         const deathAction = mixer.clipAction(clone.animations[0]);
         deathAction.play();
         deathAction.enabled = false;

         const shootAction = mixer.clipAction(clone.animations[1]);
         shootAction.play();
         shootAction.enabled = false;

         const hitAction = mixer.clipAction(clone.animations[2]);
         hitAction.play();
         hitAction.enabled = false;

         const idleAction = mixer.clipAction(clone.animations[4]);
         idleAction.play();
         idleAction.enabled = false;

         const idleGunAction = mixer.clipAction(clone.animations[5]);
         idleGunAction.play();
         idleGunAction.enabled = false;

         const idleGunPointAction = mixer.clipAction(clone.animations[6]);
         idleGunPointAction.play();
         idleGunPointAction.enabled = false;

         const idleGunShootAction = mixer.clipAction(clone.animations[7]);
         idleGunShootAction.play();
         idleGunShootAction.enabled = false;

         const idleNeutralAction = mixer.clipAction(clone.animations[8]);
         idleNeutralAction.play();
         idleNeutralAction.enabled = false;

         const idleMeleeAction = mixer.clipAction(clone.animations[9]);
         idleMeleeAction.play();
         idleMeleeAction.enabled = false;

         const interactAction = mixer.clipAction(clone.animations[10]);
         interactAction.play();
         interactAction.enabled = false;

         const rollAction = mixer.clipAction(clone.animations[15]);
         rollAction.play();
         rollAction.enabled = false;

         const runAction = mixer.clipAction(clone.animations[16]);
         runAction.play();
         runAction.enabled = false;

         const runBackAction = mixer.clipAction(clone.animations[17]);
         runBackAction.play();
         runBackAction.enabled = false;

         const runLeftAction = mixer.clipAction(clone.animations[18]);
         runLeftAction.play();
         runLeftAction.enabled = false;

         const runRightAction = mixer.clipAction(clone.animations[19]);
         runRightAction.play();
         runRightAction.enabled = false;

         const runShootAction = mixer.clipAction(clone.animations[20]);
         runShootAction.play();
         runShootAction.enabled = false;

         const runSlashAction = mixer.clipAction(clone.animations[21]);
         runSlashAction.play();
         runSlashAction.enabled = false;

         const walkAction = mixer.clipAction(clone.animations[22]);
         walkAction.play();
         walkAction.enabled = false;

         animations.set('idle', idleAction);
         animations.set('idleGun', idleGunAction);
         animations.set('idleGunPoint', idleGunPointAction);
         animations.set('idleGunShoot', idleGunShootAction);
         animations.set('idleNeutral', idleNeutralAction);
         animations.set('idleMelee', idleMeleeAction);
         animations.set('interact', interactAction);
         animations.set('roll', rollAction);
         animations.set('run', runAction);
         animations.set('runBack', runBackAction);
         animations.set('runLeft', runLeftAction);
         animations.set('runRight', runRightAction);
         animations.set('runShoot', runShootAction);
         animations.set('runSlash', runSlashAction);
         animations.set('walk', walkAction);

         this.animations.set('Wanderer', animations);
         this.mixers.set('Wanderer', mixer);
         this.characterModels.set('Wanderer', clone.scene);

      });


      // Android Player model
      gltfLoader.load('./models/player/Android.gltf', (gltf) => {
         const clone = {
            animations: gltf.animations,
            scene     : gltf.scene.clone(true)
         }

         const cloneBones         = {};
         const cloneSkinnedMeshes = {};

         clone.scene.traverse(node => {
            if (node.isBone) {
               cloneBones[node.name] = node;
            }

            if (node.isSkinnedMesh) {
               cloneSkinnedMeshes[node.name] = node;
            }
         });

         for (let name in cloneSkinnedMeshes) {
            const cloneSMesh = cloneSkinnedMeshes[name];
            const skeleton   = cloneSMesh.skeleton;

            const orderedCloneBone = [];

            for (let i = 0; i < skeleton.bones.length; i++) {
               const cloneBone = cloneBones[skeleton.bones[i].name];
               orderedCloneBone.push(cloneBone);
            }

            cloneSMesh.bind(
              new THREE.Skeleton(orderedCloneBone, skeleton.boneInverses),
              cloneSMesh.matrixWorld
            );
         }

         const mixer      = new THREE.AnimationMixer(clone.scene);
         const animations = new Map();

         const deathClip   = clone.animations[0];
         const deathAction = mixer.clipAction(deathClip);
         deathAction.play();
         deathAction.enabled = false;

         const shootClip   = clone.animations[1];
         const shootAction = mixer.clipAction(shootClip);
         shootAction.play();
         shootAction.enabled = false;

         const hitClip   = clone.animations[2];
         const hitAction = mixer.clipAction(hitClip);
         hitAction.play();
         hitAction.enabled = false;

         const idleClip   = clone.animations[6];
         const idleAction = mixer.clipAction(idleClip);
         idleAction.play();
         idleAction.enabled = false;

         const idleGunPointClip   = clone.animations[4];
         const idleGunPointAction = mixer.clipAction(idleGunPointClip);
         idleGunPointAction.play();
         idleGunPointAction.enabled = false;

         const idleGunShootClip   = clone.animations[5];
         const idleGunShootAction = mixer.clipAction(idleGunShootClip);
         idleGunShootAction.play();
         idleGunShootAction.enabled = false;

         const idleMeleeClip   = clone.animations[7];
         const idleMeleeAction = mixer.clipAction(idleMeleeClip);
         idleMeleeAction.play();
         idleMeleeAction.enabled = false;

         const interactClip   = clone.animations[8];
         const interactAction = mixer.clipAction(interactClip);
         interactAction.play();
         interactAction.enabled = false;

         const rollClip   = clone.animations[13];
         const rollAction = mixer.clipAction(rollClip);
         rollAction.play();
         rollAction.enabled = false;

         const runClip   = clone.animations[14];
         const runAction = mixer.clipAction(runClip);
         runAction.play();
         runAction.enabled = false;

         const runBackClip   = clone.animations[15];
         const runBackAction = mixer.clipAction(runBackClip);
         runBackAction.play();
         runBackAction.enabled = false;

         const runLeftClip   = clone.animations[16];
         const runLeftAction = mixer.clipAction(runLeftClip);
         runLeftAction.play();
         runLeftAction.enabled = false;

         const runRightClip   = clone.animations[17];
         const runRightAction = mixer.clipAction(runRightClip);
         runRightAction.play();
         runRightAction.enabled = false;

         const runShootClip   = clone.animations[18];
         const runShootAction = mixer.clipAction(runShootClip);
         runShootAction.play();
         runShootAction.enabled = false;

         const slashClip   = clone.animations[19];
         const slashAction = mixer.clipAction(slashClip);
         slashAction.play();
         slashAction.enabled = false;

         const walkClip   = clone.animations[20];
         const walkAction = mixer.clipAction(walkClip);
         walkAction.play();
         walkAction.enabled = false;

         animations.set('idle', {clip: idleClip, action: idleAction});
         animations.set('shoot', {clip: shootClip, action: shootAction});
         animations.set('die', {clip: deathClip, action: deathAction});
         animations.set('hit', {clip: hitClip, action: hitAction});
         animations.set('idleGunPoint', {clip: idleGunPointClip, action: idleGunPointAction});
         animations.set('idleGunShoot', {clip: idleGunShootClip, action: idleGunShootAction});
         animations.set('idleMelee', {clip: idleMeleeClip, action: idleMeleeAction});
         animations.set('interact', {clip: interactClip, action: interactAction});
         animations.set('roll', {clip: rollClip, action: rollAction});
         animations.set('run', {clip: runClip, action: runAction});
         animations.set('runBack', {clip: runBackClip, action: runBackAction});
         animations.set('runLeft', {clip: runLeftClip, action: runLeftAction});
         animations.set('runRight', {clip: runRightClip, action: runRightAction});
         animations.set('runShoot', {clip: runShootClip, action: runShootAction});
         animations.set('slash', {clip: slashClip, action: slashAction});
         animations.set('walk', {clip: walkClip, action: walkAction});

         clone.name = 'Android';
         this.animations.set('Android', animations);
         this.mixers.set('Android', mixer);
         this.characterModels.set('Android', clone.scene);
      })


      // Droid model
      gltfLoader.load('./models/npc/droid.glb', (gltf) => {
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


   _loadItemModels() {
      const gltfLoader = this.gltfLoader;
      const items      = this.items;

      // Collectible Health
      gltfLoader.load('./models/pickups/PickupHealth.glb', (gltf) => {
         const healthpackMesh            = gltf.scene;
         healthpackMesh.matrixAutoUpdate = false;
         items.set('pickupHealth', healthpackMesh);
      });

      // Collectible Heart
      gltfLoader.load('./models/pickups/PickupHeart.glb', (gltf) => {
         const heartMesh            = gltf.scene;
         heartMesh.matrixAutoUpdate = false;
         items.set('pickupHeart', heartMesh);
      });

      // Collectible Tank
      gltfLoader.load('./models/pickups/PickupTank.glb', (gltf) => {
         const tankMesh            = gltf.scene;
         tankMesh.matrixAutoUpdate = false;
         items.set('pickupTank', tankMesh);
      });

   }


   _loadWeaponModels() {
      const gltfLoader = this.gltfLoader;
      const weapons    = this.weapons;

      // Energy Pistol
      gltfLoader.load('./models/weapons/EnergyPistol.glb', (gltf) => {
         const pistolMesh            = gltf.scene;
         pistolMesh.matrixAutoUpdate = false;
         weapons.set('pistol', pistolMesh);
      });

      // Long Pistol
      gltfLoader.load('./models/weapons/LongPistol.glb', (gltf) => {
         const longPistolMesh            = gltf.scene;
         longPistolMesh.matrixAutoUpdate = false;
         weapons.set('longPistol', longPistolMesh);
      });

      // Lightning Gun
      gltfLoader.load('./models/weapons/LightningGun.glb', (gltf) => {
         const lightningGunMesh            = gltf.scene;
         lightningGunMesh.matrixAutoUpdate = false;
         weapons.set('lightningGun', lightningGunMesh);
      });

   }


   _loadPropModels() {
      const gltfLoader = this.gltfLoader;
      const props      = this.props;

      // Cockpit
      gltfLoader.load('./models/environment/Cockpit.glb', (gltf) => {
         const cockpitMesh            = gltf.scene;
         cockpitMesh.matrixAutoUpdate = false;
         props.set('cockpit', cockpitMesh);
      });

      // Platform
      gltfLoader.load('./models/environment/Platform.glb', (gltf) => {
         const platformMesh            = gltf.scene;
         platformMesh.matrixAutoUpdate = false;
         props.set('platform', platformMesh);
      });

      // Platform Mega
      gltfLoader.load('./models/environment/Platform_mega.glb', (gltf) => {
         const platformMegaMesh            = gltf.scene;
         platformMegaMesh.matrixAutoUpdate = false;
         props.set('platformMega', platformMegaMesh);
      });

      // Platform Mini
      gltfLoader.load('./models/environment/Platform_mini.glb', (gltf) => {
         const platformMiniMesh            = gltf.scene;
         platformMiniMesh.matrixAutoUpdate = false;
         props.set('platformMini', platformMiniMesh);
      });

      // Workstation
      gltfLoader.load('./models/environment/Workstation.glb', (gltf) => {
         const workstationMesh            = gltf.scene;
         workstationMesh.matrixAutoUpdate = false;
         props.set('workstation', workstationMesh);
      });

      // Gondola
      gltfLoader.load('./models/environment/Gondola.glb', (gltf) => {
         const gondolaMesh            = gltf.scene;
         gondolaMesh.matrixAutoUpdate = false;
         props.set('gondola', gondolaMesh);
      });

      // Space Station
      gltfLoader.load('./models/environment/SpaceStation.glb', (gltf) => {
         const spaceStationMesh            = gltf.scene;
         spaceStationMesh.matrixAutoUpdate = false;
         props.set('spaceStation', spaceStationMesh);
      });


   }


   _loadInteriorModels() {
      const objectLoader = this.objectLoader;
      const interiors    = this.interiors;

      const floorPath = './materials/floor/FloorTile_';

      // Floors 1
      objectLoader.load('./materials/floor/FloorTile_Basic.obj', (object) => {

         object.matrixAutoUpdate = false;
         interiors.set('BasicFloor', object);
      });

      // Floors 2
      objectLoader.load(floorPath + 'Basic2.obj', (object) => {

         object.matrixAutoUpdate = false;
         interiors.set('BasicFloor2', object);
      });

      // Floors Empty
      objectLoader.load(floorPath + 'Empty.obj', (object) => {

         object.matrixAutoUpdate = false;
         interiors.set('EmptyFloor', object);
      });

      // Floors Corner
      objectLoader.load(floorPath + 'Corner.obj', (object) => {

         object.matrixAutoUpdate = false;
         interiors.set('CornerFloor', object);
      });

      // Floors Inner Corner
      objectLoader.load(floorPath + 'InnerCorner.obj', (object) => {

         object.matrixAutoUpdate = false;
         interiors.set('InnerCornerFloor', object);
      });

      // Floors Double Hallway
      objectLoader.load(floorPath + 'Double_Hallway.obj', (object) => {

         object.matrixAutoUpdate = false;
         interiors.set('DoubleHallwayFloor', object);
      });


      // Walls
      const wallPath = './materials/wall/Wall_';

      let i = 1;
      for (i; i <= 5; i++) {
         objectLoader.load(wallPath + i + '.obj', (object) => {

            object.matrixAutoUpdate = false;
            interiors.set('BasicWall' + i, object);
         });
      }

      // Wall Empty
      objectLoader.load(wallPath + 'Empty.obj', (object) => {


         object.matrixAutoUpdate = false;
         interiors.set('EmptyWall', object);
      });

   }



}



export {AssetManager};
