'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type Camera3DProps = { progress: number };
type MovingPart = {
  group: THREE.Group;
  home: THREE.Vector3;
  away: THREE.Vector3;
  spin: THREE.Euler;
  phase: number;
};

const smooth = (v: number) => v * v * (3 - 2 * v);

export default function Camera3D({ progress }: Camera3DProps) {
  const host = useRef<HTMLDivElement>(null);
  const target = useRef(progress);
  target.current = progress;

  useEffect(() => {
    const mount = host.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const view = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    view.position.set(0, 0.15, 13.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      mount.classList.add('camera-webgl--fallback');
      return;
    }
    const compact = window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.35 : 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mount.appendChild(renderer.domElement);
    const canvas = renderer.domElement;

    scene.add(new THREE.HemisphereLight(0xeaf1ff, 0x15100d, 2.3));
    const key = new THREE.DirectionalLight(0xffffff, 4.2);
    key.position.set(-5, 7, 9);
    key.castShadow = true;
    scene.add(key);
    const rim = new THREE.PointLight(0x8ebcff, 32, 28);
    rim.position.set(7, 2, -3);
    scene.add(rim);
    const warm = new THREE.PointLight(0xff9e68, 18, 20);
    warm.position.set(-6, -4, 6);
    scene.add(warm);

    const black = new THREE.MeshStandardMaterial({ color: 0x111315, roughness: 0.27, metalness: 0.72 });
    const rubber = new THREE.MeshStandardMaterial({ color: 0x080909, roughness: 0.72, metalness: 0.08 });
    const metal = new THREE.MeshStandardMaterial({ color: 0x8d9498, roughness: 0.19, metalness: 0.96 });
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x292d30, roughness: 0.2, metalness: 0.9 });
    const board = new THREE.MeshStandardMaterial({ color: 0x214f42, roughness: 0.48, metalness: 0.3 });
    const copper = new THREE.MeshStandardMaterial({ color: 0xb86a32, roughness: 0.3, metalness: 0.88 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0x719ed0, roughness: 0.06, metalness: 0.05, transmission: 0.72, transparent: true, opacity: 0.66, thickness: 0.35, ior: 1.48 });
    const screen = new THREE.MeshPhysicalMaterial({ color: 0x172535, roughness: 0.08, metalness: 0.25, clearcoat: 1, emissive: 0x071726, emissiveIntensity: 0.8 });

    const rig = new THREE.Group();
    rig.scale.setScalar(0.78);
    scene.add(rig);
    const parts: MovingPart[] = [];

    const piece = (name: string, home: [number, number, number], away: [number, number, number], spin: [number, number, number], phase = 0) => {
      const group = new THREE.Group();
      group.name = name;
      group.position.set(...home);
      rig.add(group);
      parts.push({ group, home: new THREE.Vector3(...home), away: new THREE.Vector3(...away), spin: new THREE.Euler(...spin), phase });
      return group;
    };
    const mesh = (geometry: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Group, xyz: [number, number, number] = [0, 0, 0]) => {
      const object = new THREE.Mesh(geometry, material);
      object.position.set(...xyz);
      object.castShadow = true;
      object.receiveShadow = true;
      parent.add(object);
      return object;
    };

    // Corpo e empunhadura: volumes distintos, com profundidade real.
    const body = piece('corpo', [0, 0, 0], [0.2, -0.1, -3.6], [0.08, -0.22, 0.04]);
    mesh(new THREE.BoxGeometry(4.7, 3.05, 1.55, 3, 3, 2), black, body);
    mesh(new THREE.BoxGeometry(1.25, 3.25, 1.82), rubber, body, [-2.45, -0.13, 0.14]);
    for (let y = -1.22; y < 1.2; y += 0.22) mesh(new THREE.BoxGeometry(1.29, 0.07, 1.86), darkMetal, body, [-2.47, y, 0.17]);

    const top = piece('tampa superior', [0, 1.72, 0], [-0.8, 2.75, -0.6], [-0.42, 0.34, -0.14], 0.02);
    mesh(new THREE.BoxGeometry(3.2, 0.46, 1.48), darkMetal, top);
    mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.25, 32), metal, top, [1.05, 0.33, 0.05]);
    top.children[1].rotation.z = Math.PI / 2;

    const prism = piece('visor óptico', [0.1, 1.82, 0.05], [3.7, 2.55, 1.5], [0.5, 0.75, 0.32], 0.04);
    mesh(new THREE.CylinderGeometry(0.95, 1.25, 1.3, 4), black, prism).rotation.y = Math.PI / 4;

    const sensor = piece('sensor', [0, 0, 0.86], [-0.7, -4.4, 2.7], [-0.35, 0.68, 0.2], 0.03);
    mesh(new THREE.BoxGeometry(1.82, 1.35, 0.14), metal, sensor);
    mesh(new THREE.BoxGeometry(1.45, 1.05, 0.18), glass, sensor, [0, 0, 0.11]);

    const circuit = piece('placa principal', [0.32, 0, -0.88], [5.35, -2.25, -2.2], [0.45, -0.85, 0.52], 0.06);
    mesh(new THREE.BoxGeometry(3.55, 2.45, 0.12), board, circuit);
    [[-1.1,.62],[.1,.55],[1.05,.52],[-.65,-.55],[.65,-.52]].forEach(([x,y], i) => mesh(new THREE.BoxGeometry(i % 2 ? .54 : .72, .45, .18), i === 4 ? copper : darkMetal, circuit, [x,y,.14]));

    const rear = piece('painel traseiro', [0, 0, -0.9], [-4.9, 2.3, -2.7], [-0.35, 0.9, -0.42], 0.08);
    mesh(new THREE.BoxGeometry(4.4, 2.78, 0.28), black, rear);
    mesh(new THREE.BoxGeometry(2.75, 1.75, 0.12), screen, rear, [0.25, 0, -0.2]);

    const mountRing = piece('baioneta', [0, 0, 0.94], [-5.1, -3.15, 1.6], [0.7, -0.75, 0.58], 0.05);
    const ringMesh = mesh(new THREE.TorusGeometry(1.42, 0.17, 16, 64), metal, mountRing);
    ringMesh.rotation.x = 0;

    // Cada elemento da lente é independente: cilindro, aro e vidro possuem espessura e rotações próprias.
    const lensData = [
      { z: 1.30, r: 1.31, d: .40, away: [5.6, 3.45, 3.5], spin: [.28, .82, -.25] },
      { z: 1.66, r: 1.23, d: .34, away: [3.15, 2.75, 4.6], spin: [-.48, -.62, .38] },
      { z: 1.98, r: 1.14, d: .30, away: [0.8, -5.15, 5.5], spin: [.72, .38, -.5] },
      { z: 2.27, r: 1.06, d: .28, away: [-3.15, 2.65, 4.2], spin: [-.34, .9, .58] },
      { z: 2.55, r: .98, d: .34, away: [-5.65, -.55, 5.2], spin: [.55, -.78, -.36] },
      { z: 2.88, r: .91, d: .42, away: [4.8, -4.15, 3.8], spin: [-.62, .5, .64] },
    ] as const;
    lensData.forEach((item, index) => {
      const lens = piece(`elemento óptico ${index + 1}`, [0, 0, item.z], item.away as unknown as [number, number, number], item.spin as unknown as [number, number, number], index * 0.018);
      const barrel = mesh(new THREE.CylinderGeometry(item.r, item.r * .98, item.d, 64, 1, true), index % 2 ? darkMetal : black, lens);
      barrel.rotation.x = Math.PI / 2;
      const lip = mesh(new THREE.TorusGeometry(item.r, .075, 12, 64), metal, lens, [0, 0, item.d * .48]);
      lip.rotation.x = 0;
      const optic = mesh(new THREE.CylinderGeometry(item.r * .82, item.r * .82, .105, 64), glass, lens, [0, 0, item.d * .12]);
      optic.rotation.x = Math.PI / 2;
    });

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      view.aspect = Math.max(rect.width / Math.max(rect.height, 1), 0.1);
      view.updateProjectionMatrix();
      rig.scale.setScalar(rect.width < 700 ? 0.58 : 0.72);
    };
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    observer?.observe(mount);
    if (!observer) window.addEventListener('resize', resize, { passive: true });
    resize();

    let shown = target.current;
    let frame = 0;
    let active = !document.hidden;
    const render = () => {
      if (!active) return;
      shown += (target.current - shown) * 0.075;
      const wave = Math.sin(Math.PI * shown);
      const explosion = smooth(Math.max(0, wave));
      rig.rotation.y = shown * Math.PI * 2;
      rig.rotation.x = Math.sin(shown * Math.PI) * 0.08;
      parts.forEach((part) => {
        const local = smooth(Math.max(0, Math.min(1, (explosion - part.phase) / (1 - part.phase))));
        part.group.position.lerpVectors(part.home, part.away, local);
        part.group.rotation.set(part.spin.x * local, part.spin.y * local, part.spin.z * local);
      });
      renderer.render(scene, view);
      mount.classList.add('camera-webgl--ready');
      frame = requestAnimationFrame(render);
    };
    render();

    const visibility = () => {
      active = !document.hidden;
      if (active) {
        cancelAnimationFrame(frame);
        render();
      }
    };
    document.addEventListener('visibilitychange', visibility);
    const contextLost = (event: Event) => {
      event.preventDefault();
      mount.classList.remove('camera-webgl--ready');
    };
    const contextRestored = () => mount.classList.add('camera-webgl--ready');
    canvas.addEventListener('webglcontextlost', contextLost);
    canvas.addEventListener('webglcontextrestored', contextRestored);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', visibility);
      observer?.disconnect();
      if (!observer) window.removeEventListener('resize', resize);
      canvas.removeEventListener('webglcontextlost', contextLost);
      canvas.removeEventListener('webglcontextrestored', contextRestored);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) object.geometry.dispose();
      });
      [black, rubber, metal, darkMetal, board, copper, glass, screen].forEach((material) => material.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="camera-webgl" ref={host} aria-hidden="true"><img className="camera-mobile-fallback" src="/images/camera-cutout-assembled.png" alt="" /></div>;
}
