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
		var nurbsSurface = new CGFnurbsSurface(this.nPointsU - 1, this.nPointsV, this.controlPoints);
		this.obj = new CGFnurbsObject(this.scene, this.stacks, this.slices, nurbsSurface);
	   };
	   
	   display(){
		   this.obj.display();
	   }

	   initControlPoints(){
		var weights = [1, Math.sqrt(2)/2, 1, Math.sqrt(2)/2, 1, Math.sqrt(2)/2, 1, Math.sqrt(2)/2, 1,
					   1, Math.sqrt(2)/2, 1, Math.sqrt(2)/2, 1, Math.sqrt(2)/2, 1, Math.sqrt(2)/2, 1];
		var controlPoints = [[1,0,0], [1,1,0], [0,1,0], [-1,1,0], [-1,0,0], [-1,-1,0], [0, -1, 0], [1, -1, 0], [1,0,0],
							 [1,0,1], [1,1,1], [0,1,1], [-1,1,1], [-1,0,1], [-1,-1,1], [0, -1, 1], [1, -1, 1], [1,0,1]];
		var allControlPoints = [];
		// var radius = this.base;
		// var final_radius = this.top;
		// var ang = 2*Math.PI;
		// var angInc = 2*Math.PI/(this.slices);
		// console.log(angInc*180/Math.PI);
		// var z = 0;
		// var final_z = this.height;
		// for(let u = 0; u < this.nPointsU; u++){
		// 	var controlPointsU = [];
		// 	for(let j = 0; j <= this.nPointsV; j++){
		// 		var ok = j == 1 ?  : 1;
		// 		controlPointsU.push([]);
		// 		ang -= angInc;
		// 	}
		  
		// 	allControlPoints.push(controlPointsU);
		//   	ang = 2*Math.PI;
		//   	radius = final_radius;
		//   	z = final_z;
		// }

		var count = 0;
		for(let i = 0; i < this.nPointsU; i++){
			var controlPointsU = [];
			for(let j = 0; j < 9; j++){
				console.log(count, j);
				controlPointsU.push([controlPoints[count][0],controlPoints[count][1], controlPoints[count][2], weights[count]]);
				count++;
			}

			allControlPoints.push(controlPointsU);
		}

		this.controlPoints = allControlPoints;
		console.log(this.controlPoints);
	   }

	  

}