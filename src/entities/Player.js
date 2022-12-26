/**
 * @author MicMetzger /
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

      this.stateMachine.add('idle', new IdleState(this));
      this.stateMachine.add('walk', new WalkState(this));
      this.stateMachine.add('run', new RunState(this));
      this.stateMachine.add('runBack', new RunBackState(this));
      this.stateMachine.add('runLeft', new RunLeftState(this));
      this.stateMachine.add('runRight', new RunRightState(this));
      this.stateMachine.add('jump', new JumpState(this));
      this.stateMachine.add('fall', new FallState(this));
      this.stateMachine.add('shootAttack', new ShootAttackState(this));
      this.stateMachine.add('meleeAttack', new MeleeAttackState(this));

      this.stateMachine.changeTo('idle');
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

      return this.world.controls.input.forward || this.world.controls.input.backward || this.world.controls.input.left || this.world.controls.input.right;

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
   constructor(player) {
      super();
      this.parent = player;
   }


   get name() {
      return 'idle';
   }


   enter() {
      console.log('Enter State: Idle');

      const idleAction      = this.parent.animations.get('idle');
      const {previousState} = this.parent.stateMachine.previousState || {};
      idleAction.enabled    = true;

      // this.parent.stateMachine.currentState = this;

      if (previousState !== undefined) {

         const previousAction = this.parent.animations.get(previousState.name);

         idleAction.time = 0.0;
         idleAction.setEffectiveTimeScale(1.0);
         idleAction.setEffectiveWeight(1.0);
         // idleAction.crossFadeFrom(previousAction, 0.2, true);

      } else {

         // this.parent.stateMachine.previousState = this;

      }


   }


   execute(player) {
      // console.log('Post-Execute State: Idle');

      const {stateMachine} = this.parent.stateMachine;
      const input          = this.parent.world.controls.input;

      if (this.parent._isMoving()) {
         if (input.shift) {
            this.parent.stateMachine.changeTo('walk');
         } else {
            if (input.forward) {
               this.parent.stateMachine.changeTo('run');
            } else if (input.backward) {
               this.parent.stateMachine.changeTo('runBack');
            } else if (input.left) {
               this.parent.stateMachine.changeTo('runLeft');
            } else if (input.right) {
               this.parent.stateMachine.changeTo('runRight');
            }

         }
      }
   }


   exit() {
      console.log('Exit State: Idle');

      // const idleAction   = this.parent.animations.get('idle');
      // idleAction.enabled = false;
   }

}



class WalkState extends State {
   constructor(player) {
      super();
      this.parent = player;
   }


   get name() {
      return 'walk'
   }


   enter(player) {
      console.log('Enter State: Walk');

      const walkAction      = this.parent.animations.get('walk');
      const {previousState} = this.parent.stateMachine.previousState;
      const previousAction  = this.parent.animations.get(previousState.name);

      walkAction.enabled = true;
      // player.stateMachine.currentState = this;

      if (previousAction.name === 'run') {

         walkAction.time = 0.0;
         walkAction.crossFadeFrom(previousAction, 0.2, true);

      } else {

         walkAction.time = 0.0;
         walkAction.setEffectiveTimeScale(1.0);
         walkAction.setEffectiveWeight(1.0);
         // walkAction.crossFadeFrom(previousAction, 0.2, true);

      }
   }


   execute(player) {
      // console.log('Post-Execute State: Walk');

      const {stateMachine} = this.parent.stateMachine;
      const input          = this.parent.world.controls.input;

      if (!player._isMoving()) {
         this.parent.stateMachine.changeTo('idle');
      }
      if (!input.shift && player._isMoving()) {
         this.parent.stateMachine.changeTo('run');
      }

   }


   exit() {
      console.log('Exit State: Walk');

      const walkAction   = this.parent.animations.get('walk');
      walkAction.enabled = false;

      this.parent.stateMachine.changeTo('idle');
   }

}



class RunState extends State {
   constructor(player) {
      super();
      this.parent = player;
   }


   get name() {
      return 'run'
   }


   enter(prevState) {
      console.log('Enter State: Run');

      var currentAction     = this.parent.animations.get('run');
      const {previousState} = this.parent.stateMachine.previousState;
      const input           = this.parent.world.controls.input;

      // if (this.parent._isMoving()) {
      //    if (input.forward) {
      //       // currentAction.enabled = true;
      //       // currentAction.time    = 0.0;
      //    } else if (input.backward) {
      //       // new RunBackState().enter(this.parent);
      //       currentAction = this.parent.animations.get('runBack');
      //    } else if (input.left) {
      //       // new RunLeftState().enter(this.parent);
      //       currentAction = this.parent.animations.get('runLeft');
      //    } else if (input.right) {
      //       // new RunRightState().enter(this.parent);
      //       currentAction = this.parent.animations.get('runRight');
      //    }
      // } else {
      //    this.parent.stateMachine.changeTo('idle');
      // }



      if (prevState) {
         const prevAction = this.parent.animations.get(prevState.name);

         currentAction.enabled = true

         if (prevState.name === 'walk') {
            const ratio        = currentAction.getClip().duration / prevAction.getClip().duration
            currentAction.time = prevAction.time * ratio
         } else {
            currentAction.time = 0.0
            currentAction.setEffectiveTimeScale(1.0)
            currentAction.setEffectiveWeight(1.0)
         }

         // currentAction.crossFadeFrom(prevAction, 0.5, true)
         currentAction.play()
      } else {
         currentAction.play()
      }
   }


   execute(player) {
      // console.log('Post-Execute State: Run');

      // const {stateMachine} = this.parent.stateMachine;
      // const input          = this.parent.world.controls.input;
      //
      // if (!player._isMoving()) {
      //    this.parent.stateMachine.changeTo('idle');
      // }
      /* else {
       while (player._isMoving()) {
       const {stateMachine} = this.parent.stateMachine;
       const input          = this.parent.world.controls.input;
       const runAction      = this.parent.animations.get('run');

       if (input.left) {
       runAction.crossFadeTo(this.parent.animations.get('runLeft'), 0.2, true);
       }
       else if (input.right) {
       runAction.crossFadeTo(this.parent.animations.get('runRight'), 0.2, true);
       }
       else if (input.backward) {
       runAction.crossFadeTo(this.parent.animations.get('runBack'), 0.2, true);
       }
       else {
       continue;
       }
       }
       } */

   }


   exit() {

      const runAction   = this.parent.animations.get('run');
      runAction.enabled = false;
      runAction.stop();

      this.parent.stateMachine.changeTo('idle')

   }

}



