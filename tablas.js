// Generado por scripts/generar_tablas_js.py — no editar a mano.
// Fuente: datos/tarifas/*.json (Boletines Oficiales de Jujuy).
export const TABLAS = [
 {
  "resolucion": "168-SUSEPU/2025",
  "publicacion": "Boletín Oficial de Jujuy Nº 59 E.C., 19/05/2025",
  "fuente": "https://boletinoficial.jujuy.gob.ar/?p=310162",
  "vigencia": {
   "desde": "2025-05-01",
   "hasta": "2025-07-31"
  },
  "nota_pass_through": "Cargo fijo y uso de red (VAD) fijos en el trimestre. Energía base de la Res. 168; actualizada dentro del trimestre por Res. 226/2025 (jun) y Res. 248/2025 (jul, R1 108,3997 $/kWh, Res. SE 281/2025).",
  "t1_residencial": {
   "categorias": [
    {
     "id": "R1",
     "hasta_kwh": 150,
     "cargo_fijo": 3492,
     "uso_red_kwh": 65.0152,
     "energia_plena_kwh": 105.2126
    },
    {
     "id": "R2",
     "hasta_kwh": 250,
     "cargo_fijo": 4135,
     "uso_red_kwh": 66.0788,
     "energia_plena_kwh": 105.2637
    },
    {
     "id": "R2-bis",
     "hasta_kwh": 350,
     "cargo_fijo": 4135,
     "uso_red_kwh": 66.0788,
     "energia_plena_kwh": 105.2637
    },
    {
     "id": "R3",
     "hasta_kwh": 500,
     "cargo_fijo": 6949,
     "uso_red_kwh": 67.0095,
     "energia_plena_kwh": 105.2054
    },
    {
     "id": "R4",
     "hasta_kwh": 700,
     "cargo_fijo": 15171,
     "uso_red_kwh": 68.3071,
     "energia_plena_kwh": 105.1799
    },
    {
     "id": "R5",
     "hasta_kwh": 1400,
     "cargo_fijo": 22867,
     "uso_red_kwh": 69.549,
     "energia_plena_kwh": 105.1532
    },
    {
     "id": "R6",
     "hasta_kwh": 4800,
     "cargo_fijo": 40037,
     "uso_red_kwh": 72.0363,
     "energia_plena_kwh": 105.1709
    },
    {
     "id": "R7",
     "hasta_kwh": null,
     "cargo_fijo": 64059,
     "uso_red_kwh": 73.2783,
     "energia_plena_kwh": 105.1709
    }
   ]
  }
 },
 {
  "resolucion": "227-SUSEPU/2026",
  "publicacion": "Boletín Oficial de Jujuy Nº 79, 08/07/2026",
  "fuente": "https://boletinoficial.jujuy.gob.ar/?p=433937",
  "vigencia": {
   "desde": "2026-05-01",
   "hasta": "2026-07-31"
  },
  "nota_pass_through": "Cuadro con dos columnas: MAY-JUN/26 y JUL/26. Se cargan los valores MAY-JUN; en julio la energía plena sube (R1 de 149,9075 a 158,2890) por Res. SE 151/146/2026. Cargo fijo y uso de red no cambian en el trimestre.",
  "referencia_normativa_sef_2026": {
   "resolucion": "105-SUSEPU/2026",
   "publicacion": "Boletín Oficial de Jujuy Nº 39, 01/04/2026",
   "fuente": "https://boletinoficial.jujuy.gob.ar/?p=330322",
   "fragmento": "ARTICULO 1º.- Instruir a la empresa concesionaria EJESA a aplicar a los usuarios beneficiarios del Sistema de Enfoque Federal (SEF), durante el año 2026, la bonificación adicional extraordinaria sobre el consumo base de hasta el VEINTICINCO POR CIENTO (25 %), conforme a lo establecido en el Decreto N° 943/2025. La bonificación resultante se adicionará a la bonificación general establecida en el Artículo 7° del referido Decreto.",
   "relacion": "diferencial",
   "porcentajes_bonificacion_total": {
    "2026-01": 75.0,
    "2026-02": 72.73,
    "2026-03": 70.45,
    "2026-04": 68.18,
    "2026-05": 65.91,
    "2026-06": 63.64,
    "2026-07": 61.36,
    "2026-08": 59.09,
    "2026-09": 56.82,
    "2026-10": 54.55,
    "2026-11": 52.27
   },
   "consumos_base_zona_kwh": {
    "muy_calido": {
     "ene_feb_dic": 550,
     "may_jun_jul_ago": 300,
     "mar_abr_sep_oct_nov": 150
    },
    "calido": {
     "ene_feb_dic": 370,
     "may_jun_jul_ago": 300,
     "mar_abr_sep_oct_nov": 150
    },
    "resto": {
     "ene_feb_dic": 300,
     "may_jun_jul_ago": 300,
     "mar_abr_sep_oct_nov": 150
    }
   },
   "fragmento_consumos_base": "ZONA/MESES MUY CÁLIDO CÁLIDO RESTO - Enero, febrero y diciembre 550 kWh/mes 370 kWh/mes 300 kWh/mes - Mayo, junio, julio y agosto 300 kWh/mes 300 kWh/mes 300 kWh/mes - Marzo, abril, septiembre, octubre y noviembre 150 kWh/mes 150 kWh/mes 150 kWh/mes. Que, en particular, para los meses de marzo y abril de 2026, corresponde aplicar un límite uniforme de consumo base de CIENTO CINCUENTA KILOVATIOS HORA (150 kWh/mes) para todas las zonas del territorio nacional.",
   "nota_discrepancia": "Los porcentajes de mayo a julio de esta Res. 105 (65,91% / 63,64% / 61,36%) difieren de los citados en la nota de este cuadro (60,67% / 61,97% / 69,59%). Se conservan ambas fuentes sin corregir y no se recalculan importes."
  },
  "energia_julio_2026": {
   "R1": 158.289,
   "R2": 158.4008,
   "R3": 158.2983,
   "R4": 158.1984,
   "R5": 158.1656,
   "R6": 158.1982,
   "R7": 158.1982
  },
  "t1_residencial": {
   "categorias": [
    {
     "id": "R1",
     "hasta_kwh": 150,
     "cargo_fijo": 4772,
     "uso_red_kwh": 88.8382,
     "energia_plena_kwh": 149.9075
    },
    {
     "id": "R2",
     "hasta_kwh": 300,
     "cargo_fijo": 5651,
     "uso_red_kwh": 90.2915,
     "energia_plena_kwh": 150.0116
    },
    {
     "id": "R3",
     "hasta_kwh": 500,
     "cargo_fijo": 9495,
     "uso_red_kwh": 91.5632,
     "energia_plena_kwh": 149.9049
    },
    {
     "id": "R4",
     "hasta_kwh": 700,
     "cargo_fijo": 20730,
     "uso_red_kwh": 93.3363,
     "energia_plena_kwh": 149.8319
    },
    {
     "id": "R5",
     "hasta_kwh": 1400,
     "cargo_fijo": 31246,
     "uso_red_kwh": 95.0333,
     "energia_plena_kwh": 149.7898
    },
    {
     "id": "R6",
     "hasta_kwh": 4800,
     "cargo_fijo": 54707,
     "uso_red_kwh": 98.4319,
     "energia_plena_kwh": 149.8229
    },
    {
     "id": "R7",
     "hasta_kwh": null,
     "cargo_fijo": 87531,
     "uso_red_kwh": 100.129,
     "energia_plena_kwh": 149.8229
    }
   ]
  }
 },
 {
  "resolucion": "296-SUSEPU/2025",
  "publicacion": "Boletín Oficial de Jujuy Nº 100, 27/08/2025",
  "fuente": "https://boletinoficial.jujuy.gob.ar/?p=316892",
  "vigencia": {
   "desde": "2025-08-01",
   "hasta": "2025-10-31"
  },
  "nota_pass_through": "Cargo fijo y uso de red (VAD) se mantienen durante el trimestre. Los cargos por consumo de energía se actualizaron dentro del trimestre: Res. 363-SUSEPU/2025 (sep-oct, R1 113,0688 $/kWh) y Res. 384-SUSEPU/2025 (oct, Res. SE 383/2025). Valores base de la Res. 296 cargados abajo.",
  "t1_residencial": {
   "categorias": [
    {
     "id": "R1",
     "hasta_kwh": 150,
     "cargo_fijo": 3719,
     "uso_red_kwh": 69.2325,
     "energia_plena_kwh": 112.9199
    },
    {
     "id": "R2",
     "hasta_kwh": 250,
     "cargo_fijo": 4404,
     "uso_red_kwh": 70.3651,
     "energia_plena_kwh": 112.9728
    },
    {
     "id": "R2-bis",
     "hasta_kwh": 350,
     "cargo_fijo": 4404,
     "uso_red_kwh": 70.3651,
     "energia_plena_kwh": 112.9728
    },
    {
     "id": "R3",
     "hasta_kwh": 500,
     "cargo_fijo": 7400,
     "uso_red_kwh": 71.3561,
     "energia_plena_kwh": 112.9125
    },
    {
     "id": "R4",
     "hasta_kwh": 700,
     "cargo_fijo": 16155,
     "uso_red_kwh": 72.7379,
     "energia_plena_kwh": 112.886
    },
    {
     "id": "R5",
     "hasta_kwh": 1400,
     "cargo_fijo": 24351,
     "uso_red_kwh": 74.0604,
     "energia_plena_kwh": 112.8585
    },
    {
     "id": "R6",
     "hasta_kwh": 4800,
     "cargo_fijo": 42634,
     "uso_red_kwh": 76.709,
     "energia_plena_kwh": 112.8768
    },
    {
     "id": "R7",
     "hasta_kwh": null,
     "cargo_fijo": 68214,
     "uso_red_kwh": 78.0315,
     "energia_plena_kwh": 112.8768
    }
   ]
  }
 },
 {
  "resolucion": "297-SUSEPU/2026",
  "publicacion": "Boletín Oficial de Jujuy Nº 106, 04/09/2026",
  "fuente": "https://boletinoficial.jujuy.gob.ar/?p=435659",
  "vigencia": {
   "desde": "2026-08-01",
   "hasta": "2026-10-31"
  },
  "nota_pass_through": "El Art. 2 de la Res. 297 incorpora automáticamente las variaciones nacionales de precios (Pass Through) durante el trimestre; el VAD provincial queda fijo. EJESA publica como vigente esta resolución + Res. SE Nación 222, 225 y 272/2026. La resolución del trimestre nov-2026/ene-2027 NO estaba publicada/indexada al 21/11/2026: verificar antes de calcular facturas de noviembre en adelante.",
  "referencia_normativa_sef_2026": {
   "resolucion": "105-SUSEPU/2026",
   "publicacion": "Boletín Oficial de Jujuy Nº 39, 01/04/2026",
   "fuente": "https://boletinoficial.jujuy.gob.ar/?p=330322",
   "fragmento": "ARTICULO 1º.- Instruir a la empresa concesionaria EJESA a aplicar a los usuarios beneficiarios del Sistema de Enfoque Federal (SEF), durante el año 2026, la bonificación adicional extraordinaria sobre el consumo base de hasta el VEINTICINCO POR CIENTO (25 %), conforme a lo establecido en el Decreto N° 943/2025. La bonificación resultante se adicionará a la bonificación general establecida en el Artículo 7° del referido Decreto.",
   "relacion": "diferencial",
   "porcentajes_bonificacion_total": {
    "2026-01": 75.0,
    "2026-02": 72.73,
    "2026-03": 70.45,
    "2026-04": 68.18,
    "2026-05": 65.91,
    "2026-06": 63.64,
    "2026-07": 61.36,
    "2026-08": 59.09,
    "2026-09": 56.82,
    "2026-10": 54.55,
    "2026-11": 52.27
   },
   "consumos_base_zona_kwh": {
    "muy_calido": {
     "ene_feb_dic": 550,
     "may_jun_jul_ago": 300,
     "mar_abr_sep_oct_nov": 150
    },
    "calido": {
     "ene_feb_dic": 370,
     "may_jun_jul_ago": 300,
     "mar_abr_sep_oct_nov": 150
    },
    "resto": {
     "ene_feb_dic": 300,
     "may_jun_jul_ago": 300,
     "mar_abr_sep_oct_nov": 150
    }
   },
   "fragmento_consumos_base": "ZONA/MESES MUY CÁLIDO CÁLIDO RESTO - Enero, febrero y diciembre 550 kWh/mes 370 kWh/mes 300 kWh/mes - Mayo, junio, julio y agosto 300 kWh/mes 300 kWh/mes 300 kWh/mes - Marzo, abril, septiembre, octubre y noviembre 150 kWh/mes 150 kWh/mes 150 kWh/mes. Que, en particular, para los meses de marzo y abril de 2026, corresponde aplicar un límite uniforme de consumo base de CIENTO CINCUENTA KILOVATIOS HORA (150 kWh/mes) para todas las zonas del territorio nacional.",
   "nota_discrepancia": "Los porcentajes de mayo a agosto de esta Res. 105 (65,91% / 63,64% / 61,36% / 59,09%) difieren de los consignados en la tabla de este cuadro (60,67% / 61,97% / 69,59% / 69,59%). Se conservan ambas fuentes sin corregir y no se recalculan importes."
  },
  "t1_residencial": {
   "nota": "Categoría por consumo mensual total. Los cargos por uso de red y energía se aplican a TODO el consumo al precio de la categoría (no son bloques progresivos). Las bonificaciones SÍ se aplican por bloques.",
   "categorias": [
    {
     "id": "R1",
     "hasta_kwh": 150,
     "cargo_fijo": 5116,
     "uso_red_kwh": 95.248,
     "energia_plena_kwh": 159.1174
    },
    {
     "id": "R2",
     "hasta_kwh": 300,
     "cargo_fijo": 6058,
     "uso_red_kwh": 96.8062,
     "energia_plena_kwh": 159.1961
    },
    {
     "id": "R3",
     "hasta_kwh": 500,
     "cargo_fijo": 10180,
     "uso_red_kwh": 98.1696,
     "energia_plena_kwh": 159.1277
    },
    {
     "id": "R4",
     "hasta_kwh": 700,
     "cargo_fijo": 22226,
     "uso_red_kwh": 100.0706,
     "energia_plena_kwh": 159.0507
    },
    {
     "id": "R5",
     "hasta_kwh": 1400,
     "cargo_fijo": 33501,
     "uso_red_kwh": 101.8901,
     "energia_plena_kwh": 159.0314
    },
    {
     "id": "R6",
     "hasta_kwh": 4800,
     "cargo_fijo": 58654,
     "uso_red_kwh": 105.5339,
     "energia_plena_kwh": 159.0535
    },
    {
     "id": "R7",
     "hasta_kwh": null,
     "cargo_fijo": 93847,
     "uso_red_kwh": 107.3535,
     "energia_plena_kwh": 159.0535
    }
   ],
   "especiales": {
    "RC": {
     "nombre": "Servicios Comunitarios",
     "cargo_fijo": 112616,
     "uso_red_kwh": 92.8341,
     "energia_plena_kwh": 159.0535
    },
    "RE": {
     "nombre": "Electrodependientes",
     "cargo_fijo": 28154,
     "uso_red_kwh": 95.248,
     "energia_plena_kwh": 159.1174
    }
   }
  },
  "bonificaciones": {
   "nota": "Las bonificaciones cambian MES A MES (tabla de la Res. 297: ene 75%, feb 72,73%, mar 70,45%, abr 68,18%, may 60,67%, jun 61,97%, jul 69,59%, ago 69,59% total SEF). Solo agosto está cargado con los valores publicados del Anexo I; cargar los demás meses desde sus anexos antes de usarlos.",
   "2026-08": {
    "fuente": "Res. 297-SUSEPU/2026 Anexo I, BONIFICACIONES (vigencia 1-31/8/2026)",
    "tarifa_social": {
     "base_normativa": "Res. SUSEPU 048/24: consumo máximo subsidiado 300 kWh/mes; cargo fijo 100%; variable primeros 150 kWh 25%, entre 150 y 300 kWh 15%",
     "cargo_fijo_pct": 100,
     "solo_categorias": [
      "R1",
      "R2"
     ],
     "uso_red_bloques": [
      {
       "hasta_kwh": 150,
       "descuento_kwh": 23.812
      },
      {
       "hasta_kwh": 300,
       "descuento_kwh": 14.521
      }
     ]
    },
    "sef": {
     "base_normativa": "Decreto 943/2025 (SEF): bloque base 300 kWh en ene/feb/may/jun/jul/ago/dic y 150 kWh en mar/abr/sep/oct/nov (más diferenciales por zona bioambiental, Res. SE 13/2026)",
     "bloque_base_kwh": 300,
     "energia_bloques": [
      {
       "hasta_kwh": 150,
       "descuento_kwh": 93.2206
      },
      {
       "hasta_kwh": 300,
       "descuento_kwh": 93.273
      }
     ]
    },
    "electrodependientes": {
     "cargo_fijo_descuento": 28154,
     "uso_red_descuento_kwh": 95.248,
     "energia_descuento_kwh": 159.1174
    }
   }
  },
  "cargos_suspension_rehabilitacion": {
   "T1_monofasico": 17647,
   "T1_monofasico_tarifa_social": 17647,
   "T1_trifasico": 83489,
   "T2_T3_T4_T5": 83489
  },
  "parametros": {
   "lambda_cens_kwh": 2534.6,
   "nota": "Coeficiente de Variación del Costo de Distribución de Referencia y Costo de Energía No Suministrada, desde 1/8/2026 (Art. 3 Res. 297)"
  },
  "impuestos": {
   "nota": "El cuadro tarifario NO incluye la capa de impuestos (IVA, tasas municipales, otros conceptos) que la boleta suma encima. Esa capa se modelará con boletas reales (fase 1)."
  }
 },
 {
  "resolucion": "420-SUSEPU/2025",
  "publicacion": "Boletín Oficial de Jujuy Nº 136, 26/11/2025",
  "fuente": "https://boletinoficial.jujuy.gob.ar/?p=322524",
  "vigencia": {
   "desde": "2025-11-01",
   "hasta": "2026-01-31"
  },
  "nota_pass_through": "Cargos por consumo de energía pueden cambiar dentro del trimestre por resoluciones nacionales (Res. SE 434/437/2025). Cargo fijo y uso de red corresponden al VAD provincial y no cambian en el trimestre.",
  "subperiodos": [
   {
    "id": "energia_2025-12_2026-01",
    "desde": "2025-12-01",
    "hasta": "2026-01-31",
    "resolucion": "476-SUSEPU/2025",
    "publicacion": "Boletín Oficial de Jujuy Nº 149, 29/12/2025",
    "fuente": "https://boletinoficial.jujuy.gob.ar/?p=324884",
    "fragmento": "ARTICULO 1º.- Aprobar los Cargos por Consumo de Energía plenos para el periodo 1° de diciembre de 2025 al 31 de enero de 2026 y las Bonificaciones del Anexo I, a aplicarse para el periodo 1° al 31 de diciembre 2025. ANEXO I CUADRO TARIFARIO PLENO (EJESA) Vigencia: 1° de diciembre 2025 al 31 de enero 2026. Cargos por Consumo de Energía (Plenos): R1 123,4896; R2 123,5417; R2-bis 123,5417; R3 123,4823; R4 123,4563; R5 123,4292; R6 123,4472; R7 123,4472.",
    "alcance": "t1_residencial.categorias[].energia_plena_kwh",
    "valores": {
     "R1": 123.4896,
     "R2": 123.5417,
     "R2-bis": 123.5417,
     "R3": 123.4823,
     "R4": 123.4563,
     "R5": 123.4292,
     "R6": 123.4472,
     "R7": 123.4472
    }
   }
  ],
  "bonificaciones": {
   "nota": "Ene-26: sin importes $/kWh verificados. La Res. 476-SUSEPU/2025 limita las bonificaciones del Anexo I al 1-31/12/2025 (Art. 1) y no se encontró publicación oficial con valores $/kWh para enero 2026; no se infieren por parecido. Si aparece la resolución, cargarla con valor + fragmento + fuente.",
   "2025-12": {
    "nota": "Bonificaciones vigentes 1-31/12/2025 según Art. 1 de la Res. 476/2025. Origen: Res. SE 26/2024, distinto del Decreto 943/2025 de los cuadros posteriores. Se documentan con su fuente; NO se aplican automáticamente: la imputación a cada usuario y la relación entre partidas requieren verificación con boleta real.",
    "partidas": [
     {
      "id": "ts_dic25",
      "origen": {
       "resolucion": "476-SUSEPU/2025",
       "norma_base": "Subsidio otorgado por el Gobierno Provincial (Tarifa Social)",
       "fuente": "https://boletinoficial.jujuy.gob.ar/?p=324884",
       "fragmento": "SUBSIDIO OTORGADO POR EL GOBIERNO PROVINCIAL BONIFICACIONES - T1 Residenciales - Tarifa Social Dic-25 - Cargos Fijos: TS1 -4.218, TS2 -4.995, RE -23.214. Cargos por Uso de Red: TS1 -19,6336, TS2 -11,9728, RE -78,5342."
      },
      "desde": "2025-12-01",
      "hasta": "2025-12-31",
      "tipo": "cargo_fijo_y_uso_red",
      "valores": {
       "cargo_fijo": {
        "TS1": -4218,
        "TS2": -4995,
        "RE": -23214
       },
       "uso_red_kwh": {
        "TS1": -19.6336,
        "TS2": -11.9728,
        "RE": -78.5342
       }
      }
     },
     {
      "id": "sef_dic25",
      "origen": {
       "resolucion": "476-SUSEPU/2025",
       "norma_base": "RESOLUCION SE N°26/2024 SECRETARIA DE ENERGÍA DE LA NACIÓN",
       "fuente": "https://boletinoficial.jujuy.gob.ar/?p=324884",
       "fragmento": "RESOLUCION SE N°26/2024 SECRETARIA DE ENERGÍA DE LA NACIÓN BONIFICACION Dic-25 - Cargo Por Consumo de Energía SEGMENTO N2: R1-N2 -63,8123, R2-N2 -63,8462, R2-bis-N2 -63,8462. SEGMENTO N3: R1-N3 -49,0864, R2-N3 -49,1125. Cargo Por Consumo de Energía: RC -63,7847, RE -123,4896."
      },
      "desde": "2025-12-01",
      "hasta": "2025-12-31",
      "tipo": "energia_bloques",
      "nota": "N2 y N3 son segmentos alternativos del mismo beneficio; no se decide aquí cuál corresponde a cada usuario.",
      "valores": {
       "R1-N2": -63.8123,
       "R2-N2": -63.8462,
       "R2-bis-N2": -63.8462,
       "R1-N3": -49.0864,
       "R2-N3": -49.1125,
       "RC": -63.7847,
       "RE": -123.4896
      }
     }
    ]
   }
  },
  "t1_residencial": {
   "categorias": [
    {
     "id": "R1",
     "hasta_kwh": 150,
     "cargo_fijo": 4218,
     "uso_red_kwh": 78.5342,
     "energia_plena_kwh": 120.9237
    },
    {
     "id": "R2",
     "hasta_kwh": 250,
     "cargo_fijo": 4995,
     "uso_red_kwh": 79.8189,
     "energia_plena_kwh": 120.9742
    },
    {
     "id": "R2-bis",
     "hasta_kwh": 350,
     "cargo_fijo": 4995,
     "uso_red_kwh": 79.8189,
     "energia_plena_kwh": 120.9742
    },
    {
     "id": "R3",
     "hasta_kwh": 500,
     "cargo_fijo": 8394,
     "uso_red_kwh": 80.9431,
     "energia_plena_kwh": 120.9167
    },
    {
     "id": "R4",
     "hasta_kwh": 700,
     "cargo_fijo": 18326,
     "uso_red_kwh": 82.5105,
     "energia_plena_kwh": 120.8914
    },
    {
     "id": "R5",
     "hasta_kwh": 1400,
     "cargo_fijo": 27622,
     "uso_red_kwh": 84.0107,
     "energia_plena_kwh": 120.8652
    },
    {
     "id": "R6",
     "hasta_kwh": 4800,
     "cargo_fijo": 48362,
     "uso_red_kwh": 87.0152,
     "energia_plena_kwh": 120.8826
    },
    {
     "id": "R7",
     "hasta_kwh": null,
     "cargo_fijo": 77379,
     "uso_red_kwh": 88.5154,
     "energia_plena_kwh": 120.8826
    }
   ]
  }
 },
 {
  "resolucion": "81-SUSEPU/2026",
  "publicacion": "Boletín Oficial de Jujuy Nº 29, 09/03/2026",
  "fuente": "https://boletinoficial.jujuy.gob.ar/?p=328410",
  "vigencia": {
   "desde": "2026-02-01",
   "hasta": "2026-04-30"
  },
  "nota_pass_through": "Res. SE 22/2026 y Decreto 943/2025 (SEF, bloque base 300 kWh en feb). Los precios de energía pueden ajustarse dentro del trimestre por pass through nacional; cargo fijo y uso de red son VAD provincial (fijos en el trimestre).",
  "referencia_normativa_sef_2026": {
   "resolucion": "105-SUSEPU/2026",
   "publicacion": "Boletín Oficial de Jujuy Nº 39, 01/04/2026",
   "fuente": "https://boletinoficial.jujuy.gob.ar/?p=330322",
   "fragmento": "ARTICULO 1º.- Instruir a la empresa concesionaria EJESA a aplicar a los usuarios beneficiarios del Sistema de Enfoque Federal (SEF), durante el año 2026, la bonificación adicional extraordinaria sobre el consumo base de hasta el VEINTICINCO POR CIENTO (25 %), conforme a lo establecido en el Decreto N° 943/2025. La bonificación resultante se adicionará a la bonificación general establecida en el Artículo 7° del referido Decreto.",
   "relacion": "diferencial",
   "porcentajes_bonificacion_total": {
    "2026-01": 75.0,
    "2026-02": 72.73,
    "2026-03": 70.45,
    "2026-04": 68.18,
    "2026-05": 65.91,
    "2026-06": 63.64,
    "2026-07": 61.36,
    "2026-08": 59.09,
    "2026-09": 56.82,
    "2026-10": 54.55,
    "2026-11": 52.27
   },
   "consumos_base_zona_kwh": {
    "muy_calido": {
     "ene_feb_dic": 550,
     "may_jun_jul_ago": 300,
     "mar_abr_sep_oct_nov": 150
    },
    "calido": {
     "ene_feb_dic": 370,
     "may_jun_jul_ago": 300,
     "mar_abr_sep_oct_nov": 150
    },
    "resto": {
     "ene_feb_dic": 300,
     "may_jun_jul_ago": 300,
     "mar_abr_sep_oct_nov": 150
    }
   },
   "fragmento_consumos_base": "ZONA/MESES MUY CÁLIDO CÁLIDO RESTO - Enero, febrero y diciembre 550 kWh/mes 370 kWh/mes 300 kWh/mes - Mayo, junio, julio y agosto 300 kWh/mes 300 kWh/mes 300 kWh/mes - Marzo, abril, septiembre, octubre y noviembre 150 kWh/mes 150 kWh/mes 150 kWh/mes. Que, en particular, para los meses de marzo y abril de 2026, corresponde aplicar un límite uniforme de consumo base de CIENTO CINCUENTA KILOVATIOS HORA (150 kWh/mes) para todas las zonas del territorio nacional.",
   "nota_discrepancia": ""
  },
  "nota_rectificacion": "Rectificación 104-SUSEPU/2026 (Boletín Oficial de Jujuy Nº 39, 01/04/2026). La propia resolución fecha la Res. 081-SUSEPU/2026 en '03 de marzo de 2026' en el considerando y en el Art. 1°, pero en el Art. 2° consigna '03 de mayo de 2026'. Se deja constancia de la discrepancia sin corregirla; los valores se cargan tal como publica la rectificación. Fuente: https://boletinoficial.jujuy.gob.ar/?p=330321",
  "parametros": {
   "lambda_cens_kwh": 2235.58,
   "nota": "Art. 1 de la Res. 104-SUSEPU/2026: λ = $ 2.235,58 y CENS = 2.235,58 (rectifica el valor 2.182,26 de la Res. 081-SUSEPU/2026)."
  },
  "t1_residencial": {
   "categorias": [
    {
     "id": "R1",
     "hasta_kwh": 150,
     "cargo_fijo": 4512,
     "uso_red_kwh": 84.011,
     "energia_plena_kwh": 141.7247
    },
    {
     "id": "R2",
     "hasta_kwh": 300,
     "cargo_fijo": 5344,
     "uso_red_kwh": 85.3853,
     "energia_plena_kwh": 141.7971
    },
    {
     "id": "R3",
     "hasta_kwh": 500,
     "cargo_fijo": 8979,
     "uso_red_kwh": 86.5879,
     "energia_plena_kwh": 141.7217
    },
    {
     "id": "R4",
     "hasta_kwh": 700,
     "cargo_fijo": 19604,
     "uso_red_kwh": 88.2646,
     "energia_plena_kwh": 141.673
    },
    {
     "id": "R5",
     "hasta_kwh": 1400,
     "cargo_fijo": 29548,
     "uso_red_kwh": 89.8694,
     "energia_plena_kwh": 141.6425
    },
    {
     "id": "R6",
     "hasta_kwh": 4800,
     "cargo_fijo": 51734,
     "uso_red_kwh": 93.0834,
     "energia_plena_kwh": 141.6658
    },
    {
     "id": "R7",
     "hasta_kwh": null,
     "cargo_fijo": 82775,
     "uso_red_kwh": 94.6883,
     "energia_plena_kwh": 141.6658
    }
   ]
  }
 }
];
