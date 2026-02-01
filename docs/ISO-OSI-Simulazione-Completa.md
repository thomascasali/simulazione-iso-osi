# Simulazione Completa: Il Viaggio del Messaggio "ciao" attraverso ISO/OSI

## Scenario della Simulazione

```
┌─────────────────┐                                           ┌─────────────────┐
│   📱 TELEFONO   │                                           │   💻 PC         │
│   Android/iOS   │                                           │   Windows/Linux │
│                 │                                           │                 │
│  WhatsApp App   │ ──────────── INTERNET ──────────────────▶ │  WhatsApp Web   │
│                 │                                           │   (Browser)     │
│   WiFi 📶       │                                           │   Ethernet 🔌   │
│ 192.168.1.100   │                                           │ 192.168.2.50    │
└─────────────────┘                                           └─────────────────┘
        │                                                             │
        ▼                                                             ▼
┌─────────────────┐                                           ┌─────────────────┐
│  Router Casa A  │                                           │  Router Casa B  │
│  192.168.1.1    │                                           │  192.168.2.1    │
│  IP Pub: 82.x   │                                           │  IP Pub: 151.x  │
└─────────────────┘                                           └─────────────────┘
        │                                                             │
        └──────────────────┐                     ┌─────────────────────┘
                           ▼                     ▼
                    ┌─────────────────────────────────┐
                    │     SERVER WHATSAPP             │
                    │     (Meta/Facebook)             │
                    │     IP: 157.240.1.52            │
                    │     Porta: 443 (HTTPS/WSS)      │
                    └─────────────────────────────────┘
```

---

# PARTE 1: DISCESA DEI 7 LIVELLI SUL TELEFONO (MITTENTE)

## Dati Iniziali

- **Messaggio originale**: `ciao`
- **Codifica UTF-8**: `63 69 61 6F` (4 byte)
- **Mittente**: +39 333 1234567
- **Destinatario**: +39 347 9876543
- **Timestamp**: 1702640400 (Unix timestamp)

---

## LIVELLO 7 - APPLICAZIONE

### Cosa succede
L'utente digita "ciao" e preme invio. L'app WhatsApp prepara il messaggio usando il **protocollo proprietario Signal** (crittografia end-to-end).

### Protocollo utilizzato
- **XMPP modificato** (eXtensible Messaging and Presence Protocol) - base storica
- **Protocollo Signal** per la crittografia E2E
- Trasporto su **WebSocket** (WSS) verso i server WhatsApp

### Processo di crittografia Signal (Double Ratchet)

```
MITTENTE                                          DESTINATARIO
    │                                                   │
    │  1. Genera chiave effimera (Curve25519)           │
    │     ephemeral_key = random_curve25519()           │
    │                                                   │
    │  2. Calcola shared secret con ECDH                │
    │     shared = ECDH(ephemeral_priv, recipient_pub)  │
    │                                                   │
    │  3. Deriva chiavi con HKDF                        │
    │     (root_key, chain_key) = HKDF(shared)          │
    │                                                   │
    │  4. Genera message key                            │
    │     msg_key = HMAC-SHA256(chain_key, 0x01)        │
    │                                                   │
    │  5. Cripta il messaggio                           │
    │     ciphertext = AES-256-GCM(msg_key, "ciao")     │
    │                                                   │
```

### Dimensione payload livello 7
- Header WhatsApp: ~150 byte
- Signal envelope: ~130 byte
- Ciphertext + tag: ~44 byte
- **Totale L7**: ~324 byte

---

## LIVELLO 6 - PRESENTAZIONE

### Cosa succede
Il livello presentazione si occupa di:
1. **Serializzazione** dei dati strutturati
2. **Compressione** (opzionale)
3. **Codifica** per la trasmissione

### Protocollo utilizzato
- **Protocol Buffers (protobuf)** - formato binario efficiente di Google
- **TLS 1.3** - crittografia del canale (oltre alla E2E di Signal)

### Dimensione payload livello 6
- TLS Record header: 5 byte
- Nonce implicito: 0 byte (calcolato)
- Ciphertext: 408 byte
- Auth tag: 16 byte
- **Totale L6**: ~429 byte

---

## LIVELLO 5 - SESSIONE