class RunLeftState extends RunState {
   constructor(player) {
      super();
      this.parent = player;
   }


   get name() {
      return 'runLeft'
   }


   enter(player) {
      console.log('Enter State: Run Left');

      const input           = this.parent.world.controls.input;
      const {previousState} = this.parent.stateMachine.previousState;

      const runAction   = this.parent.animations['runLeft'].clip;
      runAction.time    = 0.0;
      runAction.enabled = true;

      runAction.play();

      // player.stateMachine.currentState = this;

   }


   exit() {

      const runAction   = this.parent.animations.get('runLeft');
      runAction.enabled = false;
      runAction.stop();

      this.parent.stateMachine.changeTo('idle');

   }

}



class RunRightState extends RunState {
   constructor(player) {
      super();
      this.parent = player;
   }


   get name() {
      return 'runRight';
   }


   enter(player) {
      console.log('Enter State: Run Right');

      const runAction       = this.parent.animations.get('runRight');
      const input           = this.parent.world.controls.input;
      const {previousState} = this.parent.stateMachine.previousState;

      // runAction.time    = 0.0;
      runAction.enabled = true;

      runAction.play();


      // player.stateMachine.currentState = this;

   }


   exit() {

      const runAction   = this.parent.animations.get('runRight');
      runAction.enabled = false;
      runAction.stop();

      this.parent.stateMachine.changeTo('idle')

   }

}



class RunBackState extends RunState {
   constructor(player) {
      super();
      this.parent = player;
   }


   get name() {
      return 'runBack'
   }


   enter(player) {
      console.log('Enter State: runBack');

      const runAction       = this.parent.animations.get('runBack');
      const input           = this.parent.world.controls.input;
      const {previousState} = this.parent.stateMachine.previousState;

      runAction.time    = 0.0;
      runAction.enabled = true;

      runAction.play();
      // player.stateMachine.currentState = this;

   }


   execute(player) {
      console.log('Post-Execute State: Run Back');



   }


   exit() {

      const runAction   = this.parent.animations.get('runBack');
      runAction.enabled = false;
      runAction.stop();

      this.parent.stateMachine.changeTo('idle')

   }
}



class ShootAttackState extends State {
   constructor(parent) {
      super();
      this.parent = parent;
   }


   get name() {
      return 'shootAttack'
   }


   enter(prevState) {

   }


   execute(player) {

   }


   exit() {}

}



class MeleeAttackState extends State {
   constructor(parent) {
      super();
      this.parent = parent;
   }


   get name() {
      return 'meleeAttack'
   }


   enter(prevState) {

   }


   execute(player) {

   }


   exit() {}

}



class JumpState extends State {
   constructor(parent) {
      super();
      this.parent = parent;
   }


   get name() {
      return 'jump'
   }


   enter(prevState) {

   }


   execute(player) {

   }


   exit() {}

}



class FallState extends State {
   constructor(parent) {
      super();
      this.parent = parent;
   }


   get name() {
      return 'fall'
   }


   enter(prevState) {

   }


   execute(player) {

   }


   exit() {}

}



export {Player};
