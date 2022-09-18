import * as THREE from 'https://cdn.skypack.dev/three';
import * as ThreeMeshUI from 'https://cdn.skypack.dev/three-mesh-ui';
import {VRButton} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/webxr/VRButton.js';
import {BoxLineGeometry} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/geometries/BoxLineGeometry.js';

// console.log(threeStdlib)
let camera, scene, renderer;
let controller1, controller2;
let controllerGrip1, controllerGrip2;

let room, room2, button, button2;

let count = 0;
const radius = 0.08;
let normal = new THREE.Vector3();
const relativeVelocity = new THREE.Vector3();

const clock = new THREE.Clock();
let isRoom1 = true;

init();

const serverWs = new WebSocket("wss://13fe-2620-101-f000-700-a857-7b6d-4b89-f2a9.ngrok.io/");

serverWs.onopen = () => {
    console.log("Server connection open!");

    // titleText.setAttribute('text',3 {
    //     value: "Connected!"
    // });
};

serverWs.onmessage = (event) => {
    // const titleText = document.querySelector('#title-text');
    const data = JSON.parse(event.data);
    // console.log("Server message:", data);

    if (data.type === "gaze") {
        // titleText.setAttribute('text', {
        //     value: Math.round(data.x)
        // }); 

        // const gazeBall = document.querySelector('#gaze-tracker');
        // gazeBall.setAttribute('position', `${data.x} ${data.y} -1`);
    } else if (data.type === "blink") {
        console.log("Blink event detected!");
        isRoom1 = ! isRoom1;

        if (isRoom1) {
            // camera.position.set(0, 1.6, 3);
            room.position.set( 0, 3, 0 );
            room2.position.set( 10, 3, 0 );
            button.position.set(0, -1, -1);
            button2.position.set(10, -1, -1);
            // room.geometry.translate( -10, 3, 0 );
            // room2.geometry.translate( 10, 3, 0 );
        } else {
            // camera.position.set(10, 1.6, 3);
            room.position.set( 10, 3, 0 );
            room2.position.set( 0, 3, 0 );
            button.position.set(10, -1, -1);
            button2.position.set(0.5, -1, -1);
            // room.geometry.translate( 10, 3, 0 );
            // room2.geometry.translate( -10, 3, 0 );
        };
    }
};

animate();

function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x505050 );

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
    camera.position.set( 0, 1.6, 3 );
    // can change ******************************************************
    room = new THREE.LineSegments(
        new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ),
        new THREE.LineBasicMaterial( { color: 0xff0000 } )
    );
    // room.geometry.translate( 0, 3, 0 );
    // room.geometry.translate( 0, 3, 0 );
    scene.add( room );

    room2 = new THREE.LineSegments(
        new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ),
        new THREE.LineBasicMaterial( { color: 0x00ff00 } )
    );
    // room2.geometry.translate( 10, 3, 0 );

    room.position.set( 0, 3, 0 );
    room2.position.set( 10, 3, 0 );

    scene.add( room2 );

    
    scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

    const light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 ).normalize();
    scene.add( light );

    const geometry = new THREE.IcosahedronGeometry( radius, 3 );
    button = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0xffffff } ) );
    button.position.set( 0, -1, -1);
    room.add(button);

    const buttonOptions = {
		width: 0.4,
		height: 0.15,
		justifyContent: 'center',
		offset: 0.05,
		margin: 0.02,
		borderRadius: 0.075
	};

    const hoveredStateAttributes = {
		state: 'hovered',
		attributes: {
			offset: 0.035,
			backgroundColor: new THREE.Color( 0x999999 ),
			backgroundOpacity: 1,
			fontColor: new THREE.Color( 0xffffff )
		},
	};

	const idleStateAttributes = {
		state: 'idle',
		attributes: {
			offset: 0.035,
			backgroundColor: new THREE.Color( 0x666666 ),
			backgroundOpacity: 0.3,
			fontColor: new THREE.Color( 0xffffff )
		},
	};
    

    const buttonFirst = new ThreeMeshUI.Block( buttonOptions );

    buttonFirst.add(
		new ThreeMeshUI.Text( { content: 'first' } )
	);

    button2 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0xff0000 } ) );
    button2.position.set( 10, -1, -1);
    room2.add(button2);

    // for ( let i = 0; i < 200; i ++ ) {

    //     const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

    //     object.position.x = Math.random() * 4 - 2;
    //     object.position.y = Math.random() * 4;
    //     object.position.z = Math.random() * 4 - 2;

    //     object.userData.velocity = new THREE.Vector3();
    //     object.userData.velocity.x = Math.random() * 0.01 - 0.005;
    //     object.userData.velocity.y = Math.random() * 0.01 - 0.005;
    //     object.userData.velocity.z = Math.random() * 0.01 - 0.005;

    //     room.add( object );

    // }
    //********************************************************** */

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.xr.enabled = true;
    document.body.appendChild( renderer.domElement );

    //

    document.body.appendChild( VRButton.createButton( renderer ) );

    // controllers

    function onSelectStart() {

        this.userData.isSelecting = true;

    }

    function onSelectEnd() {

        this.userData.isSelecting = false;

    }

    controller1 = renderer.xr.getController( 0 );
    controller1.addEventListener( 'selectstart', onSelectStart );
    controller1.addEventListener( 'selectend', onSelectEnd );
    controller1.addEventListener( 'connected', function ( event ) {

        this.add( buildController( event.data ) );

    } );
    controller1.addEventListener( 'disconnected', function () {

        this.remove( this.children[ 0 ] );

    } );
    scene.add( controller1 );

    controller2 = renderer.xr.getController( 1 );
    controller2.addEventListener( 'selectstart', onSelectStart );
    controller2.addEventListener( 'selectend', onSelectEnd );
    controller2.addEventListener( 'connected', function ( event ) {

        this.add( buildController( event.data ) );

    } );
    controller2.addEventListener( 'disconnected', function () {

        this.remove( this.children[ 0 ] );

    } );
    scene.add( controller2 );

    // The XRControllerModelFactory will automatically fetch controller models
    // that match what the user is holding as closely as possible. The models
    // should be attached to the object returned from getControllerGrip in
    // order to match the orientation of the held device.

    // const controllerModelFactory = new XRControllerModelFactory();

    // controllerGrip1 = renderer.xr.getControllerGrip( 0 );
    // controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
    // scene.add( controllerGrip1 );

    // controllerGrip2 = renderer.xr.getControllerGrip( 1 );
    // controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
    // scene.add( controllerGrip2 );

    //

    window.addEventListener( 'resize', onWindowResize );

}

