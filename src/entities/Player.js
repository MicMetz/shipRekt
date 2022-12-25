/**
 * @author Mugen87 / https://github.com/Mugen87
 */

import {AnimationMixer, LoopOnce, LoopRepeat}                                              from "three";
import {AABB, MovingEntity, MathUtils, OBB, Ray, Vector3, StateMachine, State, GameEntity} from 'yuka';

import {Particle, ParticleSystem} from '../core/ParticleSystem.js';
import {dumpObject}               from "../etc/Utilities.js";
import {PlayerProjectile}         from './PlayerProjectile.js';



const aabb               = new AABB();
const direction          = new Vector3();
const intersectionPoint  = new Vector3();
const intersectionNormal = new Vector3();
const ray                = new Ray();
const reflectionVector   = new Vector3();
const offset             = new Vector3();



class Player extends MovingEntity {

   constructor(world, body, mixer, animations, weapon) {
      super();

      console.log(process.env.NODE_ENV);
      this._GOD_MODE_ = process.env.NODE_ENV === 'development' ? true : false;

      this.world      = world;
      this.bodyMesh   = body;
      this.mixer      = mixer;
      this.animations = animations;

      this.protected      = false;
      this.protection     = 0;
      this.protectionMesh = null;

      this.maxSpeed          = 6;
      this.updateOrientation = false;

      this.MAX_HEALTH_POINTS = 3;
      this.healthPoints      = this.MAX_HEALTH_POINTS;

      this.boundingRadius = 0.5;

      this.shotsPerSecond = 10;
      this.lastShotTime   = 0;

      this.obb = new OBB();
      this.obb.halfSizes.set(0.1, 0.1, 0.5);

      this.audios = new Map();

      this.hand    = this.bodyMesh.getObjectByName('HandR');
      this.offHand = this.bodyMesh.getObjectByName('HandL');

      this.weapon    = this.hand.children[0];
      this.equipment = {};

      // this.hand.remove(this.hand.children[0]);
      console.log(this.hand);
      console.log(this.offHand);
      console.log(this.weapon);

      // particles
      this.maxParticles   = 20;
      this.particleSystem = new ParticleSystem();
      this.particleSystem.init(this.maxParticles);
      this.particlesPerSecond = 6; // number of particles per second with maxSpeed

      this._particlesNextEmissionTime = 0;
      this._particlesElapsedTime      = 0;

      this.stateMachine = new StateMachine(this);

      this.stateMachine.add('IDLE', new IdleState(this));
      this.stateMachine.add('WALK', new WalkState(this));
      this.stateMachine.add('RUN', new RunState(this));

      this.stateMachine.changeTo('IDLE');
   }


   onProtectionUp() {

      this.protected              = true;
      this.protectionMesh.visible = true;

      return this;
   }


   disableProtection() {

      this.protected              = false;
      this.protectionMesh.visible = false;

      const audio = this.audios.get('coreShieldDestroyed');
      this.world.playAudio(audio);

      return this;

   }


   shoot() {

      const world       = this.world;
      const elapsedTime = world.time.getElapsed();

      if (elapsedTime - this.lastShotTime > (1 / this.shotsPerSecond)) {

         this.lastShotTime = elapsedTime;

         this.getDirection(direction);

         const projectile = new PlayerProjectile(this, direction);

         world.addProjectile(projectile);

         const audio = this.audios.get('playerShot');
         world.playAudio(audio);

      }

      return this;

   }


   heal() {

      this.healthPoints = this.MAX_HEALTH_POINTS;

      return this;

   }


   update(delta) {

      const world = this.world;
      this.currentTime += delta;

      this.stateMachine.update();
      this.mixer.update(delta);

      this.obb.center.copy(this.position);
      this.obb.rotation.fromQuaternion(this.rotation);
      this.bodyMesh.position.copy(this.position);

      this._restrictMovement();

      super.update(delta);

      if (this.protected === true) {

         this.protectionMesh.material.uniforms.time.value = world.time.getElapsed();

      }

      this.updateParticles(delta);

      return this;

   }


