// Todas as informações comerciais e todos os materiais ficam neste arquivo.
// As imagens atuais são editoriais fictícias, não representam produtos da RRR.
export const campaign = {
  store: 'RRR',
  contact: '@rrrlojas',
  logo: null as string | null, // Arquivo dentro de public/, ex.: 'images/logo.svg'.
  colors: {
    cream: '#F1EFE7',
    black: '#171915',
    white: '#FFFFFF',
    lime: '#C6F34A',
    muted: '#74766C',
  },
  copy: {
    hookLines: ['SEU', 'ESTILO'],
    hookEndLines: ['NÃO FICA', 'PARADO.'],
    introduction: 'Novos looks.\nNovas possibilidades.',
    backgroundWord: 'NOVOS',
    verbs: ['COMBINE', 'EXPRESSE', 'SURPREENDA'],
    desireTitle: 'DO SEU\nJEITO.',
    desireBody: 'No seu\nritmo.',
    tagline: 'SEU ESTILO NÃO FICA PARADO.',
    strapline: 'VISTA SUAS POSSIBILIDADES.',
    heroCaption: 'PERSONALIDADE\nEM CADA ESCOLHA.',
    detailLabel: 'NO DETALHE',
    chapters: ['01 — EM MOVIMENTO', '02 — POSSIBILIDADES', '03 — EXPERIMENTE', '04 — NO SEU RITMO', 'RRR — VISTA-SE DE VOCÊ'],
    endHeadline: 'Seu próximo look\nestá aqui.',
    cta: 'Conheça a coleção.',
    referenceNotice: 'Imagens ilustrativas • looks de referência',
  },
  // Para usar fotos individuais: troque src e defina panel como null.
  // objectPosition aceita o enquadramento CSS usual, ex.: '50% 45%'.
  looks: [
    {src: 'images/editorial-triptych.png', panel: 0 as number | null, objectPosition: '50% 50%', label: '01 / ESSENCIAL'},
    {src: 'images/editorial-triptych.png', panel: 1 as number | null, objectPosition: '50% 50%', label: '02 / ATITUDE'},
    {src: 'images/editorial-triptych.png', panel: 2 as number | null, objectPosition: '50% 50%', label: '03 / MOVIMENTO'},
  ],
  music: 'audio/rrr-runway.wav',
  musicVolume: 0.88,
};

export const video = {width: 1080, height: 1920, fps: 30, durationInFrames: 600};
