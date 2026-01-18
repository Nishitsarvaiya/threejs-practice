import {
	AdditiveBlending,
	AmbientLight,
	AxesHelper,
	BufferAttribute,
	BufferGeometry,
	DirectionalLight,
	DirectionalLightHelper,
	Mesh,
	PerspectiveCamera,
	Points,
	PointsMaterial,
	Scene,
	SRGBColorSpace,
	TextureLoader,
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

		new TextureLoader().loadAsync('/circle_02.png').then((tex) => {
			this.texture = tex;
			this.initWorld();
		});
	}

	initWorld() {
		this.scene = new Scene();

		const cameraConfig = {
			fov: 55,
			aspect: this.sizes.width / this.sizes.height,
			near: 0.01,
			far: 1000,
		};
		this.camera = new PerspectiveCamera(cameraConfig.fov, cameraConfig.aspect, cameraConfig.near, cameraConfig.far);
		this.camera.position.set(0, 0, 2);

		this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setSize(this.sizes.width, this.sizes.height);
		this.renderer.setClearColor('#09090b');
		// this.renderer.setClearColor('#f6f6fc');
		this.renderer.outputColorSpace = SRGBColorSpace;
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		// this.renderer.shadowMap.enabled = true;
		// this.renderer.shadowMap.type = PCFSoftShadowMap;

		this.canvas = this.renderer.domElement;

		this.dom.appendChild(this.canvas);

		this.controls = new OrbitControls(this.camera, this.canvas);
		this.controls.enableDamping = true;
		this.controls.update();

		// this.createLights();
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
		// this.scene.add(new AxesHelper());

		this.particlesCount = 5000;
		this.arraySize = this.particlesCount * 3;
		this.position = new Float32Array(this.arraySize);
		this.colors = new Float32Array(this.arraySize);

		for (let i = 0; i < this.arraySize; i++) {
			this.position[i] = (Math.random() - 0.5) * 10;
			this.colors[i] = (Math.random() - 0.5) * 10;
		}

		this.geometry = new BufferGeometry();
		this.geometry.setAttribute('position', new BufferAttribute(this.position, 3));
		this.geometry.setAttribute('color', new BufferAttribute(this.colors, 3));

		this.material = new PointsMaterial();
		this.material.size = 0.05;
		this.material.transparent = true;
		this.material.alphaMap = this.texture;
		// this.material.alphaTest = 0.001;
		// this.material.depthTest = false;
		this.material.depthWrite = false;
		this.material.blending = AdditiveBlending;
		this.material.vertexColors = true;

		this.particles = new Points(this.geometry, this.material);

		this.scene.add(this.particles);
	}

	resize() {
		this.sizes.width = this.dom.offsetWidth;
		this.sizes.height = this.dom.offsetHeight;

		this.camera.aspect = this.sizes.width / this.sizes.height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(this.sizes.width, this.sizes.height);
	}

	tick(time) {
		this.time = time * 0.0009;

		this.controls.update();
		this.renderer.render(this.scene, this.camera);

		// for (let i = 0; i < this.particlesCount; i++) {
		// 	const i3 = i * 3;
		// 	const x = this.geometry.attributes.position.array[i3];
		// 	this.geometry.attributes.position.array[i3 + 1] = Math.sin(this.time + x);
		// }
		this.particles.rotation.y = this.time * 0.1;
		this.particles.rotation.x = Math.sin(this.time * 0.025);
		this.particles.rotation.z = Math.cos(this.time * 0.01);
		this.geometry.attributes.position.needsUpdate = true;

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
