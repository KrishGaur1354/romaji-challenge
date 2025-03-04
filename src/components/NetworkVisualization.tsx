import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LayerActivation } from '@/services/recognitionService';

interface NetworkVisualizationProps {
  layerActivations: LayerActivation[];
  width?: number;
  height?: number;
}

const NetworkVisualization: React.FC<NetworkVisualizationProps> = ({
  layerActivations,
  width = 600,
  height = 400
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x000000);

    // Set up camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.z = 5;

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [width, height]);

  // Update visualization when layer activations change
  useEffect(() => {
    if (!sceneRef.current) return;

    // Clear previous visualization
    sceneRef.current.children = sceneRef.current.children.filter(
      child => child instanceof THREE.Light
    );

    // Create visualization for each layer
    layerActivations.forEach((layer, layerIndex) => {
      const layerGroup = new THREE.Group();
      layerGroup.position.z = -layerIndex * 2;

      // Create neurons for this layer
      const neurons = layer.activation[0] || [];
      const neuronSize = 0.1;
      const spacing = neuronSize * 2;

      neurons.forEach((row, rowIndex) => {
        row.forEach((activation, colIndex) => {
          // Create neuron geometry
          const geometry = new THREE.SphereGeometry(neuronSize);
          const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(activation, 1, 0.5),
            transparent: true,
            opacity: 0.8
          });
          const neuron = new THREE.Mesh(geometry, material);

          // Position neuron
          neuron.position.set(
            (colIndex - row.length / 2) * spacing,
            (rowIndex - neurons.length / 2) * spacing,
            0
          );

          // Add to layer group
          layerGroup.add(neuron);

          // Add connections to previous layer if not first layer
          if (layerIndex > 0 && layerActivations[layerIndex - 1].activation[0]) {
            const prevLayer = layerActivations[layerIndex - 1].activation[0];
            const prevNeuron = new THREE.Vector3(
              (colIndex - row.length / 2) * spacing,
              (rowIndex - neurons.length / 2) * spacing,
              -2
            );

            // Create connection line
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
              neuron.position,
              prevNeuron
            ]);
            const lineMaterial = new THREE.LineBasicMaterial({
              color: 0x4444ff,
              transparent: true,
              opacity: 0.2
            });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            layerGroup.add(line);
          }
        });
      });

      // Add layer label
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = 256;
      canvas.height = 64;
      context.fillStyle = '#ffffff';
      context.font = '24px Arial';
      context.fillText(layer.layerName, 10, 40);

      const texture = new THREE.CanvasTexture(canvas);
      const labelMaterial = new THREE.SpriteMaterial({ map: texture });
      const label = new THREE.Sprite(labelMaterial);
      label.position.set(0, neurons.length * spacing * 0.6, 0);
      label.scale.set(2, 0.5, 1);
      layerGroup.add(label);

      // Add layer group to scene
      sceneRef.current?.add(layerGroup);
    });

  }, [layerActivations]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        borderRadius: '8px',
        overflow: 'hidden'
      }} 
    />
  );
};

export default NetworkVisualization; 