### Cosa succede
Gestisce il dialogo tra le applicazioni, mantiene la sessione WebSocket aperta e gestisce la sincronizzazione.

### Protocollo utilizzato
- **WebSocket (RFC 6455)** su TLS (WSS)
- Mantiene connessione persistente con i server WhatsApp

### Dimensione payload livello 5
- WebSocket header: 2 byte
- Extended length: 2 byte
- Masking key: 4 byte
- Payload (TLS record): 429 byte
- **Totale L5**: ~437 byte

---

## LIVELLO 4 - TRASPORTO

### Cosa succede
Fornisce trasporto affidabile end-to-end, gestisce il controllo di flusso e la ritrasmissione.

### Protocollo utilizzato
- **TCP (Transmission Control Protocol)** - RFC 793
- Porta sorgente: 52431 (effimera, assegnata dal SO)
- Porta destinazione: 443 (HTTPS/WSS)

### Three-Way Handshake TCP (già avvenuto)

```
TELEFONO                                          SERVER WHATSAPP
    │                                                   │
    │ ──────── SYN (seq=1513893900) ──────────────────▶│
    │          Flag: SYN=1                              │
    │          MSS=1460, Window Scale=7                 │
    │                                                   │
    │◀─────── SYN-ACK (seq=2407431500, ack=1513893901) │
    │         Flag: SYN=1, ACK=1                        │
    │         MSS=1460, Window Scale=7                  │
    │                                                   │
    │ ──────── ACK (seq=1513893901, ack=2407431501) ──▶│
    │          Flag: ACK=1                              │
    │          Connessione stabilita!                   │
    │                                                   │
```

### Dimensione payload livello 4
- TCP Header: 32 byte (con options)
- TCP Payload: 437 byte
- **Totale L4**: 469 byte

---

## LIVELLO 3 - RETE

### Cosa succede
Gestisce l'indirizzamento logico e il routing dei pacchetti attraverso reti diverse.

### Protocollo utilizzato
- **IPv4** (o IPv6)
- Il telefono usa NAT (Network Address Translation) attraverso il router domestico

### NAT (Network Address Translation) sul Router

```
PRIMA DEL NAT (LAN):                    DOPO IL NAT (WAN):
┌─────────────────────────┐             ┌─────────────────────────┐
│ Src: 192.168.1.100:52431│    NAT     │ Src: 82.53.147.201:34567│
│ Dst: 157.240.1.52:443   │ ─────────▶ │ Dst: 157.240.1.52:443   │
└─────────────────────────┘             └─────────────────────────┘
```

### Dimensione payload livello 3
- IP Header: 20 byte
- IP Payload: 469 byte
- **Totale L3**: 489 byte

---

## LIVELLO 2 - DATA LINK (WiFi)

### Cosa succede
Fornisce accesso al mezzo fisico (WiFi), gestisce l'indirizzamento MAC e la correzione degli errori.

### Protocollo utilizzato
- **IEEE 802.11 (WiFi)** - variante 802.11ac/ax
- **LLC/SNAP** per incapsulamento
- **WPA3/WPA2** per sicurezza wireless

### Dimensione Frame WiFi livello 2
- MAC Header: 24 byte
- CCMP Header: 8 byte
- LLC/SNAP: 8 byte (incluso nei dati criptati)
- Encrypted Payload: 497 byte
- MIC: 8 byte
- FCS: 4 byte
- **Totale L2 WiFi**: ~549 byte

---

## LIVELLO 1 - FISICO (WiFi)

### Cosa succede
Converte i bit in segnali radio modulati e li trasmette sull'aria.

### Tecnologia utilizzata
- **IEEE 802.11ac (WiFi 5)** o **802.11ax (WiFi 6)**
- Frequenza: 5 GHz (canale 36-64) o 2.4 GHz
- Modulazione: **OFDM** (Orthogonal Frequency Division Multiplexing)
- Schema: **256-QAM** o **1024-QAM** (WiFi 6)

### Calcolo tempo di trasmissione
- Dati da trasmettere: 549 byte × 8 = 4392 bit
- Tempo totale frame: ~52 μs
- Data rate effettivo: 549 byte / 52 μs ≈ 84.5 Mbps

---

# PARTE 2: VIAGGIO ATTRAVERSO INTERNET

## Percorso del pacchetto