function buildController( data ) {

    let geometry, material;

    switch ( data.targetRayMode ) {

        case 'tracked-pointer':
            // can change -------------------------------------------
            geometry = new THREE.BufferGeometry();
            geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
            geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );

            material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );

            return new THREE.Line( geometry, material );
            // *********************************************************8

        case 'gaze':

            geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
            material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
            return new THREE.Mesh( geometry, material );

    }

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


function handleController( controller ) {

    if ( controller.userData.isSelecting ) {

        // const object = room.children[ count ++ ];

        // object.position.copy( controller.position );
        // object.userData.velocity.x = ( Math.random() - 0.5 ) * 3;
        // object.userData.velocity.y = ( Math.random() - 0.5 ) * 3;
        // object.userData.velocity.z = ( Math.random() - 9 );
        // object.userData.velocity.applyQuaternion( controller.quaternion );

        // if ( count === room.children.length ) count = 0;

    }

}

//

function animate() {

    renderer.setAnimationLoop( render );

}

function render() {

    handleController( controller1 );
    handleController( controller2 );

    //  can change this ******************************************************

    const delta = clock.getDelta() * 0.8; // slow down simulation

    const range = 3 - radius;

    // for ( let i = 0; i < room.children.length; i ++ ) {

    //     const object = room.children[ i ];

    //     object.position.x += object.userData.velocity.x * delta;
    //     object.position.y += object.userData.velocity.y * delta;
    //     object.position.z += object.userData.velocity.z * delta;

    //     // keep objects inside room

    //     if ( object.position.x < - range || object.position.x > range ) {

    //         object.position.x = THREE.MathUtils.clamp( object.position.x, - range, range );
    //         object.userData.velocity.x = - object.userData.velocity.x;

    //     }

    //     if ( object.position.y < radius || object.position.y > 6 ) {

    //         object.position.y = Math.max( object.position.y, radius );

    //         object.userData.velocity.x *= 0.98;
    //         object.userData.velocity.y = - object.userData.velocity.y * 0.8;
    //         object.userData.velocity.z *= 0.98;

    //     }

    //     if ( object.position.z < - range || object.position.z > range ) {

    //         object.position.z = THREE.MathUtils.clamp( object.position.z, - range, range );
    //         object.userData.velocity.z = - object.userData.velocity.z;

    //     }

    //     for ( let j = i + 1; j < room.children.length; j ++ ) {

    //         const object2 = room.children[ j ];

    //         normal.copy( object.position ).sub( object2.position );

    //         const distance = normal.length();

    //         if ( distance < 2 * radius ) {

    //             normal.multiplyScalar( 0.5 * distance - radius );

    //             object.position.sub( normal );
    //             object2.position.add( normal );

    //             normal.normalize();

    //             relativeVelocity.copy( object.userData.velocity ).sub( object2.userData.velocity );

    //             normal = normal.multiplyScalar( relativeVelocity.dot( normal ) );

    //             object.userData.velocity.sub( normal );
    //             object2.userData.velocity.add( normal );

    //         }

    //     }

    //     object.userData.velocity.y -= 9.8 * delta;

    // }

    // ********************************************************

    renderer.render( scene, camera );

}

// // Define Scene
// const scene = new THREE.Scene();

// // Define Camera
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.6, 1200);
// camera.position.z = 5; // Set camera position

