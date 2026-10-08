import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  Group,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  Points,
  Quaternion,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
} from 'three'
import { ESTADOS, type Estado, type IdForma, TOTAL_ESTADOS } from '@/lib/estados'
import { CORES, FIOS, NOS, TRACO } from '@/lib/marca'
import { CenaBase, faixa, type OpcoesCena, suave } from './base'
import { aleatorio, ESCALA_MARCA, GIRO_DA_FORMA, gerarFormas, pontoDaMarca } from './formas'

/**
 * A constelação: o "A" da Abram em fios de ouro, e dezenas de milhares de
 * partículas que viram, conforme a rolagem, a janela de um site, o
 * redemoinho do tráfego, o gráfico da medição — e voltam a ser o "A".
 *
 * Duas camadas:
 *
 *   · **Partículas** (um `Points` só, num shader próprio). Cada partícula tem
 *     a sua posição em TODAS as formas (formas.ts); o shader mistura a forma
 *     de saída com a de chegada, com atraso por partícula — elas não andam
 *     em bloco, decolam uma a uma, fazem curva no ar e pousam. A CPU não
 *     move partícula nenhuma: só troca qual par de formas está ligado e
 *     manda o quanto da mistura.
 *   · **Escultura** — os fios do logotipo como cilindros de metal e os nós
 *     como esferas, refletindo o estúdio cozido em base.ts. Quando a página
 *     sai da marca, cada fio se recolhe até sumir (a direita primeiro, como o
 *     logotipo se desfaz), e a mesma silhueta fica desenhada só em pó.
 *
 * Interação: o mouse afasta as partículas; o clique solta uma onda; o
 * arrasto gira a peça (CenaBase).
 */

const VERTICE = /* glsl */ `
uniform float uMix;
uniform float uTempo;
uniform float uGiroDe;
uniform float uGiroPara;
uniform float uPx;
uniform float uForca;
uniform float uAgito;
uniform float uOnda;
uniform vec3 uPonteiro;
uniform vec3 uOndaCentro;
attribute vec3 aDe;
attribute vec3 aPara;
attribute vec4 aSemente;
attribute float aTam;
varying float vBrilho;
varying float vNo;

vec3 girar(vec3 p, float k) {
  if (k == 0.0) return p;
  float a = uTempo * k * 0.35 / (length(p.xz) * 0.8 + 0.25);
  float c = cos(a);
  float s = sin(a);
  return vec3(c * p.x - s * p.z, p.y, s * p.x + c * p.z);
}

void main() {
  // Cada partícula decola num instante: o voo é uma revoada, não um bloco.
  float atraso = aSemente.x * 0.45;
  float m = smoothstep(atraso, atraso + 0.55, uMix);
  vec3 p = mix(girar(aDe, uGiroDe), girar(aPara, uGiroPara), m);

  // No meio do voo, a curva: um campo de senos que desvia cada uma.
  float voo = sin(3.14159 * m);
  vec3 campo = vec3(
    sin(p.y * 2.3 + uTempo * 0.9 + aSemente.y * 30.0),
    sin(p.z * 2.1 + uTempo * 1.1 + aSemente.z * 30.0),
    sin(p.x * 2.7 + uTempo * 0.8 + aSemente.w * 30.0)
  );
  p += campo * (voo * 0.5 + uAgito * 0.22);
  // Parada, ela respira.
  p += 0.012 * vec3(
    sin(uTempo * 0.8 + aSemente.y * 40.0),
    cos(uTempo * 0.7 + aSemente.z * 40.0),
    sin(uTempo * 0.6 + aSemente.w * 40.0)
  );

  vec4 w = modelMatrix * vec4(p, 1.0);

  // O mouse abre caminho.
  vec2 d = w.xy - uPonteiro.xy;
  float dist = length(d);
  w.xy += d / (dist + 0.001) * uForca * exp(-dist * dist * 5.0) * 0.42;

  // A onda do clique: um anel que se expande e levanta o que atravessa.
  if (uOnda < 2.5) {
    vec2 o = w.xy - uOndaCentro.xy;
    float r = length(o);
    float frente = uOnda * 3.4;
    float f = exp(-pow((r - frente) * 2.6, 2.0)) * (1.0 - uOnda / 2.5);
    w.xy += o / (r + 0.001) * f * 0.38;
    w.z += f * 0.5;
  }

  vec4 mv = viewMatrix * w;
  gl_Position = projectionMatrix * mv;
  float pisca = 0.62 + 0.38 * sin(uTempo * (1.3 + aSemente.y * 3.0) + aSemente.z * 60.0);
  gl_PointSize = aTam * uPx * (0.85 + 0.3 * pisca) / -mv.z;
  vBrilho = pisca * (0.5 + 0.5 * aSemente.w) + voo * 0.45;
  vNo = step(0.04, aTam);
}
`

