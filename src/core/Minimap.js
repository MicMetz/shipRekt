class Minimap {
   /**
    *
    * @param {world} world
    *
    * @param map {map}
    */
   constructor(world, map) {
      this._world      = world;
      this._map        = map ? map : null;
      this._visible    = true;
      this._fullScreen = false;


      document.addEventListener('keydown', this.toggle);

   }


   connect() {

   }


   disconnect() {

   }


   toggle(event) {
      switch (event.keyCode) {
         case 77: // m
            this.Full = !this._fullScreen;
            break;
      }
   }


   set Full(bool) {
      this._fullScreen = bool;
      if (this._fullScreen) {
         this.fullScreen();
      } else {
         this.minimize();
      }
   }


   fullScreen() {

   }


   minimize() {

   }


   hide() {

   }


   show() {

   }


   getPercentDiscovered() {

   }



}
