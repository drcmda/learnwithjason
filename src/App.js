import * as THREE from 'three'
import React, { Suspense, useState, useEffect } from 'react'
import { Canvas, useLoader } from 'react-three-fiber'
import { useTransition, a } from 'react-spring'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls, draco } from 'drei'

function Model({ url }) {
  const { nodes, materials } = useLoader(GLTFLoader, url, draco())
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -7, 0]} scale={[7, 7, 7]}>
      <group rotation={[Math.PI / 13.5, -Math.PI / 5.8, Math.PI / 5.6]}>
        <mesh castShadow receiveShadow geometry={nodes.planet001.geometry} material={materials.scene} />
        <mesh castShadow receiveShadow geometry={nodes.planet002.geometry} material={materials.scene} />
      </group>
    </group>
  )
}

function Loading() {
  const [finished, set] = useState(false)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    THREE.DefaultLoadingManager.onLoad = () => set(true)
    THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) =>
      setWidth((itemsLoaded / itemsTotal) * 200)
  }, [])

  const props = useTransition(finished, null, {
    from: { opacity: 1, width: 0 },
    leave: { opacity: 0 },
    update: { width },
  })

  return props.map(
    ({ item: finished, key, props: { opacity, width } }) =>
      !finished && (
        <a.div className="loading" key={key} style={{ opacity }}>
          <div className="loading-bar-container">
            <a.div className="loading-bar" style={{ width }} />
          </div>
        </a.div>
      ),
  )
}

export default function App() {
  return (
    <>
      <div className="bg" />
      <h1>
        LEARN
        <br />
        <span>w/JASON</span>
      </h1>
      <Canvas shadowMap camera={{ position: [0, 0, 15] }}>
        <ambientLight intensity={0.75} />
        <pointLight intensity={1} position={[-10, -25, -10]} />
        <spotLight
          castShadow
          intensity={2.25}
          angle={0.2}
          penumbra={1}
          position={[25, 25, 25]}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />
        <fog attach="fog" args={['#cc7b32', 16, 20]} />
        <Suspense fallback={null}>
          <Model url="/scene-draco.gltf" />
        </Suspense>
        <OrbitControls
          autoRotate
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.5}
          rotateSpeed={1}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
      <div className="layer" />
      <Loading />
      <a href="https://github.com/drcmda/learnwithjason" className="top-left" children="Github" />
      <a href="https://twitter.com/0xca0a" className="top-right" children="Twitter" />
      <a href="https://github.com/drcmda/react-three-fiber" className="bottom-left" children="+ react-three-fiber" />
    </>
  )
}
