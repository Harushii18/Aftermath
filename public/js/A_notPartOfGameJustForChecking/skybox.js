
        // //set the scene's background-> in this case it is our skybox
        // const loader = new THREE.CubeTextureLoader();
        // //it uses different textures per face of cube
        // const texture = loader.load([
        //     '../skybox/House/posx.jpg',
        //     '../skybox/House/negx.jpg',
        //     '../skybox/House/posy.jpg',
        //     '../skybox/House/negy.jpg',
        //     '../skybox/House/posz.jpg',
        //     '../skybox/House/negz.jpg'
        // ]);
        // scene.background = texture;

        // var skybox_path = '../skybox/House/';
        // var urls = [
        //     skybox_path + 'posx.jpg',
        //     skybox_path + 'negx.jpg',
        //     skybox_path + 'posy.jpg',
        //     skybox_path + 'negy.jpg',
        //     skybox_path + 'posz.jpg',
        //     skybox_path + 'negz.jpg'
        // ];

        // var materialArray = [];
        // for (var i = 0; i < 6; i++){
        //     materialArray.push(new THREE.MeshBasicMaterial({
        //         map: THREE.ImageUtils.loadTexture(urls[i]),
        //         side: THREE.BackSide
        //     }));
        // }




        // //Experimenting with skybox
        // const textureLoader = new THREE.TextureLoader(loadingManager);

        // textureLoader.load('./skybox/moonless_golf.jpg', function (texture) {

        //     texture.encoding = THREE.sRGBEncoding;
        //     texture.mapping = THREE.EquirectangularReflectionMapping;

        //     scene.background = texture;

        // });

        //if we wanted it to be a colour, it would have been this commented code:
        //scene.background = new THREE.Color("#000");


        //WITH COLOURS
        //this.makeInstance(1, 0);

        
    // //determine color and map
    // get255BasedColor(color) {
    //     const tempColor = new THREE.Color();
    //     tempColor.set(color);
    //     return tempColor.toArray().map(v => v * 255);
    // }

    // makeRampTexture(stops) {
    //     // let's just always make the ramps 256x1
    //     const res = 256;
    //     const data = new Uint8Array(res * 3);
    //     const mixedColor = new THREE.Color();

    //     let prevX = 0;
    //     for (let ndx = 1; ndx < stops.length; ++ndx) {
    //         const nextX = Math.min(stops[ndx].position * res, res - 1);
    //         if (nextX > prevX) {
    //             const color0 = stops[ndx - 1].color;
    //             const color1 = stops[ndx].color;
    //             const diff = nextX - prevX;
    //             for (let x = prevX; x <= nextX; ++x) {
    //                 const u = (x - prevX) / diff;
    //                 mixedColor.copy(color0);
    //                 mixedColor.lerp(color1, u);
    //                 data.set(this.get255BasedColor(mixedColor), x * 3);
    //             }
    //         }
    //         prevX = nextX;
    //     }

    //     return new THREE.DataTexture(data, res, 1, THREE.RGBFormat);
    // }

    // //create cube with calculated texture and colour co-ords
    // makeInstance(scale, rot) {
    //     const texture = this.makeRampTexture([
    //         //colours for the textures
    //         { position: 0, color: new THREE.Color(0x0d182e), },
    //         { position: 0.5, color: new THREE.Color(0x284682), },
    //         { position: 1, color: new THREE.Color(0x0d182e), },
    //     ]);
    //     texture.repeat.set(1 / scale, 1 / scale);
    //     texture.rotation = rot;


    //     //create the skybox
    //     var skyGeometry = new THREE.BoxGeometry(200, 200, 200);
    //     const material = new THREE.MeshBasicMaterial({ map: texture, wireframe: false });
    
    //     /* Cause the material to be visible for inside and outside */
    //     material.side = THREE.BackSide;
    //     var skybox = new THREE.Mesh(skyGeometry, material);
    //     this.scene.add(skybox);


    // }