class Cylinder2 extends CGFobject {
   	constructor(scene, base, top, height, slices, stacks) {
   	    super(scene);

   	    this.base = base;
   	    this.top = top;
   	    this.height = height;
   	    this.slices = slices;
		this.stacks = stacks;
		
		this.nPointsU = 2;
		this.nPointsV = this.slices;

		this.initControlPoints();
		console.log(this.nPointsV);
		console.log(this.controlPoints);
		var nurbsSurface = new CGFnurbsSurface(this.nPointsU - 1, this.nPointsV - 1, this.controlPoints);
		this.obj = new CGFnurbsObject(this.scene, this.stacks, this.slices, nurbsSurface);
	   };
	   
	   display(){
		   this.obj.display();
	   }


	   initControlPoints(){

		var allControlPoints = [];
		var inc = (this.base - this.top)/(this.nPointsU - 1);
		var angInc = 2*Math.PI/(this.slices - 1);
		var ang = 2*Math.PI;
		var radius = this.top;
		var z = 0;
		var zInc = this.height/(this.nPointsU - 1);

		for(let u = 0; u < this.nPointsU; u++){
			var controlPointsU = [];
			for(let j = 0; j < this.nPointsV; j++){
				controlPointsU.push([Math.cos(ang)*radius, Math.sin(ang)*radius, z, 1]);
				ang -= angInc;
			}
		  allControlPoints.push(controlPointsU);
		  ang = 2*Math.PI;
		  radius += inc;
		  z+=zInc;
		}

		this.controlPoints = allControlPoints;
	   }

}