<div align="center">

<img src="docs/wmk-logo.jpg" alt="Logo oficial WMK Music Studio" width="128" height="128" />

# WMK Music Studio

**Estúdio de criação musical com inteligência artificial — composição, letras, áudio e videoclipes.**

[![Licença MIT](https://img.shields.io/badge/Licen%C3%A7a-MIT-green)](LICENSE)
[![GitHub Actions](https://github.com/WalneyNF/WMK-Music-Studio/actions/workflows/wmk-windows.yml/badge.svg)](https://github.com/WalneyNF/WMK-Music-Studio/actions/workflows/wmk-windows.yml)
[![Repositório](https://img.shields.io/badge/GitHub-WMK--Music--Studio-8b5cf6)](https://github.com/WalneyNF/WMK-Music-Studio)

**Desenvolvimento e expansão WMK: Walney Moreira Klein — walneyk@hotmail.com**

</div>

## Apresentação

O WMK Music Studio é um fork do [YuE2 Studio](https://github.com/timoncool/YuE2-Studio), destinado à criação e produção musical com inteligência artificial. A proposta é oferecer uma experiência inspirada no Suno, com liberdade para selecionar motores musicais, estudar composição, editar partituras e organizar músicas próprias.

O projeto está em fase inicial de adaptação WMK. Os recursos herdados do projeto original não devem ser confundidos com funcionalidades novas já testadas no fork.

![Interface original de referência](docs/screenshots/en-01-create.png)

## Recursos herdados

- Geração de músicas completas a partir de estilos e letras, com YuE2, ACE-Step e MiniMax Music 3.
- Composição instrumental, partituras ABC, edição MIDI, acordes e arranjos.
- Biblioteca musical, playlists, comparação de versões e capas.
- Separação de vocais e instrumentos, mixagem, efeitos e masterização.
- Letras sincronizadas, karaokê e criação de videoclipes MP4.
- Exportação de áudio em WAV, FLAC e MP3, além de MIDI.
- Assistente de composição e integração com modelos externos compatíveis.
- Servidor MCP para agentes de IA.
- Interface com tradução para português.

## Requisitos e compatibilidade

| Componente | Orientação |
|---|---|
| Sistema | Windows x64; verificar compatibilidade do runtime |
| Interface desktop | Tauri e Microsoft Edge WebView2 |
| GPU | O projeto original recomenda 6 GB de VRAM ou mais para os motores locais |
| Espaço | Aproximadamente 4–10 GB por conjunto de modelos, além do programa |
| CPU | Alguns motores oferecem execução por processador; desempenho depende do hardware |
| Desenvolvimento | Rust stable MSVC, ferramentas C++ do Visual Studio, Node.js 22 compatível com Vite e Git |

Computadores com 2 GB de VRAM estão abaixo dos requisitos usuais de geração local acelerada. Não há garantia de geração musical satisfatória por CPU. O modo econômico WMK e a validação de hardware são objetivos do projeto.

## Instalação e downloads

- [Releases do fork WMK](https://github.com/WalneyNF/WMK-Music-Studio/releases): consulte a disponibilidade de versões publicadas.
- [GitHub Actions](https://github.com/WalneyNF/WMK-Music-Studio/actions): acompanhe testes e compilação.
- [Releases do YuE2 Studio original](https://github.com/timoncool/YuE2-Studio/releases): opção para testar a versão original, separadamente do fork.

O fork ainda não possui uma compilação Windows validada nesta etapa.

## Compilação pelo GitHub Actions

1. Abra a aba **Actions** do repositório.
2. Habilite os workflows, caso o GitHub solicite.
3. Selecione **WMK Windows - Testes e Build**.
4. Clique em **Run workflow**, escolha a branch desejada e confirme.
5. Em caso de sucesso, consulte o artefato **WMK-Music-Studio-Windows-x64**.

O workflow está em [wmk-windows.yml](.github/workflows/wmk-windows.yml). Ele configura testes React e Rust, compilação frontend, servidor independente e aplicativo desktop. A publicação de instaladores e a validação de execução ainda são etapas pendentes.

## Desenvolvimento local (Windows)

Clone o projeto:

```powershell
git clone https://github.com/WalneyNF/WMK-Music-Studio.git
cd WMK-Music-Studio
```

Em um terminal, execute o servidor Rust:

```powershell
cargo run --locked -p music-server
```

Em outro terminal, na raiz do repositório:

```powershell
npm ci --prefix app
npm --prefix app run dev
```

A interface de desenvolvimento utiliza http://127.0.0.1:3791 e o servidor utiliza a porta 8791 por padrão. O modo navegador ainda precisa ser validado; algumas operações dependem do Tauri. Utilize apenas em rede confiável, pois a configuração Vite original escuta em todas as interfaces.

Para testar o código:

```powershell
npm --prefix app test
npm --prefix app run build
cargo test --locked -p music-server
```

## Arquitetura

| Diretório | Responsabilidade |
|---|---|
| `app/` | Interface React, TypeScript e Vite |
| `desktop/` | Aplicativo Tauri |
| `crates/music-core/` | Núcleo musical |
| `crates/music-server/` | APIs, biblioteca e MCP |
| `crates/music-engine/` | Integração com motores musicais |
| `crates/audio-post/` | Pós-processamento de áudio |
| `engines/` | Integrações de geração |
| `config/` | Catálogos e configurações |
| `docs/` | Documentação e identidade visual |

## Integração com agentes e IA

O servidor MCP original utiliza `http://127.0.0.1:8791/mcp`. Consulte a [documentação MCP](docs/mcp-skill.md) e a [API HTTP](docs/music-http-v1.md).

A integração WMK com Groq e Ollama para letras, prompts e composição estruturada está planejada. Modelos de linguagem comuns não geram diretamente músicas completas com vocais.

## Roadmap WMK

- [x] Criar fork e definir identidade WMK.
- [x] Publicar README em português e logo oficial.
- [x] Configurar workflow Windows.
- [ ] Validar compilação e execução no Windows.
- [ ] Aplicar identidade visual a toda a interface e aos ícones do aplicativo.
- [ ] Criar inicializador e modo navegador.
- [ ] Implementar diagnóstico de hardware e modo econômico.
- [ ] Integrar Groq e Ollama.
- [ ] Criar laboratório de letras, estilos e prompts para Suno.
- [ ] Organizar importação de músicas, álbuns e instrumentos.
- [ ] Desenvolver composição procedural e exportação para jogos.
- [ ] Expandir manuais em português.

## Documentação e projeto original

A documentação técnica original continua disponível no [README original em inglês](https://github.com/timoncool/YuE2-Studio/blob/main/README.md) e na [página original em português](https://timoncool.github.io/YuE2-Studio/pt.html). Consulte também os arquivos em [docs/](docs/) e [guides/](guides/).

## Créditos e licença

**Desenvolvimento e expansão WMK:** Walney Moreira Klein — walneyk@hotmail.com.

**Projeto original:** YuE2 Studio, Ilya Timonin (Nerual Dreming), Copyright © 2025–2026.

O aplicativo utiliza a [licença MIT](LICENSE), preservando os avisos de copyright originais. Modelos de IA, motores externos, plugins e outros recursos possuem licenças próprias, que devem ser verificadas antes de qualquer redistribuição ou uso comercial.

