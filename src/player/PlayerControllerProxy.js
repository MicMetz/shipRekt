/**
 * @author MicMetzger /
 */

class PlayerControllerProxy {
   constructor(animations, velocity) {
      this._animations = animations
   }


   get animations() {
      return this._animations;
   }


}



export default PlayerControllerProxy
