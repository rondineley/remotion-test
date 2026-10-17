"""Empacota fontes, materiais e entregas, sem caches ou dependências instaladas."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root=Path(__file__).resolve().parents[1]
out=root/'deliverables/RRR-projeto-editavel.zip'
skip={'.git','node_modules','.cache','build','__pycache__'}
with ZipFile(out,'w',compression=ZIP_DEFLATED,compresslevel=6) as z:
    for path in sorted(root.rglob('*')):
        if not path.is_file() or path==out:
            continue
        rel=path.relative_to(root)
        if any(part in skip for part in rel.parts) or path.suffix=='.log':
            continue
        z.write(path,Path('RRR-projeto-editavel')/rel)
with ZipFile(out) as z:
    assert z.testzip() is None
    names=z.namelist()
    for needed in ['src/config.ts','src/video.tsx','public/images/editorial-triptych.png','public/audio/rrr-runway.wav','deliverables/RRR-seu-estilo.mp4','deliverables/RRR-capa.png','package-lock.json','README.md']:
        assert 'RRR-projeto-editavel/'+needed in names,needed
    print(f'{len(names)} arquivos | {out.stat().st_size/1e6:.2f} MB | {out}')
