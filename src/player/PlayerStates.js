/**
 * @author MicMetzger /
 */

import {LoopOnce}  from "three";
import PlayerState from "./State.js";



export class IdleState extends PlayerState {
   constructor(parent) {
      super(parent);
   }


   get name() {
      return 'idle';
   }


   enter(prevState) {
      // console.log('Enter State: Idle');

      const idleAction = this.parent.proxy.animations.get('idle').action;

      if (prevState) {
         const prevAction = this.parent.proxy.animations.get(prevState.name).action;

         idleAction.time    = 0.0
         idleAction.enabled = true;

         idleAction.setEffectiveTimeScale(1.0)
         idleAction.setEffectiveWeight(1.0)
         idleAction.crossFadeFrom(prevAction, 0.5, true)
         idleAction.play()

      } else {
         idleAction.play()
      }
   }


   execute(_, input, moving) {
      // // console.log('Post-Execute State: Idle');

      // const {stateMachine} = this.parent.proxy.stateMachine;
      // // const input          = this.parent.proxy.world.controls.input;

      if (moving) {
         if (input.shift) {
            this.parent.changeTo('walk');
         } else {
            if (input.forward) {
               this.parent.changeTo('run');
            } else if (input.backward) {
               this.parent.changeTo('runBack');
            } else if (input.left) {
               this.parent.changeTo('runLeft');
            } else if (input.right) {
               this.parent.changeTo('runRight');
            }
         }

         return;
      }

      this.parent.changeTo('idle');
   }


   exit() {
      // console.log('Exit State: Idle');

      // const idleAction   = this.parent.proxy.animations.get('idle');
      // idleAction.enabled = false;
   }

}



export class WalkState extends PlayerState {
   constructor(parent) {
      super(parent);
   }


   get name() {
      return 'walk'
   }


   enter(prevState) {
      // console.log('Enter State: Walk');

      const walkAction     = this.parent.proxy.animations.get('walk').action;
      const previousAction = this.parent.proxy.animations.get(prevState.name).action;

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


   execute(_, input, moving) {
      // // console.log('Post-Execute State: Walk');

      // const {stateMachine} = this.parent.proxy.stateMachine;
      // const input          = this.parent.proxy.world.controls.input;

      if (!moving) {
         this.parent.changeTo('idle');
      }
      if (!input.shift && moving) {
         this.parent.changeTo('run');
      }

   }


   exit() {}

}



export class RunState extends PlayerState {
   constructor(parent) {
      super(parent);
   }


   get name() {
      return 'run'
   }


   enter(prevState) {
      const runAction      = this.parent.proxy.animations.get('run').action;
      const previousAction = this.parent.proxy.animations.get(prevState.name).action;

      if (prevState.name.includes('Attack')) {
         runAction.time = 0.0;

         runAction.crossFadeFrom(previousAction, 0.7, true);
      }

      runAction.enabled = true;
      runAction.play();
   }


   execute(_, input, moving) {
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


   exit() {
      // const runAction = this.parent.proxy.animations.get('run').action;
      // runAction.stop();
      // runAction.enabled = false;
   }

}



export class RunLeftState extends PlayerState {
   constructor(parent) {
      super(parent);
   }


   get name() {
      return 'runLeft'
   }


   enter(prevState) {
      // console.log('Enter State: Run Left');

      const runAction  = this.parent.proxy.animations.get('runLeft').action;
      const previousAction = this.parent.proxy.animations.get(prevState.name).action;

      if (prevState.name.includes('Attack')) {
         runAction.time = 0.0;

         runAction.crossFadeFrom(previousAction, 0.7, true);
      }

      runAction.enabled = true;
      runAction.play();
   }


   execute(_, input, moving) {
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


   exit() {
      // const runAction = this.parent.proxy.animations.get('runLeft').action;
      // runAction.stop();
      // runAction.enabled = false;

   }

}



export class RunRightState extends PlayerState {
   constructor(parent) {
      super(parent);
   }


