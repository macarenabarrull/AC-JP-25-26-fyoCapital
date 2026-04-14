export type IconKey = 'Compass' | 'Target' | 'BrainCircuit' | 'Layers' | 'Zap' | 'ClipboardCheck' | 'Heart' | 'Sparkles' | 'Users' | 'DollarSign' | 'Briefcase' | 'Calendar' | 'GraduationCap' | 'FileText' | 'Flag' | 'PencilRuler' | 'Search' | 'FileSignature' | 'Rocket' | 'BarChart3';

export interface SlideData {
  id: string;
  type: 'cover' | 'image' | 'objectives' | 'info' | 'grid' | 'table-capital' | 'closing' | 'tutor-content' | 'ecosystem-circles' | 'interactive-dynamic' | 'evaluator-mindset' | 'observation-tips' | 'investment' | 'candidate-guide';
  title?: string;
  subtitle?: string;
  content?: any;
  theme?: 'light' | 'dark' | 'brand';
}

export const SLIDES: SlideData[] = [
  {
    id: 'cover',
    type: 'cover',
    title: 'PROGRAMA JP 25-26 🚀',
    subtitle: 'assessment center',
    theme: 'brand',
    content: {
      highlight: 'fyo',
      tags: ['Somos un equipo', 'Creamos oportunidades', 'Pensamos en grande']
    }
  },
  {
    id: 'agenda',
    type: 'table-capital',
    title: 'CRONOGRAMA DE LA JORNADA 📅',
    subtitle: 'Actividades programadas para hoy',
    theme: 'light',
    content: {
      headers: ['Horario', 'Actividad', 'Duración'],
      rows: [
        ['09:30 - 09:45', 'PRESENTACIÓN INSTITUCIONAL DE FYO', '15 min'],
        ['09:45 - 10:30', 'DINÁMICA 1: DIME QUIÉN ERES...', '45 min'],
        ['10:30 - 12:15', 'DINÁMICA 2: TURBULENCIA EN LA OFICINA', '105 min'],
        ['12:15 - 12:35', '¡TOMÉMONOS UN DESCANSO!', '20 min'],
        ['12:35 - 12:55', 'ENTREVISTAS INDIVIDUALES', '20 min']
      ]
    }
  },
  {
    id: 'que-hacemos',
    type: 'info',
    title: 'NUESTRA EMPRESA 📜',
    subtitle: 'La esencia que impulsa nuestra transformación',
    theme: 'light',
    content: {
      mainText: 'En fyo trabajamos para ofrecer respuestas innovadoras y a medida, adaptadas a cada cliente.\n\nBuscamos ser una solución personalizada, innovadora y única.\n\nAsí fue como nos animamos a ser digitales en el mercado más tradicional de Argentina.',
      description: 'Desafiamos lo establecido para potenciar el futuro del agro.',
      highlight: 'CREAMOS VALOR EN CADA CADENA DEL AGRO 🚀'
    }
  },
  {
    id: 'ecosistema',
    type: 'ecosystem-circles',
    title: 'ECOSISTEMA INTEGRAL 🌐',
    subtitle: 'Ofrecemos un ecosistema que abarca toda la cadena comercial agro.',
    theme: 'light',
    content: {
      items: [
        { name: 'fyoDigital', color: 'bg-indigo-400' },
        { name: 'fyoFood', color: 'bg-indigo-500' },
        { name: 'fyoCapital', color: 'bg-indigo-600' },
        { name: 'fyoAdvisory', color: 'bg-indigo-700' },
        { name: 'fyoAcopio', color: 'bg-indigo-800' },
        { name: 'fyoCredits', color: 'bg-indigo-900' }
      ]
    }
  },
  {
    id: 'valores',
    type: 'tutor-content',
    title: 'CULTURA Y PROPÓSITO ✨',
    subtitle: 'Lo que nos mueve y hacia dónde vamos',
    theme: 'brand',
    content: {
      description: 'Nuestra cultura se basa en la confianza, la colaboracion y la innovación constante.',
      vision: 'Ser la empresa líder en potenciar los negocios de nuestros clientes.',
      valores: [
        { title: 'Somos un equipo', icon: 'Users', color: 'bg-blue-600' },
        { title: 'Pensamos en grande', icon: 'Rocket', color: 'bg-blue-500' },
        { title: 'Creamos oportunidades', icon: 'Zap', color: 'bg-blue-400' }
      ]
    }
  },
  {
    id: 'assessment-cover',
    type: 'cover',
    title: 'ASSESSMENT CENTER 🎯',
    subtitle: '¿Estan listos?',
    theme: 'brand',
    content: {
      highlight: 'Evaluación',
      tags: ['Dinámicas 🎨', 'Casos 💡', 'Talento ✨']
    }
  },
  {
    id: 'dinamica-1',
    type: 'cover',
    title: 'DINÁMICA 1: DIME QUIÉN ERES... 🎨',
    subtitle: 'Assessment Center fyo',
    theme: 'light',
    content: {
      highlight: 'Presentación',
      tags: ['Conocernos 🤝', 'Romper el hielo 🧊']
    }
  },
  {
    id: 'dinamica-2',
    type: 'interactive-dynamic',
    title: 'DINÁMICA 2: TURBULENCIA EN LA OFICINA 🏢',
    subtitle: 'FASE 1 - CONSTRUCCIÓN',
    theme: 'light',
    content: {
      phase: 1,
      consigna: '¡Bienvenido!\nAcaban de fundar su propia agencia de viajes. Tienen 30 minutos para definir la identidad de su marca (Nombre y Eslogan) y estructurar la logística del gran viaje de su temporada.',
      rolesIntro: 'Para que la agencia funcione, cada miembro del equipo debe asumir obligatoriamente uno de los siguientes roles. Elijan sabiamente quién ocupa cada silla:',
      roles: [
        { name: 'CEO', title: 'Director Comercial', desc: 'Toma la decisión final si hay empate. Es la cara visible de la empresa y quien lidera la presentación.', icon: 'Users' },
        { name: 'CMO', title: 'Director de Marketing', desc: 'El guardián de la marca. Su objetivo es definir cómo la marca conecta con el público, lidera la estrategia de ventas, precios y productos.', icon: 'DollarSign' },
        { name: 'COO', title: 'Director de Operaciones', desc: 'El encargado de la logística. Habla con proveedores, aerolíneas, hoteles y busca alternativas si un vuelo se cancela o un hotel cierra.', icon: 'Layers' },
        { name: 'CCO', title: 'Director de Comunicación', desc: 'El responsable de hablar con los clientes. Tiene que tener el tacto para calmar a la gente enojada y venderles soluciones alternativas.', icon: 'Mail' }
      ],
      tips: [
        'El tiempo vuela. No se estanquen en elegir el nombre perfecto; el negocio tiene que avanzar.',
        'Piensen en el cliente, pero protejan la rentabilidad de su agencia.',
        'Escúchense. Un equipo desalineado pierde clientes.'
      ],
      cards: [
        { id: 1, color: 'bg-indigo-600', frontText: 'Fiebre mundialista', backText: 'Viaje a Estados Unidos para el Mundial. Paquete premium que incluye entradas a 3 partidos, hoteles 5 estrellas y traslados internos.' },
        { id: 2, color: 'bg-emerald-600', frontText: 'Aventura exótica', backText: 'Viaje al Sudeste Asiático (Tailandia, Vietnam, Bali). Paquete enfocado en turismo aventura, espiritualidad y playas paradisíacas por 21 días.' },
        { id: 3, color: 'bg-amber-600', frontText: 'Lujo europeo', backText: 'Un tour súper exclusivo por Europa (París, Alpes Suizos, Roma) diseñado para 50 clientes VIP de altísimo poder adquisitivo (CEOs, celebridades).' }
      ]
    }
  },
  {
    id: 'investment-sheet',
    type: 'investment',
    title: '💰 FICHA DE INVERSIÓN',
    subtitle: 'Gestión de presupuesto - Agencia de Viajes',
    theme: 'light',
    content: {
      budget: 200000,
      topics: [
        {
          id: 'providers',
          title: '1. Nivel de proveedores (Hoteles y Aerolíneas)',
          options: [
            { id: 'low-cost', name: 'Opción Low-Cost', price: 40000, desc: 'Sin política de reembolso. Si se cancela, se pierde el 100%.' },
            { id: 'flexible', name: 'Opción Flexible', price: 90000, desc: 'Reembolso del 50% en caso de fuerza mayor o crisis geopolítica.' },
            { id: 'vip', name: 'Opción VIP/Blindada', price: 120000, desc: 'Cambios ilimitados y reembolsos totales, pero margen de ganancia muy bajo para la agencia.' }
          ]
        },
        {
          id: 'support',
          title: '2. Infraestructura de atención al cliente',
          options: [
            { id: 'basic', name: 'Soporte Básico', price: 20000, desc: 'Solo una línea de WhatsApp. Se satura fácilmente ante crisis masivas.' },
            { id: 'omnichannel', name: 'Soporte Omnicanal', price: 50000, desc: 'Equipo de respuesta rápida y sistema de CRM para gestionar reclamos en tiempo real.' }
          ]
        },
        {
          id: 'insurance',
          title: '3. Seguros y contingencias',
          options: [
            { id: 'civil', name: 'Seguro de responsabilidad civil', price: 30000, desc: 'Cubre solo accidentes físicos menores. No cubre terrorismo ni fallos financieros.' },
            { id: 'crisis', name: 'Seguro de "Gran Crisis"', price: 80000, desc: 'Cubre gastos de repatriación y alojamiento de emergencia ante cierres de espacio aéreo.' }
          ]
        }
      ]
    }
  },
  {
    id: 'dinamica-2-crisis',
    type: 'interactive-dynamic',
    title: 'DINÁMICA 2: TURBULENCIA EN LA OFICINA 🏢',
    subtitle: 'FASE 2 - GESTIÓN DE CRISIS',
    theme: 'light',
    content: {
      phase: 2,
      alertText: '¡ÚLTIMO MOMENTO!',
      cards: [
        { id: 1, color: 'bg-red-600', frontText: 'Fiebre mundialista', backText: 'Tensión geopolítica extrema. Irán insinúa un posible atentado en las sedes del Mundial. Las aerolíneas están cancelando vuelos por precaución, el pánico es generalizado y los clientes están saturando las líneas exigiendo garantías de seguridad.' },
        { id: 2, color: 'bg-red-700', frontText: 'Aventura exótica', backText: 'Estalla un conflicto bélico relámpago en una región vecina que cierra el espacio aéreo de dos de los tres países del paquete. El 80% de los clientes exige la baja inmediata y el reembolso total, pero sus proveedores locales (hoteles y guías) no aceptan devoluciones.' },
        { id: 3, color: 'bg-red-800', frontText: 'Lujo europeo', backText: 'Un apagón informático global masivo paraliza el sistema financiero y de radares europeos. Sus 50 clientes VIP están varados en el Aeropuerto de Ezeiza; no hay vuelos, las tarjetas de crédito corporativas de la agencia no pasan para emitir reservas de emergencia y los clientes están furiosos amenazando con demandas millonarias.' }
      ]
    }
  },
  {
    id: 'break-cover',
    type: 'cover',
    title: '¡TOMÉMONOS UN DESCANSO! ☕',
    theme: 'light',
    content: {
      highlight: 'Break',
      tags: ['Café ☕', 'Networking 🤝']
    }
  },
  {
    id: 'closing',
    type: 'closing',
    title: 'MUCHAS GRACIAS 👏',
    subtitle: 'Equipo fyo | Talentos',
    theme: 'light',
    content: {
      description: '"Transformamos el futuro del agro junto a las personas que se animan a desafiar lo establecido."'
    }
  }
];
