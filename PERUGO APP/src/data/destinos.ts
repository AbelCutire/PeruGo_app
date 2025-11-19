// src/data/destinos.ts

export const destinos = [
  {
    id: "cusco",
    nombre: "Cusco",
    ubicacion: "Cusco, Perú",
    tipo: "Cultural / Aventura",
    precio: 500,
    duracion: "4 días / 3 noches",
    presupuesto: "Medio",
    imagen:
      "https://www.filmingperu.com/wp-content/uploads/2020/06/014.jpg",
    descripcion:
      "La antigua capital del Imperio Inca, Cusco, combina historia, cultura y paisajes impresionantes. Camina por sus calles de piedra, visita templos y descubre la fusión entre arquitectura inca y colonial. Un destino ideal para quienes buscan experiencias auténticas y conexión con la historia del Perú. Además, es el punto de partida ideal para visitar Machu Picchu y el Valle Sagrado.",
    gastos: {
      alojamiento: 200,
      transporte: 100,
      alimentacion: 120,
      entradas: 80,
    },
    tours: [
      {
        nombre: "Tour clásico Machu Picchu",
        descripcion:
          "Incluye tren, guía y entrada al santuario histórico de Machu Picchu. Perfecto para una primera visita.",
        precio: 250,
      },
      {
        nombre: "City Tour en Cusco",
        descripcion:
          "Recorre los principales atractivos de la ciudad y sus alrededores como Sacsayhuamán, Qenqo y Tambomachay.",
        precio: 50,
      },
    ],
  },

  {
    id: "machu-picchu",
    nombre: "Machu Picchu",
    ubicacion: "Cusco, Perú",
    tipo: "Aventura / Histórico",
    precio: 600,
    duracion: "2 días / 1 noche",
    presupuesto: "Alto",
    imagen:
      "https://www.machupicchu-tours-peru.com/wp-content/uploads/2020/08/panoramica-de-machupicchu.jpg",
    descripcion:
      "Una de las siete maravillas del mundo moderno. Machu Picchu es un complejo arqueológico emblemático del Imperio Inca, rodeado de montañas y naturaleza exuberante. Ideal para quienes buscan una experiencia inolvidable en la historia y cultura del Perú.",
    gastos: {
      alojamiento: 150,
      transporte: 250,
      alimentacion: 100,
      entradas: 100,
    },
    tours: [
      {
        nombre: "Tour Machu Picchu Full Day",
        descripcion:
          "Incluye tren, bus, guía y entrada. Recomendado para quienes tienen poco tiempo.",
        precio: 280,
      },
      {
        nombre: "Tour Machu Picchu + Huayna Picchu",
        descripcion:
          "Incluye acceso a la montaña Huayna Picchu para una vista panorámica.",
        precio: 320,
      },
    ],
  },

  {
    id: "lima",
    nombre: "Lima",
    ubicacion: "Lima, Perú",
    tipo: "Urbano / Gastronómico",
    precio: 400,
    duracion: "3 días / 2 noches",
    presupuesto: "Medio",
    imagen:
      "https://denomades.s3.us-west-2.amazonaws.com/blog/wp-content/uploads/2018/10/03163705/circuito-magico-agua-lima.jpg",
    descripcion:
      "La capital del Perú combina historia, modernidad y una de las mejores gastronomías del mundo. Visita el centro histórico, Miraflores, Barranco y disfruta del ceviche y el lomo saltado.",
    gastos: {
      alojamiento: 150,
      transporte: 80,
      alimentacion: 120,
      entradas: 50,
    },
    tours: [
      {
        nombre: "City Tour Lima Colonial",
        descripcion:
          "Visita la Plaza de Armas, la Catedral de Lima y sitios históricos.",
        precio: 60,
      },
      {
        nombre: "Tour gastronómico",
        descripcion:
          "Degustación de platos peruanos en restaurantes seleccionados.",
        precio: 100,
      },
    ],
  },

  {
    id: "arequipa",
    nombre: "Arequipa",
    ubicacion: "Arequipa, Perú",
    tipo: "Cultural / Aventura",
    precio: 450,
    duracion: "3 días / 2 noches",
    presupuesto: "Medio",
    imagen:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/45/c0/3d/plaza-de-armas-arequipa.jpg?w=1200&h=-1&s=1",
    descripcion:
      "La Ciudad Blanca, con arquitectura colonial y rodeada de volcanes, ofrece cultura, historia y el famoso Cañón del Colca.",
    gastos: {
      alojamiento: 180,
      transporte: 100,
      alimentacion: 100,
      entradas: 70,
    },
    tours: [
      { nombre: "City Tour Arequipa", descripcion: "Centro histórico, miradores y lugares emblemáticos.", precio: 50 },
      { nombre: "Tour Cañón del Colca", descripcion: "Excursión de día completo con avistamiento del cóndor.", precio: 100 },
    ],
  },

  {
    id: "ica-paracas",
    nombre: "Ica y Paracas",
    ubicacion: "Ica, Perú",
    tipo: "Aventura / Relax",
    precio: 350,
    duracion: "2 días / 1 noche",
    presupuesto: "Bajo",
    imagen:
      "https://ikfwep.stripocdn.email/content/guids/CABINET_62418cfa2d2a01b2539de7bac7169b41/images/52681618224355767.jpg",
    descripcion:
      "Las dunas de Huacachina, las Islas Ballestas y la Reserva de Paracas combinan aventura y naturaleza en un viaje corto ideal.",
    gastos: {
      alojamiento: 120,
      transporte: 100,
      alimentacion: 80,
      entradas: 50,
    },
    tours: [
      {
        nombre: "Islas Ballestas",
        descripcion: "Paseo en lancha para ver fauna marina y el Candelabro.",
        precio: 40,
      },
      {
        nombre: "Buggy y sandboard",
        descripcion: "Aventura en las dunas de Ica al atardecer.",
        precio: 50,
      },
    ],
  },

  {
    id: "puno-titicaca",
    nombre: "Puno y Lago Titicaca",
    ubicacion: "Puno, Perú",
    tipo: "Cultural / Naturaleza",
    precio: 420,
    duracion: "3 días / 2 noches",
    presupuesto: "Medio",
    imagen:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/67/eb/7b/lago-titicaca.jpg?w=1100&h=900&s=1",
    descripcion:
      "El lago navegable más alto del mundo y sus islas flotantes ofrecen una experiencia cultural única.",
    gastos: {
      alojamiento: 150,
      transporte: 150,
      alimentacion: 80,
      entradas: 40,
    },
    tours: [
      {
        nombre: "Islas Uros y Taquile",
        descripcion: "Full day navegando y conociendo comunidades locales.",
        precio: 60,
      },
      {
        nombre: "Experiencia vivencial en Amantaní",
        descripcion: "Pernocta con familias locales.",
        precio: 90,
      },
    ],
  },

  {
    id: "huaraz",
    nombre: "Huaraz y Callejón de Huaylas",
    ubicacion: "Áncash, Perú",
    tipo: "Aventura / Montaña",
    precio: 480,
    duracion: "4 días / 3 noches",
    presupuesto: "Medio",
    imagen:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/5b/b0/51/santa-cruz-trek.jpg?w=1100&h=900&s=1",
    descripcion:
      "Lagunas turquesas, nevados y trekking de clase mundial en la Cordillera Blanca.",
    gastos: {
      alojamiento: 180,
      transporte: 150,
      alimentacion: 100,
      entradas: 50,
    },
    tours: [
      { nombre: "Laguna 69", descripcion: "Trekking icónico de dificultad media/alta.", precio: 70 },
      { nombre: "Laguna Parón", descripcion: "Una de las lagunas más hermosas del Perú.", precio: 60 },
    ],
  },

  {
    id: "selva-tarapoto",
    nombre: "Tarapoto",
    ubicacion: "San Martín, Perú",
    tipo: "Naturaleza / Relax",
    precio: 430,
    duracion: "3 días / 2 noches",
    presupuesto: "Medio",
    imagen:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/9a/59/ce/catarata-de-ahuashiyacu.jpg?w=1200&h=-1&s=1",
    descripcion:
      "Selva, cascadas, gastronomía amazónica y clima cálido. Ideal para desconectar.",
    gastos: {
      alojamiento: 160,
      transporte: 130,
      alimentacion: 100,
      entradas: 40,
    },
    tours: [
      { nombre: "Laguna Azul", descripcion: "Tour completo con paseo en bote.", precio: 60 },
      { nombre: "Ahuashiyacu", descripcion: "Catarata icónica cerca de Tarapoto.", precio: 40 },
    ],
  },

  {
    id: "norte-chiclayo-trujillo",
    nombre: "Chiclayo y Trujillo",
    ubicacion: "Norte del Perú",
    tipo: "Cultural / Histórico",
    precio: 460,
    duracion: "4 días / 3 noches",
    presupuesto: "Medio",
    imagen:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/63/d3/7b/huaca-de-la-luna.jpg?w=1200&h=-1&s=1",
    descripcion:
      "Historia, arqueología y gastronomía norteña: Huacas, museos y playas.",
    gastos: {
      alojamiento: 180,
      transporte: 150,
      alimentacion: 90,
      entradas: 40,
    },
    tours: [
      { nombre: "Huaca de la Luna", descripcion: "Uno de los complejos Moche más importantes.", precio: 60 },
      { nombre: "Museo Tumbas Reales", descripcion: "Señor de Sipán, historia y arqueología.", precio: 50 },
    ],
  },

  {
    id: "amazonas-chachapoyas",
    nombre: "Chachapoyas y Kuélap",
    ubicacion: "Amazonas, Perú",
    tipo: "Cultural / Naturaleza",
    precio: 480,
    duracion: "4 días / 3 noches",
    presupuesto: "Medio",
    imagen:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/51/e7/df/fortress-of-kuelap.jpg?w=1200&h=-1&s=1",
    descripcion:
      "Destino emergente con historia, naturaleza y aventura. Kuélap y Gocta son imperdibles.",
    gastos: {
      alojamiento: 180,
      transporte: 170,
      alimentacion: 80,
      entradas: 50,
    },
    tours: [
      { nombre: "Kuélap", descripcion: "Teleférico y recorrido por la ciudadela.", precio: 70 },
      { nombre: "Catarata de Gocta", descripcion: "Una de las más altas del mundo.", precio: 60 },
    ],
  },
];
