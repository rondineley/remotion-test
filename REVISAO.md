# Revisão da entrega

Verificações realizadas sobre `deliverables/RRR-seu-estilo.mp4`:

- Decodificação completa de 600 quadros e da faixa AAC, sem erros.
- 1080 × 1920, 30 fps, H.264 High, yuv420p, Rec.709 com faixa limitada e MP4 com metadados antes da mídia (fast start).
- Vídeo com exatamente 20 segundos; contêiner com 20,011 segundos por causa do enquadramento da faixa AAC.
- Nenhum quadro preto encontrado na análise dos 600 quadros.
- Tela final estável durante os últimos 66 quadros (2,2 segundos). A pequena diferença residual medida é de compressão.
- Revisão visual de imagens extraídas a cada segundo de toda a exportação, mais os quadros 53, 132, 175, 207, 252, 297, 357 e 477, e uma sequência de 24 quadros consecutivos em torno da troca de look.
- Enquadramento preservado; figuras sem alteração de proporção. Textos centrais, contato e chamada sem cortes. As palavras grandes passam intencionalmente por trás da modelo; cada palavra também aparece inteira no rodapé da composição.
- Cortes das cinco cenas na grade de 120 BPM. Entradas dos looks em 3s, 4,5s e 6s; trocas alinhadas em 7s, 8,5s e 10s; destaque em 12s e marca em 16s. Trilha e efeitos determinísticos e locais.
- Trilha sem samples externos e sem amostras digitais clipadas. Pico do arquivo fonte: aproximadamente −1,11 dBFS, antes do ganho de 0,88 usado no vídeo.
- Capa extraída do MP4 em 17,9 segundos, sem reconstrução separada.
- Reinstalação com `npm ci` e verificação TypeScript concluídas. Remotion Studio iniciado e página respondendo HTTP 200.

Os resultados automatizados estão em `deliverables/validacao.json`. Para reexecutar: `python scripts/validate.py`. O projeto não contém fotos de produtos reais da loja; os materiais ilustrativos estão identificados na peça e documentados em `ASSETS.md`.
