/**
 * @author MicMetzger /
 */

import FiniteStateMachine from './FiniteStateMachine'
import {RunState}         from './PlayerStates';
import {WalkState}        from './PlayerStates';
import {IdleState}        from './PlayerStates';
import {JumpState}        from './PlayerStates';
import {FallState}        from './PlayerStates';
import {ShootAttackState} from './PlayerStates';
import {MeleeAttackState} from './PlayerStates';
import {RunBackState}     from './PlayerStates';
import {RunLeftState}     from './PlayerStates';
import {RunRightState}    from './PlayerStates';



class PlayerProxy extends FiniteStateMachine {
   constructor(proxy) {
      super()
      this.proxy = proxy

      this.addState('idle', new IdleState(this));
      this.addState('walk', new WalkState(this));
      this.addState('run', new RunState(this));
      this.addState('runBack', new RunBackState(this));
      this.addState('runLeft', new RunLeftState(this));
      this.addState('runRight', new RunRightState(this));
      this.addState('jump', new JumpState(this));
      this.addState('fall', new FallState(this));
      this.addState('shootAttack', new ShootAttackState(this));
      this.addState('meleeAttack', new MeleeAttackState(this));
   }
}



export default PlayerProxy
