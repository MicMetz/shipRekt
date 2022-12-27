/**
 * @author MicMetzger /
 */

import {LoopOnce}  from "three";
import PlayerState from "./PlayerState.js";



export class IdleState extends PlayerState {
   constructor(parent) {
      super(parent);

      this._action = null;

   }


   get name() {
      return 'idle';
   }


   enter(prevState) {
      this._action = this.parent.proxy.animations.get('idle').action;
      if (prevState !== null && prevState !== undefined) {
         const prevAction     = this.parent.proxy.animations.get(prevState.name).action;
         this._action.time    = 0.0;
         this._action.enabled = true;
         this._action.setEffectiveTimeScale(1.0);
         this._action.setEffectiveWeight(1.0);
         this._action.crossFadeFrom(prevAction, 0.25, true);
         this._action.play();
      } else {
         this._action.play();
      }
   }


   update(_, input, moving) {

      if (input.shift && moving) {
         this.parent.changeTo('walk');
         return;
      } else if (input.forward) {
         this.parent.changeTo('run');
         return;
      } else if (input.backward) {
         this.parent.changeTo('runBack');
         return;
      } else if (input.left) {
         this.parent.changeTo('runLeft');
         return;
      } else if (input.right) {
         this.parent.changeTo('runRight');
         return;
      }


      this.parent.changeTo('idle');
   }


   cleanup() {
      this._action = null;
   }


   exit() {
      this.cleanup();
   }

}



export class WalkState extends PlayerState {
   constructor(parent) {
      super(parent);

      this._action = null;

   }


   get name() {
      return 'walk'
   }


   enter(prevState) {
      this._action = this.parent.proxy.animations.get('walk').action;
      if (prevState !== null && prevState !== undefined) {
         const previousAction = this.parent.proxy.animations.get(prevState.name).action;

         this._action.enabled = true;

         if (prevState.name.includes('run')) {
            const ratio       = this._action.getClip().duration / previousAction.getClip().duration;
            this._action.time = previousAction.time * ratio;
         } else {
            this._action.time = 0.0;
            this._action.setEffectiveTimeScale(1.0);
            this._action.setEffectiveWeight(1.0);
         }

         this._action.crossFadeFrom(previousAction, 0.1, true);
         this._action.play();
      } else {
         this._action.play();
      }
   }


   cleanup() {
      this._action = null;
   }


   exit() { this.cleanup(); }


   update(_, input, moving) {
      if (!input.shift) {
         if (input.forward) {
            this.parent.changeTo('run');
            return;
         }
         if (input.backward) {
            this.parent.changeTo('runBack');
            return;
         }
         if (input.left) {
            this.parent.changeTo('runLeft');
            return;
         }
         if (input.right) {
            this.parent.changeTo('runRight');
            return;
         }
      }

      this.parent.changeTo('idle');
   }
};



export class RunState extends PlayerState {
   constructor(parent) {
      super(parent);

      this._action = null;

      this.finishedCallback = () => {
         this.finished();
      }

   }


   get name() {
      return 'run'
   }


   enter(prevState) {
      this._action         = this.parent.proxy.animations.get('run').action;
      const previousAction = this.parent.proxy.animations.get(prevState.name).action;

      if (prevState.name.includes('Attack')) {
         this._action.time = 0.0;

         this._action.crossFadeFrom(previousAction, 0.7, true);
      }

      this._action.enabled = true;
      this._action.play();
   }


   update(_, input, moving) {
      if (input.forward || input.backward) {
         if (input.shift) {
            this.parent.changeTo('walk')
         } else {
            if (input.forward) {
               this.parent.changeTo('run')
            } else if (input.backward) {
               this.parent.changeTo('runBack')
            }
         }

         return;
      }
      if (input.left || input.right) {
         if (input.shift) {
            this.parent.changeTo('walk')
         } else {
            if (input.left) {
               this.parent.changeTo('runLeft')
            } else if (input.right) {
               this.parent.changeTo('runRight')
            }
         }

         return;
      }

      this.parent.changeTo('idle')
   }


   cleanup() {
      this._action = null;
   }


   exit() { this.cleanup(); }

}



export class RunLeftState extends PlayerState {
   constructor(parent) {
      super(parent);

      this._action = null;

      this.finishedCallback = () => {
         this.finished();
      }

   }


   get name() {
      return 'runLeft'
   }


   enter(prevState) {
      this._action         = this.parent.proxy.animations.get('runLeft').action;
      const previousAction = this.parent.proxy.animations.get(prevState.name).action;

      if (prevState.name.includes('Attack')) {
         this._action.time = 0.0;

         this._action.crossFadeFrom(previousAction, 0.7, true);
      }

      this._action.enabled = true;
      this._action.play();
   }


   update(_, input, moving) {
      if (input.forward || input.backward) {
         if (input.shift) {
            this.parent.changeTo('walk')
         } else {
            if (input.forward) {
               this.parent.changeTo('run')
            } else if (input.backward) {
               this.parent.changeTo('runBack')
            }
         }

         return;
      }
      if (input.left || input.right) {
         if (input.shift) {
            this.parent.changeTo('walk')
         } else {
            if (input.left) {
               this.parent.changeTo('runLeft')
            } else if (input.right) {
               this.parent.changeTo('runRight')
            }
         }

         return;
      }

      this.parent.changeTo('idle')
   }


   cleanup() {
      this._action = null;
   }


   exit() { this.cleanup(); }

}



export class RunRightState extends PlayerState {
   constructor(parent) {
      super(parent);

      this._action = null;

      this.finishedCallback = () => {
         this.finished();
      }

   }


   get name() {
      return 'runRight';
   }


