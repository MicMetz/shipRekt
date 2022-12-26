/**
 * @author MicMetzger /
 */

import {Item} from "./Item.js";



class WeaponItem extends Item {

   constructor(world, parent, name, type, ammunition) {
      super(world, name, type);

      this.parent     = parent;
      this.ammunition = ammunition;
      this.weaponType = type[1];
      this.applyTo(this.parent);


   }


   applyTo(entity) {

      if (!entity.weapon) {
         entity.weapon = this;
      } else {
         entity.equipment.push(this);
      }

      return this;

   }
}
