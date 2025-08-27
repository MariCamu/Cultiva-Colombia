
// Añadido para cargar las variables de entorno (API Keys) ANTES que cualquier otra cosa.
import { config } from 'dotenv';
config();

'use server';

import { writeBatch, collection, doc, GeoPoint } from 'firebase/firestore';
import { db } from './firebase';
import type { Pest } from '@/models/pest-model';

// INSTRUCCIONES:
// 1. Pega tus datos de plagas y enfermedades en la variable `pestsAndDiseasesData`.
//    Asegúrate de que cada item es un objeto {} dentro del array [], separado por comas.
// 2. Abre la terminal y ejecuta el comando: `npm run db:seed`
// 3. ¡Listo! Tu colección 'plagas_y_enfermedades' en Firestore se llenará.

const pestsAndDiseasesData: Omit<Pest, 'slug' | 'imageUrl' | 'dataAiHint'>[] = [
  // PEGA AQUÍ TUS DATOS DE PLAGAS Y ENFERMEDADES
  // EJEMPLO DE ESTRUCTURA:

    {
      id: "pulgones",
      nombreComun: "Pulgones",
      nombreCientifico: "Aphididae spp.",
      tipo: "insecto",
      descripcion: "Chupadores de savia; colonias en brotes tiernos y enves de hojas; excretan melaza y transmiten virus.",
      danos: "Enrulado, clorosis, retraso de crecimiento, fumagina sobre melaza; vectores de virosis.",
      cultivosAfectados: ['lechuga', 'cilantro', 'fresa', 'cebolla-larga', 'aj-dulce', 'pepino-cohombro', 'albahaca', 'espinaca', 'hierbabuena', 'calabacn', 'perejil', 'rbano', 'tomate-cherry', 'organo', 'acelga', 'pepino-dulce', 'frijol', 'pimentn', 'yuca_dulce'],
      prevencion: ["Monitoreo del enves", "Control de hormigas", "Asociacion con aromaticas (ajo/cebolla/calendula)"],
      solucion: "Jabon potasico o aceite de neem; liberar depredadores (mariquitas, sirfidos); retirar focos."
    },
    {
      id: "mosca_blanca",
      nombreComun: "Mosca blanca",
      nombreCientifico: "Bemisia tabaci / Trialeurodes vaporariorum",
      tipo: "insecto",
      descripcion: "Adultos alados y ninfas succionan savia y excretan melaza; vectores de virosis.",
      danos: "Amarillamiento, debilitamiento, fumagina; transmision de virus",
      cultivosAfectados: ['lechuga', 'aj-dulce', 'pimentn', 'tomate-cherry', 'pepino-cohombro', 'calabacn', 'pepino-dulce', 'albahaca', 'frijol', 'acelga', 'espinaca', 'yuca_dulce'],
      prevencion: ["Trampas amarillas", "Mallas antiinsectos", "Eliminar malezas hospedantes"],
      solucion: "Jabon potasico/neem; control biologico (Encarsia/Eretmocerus); manejo de fertilizacion N para no atraerla."
    },
    {
      id: "trips",
      nombreComun: "Trips",
      nombreCientifico: "Frankliniella occidentalis / Thrips tabaci",
      tipo: "insecto",
      descripcion: "Raspan tejidos y chupan savia; deforman hojas/flor; vectores de TSWV.",
      danos: "Plateado/bronceado, necrosis, cicatriz en frutos (tomate/pimenton/fresa).",
      cultivosAfectados: ['cebolla-larga', 'lechuga', 'fresa', 'aj-dulce', 'pimentn', 'tomate-cherry', 'pepino-cohombro', 'calabacn', 'albahaca', 'espinaca', 'frijol', 'acelga', 'organo', 'hierbabuena'],
      prevencion: ["Trampas azules", "Manejo de flores hospedantes", "Ventilacion y humedad equilibrada"],
      solucion: "Jabon potasico/neem; biocontrol (Orius spp., Amblyseius); retirar flores"
    },
    {
      id: "arana_roja",
      nombreComun: "Araña roja",
      nombreCientifico: "Tetranychus urticae",
      tipo: "ácaro",
      descripcion: "Ácaro fitofago en ambientes calidos y secos; telaranas finas.",
      danos: "Punteado clorotico, bronceado y caida de hojas; perdida de vigor.",
      cultivosAfectados: ['fresa', 'pepino-cohombro', 'calabacn', 'pimentn', 'aj-dulce', 'tomate-cherry', 'frijol', 'hierbabuena', 'albahaca', 'organo', 'acelga', 'espinaca'],
      prevencion: ["Mantener humedad ambiental", "Eliminar malezas", "Evitar estres hibrico"],
      solucion: "Acaricidas suaves/azufre; acaros beneficiosos (Phytoseiulus/Amblyseius)."
    },
    {
      id: "acaro_del_brote",
      nombreComun: "Ácaro del brote (acaro ancho)",
      nombreCientifico: "Polyphagotarsonemus latus",
      tipo: "ácaro",
      descripcion: "Plaga de brotes tiernos de solanaceas, cucurbitaceas y aromaticas.",
      danos: "Hojas encrespadas, bronceadas; malformacion de flores y frutos pequenos.",
      cultivosAfectados: ['pimentn', 'aj-dulce', 'tomate-cherry', 'pepino-cohombro', 'calabacn', 'albahaca', 'organo', 'hierbabuena', 'frijol'],
      prevencion: ["Plantulas sanas", "Evitar trasplantes estresados", "Higiene en vivero"],
      solucion: "Acaricidas especificos/azufre; retirar brotes muy afectados; biocontrol con Amblyseius."
    }, {
      id: "minadores_de_hoja",
      nombreComun: "Minadores de hoja",
      nombreCientifico: "Liriomyza spp.",
      tipo: "insecto",
      descripcion: "Larvas excavan galerias en el mesofilo; adultos pican hojas para oviposicion.",
      danos: "Serpentinas blancas, perdida de area fotosintetica, caida de hojas.",
      cultivosAfectados: ['acelga', 'espinaca', 'lechuga', 'frijol', 'perejil', 'cilantro', 'fresa'],
      prevencion: ["Trampas con feromona", "Cultivos trampa y retiro de hojas con galerias iniciales"],
      solucion: "Aceite de neem; biocontrol (Diglyphus/ Opius); evitar insecticidas de amplio espectro que matan parasitoides."
    },
    {
      id: "gusanos_cortadores",
      nombreComun: "Gusanos cortadores",
      nombreCientifico: "Agrotis spp.",
      tipo: "insecto",
      descripcion: "Larvas nocturnas que cortan plantulas al nivel del suelo.",
      danos: "Perdida de plantulas recien trasplantadas o emergidas.",
      cultivosAfectados: ['lechuga', 'cilantro', 'espinaca', 'acelga', 'pimentn', 'aj-dulce', 'tomate-cherry', 'frijol', 'pepino-cohombro', 'calabacn', 'maz'],
      prevencion: ["Labranza previa", "Anillos protectores en plantulas", "Manejo de rastrojos"],
      solucion: "Recoleccion manual nocturna; cebos con Bt; tratamientos focales si supera umbral."
    },
    {
      id: "gusanos_de_alambre",
      nombreComun: "Gusanos de alambre",
      nombreCientifico: "Agriotes spp. (Elateridae)",
      tipo: "insecto",
      descripcion: "Larvas duras subterraneas que perforan raices y tallos.",
      danos: "Marchitez, plantas debiles; perforaciones en raices/rizomas.",
      cultivosAfectados: ['lechuga', 'rbano', 'pepino-cohombro', 'calabacn', 'maz', 'frijol', 'yuca_dulce', 'jengibre', 'crcuma'],
      prevencion: ["Evitar estiercol fresco", "Rotacion", "Labranza que exponga larvas"],
      solucion: "Trampas con trozos de papa/zanahoria; nematodos entomopatógenos."
    },
    {
      id: "spodoptera",
      nombreComun: "Gusano cogollero / ejercito",
      nombreCientifico: "Spodoptera frugiperda (y otras Spodoptera spp.)",
      tipo: "insecto",
      descripcion: "Larvas polifagas; atacan cogollo y hojas; muy importante en maiz.",
      danos: "Destruccion de cogollo en maiz; defoliacion; perforacion de frutos tiernos.",
      cultivosAfectados: ['maz', 'frijol', 'pimentn', 'aj-dulce', 'tomate-cherry', 'pepino-cohombro', 'calabacn'],
      prevencion: ["Siembra oportuna", "Manejo de malezas", "Refugios de enemigos naturales"],
      solucion: "Bt (var. aizawai/kurstaki); Trichogramma (parasitoide de huevos); bioinsecticidas; rotacion."
    },
    {
      id: "helicoverpa_zea",
      nombreComun: "Gusano del fruto / elotero",
      nombreCientifico: "Helicoverpa zea",
      tipo: "insecto",
      descripcion: "Larva que perfora frutos, mazorcas y vainas.",
      danos: "Galerias en frutos de tomate/pimenton; daño en puntas de mazorca.",
      cultivosAfectados: ['maz', 'pimentn', 'aj-dulce', 'tomate-cherry', 'frijol', 'fresa'],
      prevencion: ["Monitoreo con feromonas", "Eliminacion de frutos danados"],
      solucion: "Bt y baculovirus; liberar Trichogramma; coberturas en mazorca (maiz) segun escala."
    },
    {
      id: "tuta_absoluta",
      nombreComun: "Polilla del tomate",
      nombreCientifico: "Tuta absoluta",
      tipo: "insecto",
      descripcion: "Larvas minan hojas y perforan frutos de tomate.",
      danos: "Galerias en hojas; frutos con orificios y pudriciones secundarias.",
      cultivosAfectados: ['tomate-cherry'],
      prevencion: ["Mallas y trampas con feromona", "Eliminar residuos con crisalidas"],
      solucion: "Trampas masivas; parasitoides (Trichogramma); bioinsecticidas (Bt/Spinosad) en focos."
    }, {
      id: "diatraea",
      nombreComun: "Barrenador del tallo",
      nombreCientifico: "Diatraea spp.",
      tipo: "insecto",
      descripcion: "Larvas perforan tallos, reduciendo flujo de savia.",
      danos: "Encamado, brotes rotos, perdidas de rendimiento.",
      cultivosAfectados: ['maz'],
      prevencion: ["Eliminacion de socas", "Siembras escalonadas", "Manejo integrado regional"],
      solucion: "Lib. Cotesia flavipes (parasitoide); control cultural; feromonas para monitoreo."
    },
    {
      id: "drosophila_suzukii",
      nombreComun: "Mosca de alas manchadas",
      nombreCientifico: "Drosophila suzukii",
      tipo: "insecto",
      descripcion: "Oviposita en frutos blandos sanos (no solo sobremaduros).",
      danos: "Frutos de fresa blandos con larvas; pudriciones secundarias.",
      cultivosAfectados: ['fresa'],
      prevencion: ["Cosecha frecuente", "Trampas atrayentes (vinagre/levadura)"],
      solucion: "Manejo de entorno (eliminar fruta caida); mallas finas; atrapa-mata donde este permitido."
    },
    {
      id: "cochinillas",
      nombreComun: "Cochinillas harinosas",
      nombreCientifico: "Pseudococcidae spp.",
      tipo: "insecto",
      descripcion: "Chupadores cubiertos de cera; asociados a hormigas.",
      danos: "Debiltiamiento, melaza y fumagina; transmision de complejos virales (ej. pina).",
      cultivosAfectados: ['pia', 'albahaca', 'organo', 'hierbabuena', 'pimentn', 'aj-dulce', 'fresa', 'yuca_dulce'],
      prevencion: ["Control de hormigas", "Higiene y cuarentena de material vegetativo"],
      solucion: "Alcohol isopropilico puntual; aceite de parafina/neem; liberar Cryptolaemus montrouzieri."
    },
    {
      id: "hormiga_arriera",
      nombreComun: "Hormiga arriera (cortadora)",
      nombreCientifico: "Atta / Acromyrmex spp.",
      tipo: "insecto",
      descripcion: "Corta y defolia plantas para cultivar su hongo en el nido.",
      danos: "Defoliacion rapida de plantulas y arbustos.",
      cultivosAfectados: ['maz', 'pimentn', 'aj-dulce', 'pepino-cohombro', 'calabacn', 'fresa', 'frijol', 'albahaca', 'organo', 'hierbabuena', 'lechuga', 'espinaca', 'acelga', 'cilantro', 'perejil', 'rbano', 'tomate-cherry', 'pia', 'jengibre', 'crcuma', 'pepino-dulce', 'cebolla-larga'],
      prevencion: ["Ubicar y vigilar nidos", "Barreras fisicas en viveros"],
      solucion: "Cebos especificos; control biologico (hongos entomopatógenos); manejo comunitario de nidos."
    },
    {
      id: "oidio",
      nombreComun: "Oidio (cenicilla)",
      nombreCientifico: "Erysiphe/Podosphaera spp.",
      tipo: "hongo",
      descripcion: "Micelio blanco polvoso sobre hojas/tallos en clima seco con noches frescas.",
      danos: "Clorosis, necrosis y caida de hojas; baja fotosintesis y calidad de fruto/hoja.",
      cultivosAfectados: ['pepino-cohombro', 'calabacn', 'pepino-dulce', 'fresa', 'frijol', 'pimentn', 'aj-dulce', 'tomate-cherry', 'lechuga', 'espinaca', 'acelga', 'hierbabuena', 'organo', 'albahaca'],
      prevencion: ["Ventilacion", "Marcos amplios", "Evitar exceso de N"],
      solucion: "Azufre/bicarbonato potasico/cola de caballo; retirar hojas enfermas; variedades tolerantes."
    },
    {
      id: "mildiu",
      nombreComun: "Mildiu (moho velloso)",
      nombreCientifico: "Bremia/Peronospora/Pseudoperonospora spp.",
      tipo: "oomiceto",
      descripcion: "Patogenos especificos por cultivo; exigen alta humedad y hojas mojadas.",
      danos: "Manchas amarillas y moho gris/violeta en enves; colapso de hojas.",
      cultivosAfectados: ['lechuga', 'espinaca', 'acelga', 'cebolla-larga', 'albahaca', 'pepino-cohombro', 'calabacn', 'pepino-dulce', 'perejil', 'cilantro'],
      prevencion: ["Riego por goteo", "Ventilacion", "Evitar encharcamientos", "Semillas/cultivares resistentes"],
      solucion: "Fungicidas anti-mildiu (uso responsable); cobre en preventivo; remover focos."
    },  {
      id: "botrytis",
      nombreComun: "Moho gris",
      nombreCientifico: "Botrytis cinerea",
      tipo: "hongo",
      descripcion: "Ataca tejidos senescentes/heridos con alta HR; muy comun en poscosecha.",
      danos: "Podredumbres blandas con moho gris; perdidas en campo y camara.",
      cultivosAfectados: ['fresa', 'lechuga', 'tomate-cherry', 'pimentn', 'aj-dulce', 'frijol', 'albahaca', 'hierbabuena'],
      prevencion: ["Cosecha en seco", "Ventilacion", "No mojar follaje tarde", "Higiene del cultivo"],
      solucion: "Retiro de tejidos; biofungicidas (Bacillus/Trichoderma); fungicidas especificos si hay riesgo alto."
    },
    {
      id: "sclerotinia",
      nombreComun: "Podredumbre blanca",
      nombreCientifico: "Sclerotinia sclerotiorum / S. minor",
      tipo: "hongo",
      descripcion: "Hongo de suelo; micelio blanco algodonoso y esclerocios negros.",
      danos: "Pudricion en cuello y base; marchitez y muerte.",
      cultivosAfectados: ['lechuga', 'frijol', 'albahaca', 'espinaca', 'acelga', 'perejil', 'cilantro'],
      prevencion: ["Rotacion 3 anos", "Drenaje", "Retirar residuos", "Evitar exceso de riego"],
      solucion: "Coniothyrium minitans (biocontrol del esclerocio); fungicidas de suelo en preventivo."
    },
    {
      id: "alternaria",
      nombreComun: "Mancha por Alternaria / Tizon temprano",
      nombreCientifico: "Alternaria spp. (A. solani, A. porri, etc.)",
      tipo: "hongo",
      descripcion: "Manchas concenctricas en hojas; favorecida por calor-humedad y estres.",
      danos: "Defoliacion prematura; manchas en fruto (tomate/pimenton).",
      cultivosAfectados: ['tomate-cherry', 'pimentn', 'aj-dulce', 'cebolla-larga', 'pepino-cohombro', 'calabacn', 'acelga', 'espinaca', 'rbano', 'fresa', 'frijol'],
      prevencion: ["Evitar mojado foliar", "Rotacion", "Nutricion balanceada"],
      solucion: "Contactos protectantes (manejo responsable) o extractos (neem/colas) temprano; eliminar residuos infectados."
    },
    {
      id: "fusarium",
      nombreComun: "Marchitez por Fusarium",
      nombreCientifico: "Fusarium oxysporum (diversas f. sp.)",
      tipo: "hongo",
      descripcion: "Patogeno de suelo; obstruye xilema; marchitez unilateral; decoloracion vascular.",
      danos: "Marchitez cronica, amarillamiento, muerte; en aromaticas decaimiento.",
      cultivosAfectados: ['tomate-cherry', 'pimentn', 'aj-dulce', 'albahaca', 'pepino-cohombro', 'calabacn', 'frijol', 'cebolla-larga', 'jengibre', 'crcuma'],
      prevencion: ["Plantulas sanas", "pH adecuado", "Evitar suelos cansados", "Solarizacion"],
      solucion: "Rotacion prolongada; injertos (tomate); Trichoderma en suelo; eliminar plantas enfermas."
    },
    {
      id: "phytophthora",
      nombreComun: "Tizones y pudriciones por Phytophthora",
      nombreCientifico: "Phytophthora spp. (P. infestans, P. capsici, P. nicotianae, etc.)",
      tipo: "oomiceto",
      descripcion: "Patogenos de agua/suelo; causan tizones foliares y pudriciones radicales/cuello.",
      danos: "Tizon tardio (tomate); muerte por cuello (pimenton/pepino); corazon negro en pina.",
      cultivosAfectados: ['tomate-cherry', 'pimentn', 'aj-dulce', 'pepino-cohombro', 'calabacn', 'pia'],
      prevencion: ["Drenaje excelente", "Goteo", "Rotacion", "Evitar laminas excesivas de riego"],
      solucion: "Fungicidas anti-oomicetos en preventivo; saneamiento; portainjertos tolerantes donde aplique."
    },
    {
      id: "pythium_rhizoctonia",
      nombreComun: "Damping-off / pudriciones de plantulas",
      nombreCientifico: "Pythium spp. / Rhizoctonia solani",
      tipo: "complejo (oomiceto/hongo)",
      descripcion: "Colapso de plantulas en semilleros o post-trasplante por patogenos de suelo.",
      danos: "Cuello acuoso, caida de plantulas; perdida de almacigos.",
      cultivosAfectados: ['lechuga', 'espinaca', 'acelga', 'cilantro', 'perejil', 'albahaca', 'cebolla-larga', 'pimentn', 'aj-dulce', 'tomate-cherry', 'pepino-cohombro', 'calabacn', 'fresa', 'jengibre', 'crcuma'],
      prevencion: ["Sustrato esteril", "Riegos ligeros", "Ventilacion", "Densidad adecuada"],
      solucion: "Sustrato esteril; riegos ligeros; ventilacion; densidad adecuada."
    }, {
      id: "ralstonia",
      nombreComun: "Marchitez bacteriana",
      nombreCientifico: "Ralstonia solanacearum",
      tipo: "bacteria",
      descripcion: "Bacteria de suelo que obstruye vasos; tipica en solanaceas y zingiberaceas.",
      danos: "Manchas angulares translucidas en hojas de cucurbitaceas; exudados.",
      cultivosAfectados: ['tomate-cherry', 'pimentn', 'aj-dulce', 'jengibre', 'crcuma'],
      prevencion: ["Suelo bien drenado", "Rotacion larga", "Evitar inundaciones y suelos infestados"],
      solucion: "Eliminar plantas; biocontrol (antagonistas en suelo); portainjertos resistentes (tomate)."
    },
    {
      id: "pseudomonas_cucurbita",
      nombreComun: "Mancha angular de cucurbitaceas",
      nombreCientifico: "Pseudomonas syringae pv. lachrymans",
      tipo: "bacteria",
      descripcion: "Manchas angulares translucidas en hojas de cucurbitaceas; exudados.",
      danos: "Defoliacion; lesiones en frutos (cicatrices).",
      cultivosAfectados: ['pepino-cohombro', 'calabacn', 'pepino-dulce'],
      prevencion: ["Semilla certificada", "Riego por goteo", "Evitar salpicaduras"],
      solucion: "Cupricos en preventivo; retirar hojas/frutos con lesiones; rotacion."
    },
    {
      id: "septoria",
      nombreComun: "Mancha por Septoria",
      nombreCientifico: "Septoria spp. (S. lycopersici, S. petroselini, etc.)",
      tipo: "hongo",
      descripcion: "Pequenas manchas con picnidios oscuros; avanzan en clima humedo.",
      danos: "Defoliacion; reduccion de rendimiento/calidad.",
      cultivosAfectados: ['tomate-cherry', 'perejil', 'cilantro', 'acelga', 'espinaca'],
      prevencion: ["Rotacion", "Riego sin mojar follaje", "Desinfeccion de herramientas"],
      solucion: "Retiro de hojas; fungicidas adecuados; manejo de densidad."
    },
    {
      id: "royas",
      nombreComun: "Royas",
      nombreCientifico: "Puccinia/Uromyces spp.",
      tipo: "hongo",
      descripcion: "Pustulas anaranjadas-pardas en hojas; liberan uredosporas.",
      danos: "Clorosis, necrosis y caida de hojas; baja de rendimiento.",
      cultivosAfectados: ['maz', 'frijol', 'hierbabuena', 'organo', 'albahaca'],
      prevencion: ["Eliminar hospederos alternos", "Variedades resistentes", "Evitar excesos de N"],
      solucion: "Fungicidas especificos cuando el umbral lo justifique; retiro de hojas enfermas."
    },
    {
      id: "virus_general",
      nombreComun: "Complejo de virosis",
      nombreCientifico: "Diversos (TYLCV, TSWV, CMV, ZYMV, BCMV, LMV, etc.)",
      tipo: "virus",
      descripcion: "Conjunto de virus transmitidos por vectores (mosca blanca, trips, pulgones, cochinillas).",
      danos: "Mosaicos, rizados, enanismo, abortos florales; frutos deformes o amargos.",
      cultivosAfectados: ['tomate-cherry', 'pimentn', 'aj-dulce', 'pepino-cohombro', 'calabacn', 'pepino-dulce', 'lechuga', 'frijol', 'fresa', 'albahaca', 'acelga', 'espinaca', 'yuca_dulce', 'pia'],
      prevencion: ["Semilla/plantulas sanas", "Control temprano de vectores", "Eliminacion de plantas enfermas"],
      solucion: "No hay curativo; manejo de vectores (trampas/biocontrol/jabones); barreras fisicas; variedades resistentes."
    },
    {
      id: "thielaviopsis_pina",
      nombreComun: "Podredumbre negra / corazon negro de pina",
      nombreCientifico: "Thielaviopsis (Ceratocystis) paradoxa",
      tipo: "hongo",
      descripcion: "Infecta tejidos de pina (fruto/corazon) especialmente en poscosecha o exceso de humedad.",
      danos: "Oscurecimiento interno, colapso de corona/corazon; perdidas de calidad.",
      cultivosAfectados: ['pia'],
      prevencion: ["Cosecha cuidadosa", "Desinfeccion de herramientas", "Evitar heridas y exceso de agua"],
      solucion: "Tratamientos poscosecha autorizados; manejo de drenaje y ventilacion en campo."
    }, {
      id: "dalbulus_maiz",
      nombreComun: "Chicharrita del maiz y complejo de rayado fino",
      nombreCientifico: "Dalbulus maidis (vector)",
      tipo: "insecto (vector de fitopatógenos)",
      descripcion: "Chinche pequena que transmite patogenos (fitoplasmas/virus) del maiz.",
      danos: "Rayado fino, achaparramiento, reduccion severa de rendimiento.",
      cultivosAfectados: ['maz'],
      prevencion: ["Siembra en fechas recomendadas", "Destruccion de socas", "Evitar traslapes prolongados"],
      solucion: "Monitoreo y manejo de poblaciones; bordes con barreras; control dirigido si rebasa umbral."
    },
    {
      id: "rhizomas_ginger_rot",
      nombreComun: "Pudricion de rizoma (jengibre/curcuma)",
      nombreCientifico: "Pythium/Fusarium spp.",
      tipo: "complejo (oomiceto/hongo)",
      descripcion: "Infecciones de rizomas en suelos encharcados o sustratos contaminados.",
      danos: "Rizomas blandos/olientes; amarillamiento, marchitez.",
      cultivosAfectados: ['jengibre', 'crcuma'],
      prevencion: ["Semilla (rizomas) sanos", "Sustrato drenante", "Desinfeccion y solarizacion"],
      solucion: "Mejorar drenaje; Trichoderma; evitar riegos excesivos; eliminar plantas afectadas."
    },
    {
      id: "onion_downy_purple",
      nombreComun: "Mildiu y mancha purpura de cebolla",
      nombreCientifico: "Peronospora destructor / Alternaria porri",
      tipo: "oomiceto/hongo",
      descripcion: "Enfermedades foliares clave en Allium; requieren HR alta y rocio prolongado.",
      danos: "Manchas extensas, necrosis, colapso del follaje; bulbos pequenos.",
      cultivosAfectados: ['cebolla-larga'],
      prevencion: ["Riegos por goteo", "Ventilacion", "Espaciamiento", "Rotacion"],
      solucion: "Fungicidas adecuados en preventivo; retirar hojas afectadas; evitar exceso de N."
    }
  
];