   updateParticles(delta) {

      // check emission of new particles

      const timeScale      = this.getSpeed() / this.maxSpeed; // [0,1]
      const effectiveDelta = delta * timeScale;

      this._particlesElapsedTime += effectiveDelta;

      if (this._particlesElapsedTime > this._particlesNextEmissionTime) {

         const t = 1 / this.particlesPerSecond;

         this._particlesNextEmissionTime = this._particlesElapsedTime + (t / 2) + (t / 2 * Math.random());

         // emit new particle

         const particle = new Particle();
         offset.x       = Math.random() * 0.3;
         offset.y       = Math.random() * 0.3;
         offset.z       = Math.random() * 0.3;
         particle.position.copy(this.position).add(offset);
         particle.lifetime = Math.random() * 0.7 + 0.3;
         particle.opacity  = Math.random() * 0.5 + 0.5;
         particle.size     = Math.floor(Math.random() * 10) + 10;
         particle.angle    = Math.round(Math.random()) * Math.PI * Math.random();

         this.particleSystem.add(particle);

      }

      // update the system itself

      this.particleSystem.update(delta);

   }


   handleMessage(telegram) {

      switch (telegram.message) {

         case 'hit':

            if (this._GOD_MODE_ === false) {
               console.log('player hit');

               const world = this.world;

               const audio = this.audios.get('playerHit');
               world.playAudio(audio);

               if (this.protected === false) {

                  this.healthPoints--;

                  if (this.healthPoints === 0) {

                     const audio = this.audios.get('playerExplode');
                     world.playAudio(audio);

                  }

               }
               this.healthPoints--;

            }
            break;

         default:

            console.error('Unknown message type:', telegram.message);

      }

      return true;

   }


   _isMoving() {
      return super.getSpeed() > 0.01;
   }


   _restrictMovement() {

      if (this.velocity.squaredLength() === 0) return;

      // check obstacles

      const world     = this.world;
      const obstacles = world.obstacles;

      for (let i = 0, l = obstacles.length; i < l; i++) {

         const obstacle = obstacles[i];

         // enhance the AABB

         aabb.copy(obstacle.aabb);
         aabb.max.addScalar(this.boundingRadius * 0.5);
         aabb.min.subScalar(this.boundingRadius * 0.5);

         // setup ray

         ray.origin.copy(this.position);
         ray.direction.copy(this.velocity).normalize();

         // perform ray/AABB intersection test

         if (ray.intersectAABB(aabb, intersectionPoint) !== null) {

            const squaredDistance = this.position.squaredDistanceTo(intersectionPoint);

            if (squaredDistance <= (this.boundingRadius * this.boundingRadius)) {

               // derive normal vector

               aabb.getNormalFromSurfacePoint(intersectionPoint, intersectionNormal);

               // compute reflection vector

               reflectionVector.copy(ray.direction).reflect(intersectionNormal);

               // compute new velocity vector

               const speed = this.getSpeed();

               this.velocity.addVectors(ray.direction, reflectionVector).normalize();

               const f = 1 - Math.abs(intersectionNormal.dot(ray.direction));

               this.velocity.multiplyScalar(speed * f);

            }

         }

      }

      // ensure player does not leave the game area

      const fieldXHalfSize = world.field.x / 2;
      const fieldZHalfSize = world.field.z / 2;

      this.position.x = MathUtils.clamp(this.position.x, -(fieldXHalfSize - this.boundingRadius), (fieldXHalfSize - this.boundingRadius));
      this.position.z = MathUtils.clamp(this.position.z, -(fieldZHalfSize - this.boundingRadius), (fieldZHalfSize - this.boundingRadius));

      return this;

   }


}



class IdleState extends State {
   constructor() {
      super();

      this.name = 'IDLE';

   }


   enter(player) {
      console.log('Enter State: Idle');

      const idleAction      = player.animations.get('IDLE');
      const {previousState} = player.stateMachine.previousState || {};

      player.stateMachine.currentState = this;

      if (previousState !== undefined) {

         const previousAction = player.animations.get(previousState.name);

         idleAction.time = 0.0;
         idleAction.setEffectiveTimeScale(1.0);
         idleAction.setEffectiveWeight(1.0);
         idleAction.crossFadeFrom(previousAction, 0.2, true);

      } else {

         player.stateMachine.previousState = this;

      }

      idleAction.enabled = true;

   }


   execute(player) {
      // console.log('Post-Execute State: Idle');

      const {stateMachine} = player;
      const input          = player.world.controls.input;

      if (player._isMoving()) {
         if (input.shift) {
            stateMachine.changeTo('WALK');
         } else {
            stateMachine.changeTo('RUN');
         }
      }

   }


   exit(player) {
      console.log('Exit State: Idle');

      const idleAction   = player.animations.get('IDLE');
      idleAction.enabled = false;

      player.stateMachine.previousState = this;

   }
}



