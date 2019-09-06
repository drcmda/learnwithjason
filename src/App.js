import * as THREE from 'three'
import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useThree, useRender, useLoader, extend } from 'react-three-fiber'
import { useSpring, a } from 'react-spring/three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

extend({ OrbitControls })
const Controls = props => {
  const { gl, camera } = useThree()
  const ref = useRef()
  useRender(() => ref.current.update())
  return <orbitControls ref={ref} args={[camera, gl.domElement]} {...props} />
}

function Model({ url }) {
  const model = useLoader(GLTFLoader, url, loader => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco-gltf/')
    loader.setDRACOLoader(dracoLoader)
  })
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -7, 0]} scale={[7, 7, 7]}>
      {model.map(({ geometry, material }) => (
        <mesh
          key={geometry.uuid}
          rotation={[Math.PI / 13.5, -Math.PI / 5.8, Math.PI / 5.6]}
          geometry={geometry}
          castShadow
          receiveShadow>
          <meshStandardMaterial attach="material" map={material.map} roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

export default function App() {
  return (
    <>
      <h1>LEARN<br/><span>w/JASON</span></h1>
      <Canvas
        camera={{ position: [0, 0, 15] }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true
          gl.shadowMap.type = THREE.PCFSoftShadowMap
        }}>
        <ambientLight intensity={1.5} />
        <pointLight intensity={2} position={[-10, -25, -10]} />
        <spotLight
          castShadow
          intensity={1.25}
          angle={Math.PI / 8}
          position={[25, 25, 15]}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <fog attach="fog" args={['#cc7b32', 16, 20]} />
        <Model url="/scene-draco.gltf" />
        <Controls
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
      <div class="layer" />
      <a href="https://github.com/drcmda/react-three-fiber" class="top-left" children="Github" />
      <a href="https://twitter.com/0xca0a" class="top-right" children="Twitter" />
      <a href="https://github.com/react-spring/react-spring" class="bottom-left" children="+ react-spring" />
    </>
  )
}