// URLs de imágenes para las plagas. Si un ID no está aquí, se usará una imagen de marcador de posición.
// Puedes añadir las URLs aquí cuando las tengas.
const pestImages: { [id: string]: { imageUrl: string; dataAiHint: string } } = {
  // EJEMPLO:
  // pulgones: { 
  //   imageUrl: "https://.../imagen_pulgon.jpg", 
  //   dataAiHint: "aphids on plant" 
  // },
};


async function seedPestsAndDiseases() {
  if (pestsAndDiseasesData.length === 0) {
    console.log('No hay datos de plagas para sembrar. Finalizando el script.');
    return;
  }
    
  const collectionRef = collection(db, 'plagas_y_enfermedades');
  console.log(`Iniciando siembra de ${pestsAndDiseasesData.length} plagas y enfermedades...`);

  const batch = writeBatch(db);
  pestsAndDiseasesData.forEach(pestData => {
    if (pestData.id) {
      const docRef = doc(collectionRef, pestData.id);
      const { id, ...dataToSet } = pestData;
      
      const completeData: Pest = {
        ...dataToSet,
        id: id,
        slug: id,
        imageUrl: pestImages[id]?.imageUrl || 'https://placehold.co/400x250.png',
        dataAiHint: pestImages[id]?.dataAiHint || 'plant pest disease',
      };
      
      batch.set(docRef, completeData);
    }
  });

  try {
    await batch.commit();
    console.log(`Lote de ${pestsAndDiseasesData.length} documentos de plagas subido exitosamente.`);
  } catch (error) {
    console.error("Error al subir lote de plagas a Firestore:", error);
  }
}

export const seedArticles = async () => {
    console.log('La función seedArticles está definida pero actualmente no tiene contenido.');
};

async function main() {
  console.log('--- Iniciando Proceso de Siembra en Firestore ---');
  await seedPestsAndDiseases();
  console.log('--- Proceso de Siembra Finalizado ---');
}

if (require.main === module) {
    main().catch(error => {
        console.error("Ocurrió un error en el script de siembra:", error);
    });
}
