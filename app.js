const http = require('http');
const fs = require('fs');
const url = require('url');

const servidor = http.createServer((req, res) => {
    const endereco = url.parse(req.url, true);

    if (endereco.pathname === '/') {
        fs.readFile('public/index.html', 'utf8', (erro, pagina) => {
            if (erro) {
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>Erro 500</h1><p>Não foi possível abrir a página.</p>');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(pagina);
        });
    } else if (endereco.pathname === '/media') {
        const p1 = endereco.query.p1;
        const p2 = endereco.query.p2;

        if (p1 === undefined || p2 === undefined || p1 === '' || p2 === '') {
            res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>Erro 400</h1><p>Informe as notas P1 e P2.</p>');
            return;
        }

        const nota1 = Number(p1);
        const nota2 = Number(p2);

        if (isNaN(nota1) || isNaN(nota2)) {
            res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>Erro 400</h1><p>As notas precisam ser números.</p>');
            return;
        }

        const media = (nota1 + nota2) / 2;
        let arquivo;
        let situacao;

        if (media >= 6) {
            arquivo = 'aprovado.html';
            situacao = 'APROVADO';
        } else {
            arquivo = 'reprovado.html';
            situacao = 'REPROVADO';
        }

        fs.readFile('public/' + arquivo, 'utf8', (erro, pagina) => {
            if (erro) {
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>Erro 500</h1><p>Não foi possível abrir a página.</p>');
                return;
            }

            pagina = pagina.replace('{{P1}}', nota1);
            pagina = pagina.replace('{{P2}}', nota2);
            pagina = pagina.replace('{{MEDIA}}', media.toFixed(2));
            pagina = pagina.replace('{{SITUACAO}}', situacao);

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(pagina);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Erro 404</h1><p>Página não encontrada.</p>');
    }
});

servidor.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
