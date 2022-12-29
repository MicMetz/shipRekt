/**
 * @author MicMetzger /
 */

import {Scene}           from "three";
import {EventDispatcher} from "yuka";
import {CONFIG}          from "../etc/Utilities";



class InterfaceManager {
   /**
    * Constructs a new UI manager.
    *
    * @param {World} world - A reference to the world.
    */
   constructor(world) {

      this.world       = world;
      this.currentTime = 0;

      this.outDamageIndicatorTime     = CONFIG.UI.CROSSHAIR.HIT_OUT_TIME;
      this.endTimeOutDamageIndication = Infinity;

      this.inDamageIndicatorTime     = CONFIG.UI.DAMAGE_INDICATOR.HIT_IN_TIME;
      this.endTimeInDamageIndication = Infinity;

      this.ui = {
         uiHealth     : document.getElementById("uiHealth"),
         uiAmmo       : document.getElementById("uiAmmo"),
         uiNade       : document.getElementById("uiNadeList"),
         ammo         : document.getElementById("ammo"),
         ammoRemaining: document.getElementById("ammoRemaining"),
         health       : document.getElementById("health"),
         nades        : document.getElementById("nades"),
      }

      this.sprites = {
         crosshair: null,
         indicator: null,
      }

      this.scene = new Scene();

   }



   /**
    * Updates the UI.
    *
    * @param {number} delta - The time delta.
    * @return {UIManager} A reference to this UI manager.
    */
   update(delta) {

      this.currentTime += delta;

      if (this.currentTime >= this.endTimeOutDamageIndication) {

         this._hideOutDamageIndication();

      }

   }


   _hideOutDamageIndication() {

      this.sprites.crosshair.material.color.setHex(0xffffff);
      this.endTimeOutDamageIndication = Infinity;

      return this;

   }


   _hideInDamageIndication() {

      this.sprites.indicator.material.opacity = 0;
      this.endTimeInDamageIndication          = Infinity;

      return this;

   }


   _showInDamageIndication() {

      this.sprites.indicator.visible = true;
      this.endTimeInDamageIndication = this.currentTime + this.inDamageIndicatorTime;

      return this;

   }


   _showOutDamageIndication() {

      this.sprites.crosshair.material.color.setHex(0xff0000);
      this.endTimeOutDamageIndication = this.currentTime + this.outDamageIndicatorTime;

      return this;

   }


   /**
    *
    */
   _setSizes() {

   }


   _updateHealthStatus() {

      const player = this.world.player;

      this.ui.health.textContent = player.health;

      return this;

   }


   _updateAmmoStatus() {

      const player = this.world.player;
      const weapon = player.weaponSystem.currentWeapon;

      this.ui.uiAmmo.textContent = weapon.ammoRemaining;
      this.ui.ammo.textContent   = weapon.ammo;

      return this;

   }


   _updateLevelStatus() {

   }


   _updateMapStatus() {

   }


   _hideInterface() {

      this.ui.uiHealth.classList.add("hidden");
      this.ui.uiAmmo.classList.add("hidden");
      this.ui.uiNade.classList.add("hidden");

      this.sprites.crosshair.visible = false;
      this.sprites.indicator.visible = false;

      return this;

   }


   _showInterface() {

      this.ui.uiHealth.classList.remove("hidden");
      this.ui.uiAmmo.classList.remove("hidden");
      this.ui.uiNade.classList.remove("hidden");

      // this.sprites.crosshair.visible = true;

      this._updateHealthStatus();
      this._updateAmmoStatus();

      return this;

   }

}



export {InterfaceManager};
