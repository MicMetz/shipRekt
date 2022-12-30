import {Color, Geometry, Group, Object3D, Points, PointsMaterial} from "three";



class EnvironmentManager {
   constructor(world) {
      this._world          = world;
      this._props          = [];
      this._environmentmap = new Map();
      this._floorModel     = null;
      this._wallModel      = null;

      this._rooms = new Group();

      this._stargeometry = new Geometry();
      this._stars        = new Points();

      this._options = {
         type       : 'default',
         constraints: {
            minX: 0,
            maxX: 0,
            x   : 0,

            minZ: 0,
            maxZ: 0,
            z   : 0
         },


      };

   }


   generateRooms(count) {

   }


   generateBackground() {
      this._world.scene.background = new Color(0x030303);

      for (var i = 0; i < 8000; i++) {
         var star = new Object3D();
         star.x   = Math.randFloat(-200, 200);
         star.y   = Math.randFloat(-75, -50);
         star.z   = Math.randFloat(-200, 200);

         star.scale.set(1, 1, 1).multiplyScalar(Math.random());
         // star.updateMatrix();
         star.updateMatrixWorld();

         star.velocity     = 0;
         star.acceleration = 0.002;
         this._stargeometry.vertices.push(star);
      }

      let sprite       = this._world.assetManager.textures.get('star');
      let starMaterial = new PointsMaterial({
         color: 0xaaaaaa,
         size : 0.7,
         map  : sprite,
      });
      this.stars       = new Points(this._stargeometry, starMaterial);

      this._world.scene.add(this.stars);
   }



}
