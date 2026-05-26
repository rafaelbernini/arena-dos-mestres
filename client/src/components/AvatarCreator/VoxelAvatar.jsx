import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';

function CatModel({ color, accessory, gender }) {
  const groupRef = useRef();
  const [isRotating, setIsRotating] = useState(true);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 2.5) * 0.05;
      if (isRotating) {
        groupRef.current.rotation.y = t * 0.3;
      }
    }
  });

  const handlePointerDown = () => setIsRotating(false);
  const handlePointerUp = () => setIsRotating(true);

  return (
    <group
      ref={groupRef}
      position={[0, 0.5, 0]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Corpo principal */}
      <mesh position={[0, 0.5, 0]} scale={[1, 1.2, 1.3]}>
        <boxGeometry args={[0.8, 0.8, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Cabeça */}
      <mesh position={[0, 1.2, 0.5]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Focinho */}
      <mesh position={[0, 1.0, 1.0]}>
        <boxGeometry args={[0.35, 0.3, 0.15]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Nariz */}
      <mesh position={[0, 0.95, 1.05]}>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <meshStandardMaterial color={gender === 'female' ? '#db2777' : '#ff69b4'} />
      </mesh>

      {/* Olhos (Gata = verde, Gato = preto) */}
      <mesh position={[-0.15, 1.2, 1.05]}>
        <boxGeometry args={[0.12, 0.15, 0.1]} />
        <meshStandardMaterial color={gender === 'female' ? '#10b981' : '#111111'} />
      </mesh>
      <mesh position={[0.15, 1.2, 1.05]}>
        <boxGeometry args={[0.12, 0.15, 0.1]} />
        <meshStandardMaterial color={gender === 'female' ? '#10b981' : '#111111'} />
      </mesh>

      {/* Brilho nos olhos */}
      <mesh position={[-0.13, 1.22, 1.08]}>
        <boxGeometry args={[0.04, 0.04, 0.04]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.17, 1.22, 1.08]}>
        <boxGeometry args={[0.04, 0.04, 0.04]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Orelhas esquerda */}
      <mesh position={[-0.35, 1.65, 0.5]}>
        <boxGeometry args={[0.25, 0.4, 0.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Interior da orelha esquerda */}
      <mesh position={[-0.35, 1.65, 0.65]}>
        <boxGeometry args={[0.15, 0.25, 0.1]} />
        <meshStandardMaterial color="#ffb6c1" />
      </mesh>

      {/* Orelhas direita */}
      <mesh position={[0.35, 1.65, 0.5]}>
        <boxGeometry args={[0.25, 0.4, 0.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Interior da orelha direita */}
      <mesh position={[0.35, 1.65, 0.65]}>
        <boxGeometry args={[0.15, 0.25, 0.1]} />
        <meshStandardMaterial color="#ffb6c1" />
      </mesh>

      {/* Pata dianteira esquerda */}
      <mesh position={[-0.3, 0.1, 0.3]}>
        <boxGeometry args={[0.2, 0.5, 0.25]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Pata dianteira direita */}
      <mesh position={[0.3, 0.1, 0.3]}>
        <boxGeometry args={[0.2, 0.5, 0.25]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Pata traseira esquerda */}
      <mesh position={[-0.3, 0.1, -0.5]}>
        <boxGeometry args={[0.2, 0.5, 0.25]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Pata traseira direita */}
      <mesh position={[0.3, 0.1, -0.5]}>
        <boxGeometry args={[0.2, 0.5, 0.25]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Rabo */}
      <mesh position={[0.4, 0.8, -1.0]} rotation={[0.3, 0.1, 0.2]}>
        <boxGeometry args={[0.12, 0.12, 1.0]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Detalhe Gata (Laço no topo) */}
      {gender === 'female' && (
        <group position={[0.4, 1.75, 0.45]} rotation={[0, 0, -0.3]}>
          <mesh position={[-0.12, 0, 0]}><boxGeometry args={[0.2, 0.18, 0.08]}/><meshStandardMaterial color="#db2777"/></mesh>
          <mesh position={[0.12, 0, 0]}><boxGeometry args={[0.2, 0.18, 0.08]}/><meshStandardMaterial color="#db2777"/></mesh>
          <mesh position={[0, -0.02, 0.04]}><boxGeometry args={[0.1, 0.1, 0.08]}/><meshStandardMaterial color="#fbcfe8"/></mesh>
        </group>
      )}

      {/* ACESSÓRIOS EQUIPÁVEIS */}
      {accessory === 'oculos' && (
        <group position={[0, 1.25, 1.08]}>
          <mesh position={[-0.2, 0, 0]}><boxGeometry args={[0.35, 0.18, 0.12]}/><meshStandardMaterial color="#111"/></mesh>
          <mesh position={[0.2, 0, 0]}><boxGeometry args={[0.35, 0.18, 0.12]}/><meshStandardMaterial color="#111"/></mesh>
          <mesh position={[0, 0, 0]}><boxGeometry args={[0.25, 0.06, 0.12]}/><meshStandardMaterial color="#111"/></mesh>
        </group>
      )}

      {accessory === 'chapeu' && (
        <group position={[0, 1.8, 0.4]}>
          <mesh rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.45, 0.65, 0.35, 16]} />
            <meshStandardMaterial color="#1a1a2e" />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.8, 0.1, 0.5]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
        </group>
      )}

      {accessory === 'capa' && (
        <mesh position={[0, 0.6, -0.2]} rotation={[-0.15, 0, 0]}>
          <boxGeometry args={[1.2, 0.15, 1.6]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      )}

      {accessory === 'cajado' && (
        <group position={[-0.5, 1.3, -0.1]}>
          <mesh position={[0, -0.3, 0]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.08, 1.2, 0.08]} />
            <meshStandardMaterial color="#92400e" />
          </mesh>
          <mesh position={[0.15, 0.4, 0]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
        </group>
      )}

      {accessory === 'coroa' && (
        <group position={[0, 1.85, 0.3]} rotation={[0, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.5, 0.08, 8, 32]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
          {[-0.35, -0.12, 0.12, 0.35].map((x, i) => (
            <mesh key={i} position={[x, 0.35, 0]}>
              <boxGeometry args={[0.08, 0.3, 0.08]} />
              <meshStandardMaterial color="#fbbf24" />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

export default function VoxelAvatar({ color, accessory, gender }) {
  return (
    <div style={{ width: '100%', height: '280px', cursor: 'grab', position: 'relative' }}>
      <Canvas camera={{ position: [3, 1.5, 3.5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.8} />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#8b5cf6" />
        <ContactShadows position={[0, -0.1, 0]} opacity={0.5} scale={12} blur={2.5} far={5} />
        <CatModel color={color} accessory={accessory} gender={gender} />
        <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={true} minDistance={2} maxDistance={6} />
      </Canvas>
      <div style={{
        position: 'absolute',
        bottom: 8,
        left: 8,
        fontSize: 11,
        color: '#999',
        pointerEvents: 'none'
      }}>
        Clique e arraste para rotacionar
      </div>
    </div>
  );
}