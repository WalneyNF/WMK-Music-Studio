# Integração WMK Music Studio ↔ MuseScore Studio

Repositórios:
- WMK Music Studio: https://github.com/WalneyNF/WMK-Music-Studio
- MuseScore (fork): https://github.com/WalneyNF/MuseScore

## Estratégia inicial: interoperabilidade por arquivos

O MuseScore já documenta importação/exportação MusicXML e MIDI (SMF), além de exportação PDF e sintetizador de partituras. Portanto, **não é necessário compilar ou incorporar MuseScore** para oferecer interoperabilidade.

1. WMK Music Studio cria/edita composição, notas, ritmos, acordes e letra.
2. Exporta **MusicXML** quando o objetivo é preservar partitura, duração, vozes, compassos e símbolos musicais; **MIDI (.mid)** quando o objetivo é reprodução, piano roll e prática.
3. O usuário abre o arquivo no MuseScore instalado.
4. O MuseScore edita a partitura e exporta MusicXML/MIDI para reimportação no WMK.
5. Não renomear JSON para .musicxml ou .mid: é preciso implementar serializadores e parsers válidos e testar a ida e volta.

## Próximos incrementos

- [ ] Importador/exportador MIDI no WMK Piano Trainer, com controle de BPM e velocidade e canais/mãos.
- [ ] Exportador/importador MusicXML no WMK, validado em partituras reais.
- [ ] Ação Abrir no MuseScore via backend Windows, com escolha do executável e validação de caminho.
- [ ] Identificar e preservar letras, tempos, dinâmica e articulações na ida e volta.
- [ ] Avaliar plugin ou extensão no MuseScore somente após testes da integração por arquivo.

## Compatibilidade/licenças

MuseScore Studio: **GPL-3.0**. WMK Music Studio: fork original sob **MIT**. Manter aplicativos/processos separados e interoperabilidade por arquivos; incorporar código MuseScore no WMK exige análise de obrigações GPL e compatibilidade de redistribuição. Conservar avisos de copyright.

Créditos WMK: Walney Moreira Klein — walneyk@hotmail.com.
