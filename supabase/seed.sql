-- =====================================================
-- SEED DATA: Posts de ejemplo para CDR Blog
-- =====================================================
-- Descripción: Datos de prueba para blog de CDR
-- Fecha: 2026-01-02
-- Uso: Ejecutar DESPUÉS de aplicar schema.sql
-- =====================================================

-- =====================================================
-- TAGS (Taxonomía)
-- =====================================================

INSERT INTO public.tags (id, name, slug) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Impuestos', 'impuestos'),
('550e8400-e29b-41d4-a716-446655440002', 'PYMEs', 'pymes'),
('550e8400-e29b-41d4-a716-446655440003', 'Estrategia', 'estrategia'),
('550e8400-e29b-41d4-a716-446655440004', 'CFO', 'cfo'),
('550e8400-e29b-41d4-a716-446655440005', 'Rentabilidad', 'rentabilidad'),
('550e8400-e29b-41d4-a716-446655440006', 'Cashflow', 'cashflow'),
('550e8400-e29b-41d4-a716-446655440007', 'Finanzas', 'finanzas'),
('550e8400-e29b-41d4-a716-446655440008', 'Diagnóstico', 'diagnostico'),
('550e8400-e29b-41d4-a716-446655440009', 'Presupuesto', 'presupuesto')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- POSTS (Artículos del Blog)
-- =====================================================

-- Insertar posts de ejemplo
INSERT INTO public.posts (
  id,
  title,
  slug,
  excerpt,
  content_md,
  status,
  published_at,
  seo_title,
  seo_description,
  created_at,
  updated_at
) VALUES
(
  '650e8400-e29b-41d4-a716-446655440001',
  'Por qué tu margen neto te miente (y cómo arreglarlo)',
  'margen-neto-real',
  'Muchos dueños de PYMEs confunden margen bruto con neto o ignoran costos ocultos. Descubrí cómo calcular tu rentabilidad real.',
  E'# La trampa del margen bruto

Muchos emprendedores miran el precio de compra y el precio de venta, y asumen que la diferencia es ganancia. **Error fatal.**

## Los costos ocultos

* Impuestos directos e indirectos (IIBB, Ganancias, Débitos/Créditos)
* Costos financieros de las tarjetas
* Costos de estructura fijos prorrateados

Si no tenés un Excel dinámico o un sistema que contemple esto, estás tomando decisiones a ciegas.

### ¿Qué hacer?

1. Listar todos los costos fijos.
2. Calcular el punto de equilibrio.
3. Revisar precios semanalmente si hay inflación.

_La rentabilidad no es lo que sobra en la caja, es lo que dice el estado de resultados bien hecho._',
  'published',
  NOW() - INTERVAL '30 days',
  'Cómo Calcular tu Margen Neto Real | CFO Fractional',
  'Aprende a identificar costos ocultos y calcular tu rentabilidad real para tomar mejores decisiones en tu PYME.',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '30 days'
),
(
  '650e8400-e29b-41d4-a716-446655440002',
  '5 señales de que necesitás un CFO Fractional',
  'senales-cfo-fractional',
  '¿Tu contador solo liquida impuestos? Es hora de pensar en estrategia financiera sin contratar un gerente full-time.',
  E'# ¿Contador o CFO?

Tu contador mira el pasado (lo que ya facturaste). Un CFO mira el futuro (cómo vas a financiar tu crecimiento).

## Señales de alerta

1. **Caja impredecible:** Nunca sabés si llegás a fin de mes.
2. **Crecés pero no ganás:** Vendés más pero la cuenta bancaria no sube.
3. **Deuda mala:** Te financiás con descubiertos caros.

Un **CFO Fractional** te da la jerarquía de un director financiero, pero por una fracción del costo, ideal para empresas de 10 a 50 empleados.',
  'published',
  NOW() - INTERVAL '20 days',
  '5 Señales de que Necesitas un CFO Fractional',
  'Identificá si tu empresa necesita dirección financiera estratégica sin el costo de un CFO full-time.',
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '20 days'
),
(
  '650e8400-e29b-41d4-a716-446655440003',
  'Planificación Fiscal: No es evadir, es ser inteligente',
  'planificacion-fiscal-inteligente',
  'Pagar lo justo es un derecho. Estrategias legales para optimizar tu carga tributaria antes del cierre fiscal.',
  E'# La diferencia entre evasión y elusión

Evasión es delito. Elusión (o planificación fiscal) es usar la ley a tu favor.

## Herramientas comunes

* Ajuste de fechas de facturación.
* Inversiones que deducen ganancias (ej. equipamiento).
* Correcto encuadre societario (SAS, SRL, SA).

No esperes a que llegue el vencimiento. La planificación se hace meses antes.',
  'published',
  NOW() - INTERVAL '10 days',
  'Planificación Fiscal Inteligente para PYMEs',
  'Estrategias legales para optimizar impuestos y mejorar tu rentabilidad sin riesgos.',
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '10 days'
),
(
  '650e8400-e29b-41d4-a716-446655440004',
  'Cómo proyectar tu Cashflow en tiempos de incertidumbre',
  'proyeccion-cashflow',
  'Una guía paso a paso para armar un flujo de fondos que resista la inflación y los cambios de mercado.',
  E'# El Cashflow es rey

En tiempos de inflación y volatilidad, el cashflow es más importante que la rentabilidad contable.

## Pasos para una proyección sólida

1. **Mapear ingresos reales**: No promedios, sino fechas de cobro.
2. **Detallar salidas fijas y variables**: Todo, hasta el café de oficina.
3. **Construir 3 escenarios**: Pesimista, realista, optimista.

Con una proyección a 90 días, podés anticipar crisis y aprovechar oportunidades.',
  'published',
  NOW() - INTERVAL '5 days',
  'Cómo Proyectar Cashflow en Incertidumbre',
  'Guía práctica para construir proyecciones de flujo de fondos robustas ante inflación y volatilidad.',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
),
(
  '650e8400-e29b-41d4-a716-446655440005',
  '[BORRADOR] El error de mezclar finanzas personales con las de la empresa',
  'finanzas-personales-empresa',
  'Uno de los errores más comunes en emprendedores: usar la cuenta de la empresa como caja chica personal.',
  E'# Separar es profesionalizar

Contenido en desarrollo...',
  'draft',
  NULL,
  NULL,
  NULL,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
)
ON CONFLICT (slug) DO NOTHING;

-- Relacionar posts con tags
INSERT INTO public.post_tags (post_id, tag_id) VALUES
-- Post 1: Margen neto
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005'), -- rentabilidad
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'), -- pymes

-- Post 2: CFO Fractional
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004'), -- cfo
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'), -- estrategia

-- Post 3: Planificación fiscal
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001'), -- impuestos
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003'), -- estrategia

-- Post 4: Cashflow
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440006'), -- cashflow
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440007'), -- finanzas

-- Post 5: Draft (sin tags aún)
ON CONFLICT DO NOTHING;

-- Confirmar datos insertados
SELECT 
    'Posts' as tabla, 
    COUNT(*) as cantidad 
FROM public.posts
UNION ALL
SELECT 
    'Tags' as tabla, 
    COUNT(*) as cantidad 
FROM public.tags
UNION ALL
SELECT 
    'Post-Tags Relations' as tabla, 
    COUNT(*) as cantidad 
FROM public.post_tags;