const FRAGMENTO = /* glsl */ `
uniform vec3 uOuro;
uniform vec3 uClaro;
uniform float uOpacidade;
varying float vBrilho;
varying float vNo;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float halo = smoothstep(0.5, 0.0, d);
  float nucleo = smoothstep(0.17, 0.0, d);
  vec3 cor = mix(uOuro, uClaro, nucleo * 0.85 + vNo * 0.15);
  float a = (halo * halo * (0.45 + vNo * 0.35) + nucleo * 0.85) * vBrilho * uOpacidade;
  gl_FragColor = vec4(cor, a);
}
`

/** O que a página lê da cena a cada quadro (o painel ao vivo). */
export type Leitura = { fps: number; particulas: number }

const ease = (t: number) => t * t * (3 - 2 * t)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/* ── A escultura ──────────────────────────────────────────────────────── */

class Escultura {
  readonly grupo = new Group()
  private fios: InstancedMesh
  private esferas: InstancedMesh
  /** Pose de repouso de cada instância, e quando ela se recolhe (0…1). */
  private baseFios: { pos: Vector3; rot: Quaternion; raio: number; comp: number; vez: number }[] =
    []
  private baseNos: { pos: Vector3; raio: number; vez: number }[] = []
  private m = new Matrix4()
  private escala = new Vector3()
  private semRot = new Quaternion()

  constructor(compacto: boolean) {
    const ouro = new MeshStandardMaterial({
      color: new Color(CORES.ouro),
      metalness: 1,
      roughness: 0.24,
      envMapIntensity: 1.5,
    })
    const cilindro = new CylinderGeometry(1, 1, 1, compacto ? 6 : 10, 1, true)
    const esfera = new SphereGeometry(1, compacto ? 12 : 20, compacto ? 8 : 14)
    this.fios = new InstancedMesh(cilindro, ouro, FIOS.length)
    this.esferas = new InstancedMesh(esfera, ouro, NOS.length)
    this.grupo.add(this.fios, this.esferas)

    const cima = new Vector3(0, 1, 0)
    for (const [a, b, g] of FIOS) {
      const pa = new Vector3(...pontoDaMarca(a))
      const pb = new Vector3(...pontoDaMarca(b))
      const dir = pb.clone().sub(pa)
      const comp = dir.length()
      const pos = pa.clone().add(pb).multiplyScalar(0.5)
      // A direita se desfaz primeiro — o mesmo sentido do logotipo.
      const vez = Math.min(1, Math.max(0, 0.55 - pos.x * 0.32))
      this.baseFios.push({
        pos,
        rot: new Quaternion().setFromUnitVectors(cima, dir.normalize()),
        raio: ((g ? TRACO.grosso : TRACO.fino) / 2) * ESCALA_MARCA * 1.1,
        comp,
        vez,
      })
    }
    for (const [id, r] of NOS) {
      const pos = new Vector3(...pontoDaMarca(id))
      this.baseNos.push({
        pos,
        raio: r * ESCALA_MARCA,
        vez: Math.min(1, Math.max(0, 0.6 - pos.x * 0.3)),
      })
    }
    this.atualizar(1)
  }

