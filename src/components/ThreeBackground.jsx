import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const particlesRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
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

    // Camera setup - wider field of view for more dramatic effect
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 40;
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

    // Material with custom shader for glowing particles with mouse interaction
    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#3b82f6') },
        uSecondaryColor: { value: new THREE.Color('#8b5cf6') },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        attribute float aScale;
        varying float vAlpha;
        varying float vDistToMouse;
        varying float vInfluence;
        
        void main() {
          vec3 pos = position;
          
          // Floating animation
          pos.y += sin(uTime * 0.5 + position.x * 0.1) * 2.0;
          pos.x += cos(uTime * 0.3 + position.y * 0.1) * 1.0;
          
          // Mouse interaction - MUCH stronger effect
          vec2 mousePos = uMouse * 60.0;
          float distToMouse = distance(pos.xy, mousePos);
          float interactionRadius = 40.0;
          float influence = smoothstep(interactionRadius, 0.0, distToMouse);
          
          // Strong repulsion
          vec2 dir = normalize(pos.xy - mousePos);
          float repulsionStrength = influence * 20.0;
          pos.xy += dir * repulsionStrength;
          
          // Also push in Z for depth effect
          pos.z += influence * 15.0;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Much larger size increase near mouse
          float sizeMult = 1.0 + influence * 4.0;
          gl_PointSize = (5.0 * aScale + 3.0) * sizeMult * (100.0 / -mvPosition.z);
          
          vAlpha = aScale;
          vDistToMouse = distToMouse;
          vInfluence = influence;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uSecondaryColor;
        varying float vAlpha;
        varying float vDistToMouse;
        varying float vInfluence;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float glow = 1.0 - (dist * 2.0);
          glow = pow(glow, 2.0);
          
          // Much brighter and more colorful near mouse
          float mouseGlow = vInfluence * 0.8;
          
          vec3 baseColor = mix(uColor, uSecondaryColor, vAlpha);
          // Shift to bright cyan/white near mouse
          vec3 brightColor = vec3(0.8, 0.95, 1.0);
          vec3 color = mix(baseColor, brightColor, mouseGlow);
          
          // Higher opacity near mouse
          float alpha = glow * (0.8 + mouseGlow);
          
          gl_FragColor = vec4(color, alpha);
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

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Update uniforms
      particlesMaterial.uniforms.uTime.value = time;
      particlesMaterial.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      linesMaterial.uniforms.uTime.value = time;

      // Rotate particles slowly based on mouse position
      if (particles) {
        particles.rotation.y = time * 0.03 + mouseRef.current.x * 0.2;
        particles.rotation.x = Math.sin(time * 0.02) * 0.1 + mouseRef.current.y * 0.1;
      }

      // Camera follows mouse with stronger parallax effect
      const targetX = mouseRef.current.x * 15;
      const targetY = mouseRef.current.y * 15;
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (-targetY - camera.position.y) * 0.04;
      camera.position.z = 40 + Math.abs(mouseRef.current.x) * 5;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Mouse move handler
    const handleMouseMove = (event) => {
      mouseRef.current.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
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
