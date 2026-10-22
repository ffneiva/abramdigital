"""Confere o SEO do build (dist/): JSON-LD válido, @id resolvidos, campos
obrigatórios por tipo (os que o Google pede para rich results), metadados e
travessões. Sai com erro se algo falhar.

    npm run build && python -I scripts/validar-seo.py
"""
import glob
import json
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(RAIZ, 'dist')
OBRIG = {
    'Organization': ['name', 'url', 'logo'],
    'WebSite': ['url', 'name'],
    'WebPage': ['url', 'name'], 'AboutPage': ['url', 'name'],
    'BreadcrumbList': ['itemListElement'],
    'Service': ['name', 'provider', 'serviceType'],
    'FAQPage': ['mainEntity'],
    'CreativeWork': ['name', 'creator'],
    'VideoObject': ['name', 'description', 'thumbnailUrl', 'uploadDate'],
}
erros = []


def tipos(n):
    t = n.get('@type', [])
    return t if isinstance(t, list) else [t]


def andar(n, f):
    if isinstance(n, dict):
        f(n)
        for v in n.values():
            andar(v, f)
    elif isinstance(n, list):
        for v in n:
            andar(v, f)


for arq in sorted(glob.glob(os.path.join(DIST, '**', '*.html'), recursive=True)):
    # Arquivos de verificação de buscador (google<código>.html) não são páginas.
    if re.fullmatch(r'google[0-9a-f]+\.html', os.path.basename(arq)):
        continue
    rel = os.path.relpath(arq, DIST).replace('\\', '/')
    s = re.sub(r'<!--.*?-->', '', open(arq, encoding='utf-8').read(), flags=re.S)
    vis = re.sub(r'<script.*?</script>|<style.*?</style>|<svg.*?</svg>', '', s, flags=re.S)
    if '—' in vis or '–' in vis:
        erros.append(f'{rel}: travessão no HTML')
    titulo = re.search(r'<title>(.*?)</title>', s)
    desc = re.search(r'<meta name="description" content="([^"]*)"', s)
    if not titulo:
        erros.append(f'{rel}: sem title')
    if rel != 'index.html' and rel != '404.html':
        if len(titulo.group(1)) > 60:
            erros.append(f'{rel}: title com {len(titulo.group(1))} caracteres')
        if desc and not 110 <= len(desc.group(1)) <= 165:
            erros.append(f'{rel}: description com {len(desc.group(1))} caracteres')
        if '<link rel="canonical"' not in s:
            erros.append(f'{rel}: sem canonical')
    if re.sub(r'<noscript>.*?</noscript>', '', s, flags=re.S).count('<h1') != 1:
        erros.append(f'{rel}: {s.count("<h1")} h1')
    for img in re.findall(r'<img [^>]*>', s):
        if ' alt="' not in img:
            erros.append(f'{rel}: imagem sem alt')
    blocos = re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S)
    if not blocos and rel != '404.html':
        erros.append(f'{rel}: sem JSON-LD')
    for b in blocos:
        try:
            d = json.loads(b)
        except json.JSONDecodeError as e:
            erros.append(f'{rel}: JSON-LD inválido ({e})')
            continue
        nos = d.get('@graph', [d])
        ids = set()
        andar(nos, lambda n: ids.add(n['@id']) if '@id' in n and len(n) > 1 else None)
        refs = []
        andar(nos, lambda n: refs.append(n['@id']) if list(n.keys()) == ['@id'] else None)
        for r in refs:
            if r not in ids:
                erros.append(f'{rel}: @id sem destino {r}')

        def conferir(n):
            for t in tipos(n):
                for c in OBRIG.get(t, []):
                    if c not in n and not (list(n.keys()) == ['@id']):
                        erros.append(f'{rel}: {t} sem {c}')
            if 'Question' in tipos(n) and not n.get('acceptedAnswer', {}).get('text'):
                erros.append(f'{rel}: pergunta sem resposta')
            if 'ListItem' in tipos(n) and not all(k in n for k in ('position', 'name', 'item')):
                erros.append(f'{rel}: ListItem incompleto')
        # Campos obrigatórios só nas entidades principais do @graph; um Service citado
        # dentro de uma oferta é só uma referência (nome + url), como o Google aceita.
        for n in nos:
            conferir(n)

        def aninhado(n):
            if any(n is x for x in nos):
                return
            if 'Question' in tipos(n) and not n.get('acceptedAnswer', {}).get('text'):
                erros.append(f'{rel}: pergunta sem resposta')
            if 'ListItem' in tipos(n) and not all(k in n for k in ('position', 'name', 'item')):
                erros.append(f'{rel}: ListItem incompleto')
            if 'VideoObject' in tipos(n):
                erros.extend(f'{rel}: VideoObject sem {c}' for c in OBRIG['VideoObject'] if c not in n)
        andar(nos, aninhado)
    print('ok' if not [e for e in erros if e.startswith(rel)] else '!!', rel, f'({len(blocos)} JSON-LD)')

print('\n'.join(erros) if erros else '\nTudo certo.')
sys.exit(1 if erros else 0)
