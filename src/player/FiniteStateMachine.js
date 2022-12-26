/**
 * @author MicMetzger /
 */

class FiniteStateMachine {
   constructor() {
      this.states       = {};
      this.currentState = null
   }


   addState(name, type) {
      this.states[name] = type;
   }


   changeTo(id) {

      const state = this.states[id];

      this._change(state);

      return this;

   }


   _change(state) {

      this.previousState = this.currentState;

      if (this.currentState !== null) {

         this.currentState.exit();

      }

      this.currentState = state;

      this.currentState.enter(this.previousState);

   }



   update(timeElapsed, input, moving) {
      this.currentState?.execute(timeElapsed, input, moving);
   }
}



export default FiniteStateMachine