  /** `peso` 1 = escultura inteira; 0 = recolhida. */
  atualizar(peso: number) {
    this.grupo.visible = peso > 0.002
    if (!this.grupo.visible) return
    this.baseFios.forEach((f, i) => {
      const v = ease(faixa(peso * 1.45 - f.vez * 0.45, 0, 1))
      this.escala.set(f.raio * (0.25 + 0.75 * v), f.comp * v + 1e-4, f.raio * (0.25 + 0.75 * v))
      this.m.compose(f.pos, f.rot, this.escala)
      this.fios.setMatrixAt(i, this.m)
    })
    this.baseNos.forEach((n, i) => {
      const v = ease(faixa(peso * 1.45 - n.vez * 0.45, 0, 1))
      this.escala.setScalar(n.raio * v + 1e-4)
      this.m.compose(n.pos, this.semRot, this.escala)
      this.esferas.setMatrixAt(i, this.m)
    })
    this.fios.instanceMatrix.needsUpdate = true
    this.esferas.instanceMatrix.needsUpdate = true
  }

  descartar() {
    this.fios.geometry.dispose()
    this.esferas.geometry.dispose()
    ;(this.fios.material as MeshStandardMaterial).dispose()
  }
}

/* ── A cena ───────────────────────────────────────────────────────────── */

export class CenaConstelacao extends CenaBase {
  readonly particulas: number
  private grupo = new Group()
  private material: ShaderMaterial
  private geometria = new BufferGeometry()
  private formas: Record<IdForma, BufferAttribute>
  private ligadas: [IdForma | null, IdForma | null] = [null, null]
  private escultura: Escultura

  /** A abertura: a galáxia se fecha no "A". 0 → 1 depois de `abrir()`. */
  private intro = 0
  private introAtiva = false
  private estreito = false
  private agito = 0
  private sAnterior = 0
  private forca = 0
  private ultimoMovimento = 0
  private ondaInicio = -10
  private alvoPonteiro = new Vector3()
  private aux = new Vector3()

  /** fps medido (média móvel) — para o painel ao vivo. */
  fps = 60
  aoQuadro?: (l: Leitura) => void

  /**
   * Modo calmo ("reduzir movimento" ligado): as formas continuam ligadas à
   * rolagem — quem move é a pessoa —, mas nada se mexe sozinho: sem
   * abertura, sem redemoinho, sem cintilar, sem respirar, sem balanço.
   */
  private calmo: boolean

