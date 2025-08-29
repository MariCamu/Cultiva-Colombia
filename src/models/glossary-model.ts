
export interface GlossaryTerm {
  id: string;
  termino: string;
  definicion: string;
  categoria: string;
  icono_referencia?: string;
  orden_alfabetico: string;
  palabras_clave?: string[];
}
