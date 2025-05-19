import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';


class HeroGallery {
  constructor() {
    this.container = document.getElementById('threejs-hero');
    this.canvas = document.getElementById('hero-canvas');
    
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    
    this.renderer.setClearColor(0x000000);
    this.images = [];
    this.setup();
    this.createGallery();
    this.animate();
    this.addControls();
    this.addTestCube();
  }

  setup() {
    // Configure renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    
    // Set camera position
    this.camera.position.z = 5;
    
    // Handle resize
    window.addEventListener('resize', this.onResize.bind(this));
  }

  addControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
  }

  addTestCube() {
    console.log('addTestCube');
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    const material = new THREE.MeshBasicMaterial({
      color: 0xff00ff, 
      wireframe: true
    });

    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
  }

  createGallery() {
    // Create image planes
    const textureLoader = new THREE.TextureLoader();
    
    // Get image URLs from Shopify section
    const imageUrls = [
      document.querySelector('[data-gallery-image-1]')?.dataset.url,
      document.querySelector('[data-gallery-image-2]')?.dataset.url,
      document.querySelector('[data-gallery-image-3]')?.dataset.url
    ].filter(Boolean);

    imageUrls.forEach((url, index) => {
      textureLoader.load(url, (texture) => {
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide
        });

        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = 0;
        mesh.position.y = 0;
        mesh.position.z = 0;
        
        
        this.images.push(mesh);
        this.scene.add(mesh);
      });
    });
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    // Add animation effects
    this.images.forEach((mesh) => {
      mesh.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
    });

    if(this.cube) {
      this.cube.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
    }
    
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('threejs-hero')) {
    new HeroGallery();
    console.log('HeroGallery initialized');

  }
}); 