```
📱 Telefono (192.168.1.100)
    │
    │ WiFi (L1-L2)
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ HOP 1: Router Casa (192.168.1.1 / 82.53.147.201)                    │
│        - Decapsula WiFi, Applica NAT, TTL: 64 → 63                  │
└─────────────────────────────────────────────────────────────────────┘
    │
    │ Fibra FTTH
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ HOP 2: OLT ISP (Optical Line Terminal) - TTL: 63 → 62               │
└─────────────────────────────────────────────────────────────────────┘
    │
    │ Backbone ISP (10 Gbps)
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ HOP 3: Core Router ISP - MPLS Label switching - TTL: 62 → 61        │
└─────────────────────────────────────────────────────────────────────┘
    │
    │ Peering (100 Gbps)
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ HOP 4: Internet Exchange Point (MIX Milano) - TTL: 61 → 60          │
└─────────────────────────────────────────────────────────────────────┘
    │
    │ Meta backbone
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ HOP 5: Meta Edge Router - Load balancing - TTL: 60 → 59             │
└─────────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ HOP 6: WhatsApp Server (157.240.1.52) - TTL finale: 59              │
└─────────────────────────────────────────────────────────────────────┘
```

---

# PARTE 3: SUL SERVER WHATSAPP

Il server **NON può leggere "ciao"** (E2E encryption)

Operazioni possibili:
- Verificare autenticazione del mittente
- Leggere metadata (mittente, destinatario, timestamp)
- Cercare il destinatario nel database
- Verificare se il destinatario è online
- Memorizzare messaggio criptato se offline
- Inoltrare al destinatario se online
- Inviare ACK al mittente

---

# PARTE 4: RISALITA DEI 7 LIVELLI SUL PC (DESTINATARIO)

Il processo è inverso:
- **L1**: Segnale elettrico → bit (Gigabit Ethernet)
- **L2**: Frame Ethernet → pacchetto IP
- **L3**: Pacchetto IP → segmento TCP
- **L4**: Segmento TCP → dati applicazione
- **L5**: WebSocket frame → payload
- **L6**: TLS decrypt → protobuf
- **L7**: Deserializza protobuf + Signal decrypt → **"ciao"**

---

# RIEPILOGO

## Tabella riassuntiva dimensioni

| Livello | Protocollo | Header | Payload → Totale |
|---------|-----------|--------|------------------|
| L7 | WhatsApp + Signal | ~280 byte | 4 byte → 324 byte |
| L6 | Protobuf + TLS 1.3 | ~105 byte | 324 byte → 429 byte |
| L5 | WebSocket | 8 byte | 429 byte → 437 byte |
| L4 | TCP | 32 byte | 437 byte → 469 byte |
| L3 | IPv4 | 20 byte | 469 byte → 489 byte |
| L2 | 802.11 (WiFi) + CCMP | ~60 byte | 489 byte → 549 byte |
| L1 | 802.11ac OFDM | ~44 μs | Data: ~8 μs |

**Messaggio originale**: 4 byte ("ciao" in UTF-8)
**Trasmesso su WiFi**: 549 byte + preamble
**Overhead totale**: ~137× (13.600% del messaggio originale!)

## Tre livelli di crittografia

1. **END-TO-END (Signal Protocol)**: Solo mittente e destinatario possono decifrare
2. **TRANSPORT LAYER (TLS 1.3)**: Protegge da intercettazione sulla rete
3. **LINK LAYER (WPA2/WPA3)**: Protegge il link wireless locale

## Tempi approssimativi

| Fase | Tempo |
|------|-------|
| Elaborazione telefono (L7→L1) | ~1-5 ms |
| Trasmissione WiFi | ~52 μs |
| Elaborazione router casa | ~100-500 μs |
| Propagazione fibra (100 km) | ~500 μs |
| Hop attraverso Internet (~10) | ~10-50 ms |
| Elaborazione server WhatsApp | ~5-20 ms |
| Ritorno al destinatario | ~10-50 ms |
| Elaborazione PC (L1→L7) | ~1-5 ms |
| Rendering browser | ~5-50 ms |
| **TOTALE TIPICO** | **~50-200 ms** |

---

**Documento creato per scopi didattici - ITTS Belluzzi Da Vinci - Rimini**
**Corso: Sistemi e Reti**