   get name() {
      return 'runRight';
   }


   enter(prevState) {
      // console.log('Enter State: Run Right');

      const runAction      = this.parent.proxy.animations.get('runRight').action;
      const previousAction = this.parent.proxy.animations.get(prevState.name).action;

      if (prevState.name.includes('Attack')) {
         runAction.time = 0.0;

         runAction.crossFadeFrom(previousAction, 0.7, true);
      }

      runAction.enabled = true;
      runAction.play();


      // player.stateMachine.currentState = this;

   }


   execute(_, input, moving) {
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


   exit() {
      // const runAction = this.parent.proxy.animations.get('runRight').action;
      // runAction.stop();
      // runAction.enabled = false;
   }

}



export class RunBackState extends PlayerState {
   constructor(parent) {
      super(parent);
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


   execute(_, input, moving) {
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


   exit() {
      // const runAction = this.parent.proxy.animations.get('runBack').action;
      // runAction.stop();
      // runAction.enabled = false;
   }
}



export class ShootAttackState extends PlayerState {
   constructor(parent) {
      super(parent);
   }


   get name() {
      return 'shootAttack'
   }


   enter(prevState) {
      const currentAction = this.parent.proxy.animations.get('shoot').action;
      // const mixer = currentAction.getMixer()
      // mixer.addEventListener('finished', this.finish)

      if (prevState) {
         const previousAction = this.parent.proxy.animations.get(prevState.name).action;

         if (prevState.name.includes('run')) {
            this.parent.animations.stopAllAction();

            var fromAction = this.parent.proxy.animations.get(prevState.name).clip;
            var toAction   = this.parent.proxy.animations.get('shoot').clip;

            fromAction.crossFadeTo(toAction, 1, true);
            return;
         }

         currentAction.reset()
         currentAction.setLoop(LoopOnce, 1)
         currentAction.clampWhenFinished = true
         currentAction.crossFadeFrom(previousAction, 0.2, true)
         currentAction.play()
      } else {
         currentAction.play()
      }
   }


   execute(_, input, moving) {

   }


   exit() {}

}



export class MeleeAttackState extends PlayerState {
   constructor(parent) {
      super(parent);
   }


   get name() {
      return 'meleeAttack'
   }


   enter(prevState) {
      const currentAction = this.parent.proxy.animations.get('slash').action;
      currentAction.setLoop(LoopOnce, 1);
      currentAction.clampWhenFinished = false

      if (prevState) {
         const prevAction = this.parent.proxy.animations.get(prevState.name).action

         currentAction.enabled = true

         if (prevState.name === 'run' || prevState.name === 'runBack' || prevState.name === 'runLeft' || prevState.name === 'runRight' || prevState.name === 'walk') {
            currentAction.crossFadeTo(prevAction, 1, true)

         } else {
            currentAction.setEffectiveTimeScale(1.0)
            currentAction.setEffectiveWeight(1.0)
         }

         currentAction.play()
      } else {
         currentAction.play()
      }
   }


   execute(_, input, moving) {
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


   exit() {}

}



export class RollState extends PlayerState {
   constructor(parent) {
      super(parent);
   }


   get name() {
      return 'roll'
   }


   enter(prevState) {
      console.log('Enter State: Roll');

      const currentAction  = this.parent.proxy._animations.get('roll').action;
      const previousAction = this.parent.proxy.animations.get(prevState.name).action;

      if (prevState) {

      }

      currentAction.reset()
      currentAction.setLoop(LoopOnce, 1)
      currentAction.clampWhenFinished = false
      currentAction.crossFadeFrom(previousAction, 0.2, true)
      currentAction.play()

   }


   execute(_, input, moving) {


   }


   exit() {}

}



export class StunState extends PlayerState {
   constructor(parent) {
      super(parent);
   }


   get name() {
      return 'stun'
   }


   enter(prevState) {

   }


   execute(_, input, moving) {

   }


   exit() {}

}
