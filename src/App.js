import {
	AmbientLight,
	AxesHelper,
	BoxGeometry,
	BoxHelper,
	DirectionalLight,
	DirectionalLightHelper,
	Mesh,
	MeshStandardMaterial,
	PCFSoftShadowMap,
	PerspectiveCamera,
	PlaneGeometry,
	Scene,
	SRGBColorSpace,
	WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export default class App {
	constructor(options) {
		this.dom = options.dom;

		this.sizes = {
			width: this.dom.offsetWidth,
			height: this.dom.offsetHeight,
		};

		this.initWorld = this.initWorld.bind(this);
		this.createLights = this.createLights.bind(this);
		this.createObjects = this.createObjects.bind(this);
		this.resize = this.resize.bind(this);
		this.tick = this.tick.bind(this);
		this.eventListeners = this.eventListeners.bind(this);

		this.initWorld();
	}

	initWorld() {
		this.scene = new Scene();

		const cameraConfig = {
			fov: 35,
			aspect: this.sizes.width / this.sizes.height,
			near: 0.01,
			far: 1000,
		};
		this.camera = new PerspectiveCamera(cameraConfig.fov, cameraConfig.aspect, cameraConfig.near, cameraConfig.far);
		this.camera.position.set(0, 3, 8);

		this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setSize(this.sizes.width, this.sizes.height);
		this.renderer.setClearColor('#09090b');
		this.renderer.outputColorSpace = SRGBColorSpace;
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = PCFSoftShadowMap;

		this.canvas = this.renderer.domElement;

		this.dom.appendChild(this.canvas);

		this.controls = new OrbitControls(this.camera, this.canvas);
		this.controls.enableDamping = true;
		this.controls.update();

		this.createLights();
		this.createObjects();
		this.resize();
		this.tick();
		this.eventListeners();
	}

	createLights() {
		this.ambientLight = new AmbientLight('#ffffff', 3);
		this.dirLight = new DirectionalLight('#ffffff', 1);
		this.dirLight.position.set(3, 6, -1);
		this.dirLight.castShadow = true;
		this.dirLight.shadow.mapSize.width = 1024; // default
		this.dirLight.shadow.mapSize.height = 1024; // default
		this.dirLight.shadow.camera.near = 0.5; // default
		this.dirLight.shadow.camera.far = 500;

		this.scene.add(new DirectionalLightHelper(this.dirLight, 1));

		this.scene.add(new AxesHelper(5));

		this.scene.add(this.ambientLight, this.dirLight);
	}

	createObjects() {
		this.boxG = new BoxGeometry(1, 1, 1);
		this.boxM = new MeshStandardMaterial({ color: '#a7c7e7', metalness: 0.56, roughness: 0.17 });
		this.box = new Mesh(this.boxG, this.boxM);
		this.box.position.set(0, 1, 0);

		this.box.add(new AxesHelper());

		this.planeG = new PlaneGeometry(10, 10);
		this.planeM = new MeshStandardMaterial({ color: '#f8fafc' });
		this.plane = new Mesh(this.planeG, this.planeM);
		this.plane.rotation.x = Math.PI * -0.5;

		this.box.castShadow = true;
		this.plane.receiveShadow = true;

		this.scene.add(this.box, this.plane);
	}

	resize() {
		this.sizes.width = this.dom.offsetWidth;
		this.sizes.height = this.dom.offsetHeight;

		this.camera.aspect = this.sizes.width / this.sizes.height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(this.sizes.width, this.sizes.height);
	}

	tick(time) {
		this.time = time * 0.0005;

		this.controls.update();
		this.renderer.render(this.scene, this.camera);

		this.box.rotation.y = this.time;

		this.rafId = requestAnimationFrame(this.tick);
	}

	eventListeners() {
		window.addEventListener('resize', this.resize);
	}

	destroy() {
		window.removeEventListener('resize', this.resize);

		this.scene.traverse((child) => {
			if (child instanceof Mesh) {
				child.geometry.dispose();

				if (Array.isArray(child.material)) {
					child.material.forEach((mat) => mat.dispose());
				} else {
					child.material.dispose();
				}
			}
		});

		this.renderer.dispose();

		cancelAnimationFrame(this.rafId);

		console.log('Scene Destroyed 💥');
	}
}