   enter(prevState) {
      this._action         = this.parent.proxy.animations.get('runRight').action;
      const previousAction = this.parent.proxy.animations.get(prevState.name).action;

      if (prevState.name.includes('Attack')) {
         this._action.time = 0.0;

         this._action.crossFadeFrom(previousAction, 0.7, true);
      }

      this._action.enabled = true;
      this._action.play();
   }


   update(_, input, moving) {
      if (input.forward || input.backward) {
         if (input.shift) {
            this.parent.changeTo('walk')
         } else {
            if (input.forward) {
               this.parent.changeTo('run')
            } else if (input.backward) {
               this.parent.changeTo('runBack')
            }
         }

         return;
      }
      if (input.left || input.right) {
         if (input.shift) {
            this.parent.changeTo('walk')
         } else {
            if (input.left) {
               this.parent.changeTo('runLeft')
            } else if (input.right) {
               this.parent.changeTo('runRight')
            }
         }

         return;
      }

      this.parent.changeTo('idle')
   }


   cleanup() {
      this._action = null;
   }


   exit() { this.cleanup(); }

}



export class RunBackState extends PlayerState {
   constructor(parent) {
      super(parent);

      this._action = null;

      this.finishedCallback = () => {
         this.finished();
      }

   }


   get name() {
      return 'runBack'
   }


   enter(prevState) {
      const runAction      = this.parent.proxy.animations.get('runBack').action;
      const previousAction = this.parent.proxy.animations.get(prevState.name).action;

      if (prevState.name.includes('Attack')) {
         runAction.time = 0.0;

         runAction.crossFadeFrom(previousAction, 0.7, true);
      }

      runAction.enabled = true;
      runAction.play();
   }


   update(_, input, moving) {
      if (input.forward || input.backward) {
         if (input.shift) {
            this.parent.changeTo('walk')
         } else {
            if (input.forward) {
               this.parent.changeTo('run')
            } else if (input.backward) {
               this.parent.changeTo('runBack')
            }
         }

         return;
      }
      if (input.left || input.right) {
         if (input.shift) {
            this.parent.changeTo('walk')
         } else {
            if (input.left) {
               this.parent.changeTo('runLeft')
            } else if (input.right) {
               this.parent.changeTo('runRight')
            }
         }

         return;
      }

      this.parent.changeTo('idle')
   }


   cleanup() {
      this._action = null;
   }


   exit() { this.cleanup(); }

}



export class ShootAttackState extends PlayerState {
   constructor(parent) {
      super(parent);

      this._action = null;

      this.finishedCallback = () => {
         this.finished();
      }

   }


   get name() {
      return 'shootAttack'
   }


   enter(prevState) {
      this._action = this.parent.proxy.animations.get('shoot').action;
      const mixer  = this._action.getMixer();
      mixer.addEventListener('finished', this.finishedCallback);

      if (prevState !== undefined) {
         const previousAction = this.parent.proxy.animations.get(prevState.name).action;

         this._action.reset();
         this._action.setLoop(LoopOnce, 1);
         this._action.clampWhenFinished = true;
         this._action.crossFadeFrom(previousAction, 0.2, true);
         this._action.play();
      } else {
         this._action.play();
      }
   }


   finished() {
      this.cleanup();
      this.parent.changeTo('idle');
   }


   cleanup() {
      if (this._action) {
         this._action.getMixer().removeEventListener('finished', this.finishedCallback);
         this._action = null;
      }
   }


   update(_, input, moving) {
      return;
   }


   exit() {
      this.cleanup();
   }

}



export class MeleeAttackState extends PlayerState {
   constructor(parent) {
      super(parent);

      this._action = null;

      this.finishedCallback = () => {
         this.finished();
      }

   }


   get name() {
      return 'meleeAttack'
   }


   enter(prevState) {
      this._action = this.parent.proxy.animations.get('slash').action;
      const mixer  = this._action.getMixer();
      mixer.addEventListener('finished', this.finishedCallback);

      this._action.reset();
      this._action.setLoop(LoopOnce, 1);

      if (prevState !== undefined && prevState.name.includes('Attack')) {
         const previousAction = this.parent.proxy.animations.get(prevState.name).action;

         this._action.clampWhenFinished = false;
         this._action.crossFadeFrom(previousAction, 0.2, true);
         this._action.play();
      } else {
         this._action.play();
      }
   }


   finished() {
      this.cleanup();
      this.parent.changeTo('idle');
   }


   cleanup() {
      if (this._action) {
         this._action.getMixer().removeEventListener('finished', this.finishedCallback);
         this._action = null;
      }
   }


   update(_, input, moving) {
      return;
   }


   exit() {
      this.cleanup();
   }

}



export class RollState extends PlayerState {
   constructor(parent) {
      super(parent);

      this._action = null;

      this.finishedCallback = () => {
         this.finished();
      }

   }


   get name() {
      return 'roll'
   }


   enter(prevState) {
      console.log('Enter State: Roll');

      this._action         = this.parent.proxy._animations.get('roll').action;
      const previousAction = this.parent.proxy.animations.get(prevState.name).action;

      if (prevState) {

      }

      this._action.reset()
      this._action.setLoop(LoopOnce, 1)
      this._action.clampWhenFinished = false
      this._action.crossFadeFrom(previousAction, 0.2, true)
      this._action.play()

   }


   cleanup() {
      if (this._action) {
         this._action.getMixer().removeEventListener('finished', this.finishedCallback);
         this._action = null;
      }
   }


   update(_, input, moving) {

      return;

   }


   exit() {
      this.cleanup();
   }

}



export class StunState extends PlayerState {
   constructor(parent) {
      super(parent);

      this._action = null;

      this.finishedCallback = () => {
         this.finished();
      }

   }


   get name() {
      return 'stun'
   }


   enter(prevState) {

   }


   update(_, input, moving) {

   }


   exit() {}

}
