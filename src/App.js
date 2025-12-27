import {
	AmbientLight,
	BoxGeometry,
	Clock,
	DirectionalLight,
	DoubleSide,
	Mesh,
	MeshStandardMaterial,
	PerspectiveCamera,
	Scene,
	SRGBColorSpace,
	WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export default class App {
	constructor(options) {
		// Get DOM Els
		this.dom = options.dom;

		// Dimensions
		this.sizes = {
			width: this.dom.offsetWidth,
			height: this.dom.offsetHeight,
		};

		this.initWorld();
	}

	initWorld() {
		// Scene
		this.scene = new Scene();

		// Camera
		const fov = 75;
		const near = 0.01;
		const far = 1000;
		const aspect = this.sizes.width / this.sizes.height;
		this.camera = new PerspectiveCamera(fov, aspect, near, far);
		this.camera.position.set(0, 0, 8);

		// Renderer
		this.renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
		this.canvas = this.renderer.domElement;
		this.renderer.setClearColor('#ffffff');
		this.renderer.setSize(this.sizes.width, this.sizes.height);
		this.renderer.outputColorSpace = SRGBColorSpace;
		this.renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio, 1), 2));
		this.dom.appendChild(this.canvas);

		this.clock = new Clock();

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
		// Lights
		this.ambientLight = new AmbientLight('#ffffff', 1);
		this.dirLight = new DirectionalLight('#ffffff', 3);
		this.dirLight.position.set(2, 2, -4);

		this.scene.add(this.ambientLight, this.dirLight);
	}

	createObjects() {
		// Objects
		this.boxG = new BoxGeometry(2, 2, 2);
		this.boxM = new MeshStandardMaterial({ color: '#3d405b', side: DoubleSide });

		this.box = new Mesh(this.boxG, this.boxM);

		this.scene.add(this.box);
	}

	eventListeners() {
		window.addEventListener('resize', () => this.resize());
	}

	resize() {
		this.sizes.width = this.dom.offsetWidth;
		this.sizes.height = this.dom.offsetHeight;

		this.renderer.setSize(this.sizes.width, this.sizes.height);

		this.camera.aspect = this.sizes.width / this.sizes.height;
		this.camera.updateProjectionMatrix();
	}

	tick() {
		this.time = this.clock.getElapsedTime();

		this.renderer.render(this.scene, this.camera);
		this.controls.update();

		this.box.rotation.x = this.time * 0.5;
		this.box.rotation.y = this.time * 0.5;

		requestAnimationFrame(() => this.tick());
	}
}
