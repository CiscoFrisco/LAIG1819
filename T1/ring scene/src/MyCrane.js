/**
 * MyCrane
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCrane extends CGFobject {
        /**
         * Builds a MyCrane object
         * 
         * @param {CGFscene} scene CGFscene
         * @param {Number} initAngle initial angle of the Crane relative to the origin
         * @param {String} initPos initial position of the Crane (deposit or recovery)
         */
        constructor(scene, initAngle, initPos) {
                super(scene);

                this.cylinder = new MyCylinderCovered(scene, 20, 20);

                this.velY = 0;
                this.gravity = 1;
                this.dt = 0.001;

                //Rotation angles for default and grab states
                this.maxDownAngle = Math.PI / 5;
                this.maxUpAngle = -0.5;

                //Rotation angles for recovery and deposit platforms
                this.RAngle = 0.0;
                this.DAngle = Math.PI;

                this.angleY = initPos == 'D' ? Math.PI : 0;
                this.initAngle = initAngle == 'UP' ? this.maxUpAngle : this.maxDownAngle;
                this.angleX = this.initAngle;

                this.zephyrTexture = new CGFappearance(this.scene);
                this.zephyrTexture.loadTexture("../resources/images/mrzephyr.png");

                this.vel = 0.001;

                this.state = 'DEF';
        }

        /**
         * Displays this object
         */
        display() {
                this.zephyrTexture.apply();

                this.scene.pushMatrix();
                this.scene.rotate(this.angleY, 0, 1, 0);

                //base
                this.scene.pushMatrix();
                this.scene.rotate(-Math.PI / 2, 1, 0, 0);
                this.scene.scale(2, 2, 1);
                this.cylinder.display();
                this.scene.popMatrix();

                //big arm
                this.scene.pushMatrix();
                this.scene.rotate(-Math.PI / 3, 1, 0, 0);
                this.scene.translate(0, 0.5, 0.5);
                this.scene.scale(0.7, 0.7, 15);
                this.cylinder.display();
                this.scene.popMatrix();

                //joint
                this.scene.pushMatrix();
                this.scene.translate(-0.8, 14, 7.5);
                this.scene.rotate(Math.PI / 2, 0, 1, 0);
                this.scene.scale(1.5, 1.5, 1.5);
                this.cylinder.display();
                this.scene.popMatrix();

                this.scene.pushMatrix()

                this.scene.translate(0, 14, 8.0);

                //small arm
                this.scene.pushMatrix();
                this.scene.rotate(this.angleX, 1, 0, 0);
                this.scene.scale(0.5, 0.6, 11.9);
                this.cylinder.display();
                this.scene.popMatrix();

                //nathan summers
                this.scene.pushMatrix();
                this.scene.translate(0, -Math.sin(this.angleX) * 11.4, Math.cos(this.angleX) * 11.4);
                this.scene.scale(0.1, 6, 0.1)
                this.scene.rotate(Math.PI / 2, 1, 0, 0);
                this.cylinder.display();
                this.scene.popMatrix();

                //magneto
                this.scene.pushMatrix();
                this.scene.translate(0.1, -Math.sin(this.angleX) * 11.4 - 6.0, Math.cos(this.angleX) * 11.4);
                this.scene.rotate(-Math.PI / 2, 1, 0, 0);
                this.scene.scale(3, 3, 0.4);
                this.cylinder.display();
                this.scene.popMatrix();

                //Displays the car if it is attached
                if (this.scene.car.attached) {
                        this.scene.pushMatrix();
                        this.scene.translate(0.1, -Math.sin(this.angleX) * 11.4 - 6.7 - this.scene.car.centerY, Math.cos(this.angleX) * 11.4);
                        this.scene.rotate(this.scene.car.angleCar, 0, 1, 0);
                        this.scene.car.display();
                        this.scene.popMatrix();
                }

                this.scene.popMatrix();

                this.scene.popMatrix();

                this.scene.materialDefault.apply();
        }

        /**
         * Updates the crane's variables, according to its state.
         * In DEF, it doesn't do anything.
         * In GRAB, it rotates towards the R position, and lowers its arm in order to grab the car.
         * In MOVE, it does the inverse, thus moving the car towards the D position.
         * In DROP, it disattaches the car, letting it drop towards the ground with acceleration.
         * 
         * @param {Number} deltaTime time period after the last update
         */
        update(deltaTime) {
                switch (this.state) {
                        case 'GRAB':
                                //Rotate towards R platform
                                if (this.angleY >= this.RAngle)
                                        this.angleY -= deltaTime * this.vel;
                                //Lower the arm
                                else if (this.angleX <= this.maxDownAngle)
                                        this.angleX += deltaTime * this.vel;
                                else {
                                        this.scene.car.attached = true;
                                        this.state = 'MOVE';
                                }
                                break;
                        case 'MOVE':
                                //Lift the arm and car
                                if (this.angleX >= this.maxUpAngle)
                                        this.angleX -= deltaTime * this.vel;
                                //Rotate towards D platform
                                else if (this.angleY <= this.DAngle)
                                        this.angleY += deltaTime * this.vel;
                                //Update car's attributes
                                else {
                                        //TODO: too hardcoded?
                                        this.state = 'DROP';
                                        this.scene.car.attached = false;
                                        this.scene.car.centerX = 0.1;
                                        this.scene.car.centerY = 14.3;
                                        this.scene.car.centerZ = -this.scene.planeZ;
                                        this.scene.car.angleCar += this.angleY;
                                        this.scene.car.vel = 0;
                                }

                                break;
                        case 'DROP':
                                //Drop the car
                                this.velY += this.gravity * this.dt;
                                if (this.scene.car.centerY >= 1.8)
                                        this.scene.car.centerY -= deltaTime * this.velY;
                                else {
                                        this.state = 'DEF';
                                        this.scene.car.controlOn = true;
                                        this.velY = 0;
                                }
                        default:
                                break;
                }
        }
};