class WalkState extends State {
   constructor() {
      super();

      this.name = 'WALK';

   }


   enter(player) {
      console.log('Enter State: Walk');

      const walkAction      = player.animations.get('WALK');
      const {previousState} = player.stateMachine.previousState;
      const previousAction  = player.animations.get(previousState.name);

      walkAction.enabled               = true;
      player.stateMachine.currentState = this;

      if (previousAction.name === 'RUN') {

         walkAction.time = 0.0;
         walkAction.crossFadeFrom(previousAction, 0.2, true);

      } else {

         walkAction.time = 0.0;
         walkAction.setEffectiveTimeScale(1.0);
         walkAction.setEffectiveWeight(1.0);
         walkAction.crossFadeFrom(previousAction, 0.2, true);

      }
   }


   execute(player) {
      // console.log('Post-Execute State: Walk');

      const {stateMachine} = player;
      const input          = player.world.controls.input;

      if (!input.shift) {
         stateMachine.changeTo('RUN');
      } else if (!player._isMoving()) {
         stateMachine.changeTo('IDLE');
      }

   }


   exit(player) {
      console.log('Exit State: Walk');

      const walkAction   = player.animations.get('WALK');
      walkAction.enabled = false;

      player.stateMachine.previousState = this;

   }

}



class RunState extends State {
   constructor() {
      super();

      this.name = 'RUN';

   }


   enter(player) {
      console.log('Enter State: Run');

      const input = player.world.controls.input;

      if (input.forward) {
         console.log('forward');
         const runAction       = player.animations.get('RUN');
         const {previousState} = player.stateMachine.previousState;

         runAction.enabled                = true;
         player.stateMachine.currentState = this;
      } else if (input.backward) {
         new RunBackState().enter(player);
      } else if (input.left) {
         new RunLeftState().enter(player);
      } else if (input.right) {
         new RunRightState().enter(player);
      }

   }


   execute(player) {
      // console.log('Post-Execute State: Run');

      const {stateMachine} = player;
      const input          = player.world.controls.input;

      if (input.shift) {
         stateMachine.changeTo('WALK');
      } else if (!player._isMoving()) {
         stateMachine.changeTo('IDLE');
      }

   }


   exit(player) {
      console.log('Exit State: Run');

      const runAction   = player.animations.get('RUN');
      runAction.enabled = false;

      player.stateMachine.previousState = this;

   }

}



class RunLeftState extends RunState {
   constructor() {
      super();

      this.name = 'RUN_LEFT';

   }


   enter(player) {
      console.log('Enter State: Run Left');

      const input           = player.world.controls.input;
      const {previousState} = player.stateMachine.previousState;

      const runAction   = player.animations.get('RUN_LEFT');
      runAction.time    = 0.0;
      runAction.enabled = true;


      // player.stateMachine.currentState = this;

   }


   exit(player) {
      console.log('Exit State: Run Left');

      const runAction   = player.animations.get('RUN_LEFT');
      runAction.enabled = false;

      player.stateMachine.previousState = this;

   }
}



class RunRightState extends RunState {
   constructor() {
      super();

      this.name = 'RUN_RIGHT';

   }


   enter(player) {
      console.log('Enter State: Run Right');

      const input           = player.world.controls.input;
      const {previousState} = player.stateMachine.previousState;

      const runAction   = player.animations.get('RUN_RIGHT');
      runAction.time    = 0.0;
      runAction.enabled = true;


      // player.stateMachine.currentState = this;

   }


   exit(player) {
      console.log('Exit State: Run Right');

      const runAction   = player.animations.get('RUN_RIGHT');
      runAction.enabled = false;

      player.stateMachine.previousState = this;

   }
}



class RunBackState extends RunState {
   constructor() {
      super();

      this.name = 'RUN_BACK';

   }


   enter(player) {
      console.log('Enter State: Run Back');

      const input           = player.world.controls.input;
      const {previousState} = player.stateMachine.previousState;

      const runAction   = player.animations.get('RUN_BACK');
      runAction.time    = 0.0;
      runAction.enabled = true;

      // player.stateMachine.currentState = this;

   }


   exit(player) {
      console.log('Exit State: Run Back');

      const runAction   = player.animations.get('RUN_BACK');
      runAction.enabled = false;

      player.stateMachine.previousState = this;

   }
}



export {Player};