// // Renderer
// const renderer = new THREE.WebGLRenderer({antialias: true});
// renderer.setClearColor("#233143"); // Set background colour
// renderer.setSize(window.innerWidth, window.innerHeight);
// //renderer.vr.enabled = true;
// renderer.xr.enabled = true;
// document.body.appendChild(renderer.domElement); // Add renderer to HTML as a canvas element
// // Make Canvas Responsive
// window.addEventListener('resize', () => {
//     renderer.setSize(window.innerWidth, window.innerHeight); // Update size
//     camera.aspect = window.innerWidth / window.innerHeight; // Update aspect ratio
//     camera.updateProjectionMatrix(); // Apply changes
// })


// // Add a vr button
// document.body.appendChild(VRButton.createButton(renderer));

// // Create box:
// const boxGeometry = new THREE.BoxGeometry(2, 2, 2); // Define geometry
// const boxMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF}); // Define material
// const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial); // Build box
// boxMesh.rotation.set(40, 0, 40); // Set box initial rotation
// scene.add(boxMesh); // Add box to canvas
// // Create spheres: 
// const sphereMeshes = [];
// const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32); // Define geometry
// const sphereMaterial = new THREE.MeshLambertMaterial({color: 0xC56CEF}); // Define material
// for (let i=0; i<4; i++) {
//     sphereMeshes[i] = new THREE.Mesh(sphereGeometry, sphereMaterial); // Build sphere
//     sphereMeshes[i].position.set(0, 0, 0);
//     scene.add(sphereMeshes[i]); // Add sphere to canvas
// }
// // Lights
// const lights = []; // Storage for lights
// // const lightHelpers = []; // Storage for light helpers
// // Properties for each light
// const lightValues = [
//     {colour: 0x14D14A, intensity: 8, dist: 12, x: 1, y: 0, z: 8},
//     {colour: 0xBE61CF, intensity: 6, dist: 12, x: -2, y: 1, z: -10},
//     {colour: 0x00FFFF, intensity: 3, dist: 10, x: 0, y: 10, z: 1},
//     {colour: 0x00FF00, intensity: 6, dist: 12, x: 0, y: -10, z: -1},
//     {colour: 0x16A7F5, intensity: 6, dist: 12, x: 10, y: 3, z: 0},
//     {colour: 0x90F615, intensity: 6, dist: 12, x: -10, y: -1, z: 0}
// ];
// for (let i=0; i<6; i++) {
//     // Loop 6 times to add each light to lights array
//     // using the lightValues array to input properties
//     lights[i] = new THREE.PointLight(
//       lightValues[i]['colour'], 
//       lightValues[i]['intensity'], 
//       lightValues[i]['dist']
//     );
  
//     lights[i].position.set(
//       lightValues[i]['x'], 
//       lightValues[i]['y'], 
//       lightValues[i]['z']
//     );
  
//     scene.add(lights[i]);
// // Add light helpers for each light
//     // lightHelpers[i] = new THREE.PointLightHelper(lights[i]);
//     // scene.add(lightHelpers[i]);
// };
// //Trackball Controls for Camera 
// // const controls = new TrackballControls(camera, renderer.domElement); 
// // controls.rotateSpeed = 4;
// // controls.dynamicDampingFactor = 0.15;
// // // Axes Helper
// // const axesHelper = new THREE.AxesHelper(5);
// // scene.add( axesHelper ); // X axis = red, Y axis = green, Z axis = blue
// // Trigonometry Constants for Orbital Paths 
// let theta = 0; // Current angle
// // Angle increment on each render
// const dTheta = 2 * Math.PI / 100;
// // Rendering Function
// const rendering = function() {
//     // Rerender every time the page refreshes (pause when on another tab)
//     requestAnimationFrame(rendering);
// // Update trackball controls
//     // controls.update();
// // Constantly rotate box
//     scene.rotation.z -= 0.005;
//     scene.rotation.x -= 0.01;
// //Increment theta, and update sphere coords based off new value        
//     theta += dTheta;
// // Store trig functions for sphere orbits 
//     // MUST BE INSIDE RENDERING FUNCTION OR THETA VALUES ONLY GET SET ONCE
//     const trigs = [
//         {x: Math.cos(theta*1.05), y: Math.sin(theta*1.05), z: Math.cos(theta*1.05), r: 2},
//         {x: Math.cos(theta*0.8), y: Math.sin(theta*0.8), z: Math.sin(theta*0.8), r: 2.25},
//         {x: Math.cos(theta*1.25), y: Math.cos(theta*1.25), z: Math.sin(theta*1.25), r: 2.5},
//         {x: Math.sin(theta*0.6), y: Math.cos(theta*0.6), z: Math.sin(theta*0), r: 2.75}
//     ];
// // Loop 4 times (for each sphere), updating the position 
//     for (let i=0; i<4; i++) {
//         sphereMeshes[i].position.x = trigs[i]['r'] * trigs[i]['x'];
//         sphereMeshes[i].position.y = trigs[i]['r'] * trigs[i]['y'];
//         sphereMeshes[i].position.z = trigs[i]['r'] * trigs[i]['z'];
//     };
// renderer.render(scene, camera);
// }
// rendering();