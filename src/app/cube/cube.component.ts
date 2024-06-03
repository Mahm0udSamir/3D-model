import { AfterViewInit, Component, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-cube',
  standalone: true,
  imports: [CardModule],
  templateUrl: './cube.component.html',
  styleUrl: './cube.component.scss'
})


export class CubeComponent implements  AfterViewInit {

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private mixer!: THREE.AnimationMixer;
  private clock!: THREE.Clock;
  private cameraIndex: number = 0;
  private cameras: THREE.PerspectiveCamera[] = [];
  private model!: THREE.Group;  // Reference to the loaded model
  private controls!: OrbitControls;  // Reference to the OrbitControls

  constructor(private el: ElementRef) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.initThreeJS();
  }

  initThreeJS(): void {
    const container = this.el.nativeElement.querySelector('#threejs-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create scene
    this.scene = new THREE.Scene();

    // Create multiple cameras
    this.createCameras(width, height);

    // Use the first camera initially
    this.camera = this.cameras[this.cameraIndex];

    // Create renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    // Add lighting
    this.addLighting();

    // Initialize OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 1, 0);  // Ensure controls target the model
    this.controls.update();

    // Clock for animation
    this.clock = new THREE.Clock();

    // Load GLTF model
    const loader = new GLTFLoader();
    loader.load('assets/human/scene.gltf', (gltf) => {
      this.model = gltf.scene;  // Store the reference to the loaded model
      this.scene.add(this.model);
      this.animate();
    }, undefined, (error) => {
      console.error('An error occurred while loading the GLTF model:', error);
    });
  }

  createCameras(width: number, height: number): void {
    // Camera 1: Default front view
    const camera1 = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera1.position.set(0, 1, 5);
    camera1.lookAt(0, 1, 0);  // Ensure the camera looks at the model
    this.cameras.push(camera1);

    // Camera 2: Top view
    const camera2 = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera2.position.set(0, 5, 0);
    camera2.lookAt(0, 0, 0);  // Ensure the camera looks at the model
    this.cameras.push(camera2);

    // Camera 3: Side view
    const camera3 = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera3.position.set(5, 1, 0);
    camera3.lookAt(0, 0, 0);  // Ensure the camera looks at the model
    this.cameras.push(camera3);
  }

  addLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);  // Soft white light with increased intensity
    this.scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    this.scene.add(directionalLight);

    // Additional point light for better illumination
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(5, 5, 5);
    this.scene.add(pointLight);
  }

  switchCamera(): void {
    this.cameraIndex = (this.cameraIndex + 1) % this.cameras.length;
    this.camera = this.cameras[this.cameraIndex];
    this.controls.object = this.camera;  // Update controls to use the new camera
    this.controls.update();
  }

  animate = () => {
    requestAnimationFrame(this.animate);


    if (this.mixer) {
      const delta = this.clock.getDelta();
      this.mixer.update(delta);
    }

    this.controls.update();  // Update controls on each frame
    this.renderer.render(this.scene, this.camera);
  }
}
