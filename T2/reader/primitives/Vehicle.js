class Vehicle extends CGFobject {
    constructor(scene) {
        super(scene);

        this.frontCP = [
            [
                [12.5, 0.0, 2.5, 1.0],
                [12.5, 2.5, 0.0, 1.0],
                [12.5, 0.0, -2.5, 1.0]
            ],
            [
                [13.5, 0.0, 2.35, 1.0],
                [13.5, 2.15, 0.0, 1.0],
                [13.5, 0.0, -2.35, 1.0]
            ],
            [
                [15.0, 0.0, 2.0, 1.0],
                [15.0, 2.0, 0.0, 1.0],
                [15.0, 0.0, -2.0, 1.0]
            ],
            [
                [16.5, 0.0, 1.0, 1.0],
                [16.5, 1.0, 0.0, 1.0],
                [16.5, 0.0, -1.0, 1.0]
            ],
            [
                [17.5, 0.0, 0.0, 1.0],
                [17.5, 0.0, 0.0, 1.0],
                [17.5, 0.0, 0.0, 1.0]
            ]
        ];

        this.front = new Patch(scene, 5, 3, 10, 10, this.frontCP);


        this.left_under_window_front_CP = [
            [
                [0.0, 0.0, 2.8, 1.0],
                [0.0, 0.2, 2.5, 1.0],
                [0.0, 0.4, 2.3, 1.0]
            ],
            [
                [5.0, 0.0, 3.0, 1.0],
                [5.0, 0.2, 2.8, 1.0],
                [5.0, 0.4, 2.5, 1.0]
            ],
            [
                [12.5, 0.0, 2.5, 1.0],
                [12.5, 0.2, 2.2, 1.0],
                [12.5, 0.4, 2.0, 1.0]
            ]
        ];

        this.left_under_window_back_CP = [
            [
                [-10.0, 0.0, 2.0, 1.0],
                [-10.0, 0.4, 1.5, 1.0],
                [-10.0, 0.6, 1.2, 1.0]
            ],
            [
                [-5.0, 0.0, 2.5, 1.0],
                [-5.0, 0.4, 2.0, 1.0],
                [-5.0, 0.6, 1.7, 1.0]
            ],
            [
                [0.5, 0.0, 2.8, 1.0],
                [0.5, 0.4, 2.3, 1.0],
                [0.0, 0.7, 2.0, 1.0]
            ]
        ];

        this.left_under_window_front = new Patch(scene, 3, 3, 10, 10, this.left_under_window_front_CP);
        this.left_under_window_back = new Patch(scene, 3, 3, 10, 10, this.left_under_window_back_CP);

        this.right_under_window_front_CP = [
            [
                [0.0, 0.4, -2.3, 1.0],
                [0.0, 0.2, -2.5, 1.0],
                [0.0, 0.0, -2.8, 1.0]
            ],
            [
                [5.0, 0.4, -2.5, 1.0],
                [5.0, 0.2, -2.8, 1.0],
                [5.0, 0.0, -3.0, 1.0]
            ],
            [
                [12.5, 0.4, -2.0, 1.0],
                [12.5, 0.2, -2.2, 1.0],
                [12.5, 0.0, -2.5, 1.0]
            ]
        ];

        this.right_under_window_back_CP = [
            [
                [-10.0, 0.6, -1.2, 1.0],
                [-10.0, 0.4, -1.5, 1.0],
                [-10.0, 0.0, -2.0, 1.0]
            ],
            [
                [-5.0, 0.6, -1.7, 1.0],
                [-5.0, 0.4, -2.0, 1.0],
                [-5.0, 0.0, -2.5, 1.0]
            ],
            [
                [0.0, 0.7, -2.0, 1.0],
                [0.5, 0.4, -2.3, 1.0],
                [0.5, 0.0, -2.8, 1.0]
            ]
        ];

        this.right_under_window_front = new Patch(scene, 3, 3, 10, 10, this.right_under_window_front_CP);
        this.right_under_window_back = new Patch(scene, 3, 3, 10, 10, this.right_under_window_back_CP);

        this.window_front_CP = [
            [
                [0.35, 0.4, 2.3, 1.0],
                [0.35, 5.3, 0.0, 1.0],
                [0.35, 0.4, -2.3, 1.0]
            ],
            [
                [5, 0.4, 2.5, 1.0],
                [5, 5.0, 0.0, 1.0],
                [5, 0.4, -2.5, 1.0]
            ],
            [
                [12.5, 0.4, 2.0, 1.0],
                [12.5, 2.0, 0.0, 1.0],
                [12.5, 0.4, -2.0, 1.0]
            ]
        ];

        this.window_front = new Patch(scene, 3, 3, 20, 20, this.window_front_CP);

        this.window_middle_CP = [
            [
                [0.0, 0.7, 2.0, 1.0],
                [0.0, 5.0, 0.0, 1.0],
                [0.0, 0.7, -2.0, 1.0]
            ],
            [
                [0.35, 0.4, 2.3, 1.0],
                [0.35, 5.3, 0.0, 1.0],
                [0.35, 0.4, -2.3, 1.0]
            ]
        ];


        this.window_middle = new Patch(scene, 2, 3, 20,20, this.window_middle_CP);

        this.window_back_CP = [
            [
                [-10, 0.6, 1.2, 1.0],
                [-10, 3.0, 0.0, 1.0],
                [-10, 0.6, -1.2, 1.0]
            ],

            [
                [-2.5, 0.7, 1.9, 1.0],
                [-2.5, 4.0, 0.0, 1.0],
                [-2.5, 0.7, -1.9, 1.0]
            ],

            [
                [-2.0, 0.4, 2.0, 1.0],
                [-2.0, 5.0, 0.0, 1.0],
                [-2.0, 0.4, -2.0, 1.0]
            ],
            [
                [0.0, 0.7, 2.0, 1.0],
                [0.0, 5.0, 0.0, 1.0],
                [0.0, 0.7, -2.0, 1.0]
            ]
        ];

        this.window_back = new Patch(scene, 4, 3, 20, 20, this.window_back_CP);

        this.bottom_CP = [
            [
                [-10, 0.0, -2.0, 1.0],
                [-10, -2.0, 0.0, 1.0],
                [-10, 0.0, 2.0, 1.0]
            ],

            [
                [-2.5, 0.0, -2.5, 1.0],
                [-2.5, -2.0, 0.0, 1.0],
                [-2.5, 0.0, 2.5, 1.0]
            ],

            [
                [-2.0, 0.0, -2.8, 1.0],
                [-2.0, -3.0, 0.0, 1.0],
                [-2.0, 0.0, 2.8, 1.0]
            ],
            [
                [0.0, 0.0, -2.8, 1.0],
                [0.0, -3.0, 0.0, 1.0],
                [0.0, 0.0, 2.8, 1.0]
            ],
            [
                [5, 0.0, -3.0, 1.0],
                [5, -3.0, 0.0, 1.0],
                [5, 0.0, 3.0, 1.0]
            ],
            [
                [12.5, 0.0, -2.5, 1.0],
                [12.5, -2.0, 0.0, 1.0],
                [12.5, 0.0, 2.5, 1.0]
            ],
            [
                [13.5, 0.0, -2.35, 1.0],
                [13.5, -2.0, 0.0, 1.0],
                [13.5, 0.0, 2.35, 1.0]
            ],
            [
                [15.0, 0.0, -2.0, 1.0],
                [15.0, -2.0, 0.0, 1.0],
                [15.0, 0.0, 2.0, 1.0]
            ],
            [
                [16.5, 0.0, -1.0, 1.0],
                [16.5, -1.0, 0.0, 1.0],
                [16.5, 0.0, 1.0, 1.0]
            ],
            [
                [17.5, 0.0, 0.0, 1.0],
                [17.5, 0.0, 0.0, 1.0],
                [17.5, 0.0, 0.0, 1.0]
            ]
        ];

        this.bottom = new Patch(scene, 10, 3, 20, 20, this.bottom_CP);

        this.top_frame_CP = [
            [
                [-10.0, 0.6, 1.2, 1.0],
                [-10.0, 3.0, 0.0, 1.0],
                [-10.0, 0.6, -1.2, 1.0]
            ],

            [
                [-7.5, 2.0, 1.5, 1.0],
                [-7.5, 2.1, 0.0, 1.0],
                [-7.5, 2.0, -1.5, 1.0]
            ],
            [
                [-5.0, 2.1, 1.5, 1.0],
                [-5.0, 2.2, 0.0, 1.0],
                [-5.0, 2.1, -1.5, 1.0]
            ],
            [
                [-2.5, 2.3, 0.5, 1.0],
                [-2.5, 2.4, 0.0, 1.0],
                [-2.5, 2.3, -0.5, 1.0]
            ],
            [
                [0.0, 3.1, 0.5, 1.0],
                [0.0, 3.4, 0.0, 1.0],
                [0.0, 3.1, -0.5, 1.0]
            ],
            [
                [0.35, 3.1, 0.5, 1.0],
                [0.35, 3.4, 0.0, 1.0],
                [0.35, 3.1, -0.5, 1.0]
            ],
            [
                [5, 2.7, 0.5, 1.0],
                [5, 3.0, 0.0, 1.0],
                [5, 2.7, -0.5, 1.0]
            ],
            [
                [12.5, 1.2, 0.25, 1.0],
                [12.5, 1.3, 0.0, 1.0],
                [12.5, 1.2, -0.25, 1.0]
            ]
        ];

        this.top_frame = new Patch(scene, 8, 3, 20, 20, this.top_frame_CP);

        this.fin_CP = [
            [
                [-10.0, 1.0, -1.0, 1.0],
                [-6.5, 2.0, -1.0, 1.0],
                [-3.5, 2.5, 0.0, 1.0],
                [-6.5, 2.0, 1.0, 1.0],
                [-10.0, 1.0, 1.0, 1.0]
            ],
            [
                [-9.5, 1.5, -0.25, 1.0],
                [-7.0, 2.5, -0.25, 1.0],
                [-4.0, 3.0, 0.0, 1.0],
                [-7.0, 2.5, 0.25, 1.0],
                [-9.5, 1.5, 0.25, 1.0]
            ],
            [
                [-9.5, 2.0, -0.25, 1.0],
                [-7.0, 3.5, -0.25, 1.0],
                [-4.5, 3.5, 0, 1.0],
                [-7.0, 3.5, 0.25, 1.0],
                [-9.5, 2.0, 0.25, 1.0]
            ],
            [
                [-9.25, 2.5, -0.25, 1.0],
                [-7.25, 3.5, -0.25, 1.0],
                [-4.9, 4.0, 0, 1.0],
                [-7.25, 3.5, 0.25, 1.0],
                [-9.25, 2.5, 0.25, 1.0]
            ],
            [
                [-9.25, 2.9, -0.25, 1.0],
                [-7.25, 3.9, -0.25, 1.0],
                [-5.5, 4.4, 0, 1.0],
                [-7.5, 3.9, 0.25, 1.0],
                [-9.25, 2.9, 0.25, 1.0]
            ],
            [
                [-9.0, 3.5, -0.25, 1.0],
                [-7.5, 4.5, -0.25, 1.0],
                [-6.0, 5.0, 0, 1.0],
                [-7.5, 4.5, 0.25, 1.0],
                [-9.0, 3.5, 0.25, 1.0]
            ],
            [
                [-9.0, 4.2, -0.25, 1.0],
                [-7.5, 4.7, -0.25, 1.0],
                [-6.5, 5.2, 0, 1.0],
                [-7.5, 4.7, 0.25, 1.0],
                [-9.0, 4.2, 0.25, 1.0]
            ]
        ];

        this.fin = new Patch(scene, 7, 5, 20, 20, this.fin_CP);

        this.fin_top_CP = [
            [
                [-9.0, 4.2, 0.25, 1.0],                
                [-9.0, 4.2, -0.25, 1.0]
            ],
            [
                [-7.5, 4.7, 0.25, 1.0],
                [-7.5, 4.7, -0.25, 1.0]
            ],
            [
                [-7.3, 4.84, 0.01, 1.0],
                [-7.3, 4.84, -0.01, 1.0]
            ]
        ];

        this.fin_top = new Patch(scene,3 , 2, 20, 20 , this.fin_top_CP);

        this.fin_back_CP =  [
            [
                [-10.0, 1.0, 1.0, 1.0],
                [-10.0, 1.0, -1.0, 1.0]
            ],
            [
                [-9.5, 1.5, 0.25, 1.0],
                [-9.5, 1.5, -0.25, 1.0]
            ],
            [
                [-9.5, 2.0, 0.25, 1.0],
                [-9.5, 2.0, -0.25, 1.0]
            ],
            [
                [-9.25, 2.5, 0.25, 1.0],
                [-9.25, 2.5, -0.25, 1.0]
            ],
            [
                [-9.25, 2.9, 0.25, 1.0],
                [-9.25, 2.9, -0.25, 1.0]
            ],
            [
                [-9.0, 3.5, 0.25, 1.0],
                [-9.0, 3.5, -0.25, 1.0]
            ],
            [
                [-9.0, 4.2, 0.25, 1.0],
                [-9.0, 4.2, -0.25, 1.0]
            ]
        ];

        this.fin_back = new Patch(scene, 7, 2, 20, 20 , this.fin_back_CP);


        this.combustion_tube = new Cylinder2(scene, 2.5, 2.0, 5.0, 20, 20);

        this.initTextures();
    }

    initTextures() {
        this.windowTexture = new CGFappearance(this.scene);
        this.windowTexture.loadTexture("scenes/images/aliens.jpg");

        this.defaultTexture = new CGFappearance(this.scene);
    };

    display() {

        this.scene.pushMatrix()
            this.scene.rotate(-Math.PI/2,1,0,0);

            this.scene.pushMatrix();
            this.front.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.left_under_window_front.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.left_under_window_back.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.right_under_window_front.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.right_under_window_back.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.windowTexture.apply();
            this.window_back.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.defaultTexture.apply();
            this.window_middle.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.windowTexture.apply();
            this.window_front.display();
            this.scene.popMatrix();

            this.defaultTexture.apply();

            this.scene.pushMatrix();
            this.bottom.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(0, 0, 0);
            this.scene.rotate(-Math.PI / 2, 0, 1, 0);
            //this.combustion_tube.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(0,0,0);
            this.top_frame.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.fin.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.fin_top.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.fin_back.display();
            this.scene.popMatrix();
        
        this.scene.popMatrix();
    }
}