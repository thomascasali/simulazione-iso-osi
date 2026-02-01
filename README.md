# Simulazione ISO/OSI - Il Viaggio del Messaggio

Una simulazione animata e interattiva del viaggio di un messaggio "ciao" attraverso i 7 livelli della pila ISO/OSI, da un telefono con WhatsApp a un PC con WhatsApp Web.

## Demo

[Visualizza la simulazione online](https://thomascasali.github.io/simulazione-iso-osi/)

## Caratteristiche

- Visualizzazione animata di tutti i 7 livelli ISO/OSI
- Dettagli tecnici su protocolli reali (Signal, TLS 1.3, WebSocket, TCP/IP, WiFi, Ethernet)
- Animazioni interattive con effetti visivi
- Navigazione tramite tastiera e click
- Modalità presentazione automatica
- Visualizzazione dell'incapsulamento/deincapsulamento dei pacchetti
- Spiegazione della tripla crittografia (E2E + TLS + WPA2)

## Struttura della presentazione

1. **Intro** - Panoramica dello scenario
2. **Pila ISO/OSI** - I 7 livelli e le loro funzioni
3. **L7 Applicazione** - WhatsApp + Signal Protocol
4. **L6-L5 Presentazione/Sessione** - Protobuf + TLS + WebSocket
5. **L4-L3 Trasporto/Rete** - TCP + IPv4 + NAT
6. **L2-L1 Data Link/Fisico** - WiFi 802.11 + OFDM
7. **Viaggio Internet** - Hop attraverso la rete
8. **Ricezione L1-L2** - Gigabit Ethernet
9. **Ricezione L3-L4** - Verifica IP + TCP ACK
10. **Ricezione L5-L7** - Decifratura e visualizzazione
11. **Riepilogo** - Overhead e tempi
12. **Fine** - Conclusioni

## Comandi

| Tasto | Azione |
|-------|--------|
| `→` o `Spazio` | Slide successiva |
| `←` | Slide precedente |
| `Home` | Prima slide |
| `End` | Ultima slide |

## Sviluppo locale

### Prerequisiti

- Node.js 18+
- npm 9+

### Installazione

```bash
# Clona il repository
git clone https://github.com/thomascasali/simulazione-iso-osi.git
cd simulazione-iso-osi

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

### Build

```bash
# Crea la build di produzione
npm run build

# Preview della build
npm run preview
```

### Deploy su GitHub Pages

```bash
npm run deploy
```

## Tecnologie utilizzate

- **React 19** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **gh-pages** - Deploy

## Documentazione

La documentazione completa si trova nella cartella `docs/`:
- [ISO-OSI-Simulazione-Completa.md](docs/ISO-OSI-Simulazione-Completa.md)

## Crediti

Realizzato per scopi didattici

**ITTS Belluzzi Da Vinci - Rimini**

Corso: Sistemi e Reti

## Licenza

MIT License
