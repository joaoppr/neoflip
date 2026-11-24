# NeoFlip

Site institucional da NeoFlip: consultoria estratégica de cloud, FinOps e governança, e plataforma SaaS de FinOps multicloud, para empresas de qualquer porte e com uma ou várias clouds.

> Turning technology into value

## Estrutura

```
index.html        página única (HTML semântico, responsiva)
css/              styles.css (estilos) e fonts.css (Inter e Sora, auto-hospedadas)
js/               main.js (interações) e config.js (dados de contato)
img/              logo, ícones, telas da demonstração e imagem de compartilhamento
fonts/            arquivos woff2
```

Sem etapa de build e sem dependências externas: basta servir os arquivos estáticos.

## Rodar localmente

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

## Configurar contatos

Edite `js/config.js` (e-mail, telefone, LinkedIn). Enquanto os valores estiverem entre `[colchetes]`, o site mostra "a definir" e o formulário avisa que o canal ainda está sendo configurado.

## Observações de conteúdo

- As telas da plataforma são da demonstração, com **dados simulados**; a plataforma está em desenvolvimento.
- As telas da plataforma vêm de uma demonstração com um grupo fictício ("Grupo Exemplo"); o site é genérico e não cita clientes.
- As marcas de terceiros citadas pertencem aos respectivos titulares e a menção não indica parceria.

## Publicação

Por ser um site estático, pode ser publicado no GitHub Pages (Settings > Pages > Deploy from a branch > `main` / root), na Vercel, no Netlify ou em qualquer hospedagem estática. Em repositórios privados, o GitHub Pages exige plano pago.
