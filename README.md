# RRR — Seu estilo não fica parado.

Campanha de moda vertical renderizada em Remotion. 1080 × 1920, 30 fps, 20 segundos (600 quadros). Exportação H.264, pixel format yuv420p, Rec.709, áudio AAC estéreo. O contato utilizado é **@rrrlojas**.

## Entregas

- `deliverables/RRR-seu-estilo.mp4`: vídeo final com trilha e efeitos.
- `deliverables/RRR-capa.png`: quadro do próprio MP4, em 17,9 segundos.
- `deliverables/RRR-projeto-editavel.zip`: código, imagens, áudio e instruções; sem `node_modules`.
- `deliverables/validacao.json`: verificação técnica da exportação.

## Baixar os arquivos

Na branch `rrr-campanha` do GitHub, abra `deliverables/RRR-projeto-editavel.zip` e clique em **Download raw file** (ícone de download). Extraia o ZIP para obter a pasta `RRR-projeto-editavel`, que inclui o vídeo final, a capa e todo o código. Para baixar o repositório inteiro, use **Code → Download ZIP**.

- [Baixar projeto editável](https://github.com/rondineley/remotion-test/raw/refs/heads/rrr-campanha/deliverables/RRR-projeto-editavel.zip)
- [Baixar vídeo MP4](https://github.com/rondineley/remotion-test/raw/refs/heads/rrr-campanha/deliverables/RRR-seu-estilo.mp4)
- [Baixar capa PNG](https://github.com/rondineley/remotion-test/raw/refs/heads/rrr-campanha/deliverables/RRR-capa.png)

## Iniciar e renderizar

Requer Node.js 22 ou 24, npm e um navegador Chromium. FFmpeg é necessário para extrair a capa e executar a verificação técnica. A música pronta está incluída; Python 3 e NumPy só são necessários para recriá-la ou rodar `scripts/validate.py`.

```bash
npm ci
npm run studio
```

Para exportar:

```bash
npm run typecheck
npm run render
npm run cover
python scripts/validate.py
```

Na nuvem, trabalhe diretamente em `/workspace/remotion-test`. Não é necessário criar um Git worktree. O Chromium disponível em `/usr/bin/chromium` é detectado por `remotion.config.ts`. Em outra máquina, o Remotion usa seu navegador padrão; você também pode definir `REMOTION_BROWSER_EXECUTABLE` com o caminho do navegador. As fontes, as imagens e a trilha são locais: a renderização não depende de bancos de imagens ou de fontes pela rede.

## Trocar nome, textos, cores, logo e contato

Edite **`src/config.ts`**. Os campos `store`, `contact`, `logo`, `colors`, `copy` e `looks` concentram o conteúdo. Para usar um logo, coloque o arquivo em `public/images/` e indique, por exemplo, `logo: 'images/logo.svg'`. O texto RRR atual é uma assinatura tipográfica criada para esta peça, não um logotipo oficial fornecido pela loja.

## Trocar as imagens

Coloque três fotos em `public/images/` e configure cada look assim:

```ts
{src: 'images/look-real-01.jpg', panel: null, objectPosition: '50% 50%', label: '01 / ESSENCIAL'}
```

Repita para os looks 02 e 03. Use fotos verticais, de preferência de corpo inteiro e com cabeça/quadril alinhados. `objectPosition` ajusta o enquadramento; as imagens preservam a proporção, mas suas bordas podem ser recortadas para preencher o quadro. As máscaras de silhueta do editorial original só se aplicam ao atlas de três painéis. Com fotos individuais, a composição mantém o match cut e a transição de camiseta; para texto atravessando por trás de novas silhuetas, adapte as máscaras em `src/video.tsx` ou use recortes transparentes preparados a partir das fotos reais.

As imagens atuais são **editoriais fictícios gerados por IA**, identificados no vídeo como ilustrativos. Elas não representam estoque, produtos ou modelos reais da RRR. Quando colocar materiais da loja autorizados para publicidade, atualize `copy.referenceNotice` conforme o uso real. Não foram criados preços ou promoções.

## Linha do tempo

| Tempo | Cena |
| --- | --- |
| 0–3s | Camiseta em movimento, tipografia SEU ESTILO / NÃO FICA PARADO. |
| 3–7s | Três looks, três entradas, recortes de tecido. |
| 7–12s | Enquadramentos alinhados, máscaras de camiseta e palavras atrás da modelo. |
| 12–16s | Look principal, aproximação suave e pausa de leitura. |
| 16–20s | Assinatura RRR, chamada e @rrrlojas; tela parada de 17,8s a 20s. |

As animações usam apenas o número do quadro, sem timers ou aleatoriedade na renderização. Os cortes principais coincidem com a grade de 120 BPM da trilha. As informações importantes ficam afastadas das bordas e da área inferior usada pela interface dos aplicativos.

## Materiais e som

Veja `ASSETS.md` para a origem de cada recurso e as licenças das fontes. A trilha instrumental e os efeitos são sínteses originais, sem samples externos. Para regenerar o áudio com a mesma semente: `npm run audio` (Python 3 + NumPy). A trilha também funciona como arquivo separado em `public/audio/rrr-runway.wav`.
