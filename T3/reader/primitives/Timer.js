class Timer extends CGFobject {
    constructor(scene, maxTime, numbers){
        super(scene);

        this.maxTime = maxTime;

        this.numbers = numbers;
        this.time = maxTime;
        this.elapsedTime = this.maxTime * 1000;
        this.base = new MyQuad(this.scene, -0.5, -0.5, 0.5, 0.5);
    }

    display(){
        let units = this.time % 10;
        let dozens = Math.floor(this.time / 10);
        this.scene.pushMatrix();
        this.numbers[dozens].bind();
        this.scene.scale(5,5,1);
        this.base.display();
        this.numbers[dozens].unbind();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.numbers[units].bind();
        this.scene.translate(5,0,0);
        this.scene.scale(5,5,1);
        this.base.display();
        this.numbers[units].unbind();
        this.scene.popMatrix();
    }

    resetTimer(){
        this.time = this.maxTime;
        this.elapsedTime = this.maxTime * 1000;
    }

    update(deltaTime){
        this.elapsedTime-=deltaTime;

        this.time = Math.floor(this.elapsedTime / 1000);
        
        if(this.time == 0){
            this.resetTimer();
        }
    }
}