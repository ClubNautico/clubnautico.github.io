/* ==========================================================================
   CONFIGURACIÓN DE LA PORTADA - Club Náutico
   Este es el único archivo que hay que tocar para cambiar tarjetas o direcciones.
   Cuidado: no borres comillas, comas ni llaves. Cambia solo el texto entre comillas.
   ========================================================================== */

window.HUB_CONFIG = {

  /* ---- Dirección de la computadora de la piscina (solo para la versión de internet) ----
     Si dejas esto VACÍO, al tocar "Asistencias" o "Entrenamientos" desde internet se
     muestra una explicación de cómo entrar (conectarse al wifi de la piscina).
     Si la computadora de la piscina tiene siempre la misma dirección, escríbela aquí
     sin el puerto, por ejemplo:  "http://192.168.1.50"
     (cuando la portada se abre desde la propia computadora de la piscina, esto no se usa) */
  direccionPiscina: "",

  /* ---- Escudo del club ----
     Vacío ("") = se dibuja la marca sencilla de ondas.
     Para usar el escudo real: copia la imagen a  sitio/img/escudo.png
     (cuadrada, fondo transparente, mínimo 256 x 256) y escribe aquí:  escudo: "img/escudo.png" */
  escudo: "",

  /* ---- Las páginas ----
     titulo      : nombre grande de la tarjeta
     descripcion : una línea corta
     icono       : trofeo | perfil | asistencia | cronometro | gota | bandera
     url         : dirección completa (páginas de internet)
     puerta      : carpeta con la que se abre dentro de la puerta (tarjetas con local, o con url como el Portal)
     local       : puerto (número) si la página vive en la computadora de la piscina
                   (en ese caso no se pone url)
     Para ocultar una tarjeta, borra todo su bloque { ... }, con su coma. */
  secciones: [
    {
      titulo: "Para todos",
      paginas: [
        { titulo: "Récords del club",
          descripcion: "Récords y mejores marcas históricas.",
          icono: "trofeo",
          url: "https://clubnautico.github.io/records-club-nautico/" },
        { titulo: "Portal del nadador",
          descripcion: "Cada nadador ve su información. Se entra con su usuario.",
          icono: "perfil",
          url: "https://clubnautico.github.io/portal-nadador/",
          puerta: "portal/" }
      ]
    },
    {
      titulo: "Para profesores",
      paginas: [
        { titulo: "Asistencias",
          descripcion: "Asistencia, atrasos y notas del día.",
          icono: "asistencia",
          local: 8772,
          puerta: "asistencias/" },
        { titulo: "Entrenamientos",
          descripcion: "Series y tiempos por carril.",
          icono: "cronometro",
          local: 8765,
          puerta: "entrenamientos/" },
        { titulo: "Tests de agua",
          descripcion: "Toma de tests con cronómetro.",
          icono: "gota",
          url: "https://clubnautico.github.io/tests-agua/" }
      ]
    }
  ]
};
