import * as THREE from 'three'

export function initBlackHole(canvas: HTMLCanvasElement): () => void {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const setSize = () => renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
  setSize()

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
  camera.position.set(0, 0.8, 3.5)
  camera.lookAt(0, 0, 0)

  // ── Campo de estrellas estático y sutil ────────────────────────────────────
  const starCount = 1200
  const starPos = new Float32Array(starCount * 3)
  const starSizes = new Float32Array(starCount)
  for (let i = 0; i < starCount; i++) {
    // Distribuir en una esfera grande
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.acos(2 * Math.random() - 1)
    const r     = 8 + Math.random() * 8
    starPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
    starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    starPos[i * 3 + 2] = r * Math.cos(phi)
    starSizes[i] = Math.random() * 1.5 + 0.3
  }
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
  starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1))

  const starMat = new THREE.ShaderMaterial({
    uniforms: { uOpacity: { value: 0.55 } },
    vertexShader: /* glsl */`
      attribute float size;
      void main() {
        gl_PointSize = size;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */`
      uniform float uOpacity;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float alpha = smoothstep(1.0, 0.2, d) * uOpacity;
        gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  scene.add(new THREE.Points(starGeo, starMat))

  // ── Disco de acreción ──────────────────────────────────────────────────────
  const diskGeo = new THREE.TorusGeometry(1.15, 0.28, 64, 180)
  const diskMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime:   { value: 0 },
      uScroll: { value: 0 },
    },
    vertexShader: /* glsl */`
      varying vec2 vUv;
      varying float vAngle;
      varying float vRadius;
      void main() {
        vUv = uv;
        vAngle = atan(position.y, position.x);
        vRadius = length(position.xy);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */`
      uniform float uTime;
      uniform float uScroll;
      varying vec2 vUv;
      varying float vAngle;
      varying float vRadius;

      void main() {
        // Rotación luminosa en el disco
        float wave = sin(vAngle * 6.0 - uTime * 1.8 + uScroll * 2.0) * 0.5 + 0.5;
        float wave2 = sin(vAngle * 3.0 + uTime * 0.9) * 0.5 + 0.5;
        float brightness = mix(wave, wave2, 0.4);

        // Colores: naranja caliente → morado
        vec3 hot    = vec3(1.0,  0.45, 0.1);
        vec3 mid    = vec3(0.85, 0.2,  0.5);
        vec3 cool   = vec3(0.4,  0.1,  0.85);
        vec3 color  = mix(cool, mix(hot, mid, brightness), brightness);

        // Fade en los bordes del tubo
        float edgeFade = smoothstep(0.0, 0.45, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
        float alpha = edgeFade * (0.6 + brightness * 0.4);

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const disk = new THREE.Mesh(diskGeo, diskMat)
  disk.rotation.x = Math.PI * 0.32
  scene.add(disk)

  // ── Esfera negra central ───────────────────────────────────────────────────
  const holeGeo = new THREE.SphereGeometry(0.52, 64, 64)
  const holeMat = new THREE.MeshBasicMaterial({ color: 0x000000 })
  scene.add(new THREE.Mesh(holeGeo, holeMat))

  // ── Halo gravitacional (rim glow) ──────────────────────────────────────────
  const haloGeo = new THREE.SphereGeometry(0.62, 64, 64)
  const haloMat = new THREE.ShaderMaterial({
    vertexShader: /* glsl */`
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */`
      varying vec3 vNormal;
      void main() {
        float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
        rim = pow(rim, 2.2);
        vec3 color = mix(vec3(0.4, 0.1, 0.9), vec3(1.0, 0.4, 0.1), rim * 0.5);
        gl_FragColor = vec4(color, rim * 0.7);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.FrontSide,
  })
  scene.add(new THREE.Mesh(haloGeo, haloMat))

  // ── Scroll ─────────────────────────────────────────────────────────────────
  let scrollY = 0
  const onScroll = () => { scrollY = window.scrollY }
  window.addEventListener('scroll', onScroll, { passive: true })

  // ── Resize ─────────────────────────────────────────────────────────────────
  const onResize = () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
    setSize()
  }
  window.addEventListener('resize', onResize)

  // ── Loop ───────────────────────────────────────────────────────────────────
  let rafId = 0
  const clock = new THREE.Clock()

  const animate = () => {
    rafId = requestAnimationFrame(animate)
    const t = clock.getElapsedTime()
    const scrollFrac = scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1)

    diskMat.uniforms['uTime']!.value   = t
    diskMat.uniforms['uScroll']!.value = scrollFrac

    // Rotación suave del disco
    disk.rotation.z = t * 0.12

    // Cámara sube levemente con el scroll
    camera.position.y = 0.8 + scrollFrac * 0.6

    renderer.render(scene, camera)
  }
  animate()

  return () => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    renderer.dispose()
  }
}
