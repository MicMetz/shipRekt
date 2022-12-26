/**
 * @author MicMetzger /
 */

import PlayerState from "./State.js";



export class IdleState extends PlayerState {
   constructor(parent) {
      super(parent);
   }


   get name() {
      return 'idle';
   }


   enter(prevState) {
      console.log('Enter State: Idle');

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
      // console.log('Post-Execute State: Idle');

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
      console.log('Exit State: Idle');

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
      console.log('Enter State: Walk');

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
      // console.log('Post-Execute State: Walk');

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
      const currentAction = this.parent.proxy.animations.get('run').action

      if (prevState) {
         const prevAction = this.parent.proxy.animations.get(prevState.name).action

         currentAction.enabled = true

         if (prevState.name === 'walk') {
            const ratio        =
                    currentAction.getClip().duration / prevAction.getClip().duration
            currentAction.time = prevAction.time * ratio
         } else {
            currentAction.time = 0.0
            currentAction.setEffectiveTimeScale(1.0)
            currentAction.setEffectiveWeight(1.0)
         }

         currentAction.crossFadeFrom(prevAction, 0.5, true)
         currentAction.play()
      } else {
         currentAction.play()
      }
   }


   execute(_, input, moving) {
      if (input.forward || input.backward) {
         if (input.shift) {
            this.parent.changeTo('walk')
         }
      } else {
         if (input.backward) {
            this.parent.changeTo('runBack')
         } else {
            this.parent.changeTo('run')
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



export class RunLeftState extends PlayerState {
   constructor(parent) {
      super(parent);
   }


   get name() {
      return 'runLeft'
   }


   enter(prevState) {
      console.log('Enter State: Run Left');

      const runLeftAction  = this.parent.proxy.animations.get('runLeft').action;
      const previousAction = this.parent.proxy.animations.get(prevState.name).action;

      runLeftAction.enabled = true;
      runLeftAction.play();
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



export class RunRightState extends PlayerState {
   constructor(player) {
      super(player);
   }


   get name() {
      return 'runRight';
   }


   enter(prevState) {
      console.log('Enter State: Run Right');

      const runAction      = this.parent.proxy.animations.get('runRight').action;
      const previousAction = this.parent.proxy.animations.get(prevState.name).action;

      // runAction.time    = 0.0;
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


   exit() {}

}



export class RunBackState extends PlayerState {
   constructor(player) {
      super(parent);
      this.parent.proxy = player;
   }


   get name() {
      return 'runBack'
   }


   enter(prevState) {
      console.log('Enter State: runBack');

      const runAction      = this.parent.proxy.animations.get('runBack').action;
      const previousAction = this.parent.proxy.animations.get(prevState.name).action;

      runAction.time    = 0.0;
      runAction.enabled = true;

      runAction.play();
      // player.stateMachine.currentState = this;

   }


   execute(_, input, moving) {
      console.log('Post-Execute State: Run Back');

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



export class ShootAttackState extends PlayerState {
   constructor(parent) {
      super(parent);
   }


   get name() {
      return 'shootAttack'
   }


   enter(prevState) {

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

   }


   execute(_, input, moving) {

   }


   exit() {}

}



export class JumpState extends PlayerState {
   constructor(parent) {
      super(parent);
   }


   get name() {
      return 'jump'
   }


   enter(prevState) {

   }


   execute(_, input, moving) {

   }


   exit() {}

}



export class FallState extends PlayerState {
   constructor(parent) {
      super(parent);
   }


   get name() {
      return 'fall'
   }


   enter(prevState) {

   }


   execute(_, input, moving) {

   }


   exit() {}

}
