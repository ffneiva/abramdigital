# Deploy

- **Endereço:** https://abramdigital.com.br (e www → raiz)
- **Origem:** S3 static website hosting (sa-east-1), bucket `abramdigital.com.br`
- **Na frente:** Cloudflare (proxy laranja, TLS, cache, cabeçalhos de segurança)
- **CI/CD:** GitHub Actions com OIDC — nenhuma chave da AWS de longa duração

Sem CloudFront: a Cloudflare já faz CDN e TLS, e as duas juntas eram camada
duplicada. Os scripts de provisionamento e os valores reais ficam **fora deste
repositório**, que é público, em `../_infra-abramdigital` (leia o `LEIA-ME.md`
de lá).

---

## Primeira vez

1. `ABERTO_ATE_DNS=1 bash ../_infra-abramdigital/aws-setup.sh` — cria os dois
   buckets (site e www → redirect), o website hosting, a role OIDC e grava o
   resumo em `../_infra-abramdigital/DEPLOY-SECRETS.txt`. Com
   `ABERTO_ATE_DNS=1`, o endpoint `*.s3-website-sa-east-1.amazonaws.com` abre
   direto no navegador, para ver o site antes do DNS.
2. `bash ../_infra-abramdigital/deploy-local.sh` — publica da máquina local.
3. **Cloudflare** — a zona `abramdigital.com.br` adicionada e os nameservers
   trocados no Registro.br. Depois, com um token de API
   (`setx CLOUDFLARE_API_TOKEN ...`, permissões no LEIA-ME da infra):
   `bash ../_infra-abramdigital/cloudflare-setup.sh` — DNS proxied, SSL
   Flexible só para estes hostnames, HTTPS sempre, HSTS, CSP e cabeçalhos,
   regras de cache e o 301 de `/rota` para `/rota/`.
4. `bash ../_infra-abramdigital/aws-setup.sh` (sem `ABERTO_ATE_DNS`) — fecha o
   bucket só para os IPs da Cloudflare.
5. GitHub (`ffneiva/abramdigital`) → Settings → Environments → `production`;
   Secret `AWS_ROLE_ARN` (secret, não variable: o log do Actions é público e o
   GitHub só mascara secrets); Variables `AWS_REGION`, `S3_BUCKET_NAME`,
   `S3_WEBSITE_ENDPOINT`, `SITE_DOMINIO`. Os valores estão no
   `DEPLOY-SECRETS.txt`. Sem token da Cloudflare no GitHub: o HTML vai com
   `max-age=0` e a borda não o guarda.

## Dia a dia

```bash
git push origin main      # o deploy.yml testa, constrói, publica e confere no ar
```

### Mudar texto, serviço, contato, portfólio

Tudo em [`src/lib/business.ts`](src/lib/business.ts). Para um trabalho novo no
portfólio: a entrada em `TRABALHOS`, o vídeo do site rolando (960×600, ~10 s,
mudo) em `public/videos/trabalhos/<id>.{webm,mp4}` e a capa (o primeiro
quadro) em `public/images/trabalhos/<id>-capa.{avif,webp}`. O gravador fica
fora do repositório, em `../_midia-abramdigital/video/gravar.mjs`: ele usa a
GPU de verdade e rola a página com a roda do mouse, para os efeitos de cada
site aparecerem como são.

---

## Quando algo dá errado

| Sintoma | Causa |
|---|---|
| `404 NoSuchBucket` pela Cloudflare | O bucket não tem o nome exato do hostname — o S3 website escolhe o bucket pelo `Host` |
| Erro 52x da Cloudflare | SSL em *Full* com origem S3 website (que só fala HTTP): a regra de configuração precisa de *Flexible* para estes hostnames |
| `403` em página inexistente, em vez de `404` | A policy do bucket perdeu o `s3:ListBucket` |
| `/rota` responde 302 em vez de 301 | A regra de redirecionamento da Cloudflare não foi criada (o 302 é do S3) |
| Fonte do sistema no lugar da Montserrat | `Content-Type` errado no `.woff2` (o deploy corrige numa passada própria) |
| Site antigo depois do deploy | Cache do navegador; a borda não guarda HTML. Se mudou a regra de cache, purge manual no painel da Cloudflare |
| Action falha em *AssumeRoleWithWebIdentity* | O environment `production` não existe no GitHub |