  constructor(canvas: HTMLCanvasElement, opcoes: OpcoesCena & { calmo?: boolean } = {}) {
    super(canvas, { ...opcoes, fov: 30 })
    this.calmo = opcoes.calmo ?? false
    if (this.calmo) this.intro = 1
    const n = this.compacto ? 13000 : 36000
    const k = this.compacto ? 260 : 560
    this.particulas = n

    const formas = gerarFormas(n, k)
    this.formas = Object.fromEntries(
      Object.entries(formas).map(([id, arr]) => [id, new BufferAttribute(arr, 3)]),
    ) as Record<IdForma, BufferAttribute>

    const r = aleatorio(2026)
    const semente = new Float32Array(n * 4)
    const tam = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < 4; j++) semente[i * 4 + j] = r()
      // Poucas grandes, muitas finas: o pó tem textura.
      tam[i] = i < k ? 0.05 + r() * 0.045 : 0.011 + r() ** 3 * 0.026
    }
    if (this.compacto) for (let i = 0; i < n; i++) tam[i] *= 1.25

    this.geometria.setAttribute('position', this.formas.marca)
    this.geometria.setAttribute('aSemente', new BufferAttribute(semente, 4))
    this.geometria.setAttribute('aTam', new BufferAttribute(tam, 1))
    this.ligar('galaxia', 'marca')

    this.material = new ShaderMaterial({
      vertexShader: VERTICE,
      fragmentShader: FRAGMENTO,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uMix: { value: 0 },
        uTempo: { value: 0 },
        uGiroDe: { value: 0 },
        uGiroPara: { value: 0 },
        uPx: { value: 600 },
        uForca: { value: 0 },
        uAgito: { value: 0 },
        uOnda: { value: 10 },
        uPonteiro: { value: new Vector3(99, 99, 0) },
        uOndaCentro: { value: new Vector3() },
        uOuro: { value: new Color(CORES.ouro) },
        uClaro: { value: new Color('#fff4d6') },
        uOpacidade: { value: 1 },
      },
    })
    const pontos = new Points(this.geometria, this.material)
    pontos.frustumCulled = false

    this.escultura = new Escultura(this.compacto)
    this.grupo.add(this.escultura.grupo, pontos)
    this.cena.add(this.grupo)
    this.camera.position.set(0, 0, 9)

    this.descartaveis.push(this.geometria, this.material, {
      dispose: () => this.escultura.descartar(),
    })
  }

  /** Começa a abertura (a galáxia se fecha no "A"). Chamado quando a cortina sobe. */
  abrir() {
    if (this.calmo) return
    if (this.progresso * TOTAL_ESTADOS > 0.5) {
      this.intro = 1
      return
    }
    this.introAtiva = true
  }

  /** Pula a abertura (foto, retomada no meio da página). */
  pularAbertura() {
    this.intro = 1
    this.introAtiva = false
  }

  /** O clique solta uma onda a partir do ponto (coordenadas normalizadas −1…1). */
  onda(nx: number, ny: number) {
    this.ondaInicio = performance.now()
    this.projetar(nx, ny, this.material.uniforms.uOndaCentro.value as Vector3)
  }

  override definirPonteiro(x: number, y: number) {
    super.definirPonteiro(x, y)
    this.ultimoMovimento = performance.now()
  }

  /** Onde o raio do ponteiro fura o plano z = 0. */
  private projetar(nx: number, ny: number, saida: Vector3) {
    this.aux.set(nx, -ny, 0.5).unproject(this.camera).sub(this.camera.position).normalize()
    const t = -this.camera.position.z / this.aux.z
    saida.copy(this.camera.position).addScaledVector(this.aux, t)
  }

  private ligar(de: IdForma, para: IdForma) {
    if (this.ligadas[0] === de && this.ligadas[1] === para) return
    this.geometria.setAttribute('aDe', this.formas[de])
    this.geometria.setAttribute('aPara', this.formas[para])
    this.ligadas = [de, para]
  }

  protected override aoRedimensionar(w: number, h: number) {
    this.estreito = w / h < 0.85
    // Na tela em pé, a câmera recua: a marca precisa caber na largura.
    this.camera.position.z = this.estreito ? 13.5 : 9
    const altura = h * this.renderer.getPixelRatio()
    this.material.uniforms.uPx.value = altura / (2 * Math.tan((this.camera.fov * Math.PI) / 360))
  }

  /** A pose de um estado, já adaptada à tela. */
  private pose(e: Estado) {
    if (!this.estreito) return e
    // Em pé: tudo centralizado; a marca do herói sobe, acima do título; o
    // que fica no meio da página vira fundo.
    const fundo = e.id !== 'heroi' && e.id !== 'fecho'
    return {
      ...e,
      x: 0,
      y: e.id === 'heroi' ? 1.95 : e.y,
      escala: e.escala * (e.id === 'heroi' ? 0.72 : e.forma === 'marca' ? 0.9 : 0.8),
      op: fundo ? e.op * 0.45 : e.op,
    }
  }

  protected passo(dt: number, t: number) {
    const u = this.material.uniforms

    // A abertura: 2,8 s da galáxia até o "A".
    if (this.introAtiva) {
      this.intro = Math.min(1, this.intro + dt / 2.8)
      if (this.intro >= 1) this.introAtiva = false
    }

    const s = Math.min(TOTAL_ESTADOS, Math.max(0, this.progressoSuave * TOTAL_ESTADOS))
    const i = Math.min(Math.floor(s), TOTAL_ESTADOS - 1)
    const f = s - i
    // Patamar: a forma assenta e fica um tempo parada antes da próxima.
    const m = faixa(f, 0.22, 0.78)
    const a = this.pose(ESTADOS[i])
    const b = this.pose(ESTADOS[Math.min(i + 1, TOTAL_ESTADOS)])

    let mistura = m
    let pesoMarca = (a.forma === 'marca' ? 1 - m : 0) + (b.forma === 'marca' ? m : 0)
    if (this.intro < 1 && s < 0.5) {
      this.ligar('galaxia', 'marca')
      mistura = ease(this.intro)
      pesoMarca = faixa(this.intro, 0.55, 1)
      u.uGiroDe.value = GIRO_DA_FORMA.galaxia
      u.uGiroPara.value = 0
    } else {
      this.intro = 1
      this.introAtiva = false
      this.ligar(a.forma, b.forma)
      u.uGiroDe.value = GIRO_DA_FORMA[a.forma]
      u.uGiroPara.value = GIRO_DA_FORMA[b.forma]
    }
    u.uMix.value = mistura
    // No modo calmo o relógio do shader para: o campo de senos, o giro e o
    // cintilar ficam congelados numa pose bonita.
    u.uTempo.value = this.calmo ? 7.3 : t

    // Pose do grupo, interpolada. Na abertura a galáxia já nasce no lugar do "A".
    const k = ease(m)
    const x = lerp(a.x, b.x, k)
    const y = lerp(a.y, b.y, k)
    const esc = lerp(a.escala, b.escala, k)
    let rx = lerp(a.rx, b.rx, k)
    if (this.intro < 1 && s < 0.5) rx = lerp(1.1, 0, ease(this.intro))
    const ry = lerp(a.ry, b.ry, k)
    // A marca balança devagar, para o volume da escultura aparecer.
    const balanco = this.calmo ? 0 : Math.sin(t * 0.35) * 0.22 * pesoMarca
    this.grupo.position.set(x, y, 0)
    this.grupo.scale.setScalar(esc)
    this.grupo.rotation.set(
      rx + this.giroX + this.ponteiroSuave.y * 0.12,
      ry + this.giro + balanco + this.ponteiroSuave.x * 0.18,
      0,
    )
    u.uOpacidade.value = lerp(a.op, b.op, k) * (this.intro < 1 ? 0.35 + 0.65 * this.intro : 1)
    this.escultura.atualizar(pesoMarca)

    // A rolagem rápida agita o pó.
    const vel = Math.abs(s - this.sAnterior) / Math.max(dt, 1e-3)
    this.sAnterior = s
    this.agito = suave(this.agito, Math.min(1, vel * 0.35), 0.05, dt)
    u.uAgito.value = this.agito

    // O mouse: força plena enquanto mexe, some depois de 2 s parado.
    const parado = performance.now() - this.ultimoMovimento > 2000
    this.forca = suave(this.forca, parado ? 0 : 1, 0.1, dt)
    u.uForca.value = this.forca
    this.projetar(this.ponteiroSuave.x, this.ponteiroSuave.y, this.alvoPonteiro)
    ;(u.uPonteiro.value as Vector3).copy(this.alvoPonteiro)
    u.uOnda.value = (performance.now() - this.ondaInicio) / 1000

    if (dt > 0) this.fps = this.fps * 0.95 + (1 / dt) * 0.05
    this.aoQuadro?.({ fps: this.fps, particulas: this.particulas })
  }
}
