/**
 * @author MicMetzger /
 */

import {GameEntity} from "yuka";



class Item extends GameEntity {
   constructor(world, name, type) {
      super();
      this.name        = name;
      this.type        = type[0];
      this.description = world.assetManager.descriptors.get(this.type, this.name);
   }


   applyTo(entity) {/* apply the item to the given entity */}

}



export {Item};
