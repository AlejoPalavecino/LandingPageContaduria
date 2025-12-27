import { Post } from '../types';

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Por qué tu margen neto te miente (y cómo arreglarlo)',
    slug: 'margen-neto-real',
    excerpt: 'Muchos dueños de PYMEs confunden margen bruto con neto o ignoran costos ocultos. Descubrí cómo calcular tu rentabilidad real.',
    date: '2023-10-15',
    tags: ['costos', 'pymes', 'rentabilidad'],
    status: 'published',
    contentMarkdown: `
# La trampa del margen bruto

Muchos emprendedores miran el precio de compra y el precio de venta, y asumen que la diferencia es ganancia. **Error fatal.**

## Los costos ocultos

*   Impuestos directos e indirectos (IIBB, Ganancias, Débitos/Créditos)
*   Costos financieros de las tarjetas
*   Costos de estructura fijos prorrateados

Si no tenés un Excel dinámico o un sistema que contemple esto, estás tomando decisiones a ciegas.

### ¿Qué hacer?

1.  Listar todos los costos fijos.
2.  Calcular el punto de equilibrio.
3.  Revisar precios semanalmente si hay inflación.

_La rentabilidad no es lo que sobra en la caja, es lo que dice el estado de resultados bien hecho._
    `
  },
  {
    id: '2',
    title: '5 señales de que necesitás un CFO Fractional',
    slug: 'senales-cfo-fractional',
    excerpt: '¿Tu contador solo liquida impuestos? Es hora de pensar en estrategia financiera sin contratar un gerente full-time.',
    date: '2023-10-22',
    tags: ['estrategia', 'cfo', 'crecimiento'],
    status: 'published',
    contentMarkdown: `
# ¿Contador o CFO?

Tu contador mira el pasado (lo que ya facturaste). Un CFO mira el futuro (cómo vas a financiar tu crecimiento).

## Señales de alerta

1.  **Caja impredecible:** Nunca sabés si llegás a fin de mes.
2.  **Crecés pero no ganás:** Vendés más pero la cuenta bancaria no sube.
3.  **Deuda mala:** Te financiás con descubiertos caros.

Un **CFO Fractional** te da la jerarquía de un director financiero, pero por una fracción del costo, ideal para empresas de 10 a 50 empleados.
    `
  },
  {
    id: '3',
    title: 'Planificación Fiscal: No es evadir, es ser inteligente',
    slug: 'planificacion-fiscal-inteligente',
    excerpt: 'Pagar lo justo es un derecho. Estrategias legales para optimizar tu carga tributaria antes del cierre fiscal.',
    date: '2023-11-05',
    tags: ['impuestos', 'legal', 'estrategia'],
    status: 'published',
    contentMarkdown: `
# La diferencia entre evasión y elusión

Evasión es delito. Elusión (o planificación fiscal) es usar la ley a tu favor.

## Herramientas comunes

*   Ajuste de fechas de facturación.
*   Inversiones que deducen ganancias (ej. equipamiento).
*   Correcto encuadre societario (SAS, SRL, SA).

No esperes a que llegue el vencimiento. La planificación se hace meses antes.
    `
  },
  {
    id: '4',
    title: 'Cómo proyectar tu Cashflow en tiempos de incertidumbre',
    slug: 'proyeccion-cashflow',
    excerpt: 'Una guía paso a paso para armar un flujo de fondos que resista la inflación y los cambios de mercado.',
    date: '2023-09-10',
    tags: ['cashflow', 'proyecciones', 'finanzas'],
    status: 'published',
    contentMarkdown: 'Contenido sobre cashflow...'
  },
  {
    id: '5',
    title: 'Borrador: Estrategias de precios 2024',
    slug: 'estrategias-precios-2024',
    excerpt: 'Post en construcción sobre precios.',
    date: '2023-11-20',
    tags: ['precios', 'draft'],
    status: 'draft',
    contentMarkdown: 'Contenido borrador...'
  },
  {
    id: '6',
    title: 'El error de mezclar finanzas personales con las de la empresa',
    slug: 'finanzas-personales-empresa',
    excerpt: 'Si sacás plata de la caja para el súper, este post es para vos. Cómo ordenar los retiros de los socios.',
    date: '2023-08-01',
    tags: ['orden', 'socios'],
    status: 'published',
    contentMarkdown: 'Contenido sobre retiros...'
  }
];