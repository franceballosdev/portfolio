import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const particlesRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.background = 'transparent';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 80;
    const posArray = new Float32Array(particlesCount * 3);
    const scaleArray = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 100;
      posArray[i + 1] = (Math.random() - 0.5) * 100;
      posArray[i + 2] = (Math.random() - 0.5) * 50;
      scaleArray[i / 3] = Math.random();
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));

    // Material with custom shader for glowing particles
    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#3b82f6') },
        uSecondaryColor: { value: new THREE.Color('#8b5cf6') },
      },
      vertexShader: `
        uniform float uTime;
        attribute float aScale;
        varying float vAlpha;
        
        void main() {
          vec3 pos = position;
          pos.y += sin(uTime * 0.5 + position.x * 0.1) * 2.0;
          pos.x += cos(uTime * 0.3 + position.y * 0.1) * 1.0;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = (4.0 * aScale + 2.0) * (100.0 / -mvPosition.z);
          vAlpha = aScale;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uSecondaryColor;
        varying float vAlpha;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float glow = 1.0 - (dist * 2.0);
          glow = pow(glow, 2.0);
          
          vec3 color = mix(uColor, uSecondaryColor, vAlpha);
          gl_FragColor = vec4(color, glow * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Lines between close particles
    const linesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#3b82f6') },
      },
      vertexShader: `
        uniform float uTime;
        varying float vAlpha;
        
        void main() {
          vec3 pos = position;
          pos.y += sin(uTime * 0.5 + position.x * 0.1) * 2.0;
          pos.x += cos(uTime * 0.3 + position.y * 0.1) * 1.0;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          vAlpha = 1.0;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        
        void main() {
          gl_FragColor = vec4(uColor, 0.15);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    let linesMesh = null;

    // Animation
    let time = 0;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      time += 0.016;

      // Update uniforms
      particlesMaterial.uniforms.uTime.value = time;
      linesMaterial.uniforms.uTime.value = time;

      // Rotate particles slowly
      if (particles) {
        particles.rotation.y = time * 0.05;
        particles.rotation.x = Math.sin(time * 0.02) * 0.1;
      }

      // Mouse interaction - subtle camera movement
      const targetX = mouseRef.current.x * 5;
      const targetY = mouseRef.current.y * 5;
      camera.position.x += (targetX - camera.position.x) * 0.02;
      camera.position.y += (-targetY - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Mouse move handler
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && mount.contains(rendererRef.current.domElement)) {
        mount.removeChild(rendererRef.current.domElement);
      }
      
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      linesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ 
        background: 'transparent',
        mixBlendMode: 'screen',
      }}
      aria-hidden="true"
    />
  );
};

export default ThreeBackground;
