import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';

// Componente que monta o nosso Gato em Blocos (estilo Minecraft/Voxel)
function CatModel({ color, accessory, gender }) {
  const groupRef = useRef();

  // Animação de "flutuar" levemente (respiração)
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 2.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      {/* Corpo */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1, 0.8, 1.6]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Cabeça */}
      <mesh position={[0, 1.1, 0.6]}>
        <boxGeometry args={[0.9, 0.7, 0.9]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Focinho / Rosto (Branco) */}
      <mesh position={[0, 1.0, 1.06]}>
        <boxGeometry args={[0.4, 0.3, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Olhos (Gata = verde esmeralda, Gato = preto) */}
      <mesh position={[-0.15, 1.15, 1.06]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color={gender === 'female' ? '#10b981' : '#111111'} />
      </mesh>
      <mesh position={[0.15, 1.15, 1.06]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color={gender === 'female' ? '#10b981' : '#111111'} />
      </mesh>

      {/* Orelhas */}
      <mesh position={[-0.3, 1.5, 0.6]}>
        <boxGeometry args={[0.25, 0.3, 0.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.3, 1.5, 0.6]}>
        <boxGeometry args={[0.25, 0.3, 0.2]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Rabo */}
      <mesh position={[0, 0.7, -0.9]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[0.15, 0.8, 0.15]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Detalhe Gata (Laço na orelha) */}
      {gender === 'female' && (
        <group position={[0.3, 1.7, 0.7]} rotation={[0, 0, -0.2]}>
          <mesh position={[-0.1, 0, 0]}><boxGeometry args={[0.15, 0.15, 0.05]}/><meshStandardMaterial color="#db2777"/></mesh>
          <mesh position={[0.1, 0, 0]}><boxGeometry args={[0.15, 0.15, 0.05]}/><meshStandardMaterial color="#db2777"/></mesh>
          <mesh position={[0, 0, 0.02]}><boxGeometry args={[0.08, 0.08, 0.06]}/><meshStandardMaterial color="#fbcfe8"/></mesh>
        </group>
      )}

      {/* ACESSÓRIOS EQUIPÁVEIS */}
      {accessory === 'oculos' && (
        <group position={[0, 1.15, 1.1]}>
          <mesh position={[-0.2, 0, 0]}><boxGeometry args={[0.3, 0.15, 0.1]}/><meshStandardMaterial color="#111"/></mesh>
          <mesh position={[0.2, 0, 0]}><boxGeometry args={[0.3, 0.15, 0.1]}/><meshStandardMaterial color="#111"/></mesh>
          <mesh position={[0, 0, 0]}><boxGeometry args={[0.2, 0.05, 0.1]}/><meshStandardMaterial color="#111"/></mesh>
        </group>
      )}
      
      {accessory === 'chapeu' && (
        <mesh position={[0, 1.6, 0.6]}>
          <cylinderGeometry args={[0.4, 0.6, 0.5, 16]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      )}
      
      {accessory === 'capa' && (
        <mesh position={[0, 0.6, -0.1]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[1.1, 0.1, 1.4]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      )}
    </group>
  );
}

export default function VoxelAvatar({ color, accessory, gender }) {
  return (
    <div style={{ width: '100%', height: '220px', cursor: 'grab' }}>
      <Canvas camera={{ position: [3, 2, 4], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={10} blur={2} far={4} />
        <CatModel color={color} accessory={accessory} gender={gender} />
        <OrbitControls autoRotate autoRotateSpeed={1.5} enableZoom={false} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI/2} />
      </Canvas>
    </div>
  );
}