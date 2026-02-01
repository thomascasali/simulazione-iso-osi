import React, { useState, useEffect, useRef } from 'react';

// Custom hook for typewriter effect
const useTypewriter = (text, speed = 50, trigger = true) => {
  const [displayText, setDisplayText] = useState('');
  useEffect(() => {
    if (!trigger) { setDisplayText(''); return; }
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, trigger]);
  return displayText;
};

// Animated packet component
const AnimatedPacket = ({ layers, currentLayer, direction = 'down' }) => {
  const layerColors = {
    7: '#ff6b6b',
    6: '#feca57',
    5: '#48dbfb',
    4: '#1dd1a1',
    3: '#5f27cd',
    2: '#ff9f43',
    1: '#00d2d3'
  };

  const layerNames = {
    7: 'APP',
    6: 'PRES',
    5: 'SESS',
    4: 'TRANS',
    3: 'NET',
    2: 'DATA',
    1: 'PHY'
  };

  const visibleLayers = direction === 'down'
    ? layers.filter(l => l >= currentLayer)
    : layers.filter(l => l <= currentLayer);

  return (
    <div className="flex flex-col items-center gap-1">
      {direction === 'down' ? (
        visibleLayers.sort((a, b) => b - a).map((layer, idx) => (
          <div
            key={layer}
            className="transition-all duration-500 ease-out"
            style={{
              backgroundColor: layerColors[layer],
              padding: `${4 + idx * 2}px ${12 + idx * 6}px`,
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 'bold',
              color: '#000',
              opacity: layer === currentLayer ? 1 : 0.7,
              transform: layer === currentLayer ? 'scale(1.1)' : 'scale(1)',
              boxShadow: layer === currentLayer ? `0 0 20px ${layerColors[layer]}` : 'none'
            }}
          >
            L{layer} {layerNames[layer]}
          </div>
        ))
      ) : (
        visibleLayers.sort((a, b) => a - b).map((layer, idx) => (
          <div
            key={layer}
            className="transition-all duration-500 ease-out"
            style={{
              backgroundColor: layerColors[layer],
              padding: `${4 + (visibleLayers.length - idx - 1) * 2}px ${12 + (visibleLayers.length - idx - 1) * 6}px`,
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 'bold',
              color: '#000',
              opacity: layer === currentLayer ? 1 : 0.7,
              transform: layer === currentLayer ? 'scale(1.1)' : 'scale(1)',
              boxShadow: layer === currentLayer ? `0 0 20px ${layerColors[layer]}` : 'none'
            }}
          >
            L{layer} {layerNames[layer]}
          </div>
        ))
      )}
    </div>
  );
};

// Binary rain effect
const BinaryRain = () => {
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    const newDrops = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      char: Math.random() > 0.5 ? '1' : '0'
    }));
    setDrops(newDrops);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {drops.map(drop => (
        <span
          key={drop.id}
          className="absolute text-green-400 font-mono text-xs"
          style={{
            left: `${drop.left}%`,
            animation: `fall ${drop.duration}s linear ${drop.delay}s infinite`
          }}
        >
          {drop.char}
        </span>
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px); opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Hex viewer component
const HexViewer = ({ data, highlight = [] }) => {
  return (
    <div className="font-mono text-xs bg-black/50 p-3 rounded border border-cyan-500/30 overflow-x-auto">
      <div className="flex flex-wrap gap-1">
        {data.map((byte, idx) => (
          <span
            key={idx}
            className={`px-1 py-0.5 rounded transition-all duration-300 ${
              highlight.includes(idx)
                ? 'bg-cyan-500 text-black font-bold scale-110'
                : 'text-cyan-300'
            }`}
          >
            {byte}
          </span>
        ))}
      </div>
    </div>
  );
};

// Signal wave animation
const SignalWave = ({ active }) => {
  return (
    <div className="h-16 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 200 40" className="w-full h-full">
        <path
          d={active
            ? "M0,20 Q10,5 20,20 T40,20 T60,20 T80,20 T100,20 T120,20 T140,20 T160,20 T180,20 T200,20"
            : "M0,20 L200,20"
          }
          fill="none"
          stroke="#00ff88"
          strokeWidth="2"
          className="transition-all duration-500"
          style={{
            strokeDasharray: active ? '0' : '5,5',
            animation: active ? 'wave 1s linear infinite' : 'none'
          }}
        />
        <style>{`
          @keyframes wave {
            0% { transform: translateX(0); }
            100% { transform: translateX(-40px); }
          }
        `}</style>
      </svg>
    </div>
  );
};

// Network diagram
const NetworkDiagram = ({ activeHop }) => {
  const hops = [
    { id: 1, name: 'Telefono', icon: '📱', x: 5, y: 50 },
    { id: 2, name: 'Router Casa', icon: '🏠', x: 20, y: 30 },
    { id: 3, name: 'ISP', icon: '🏢', x: 35, y: 60 },
    { id: 4, name: 'IXP', icon: '🌐', x: 50, y: 40 },
    { id: 5, name: 'Meta Edge', icon: '☁️', x: 65, y: 55 },
    { id: 6, name: 'WhatsApp', icon: '💬', x: 80, y: 35 },
    { id: 7, name: 'PC', icon: '💻', x: 95, y: 50 }
  ];

  return (
    <div className="relative h-40 w-full">
      <svg className="absolute inset-0 w-full h-full">
        {hops.slice(0, -1).map((hop, idx) => (
          <line
            key={idx}
            x1={`${hop.x}%`}
            y1={`${hop.y}%`}
            x2={`${hops[idx + 1].x}%`}
            y2={`${hops[idx + 1].y}%`}
            stroke={idx < activeHop - 1 ? '#00ff88' : '#334155'}
            strokeWidth="2"
            strokeDasharray={idx < activeHop - 1 ? '0' : '5,5'}
            className="transition-all duration-500"
          />
        ))}
      </svg>
      {hops.map((hop, idx) => (
        <div
          key={hop.id}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
            idx + 1 === activeHop ? 'scale-125' : ''
          }`}
          style={{ left: `${hop.x}%`, top: `${hop.y}%` }}
        >
          <div className={`text-2xl ${idx + 1 === activeHop ? 'animate-bounce' : ''}`}>
            {hop.icon}
          </div>
          <div className={`text-xs mt-1 whitespace-nowrap ${
            idx + 1 <= activeHop ? 'text-cyan-400' : 'text-gray-500'
          }`}>
            {hop.name}
          </div>
          {idx + 1 === activeHop && (
            <div className="absolute -inset-4 border-2 border-cyan-400 rounded-full animate-ping opacity-50" />
          )}
        </div>
      ))}
    </div>
  );
};

// Layer detail component
const LayerDetail = ({ layer, direction, isActive }) => {
  const layerData = {
    7: {
      name: 'APPLICAZIONE',
      color: '#ff6b6b',
      protocol: 'WhatsApp + Signal Protocol',
      icon: '📱',
      description: 'Il messaggio "ciao" viene preparato dall\'app WhatsApp e criptato con il protocollo Signal (crittografia end-to-end)',
      details: [
        'Message ID: 3EB0A8C7D2F4E6B8...',
        'Sender: 393331234567@s.whatsapp.net',
        'Recipient: 393479876543@s.whatsapp.net',
        'Encryption: AES-256-GCM'
      ],
      hex: ['63', '69', '61', '6F', '→', '7F', '2A', '8B', '4C', '9D', '1E', '6F', '3A'],
      size: '4 byte → 324 byte'
    },
    6: {
      name: 'PRESENTAZIONE',
      color: '#feca57',
      protocol: 'Protocol Buffers + TLS 1.3',
      icon: '🔄',
      description: 'I dati vengono serializzati in formato binario (Protobuf) e poi criptati con TLS per il trasporto sicuro',
      details: [
        'Serialization: Protocol Buffers',
        'TLS Version: 1.3',
        'Cipher: AES-256-GCM',
        'Auth Tag: 16 byte'
      ],
      hex: ['17', '03', '03', '01', 'B5', '4A', '7B', '2C', '8D', '1E', '5F', '3A', '9B'],
      size: '324 byte → 429 byte'
    },
    5: {
      name: 'SESSIONE',
      color: '#48dbfb',
      protocol: 'WebSocket (WSS)',
      icon: '🔗',
      description: 'La connessione WebSocket mantiene il canale aperto per comunicazione bidirezionale in tempo reale',
      details: [
        'FIN: 1 (messaggio completo)',
        'Opcode: 0x2 (binary)',
        'MASK: 1 (client→server)',
        'Masking Key: 37 4E 8A F1'
      ],
      hex: ['82', 'FE', '01', 'AD', '37', '4E', '8A', 'F1', '20', '4D', '89', 'F0'],
      size: '429 byte → 437 byte'
    },
    4: {
      name: 'TRASPORTO',
      color: '#1dd1a1',
      protocol: 'TCP (Transmission Control Protocol)',
      icon: '🚚',
      description: 'TCP garantisce la consegna affidabile dei dati con controllo di flusso e ritrasmissione',
      details: [
        'Src Port: 52431 (effimera)',
        'Dst Port: 443 (HTTPS)',
        'Seq: 1513893917',
        'Flags: ACK, PSH'
      ],
      hex: ['CC', 'CF', '01', 'BB', '5A', '3B', '2C', '1D', '8F', '7E', '6D', '5C', '50', '18'],
      size: '437 byte → 469 byte'
    },
    3: {
      name: 'RETE',
      color: '#5f27cd',
      protocol: 'IPv4 + NAT',
      icon: '🌐',
      description: 'Il pacchetto IP contiene gli indirizzi logici. Il router applica NAT per tradurre IP privato→pubblico',
      details: [
        'Src IP: 192.168.1.100 → 82.53.147.201',
        'Dst IP: 157.240.1.52',
        'TTL: 64',
        'Protocol: 6 (TCP)'
      ],
      hex: ['45', '00', '01', 'E9', '4A', '2B', '40', '00', '40', '06', 'C0', 'A8', '01', '64', '9D', 'F0', '01', '34'],
      size: '469 byte → 489 byte'
    },
    2: {
      name: 'DATA LINK',
      color: '#ff9f43',
      protocol: direction === 'down' ? 'IEEE 802.11 (WiFi)' : 'IEEE 802.3 (Ethernet)',
      icon: direction === 'down' ? '📡' : '🔌',
      description: direction === 'down'
        ? 'Il frame WiFi include indirizzi MAC, crittografia WPA2 e controllo errori (FCS)'
        : 'Il frame Ethernet trasporta il pacchetto sulla rete cablata locale',
      details: direction === 'down' ? [
        'Dest MAC: AA:BB:CC:DD:EE:FF (AP)',
        'Src MAC: 11:22:33:44:55:66',
        'Security: WPA2-CCMP (AES)',
        'FCS: CRC-32'
      ] : [
        'Dest MAC: 78:45:C4:AB:CD:EF (PC)',
        'Src MAC: 00:11:22:33:44:55',
        'EtherType: 0x0800 (IPv4)',
        'FCS: CRC-32'
      ],
      hex: ['08', '41', '00', '7D', 'AA', 'BB', 'CC', 'DD', 'EE', 'FF', '11', '22', '33', '44', '55', '66'],
      size: '489 byte → 549 byte'
    },
    1: {
      name: 'FISICO',
      color: '#00d2d3',
      protocol: direction === 'down' ? '802.11ac OFDM' : 'Gigabit Ethernet',
      icon: direction === 'down' ? '📶' : '⚡',
      description: direction === 'down'
        ? 'I bit vengono modulati in onde radio usando OFDM con 256-QAM a 5 GHz'
        : 'I bit viaggiano come segnali elettrici PAM-5 sul cavo twisted pair',
      details: direction === 'down' ? [
        'Frequenza: 5180 MHz (Ch 36)',
        'Bandwidth: 80 MHz',
        'Modulazione: 256-QAM',
        'Tempo TX: ~52 μs'
      ] : [
        'Standard: 1000BASE-T',
        'Codifica: PAM-5',
        '4 coppie bidirezionali',
        'Rate: 1 Gbps'
      ],
      hex: [],
      size: direction === 'down' ? '∿∿∿ Onde Radio ∿∿∿' : '─── Segnali Elettrici ───'
    }
  };

  const data = layerData[layer];
  if (!data) return null;

  return (
    <div
      className={`rounded-xl p-4 border-2 transition-all duration-500 ${
        isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-50'
      }`}
      style={{
        borderColor: data.color,
        backgroundColor: `${data.color}15`,
        boxShadow: isActive ? `0 0 30px ${data.color}40` : 'none'
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{data.icon}</span>
        <div>
          <h3 className="text-lg font-bold" style={{ color: data.color }}>
            L{layer} - {data.name}
          </h3>
          <p className="text-sm text-gray-400">{data.protocol}</p>
        </div>
        <div className="ml-auto text-right">
          <span className="text-xs px-2 py-1 rounded bg-black/30" style={{ color: data.color }}>
            {data.size}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-3">{data.description}</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-bold text-gray-400 mb-2">DETTAGLI</h4>
          <ul className="text-xs space-y-1 font-mono">
            {data.details.map((detail, idx) => (
              <li key={idx} className="text-gray-300">
                <span style={{ color: data.color }}>▸</span> {detail}
              </li>
            ))}
          </ul>
        </div>

        {data.hex.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-gray-400 mb-2">HEADER (HEX)</h4>
            <HexViewer data={data.hex} highlight={isActive ? [0, 1, 2, 3] : []} />
          </div>
        )}
      </div>

      {layer === 1 && (
        <div className="mt-3">
          <SignalWave active={isActive} />
        </div>
      )}
    </div>
  );
};

// Encryption visualization
const EncryptionLayers = () => {
  const [activeLayer, setActiveLayer] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLayer(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const layers = [
    { name: 'Messaggio', color: '#fff', content: '"ciao"' },
    { name: 'Signal E2E', color: '#ff6b6b', content: 'AES-256-GCM' },
    { name: 'TLS 1.3', color: '#feca57', content: 'AES-256-GCM' },
    { name: 'WPA2', color: '#ff9f43', content: 'AES-128-CCM' }
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      {layers.map((layer, idx) => (
        <div
          key={idx}
          className="transition-all duration-500 flex items-center justify-center"
          style={{
            width: `${280 - idx * 50}px`,
            padding: '8px 16px',
            backgroundColor: `${layer.color}${idx === 0 ? 'ff' : '30'}`,
            border: `2px solid ${layer.color}`,
            borderRadius: '8px',
            transform: activeLayer >= idx ? 'scale(1)' : 'scale(0.9)',
            opacity: activeLayer >= idx ? 1 : 0.3,
            boxShadow: activeLayer === idx ? `0 0 20px ${layer.color}` : 'none'
          }}
        >
          <span className="text-xs font-bold" style={{ color: idx === 0 ? '#000' : layer.color }}>
            {layer.name}: {layer.content}
          </span>
        </div>
      ))}
    </div>
  );
};

// Main presentation component
export default function ISOOSIPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationStep, setAnimationStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const totalSlides = 12;

  useEffect(() => {
    if (autoPlay) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [autoPlay]);

  useEffect(() => {
    setAnimationStep(0);
    const timer = setInterval(() => {
      setAnimationStep(prev => Math.min(prev + 1, 10));
    }, 500);
    return () => clearInterval(timer);
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentSlide(totalSlides - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
  const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

  // Slide content renderer
  const renderSlide = () => {
    switch (currentSlide) {
      case 0: // Intro
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-8">
              <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Il Viaggio del Messaggio
              </h1>
              <h2 className="text-2xl text-gray-400">"ciao" attraverso ISO/OSI</h2>
            </div>

            <div className="flex items-center gap-8 my-8">
              <div className="text-center">
                <div className="text-6xl mb-2">📱</div>
                <div className="text-sm text-gray-400">WhatsApp App</div>
                <div className="text-xs text-cyan-400">192.168.1.100</div>
              </div>

              <div className="flex-1 relative h-2">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-gray-900 px-4 text-lg">→ "ciao" →</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-6xl mb-2">💻</div>
                <div className="text-sm text-gray-400">WhatsApp Web</div>
                <div className="text-xs text-cyan-400">192.168.2.50</div>
              </div>
            </div>

            <p className="text-gray-400 max-w-xl">
              Seguiamo il percorso completo di un semplice messaggio attraverso
              i 7 livelli della pila ISO/OSI, dal telefono al PC
            </p>

            <div className="mt-8 text-xs text-gray-500">
              ITTS Belluzzi Da Vinci - Sistemi e Reti
            </div>
          </div>
        );

      case 1: // Overview
        return (
          <div className="h-full flex flex-col">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">📚 La Pila ISO/OSI</h2>

            <div className="flex-1 flex gap-8">
              <div className="flex-1">
                <div className="space-y-2">
                  {[7, 6, 5, 4, 3, 2, 1].map((layer) => {
                    const names = ['Applicazione', 'Presentazione', 'Sessione', 'Trasporto', 'Rete', 'Data Link', 'Fisico'];
                    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd', '#ff9f43', '#00d2d3'];
                    const desc = [
                      'Interfaccia utente, protocolli applicativi',
                      'Codifica, crittografia, compressione',
                      'Gestione sessioni e dialogo',
                      'Trasporto affidabile end-to-end',
                      'Indirizzamento logico e routing',
                      'Indirizzamento fisico e accesso al mezzo',
                      'Trasmissione bit sul mezzo fisico'
                    ];

                    return (
                      <div
                        key={layer}
                        className="flex items-center gap-3 p-2 rounded transition-all duration-500"
                        style={{
                          backgroundColor: `${colors[7 - layer]}20`,
                          borderLeft: `4px solid ${colors[7 - layer]}`,
                          transform: animationStep >= (8 - layer) ? 'translateX(0)' : 'translateX(-100px)',
                          opacity: animationStep >= (8 - layer) ? 1 : 0
                        }}
                      >
                        <span className="text-2xl font-bold w-10" style={{ color: colors[7 - layer] }}>
                          L{layer}
                        </span>
                        <div>
                          <div className="font-bold" style={{ color: colors[7 - layer] }}>
                            {names[7 - layer]}
                          </div>
                          <div className="text-xs text-gray-400">{desc[7 - layer]}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="w-64 flex flex-col items-center justify-center">
                <h3 className="text-sm font-bold text-gray-400 mb-4">INCAPSULAMENTO</h3>
                <AnimatedPacket
                  layers={[7, 6, 5, 4, 3, 2, 1].slice(0, Math.min(animationStep, 7))}
                  currentLayer={Math.max(8 - animationStep, 1)}
                  direction="down"
                />
                <div className="mt-4 text-xs text-gray-500 text-center">
                  Ogni livello aggiunge<br/>il proprio header
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // L7 Down
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">📱</span>
              <div>
                <h2 className="text-2xl font-bold text-red-400">Livello 7 - Applicazione</h2>
                <p className="text-gray-400">WhatsApp + Signal Protocol</p>
              </div>
              <div className="ml-auto px-3 py-1 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
                ↓ INCAPSULAMENTO
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-black/30 rounded-lg p-4 border border-red-500/30">
                  <h3 className="text-sm font-bold text-red-400 mb-2">MESSAGGIO ORIGINALE</h3>
                  <div className="text-4xl font-mono text-center py-4 bg-white/10 rounded">
                    "ciao"
                  </div>
                  <div className="text-xs text-gray-400 mt-2 text-center">
                    UTF-8: 63 69 61 6F (4 byte)
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-red-500/30">
                  <h3 className="text-sm font-bold text-red-400 mb-2">CRITTOGRAFIA END-TO-END</h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Algoritmo:</span>
                      <span className="text-red-300">Signal Protocol</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cifratura:</span>
                      <span className="text-red-300">AES-256-GCM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Scambio chiavi:</span>
                      <span className="text-red-300">Curve25519 (ECDH)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Double Ratchet:</span>
                      <span className="text-green-400">✓ Attivo</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-black/30 rounded-lg p-4 border border-red-500/30">
                  <h3 className="text-sm font-bold text-red-400 mb-2">STRUTTURA MESSAGGIO WHATSAPP</h3>
                  <div className="space-y-1 text-xs font-mono">
                    <div className="p-2 bg-red-500/20 rounded">
                      <span className="text-red-400">message_id:</span>
                      <span className="text-gray-300 ml-2">3EB0A8C7D2F4E6B8...</span>
                    </div>
                    <div className="p-2 bg-red-500/10 rounded">
                      <span className="text-red-400">sender_jid:</span>
                      <span className="text-gray-300 ml-2">393331234567@s.whatsapp.net</span>
                    </div>
                    <div className="p-2 bg-red-500/20 rounded">
                      <span className="text-red-400">recipient_jid:</span>
                      <span className="text-gray-300 ml-2">393479876543@s.whatsapp.net</span>
                    </div>
                    <div className="p-2 bg-red-500/10 rounded">
                      <span className="text-red-400">timestamp:</span>
                      <span className="text-gray-300 ml-2">1702640400</span>
                    </div>
                    <div className="p-2 bg-red-500/30 rounded border border-red-500">
                      <span className="text-red-400">encrypted_payload:</span>
                      <span className="text-gray-300 ml-2">[Signal Ciphertext]</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-red-500/30">
                  <h3 className="text-sm font-bold text-red-400 mb-2">OUTPUT L7</h3>
                  <HexViewer
                    data={['7F', '2A', '8B', '4C', '9D', '1E', '6F', '3A', '5B', '2C', '8D', '4E', 'F1', 'A2', 'B3', 'C4']}
                    highlight={[0, 1, 2, 3]}
                  />
                  <div className="text-xs text-gray-400 mt-2">
                    4 byte → <span className="text-red-400 font-bold">324 byte</span> (criptato + metadata)
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // L6-L5 Down
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">🔄</span>
              <div>
                <h2 className="text-2xl font-bold text-yellow-400">L6 Presentazione + L5 Sessione</h2>
                <p className="text-gray-400">Protocol Buffers + TLS 1.3 + WebSocket</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-lg p-4 border border-yellow-500/30">
                <h3 className="text-sm font-bold text-yellow-400 mb-3">L6 - PRESENTAZIONE</h3>

                <div className="space-y-3">
                  <div className="bg-yellow-500/10 p-3 rounded">
                    <h4 className="text-xs font-bold text-yellow-300 mb-2">Serializzazione Protobuf</h4>
                    <div className="text-xs font-mono text-gray-300">
                      <div>0A 20 [message_id: 32 byte]</div>
                      <div>12 1E [sender: 30 byte]</div>
                      <div>1A 1E [recipient: 30 byte]</div>
                      <div>20 [timestamp: varint]</div>
                      <div>2A [encrypted: 300 byte]</div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 p-3 rounded">
                    <h4 className="text-xs font-bold text-yellow-300 mb-2">Crittografia TLS 1.3</h4>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Content Type:</span>
                        <span className="text-yellow-300">0x17 (App Data)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cipher Suite:</span>
                        <span className="text-yellow-300">AES-256-GCM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Auth Tag:</span>
                        <span className="text-yellow-300">16 byte</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 text-center">
                    324 byte → <span className="text-yellow-400 font-bold">429 byte</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/30">
                <h3 className="text-sm font-bold text-cyan-400 mb-3">L5 - SESSIONE</h3>

                <div className="space-y-3">
                  <div className="bg-cyan-500/10 p-3 rounded">
                    <h4 className="text-xs font-bold text-cyan-300 mb-2">WebSocket Frame</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-black/30 p-2 rounded">
                        <div className="text-gray-400">FIN</div>
                        <div className="text-cyan-300 font-mono">1</div>
                      </div>
                      <div className="bg-black/30 p-2 rounded">
                        <div className="text-gray-400">Opcode</div>
                        <div className="text-cyan-300 font-mono">0x2 (binary)</div>
                      </div>
                      <div className="bg-black/30 p-2 rounded">
                        <div className="text-gray-400">MASK</div>
                        <div className="text-cyan-300 font-mono">1</div>
                      </div>
                      <div className="bg-black/30 p-2 rounded">
                        <div className="text-gray-400">Length</div>
                        <div className="text-cyan-300 font-mono">429</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-cyan-500/10 p-3 rounded">
                    <h4 className="text-xs font-bold text-cyan-300 mb-2">Masking (XOR)</h4>
                    <div className="text-xs font-mono space-y-1">
                      <div><span className="text-gray-400">Key:</span> <span className="text-cyan-300">37 4E 8A F1</span></div>
                      <div><span className="text-gray-400">Original:</span> <span className="text-gray-300">17 03 03 01</span></div>
                      <div><span className="text-gray-400">Masked:</span> <span className="text-cyan-300">20 4D 89 F0</span></div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 text-center">
                    429 byte → <span className="text-cyan-400 font-bold">437 byte</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // L4-L3 Down
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">🚚</span>
              <div>
                <h2 className="text-2xl font-bold text-green-400">L4 Trasporto + L3 Rete</h2>
                <p className="text-gray-400">TCP + IPv4 + NAT</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-lg p-4 border border-green-500/30">
                <h3 className="text-sm font-bold text-green-400 mb-3">L4 - TCP SEGMENT</h3>

                <div className="bg-green-500/10 p-3 rounded mb-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">Src Port:</span>
                      <div className="text-green-300 font-mono">52431</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Dst Port:</span>
                      <div className="text-green-300 font-mono">443</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Seq Number:</span>
                      <div className="text-green-300 font-mono">1513893917</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Ack Number:</span>
                      <div className="text-green-300 font-mono">2407431516</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  {['ACK', 'PSH'].map(flag => (
                    <span key={flag} className="px-2 py-1 bg-green-500 text-black text-xs font-bold rounded">
                      {flag}
                    </span>
                  ))}
                  {['SYN', 'FIN', 'RST'].map(flag => (
                    <span key={flag} className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">
                      {flag}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-gray-400">
                  Header: 32 byte | 437 byte → <span className="text-green-400 font-bold">469 byte</span>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-4 border border-purple-500/30">
                <h3 className="text-sm font-bold text-purple-400 mb-3">L3 - IP PACKET + NAT</h3>

                <div className="bg-purple-500/10 p-3 rounded mb-3">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 w-20">Src IP:</span>
                      <span className="text-red-400 line-through">192.168.1.100</span>
                      <span className="text-green-400">→</span>
                      <span className="text-purple-300">82.53.147.201</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 w-20">Dst IP:</span>
                      <span className="text-purple-300">157.240.1.52</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 w-20">TTL:</span>
                      <span className="text-purple-300">64</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 w-20">Protocol:</span>
                      <span className="text-purple-300">6 (TCP)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-500/20 p-2 rounded border border-orange-500/50 mb-3">
                  <div className="text-xs font-bold text-orange-400 mb-1">🔄 NAT Translation</div>
                  <div className="text-xs text-gray-300">
                    192.168.1.100:52431 → 82.53.147.201:34567
                  </div>
                </div>

                <div className="text-xs text-gray-400">
                  Header: 20 byte | 469 byte → <span className="text-purple-400 font-bold">489 byte</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // L2-L1 Down (WiFi)
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">📡</span>
              <div>
                <h2 className="text-2xl font-bold text-orange-400">L2 Data Link + L1 Fisico</h2>
                <p className="text-gray-400">IEEE 802.11 WiFi + OFDM</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-lg p-4 border border-orange-500/30">
                <h3 className="text-sm font-bold text-orange-400 mb-3">L2 - WIFI FRAME (802.11)</h3>

                <div className="space-y-2 text-xs">
                  <div className="bg-orange-500/10 p-2 rounded">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-400">Frame Control:</span>
                        <div className="text-orange-300 font-mono">0x08 0x41</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Duration:</span>
                        <div className="text-orange-300 font-mono">125 μs</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-500/10 p-2 rounded">
                    <div className="text-gray-400 mb-1">Indirizzi MAC:</div>
                    <div className="space-y-1 font-mono text-orange-300">
                      <div>RA: AA:BB:CC:DD:EE:FF (AP)</div>
                      <div>TA: 11:22:33:44:55:66 (Phone)</div>
                      <div>DA: 00:11:22:33:44:55 (Router)</div>
                    </div>
                  </div>

                  <div className="bg-red-500/20 p-2 rounded border border-red-500/50">
                    <div className="text-red-400 font-bold mb-1">🔐 WPA2-CCMP</div>
                    <div className="text-gray-300">AES-128-CCM + MIC 8 byte</div>
                  </div>
                </div>

                <div className="text-xs text-gray-400 mt-3">
                  489 byte → <span className="text-orange-400 font-bold">549 byte</span>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/30">
                <h3 className="text-sm font-bold text-cyan-400 mb-3">L1 - TRASMISSIONE RADIO</h3>

                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-cyan-500/10 p-2 rounded">
                      <div className="text-gray-400">Frequenza</div>
                      <div className="text-cyan-300 font-bold">5180 MHz</div>
                    </div>
                    <div className="bg-cyan-500/10 p-2 rounded">
                      <div className="text-gray-400">Bandwidth</div>
                      <div className="text-cyan-300 font-bold">80 MHz</div>
                    </div>
                    <div className="bg-cyan-500/10 p-2 rounded">
                      <div className="text-gray-400">Modulazione</div>
                      <div className="text-cyan-300 font-bold">256-QAM</div>
                    </div>
                    <div className="bg-cyan-500/10 p-2 rounded">
                      <div className="text-gray-400">Tempo TX</div>
                      <div className="text-cyan-300 font-bold">~52 μs</div>
                    </div>
                  </div>

                  <div className="bg-cyan-500/10 p-2 rounded">
                    <div className="text-gray-400 mb-1">OFDM Symbol</div>
                    <div className="text-cyan-300">234 subcarrier × 8 bit × 2 streams</div>
                  </div>
                </div>

                <SignalWave active={animationStep > 2} />

                <div className="text-center text-cyan-400 text-lg mt-2">
                  ∿∿∿ Onde Radio a 5 GHz ∿∿∿
                </div>
              </div>
            </div>
          </div>
        );

      case 6: // Internet Journey
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">🌍</span>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Viaggio attraverso Internet
                </h2>
                <p className="text-gray-400">Il pacchetto attraversa multiple reti</p>
              </div>
            </div>

            <NetworkDiagram activeHop={Math.min(animationStep, 7)} />

            <div className="flex-1 grid grid-cols-3 gap-3 mt-4">
              {[
                { hop: 1, name: 'Router Casa', action: 'NAT, WiFi→Ethernet', ttl: '64→63' },
                { hop: 2, name: 'OLT ISP', action: 'Ottico→Elettrico', ttl: '63→62' },
                { hop: 3, name: 'Core Router', action: 'MPLS Switching', ttl: '62→61' },
                { hop: 4, name: 'IXP (MIX)', action: 'Peering', ttl: '61→60' },
                { hop: 5, name: 'Meta Edge', action: 'Load Balancing', ttl: '60→59' },
                { hop: 6, name: 'WhatsApp', action: 'Store & Forward', ttl: '59' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded border text-xs transition-all duration-300 ${
                    animationStep > idx
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-700 bg-gray-800/50 opacity-50'
                  }`}
                >
                  <div className="font-bold text-cyan-400">HOP {item.hop}: {item.name}</div>
                  <div className="text-gray-400">{item.action}</div>
                  <div className="text-yellow-400">TTL: {item.ttl}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-purple-500/20 rounded-lg border border-purple-500/50">
              <div className="text-sm text-purple-300">
                <span className="font-bold">⚠️ Sul server WhatsApp:</span> Il contenuto "ciao" rimane criptato E2E.
                Il server può solo leggere i metadata e inoltrare il messaggio.
              </div>
            </div>
          </div>
        );

      case 7: // L1-L2 Up (Ethernet)
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">💻</span>
              <div>
                <h2 className="text-2xl font-bold text-cyan-400">L1 + L2 - Ricezione sul PC</h2>
                <p className="text-gray-400">Gigabit Ethernet (1000BASE-T)</p>
              </div>
              <div className="ml-auto px-3 py-1 bg-green-500/20 border border-green-500 rounded text-green-400 text-sm">
                ↑ DEINCAPSULAMENTO
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/30">
                <h3 className="text-sm font-bold text-cyan-400 mb-3">L1 - SEGNALE ELETTRICO</h3>

                <div className="space-y-3">
                  <div className="bg-cyan-500/10 p-3 rounded">
                    <div className="text-xs text-gray-400 mb-2">Codifica PAM-5 (5 livelli)</div>
                    <div className="flex justify-around items-end h-16">
                      {['+1V', '+0.5V', '0V', '-0.5V', '-1V'].map((v, i) => (
                        <div key={i} className="text-center">
                          <div
                            className="w-4 bg-cyan-500 rounded-t"
                            style={{ height: `${40 - i * 8}px` }}
                          />
                          <div className="text-xs text-cyan-300 mt-1">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-cyan-500/10 p-2 rounded">
                      <div className="text-gray-400">Cavo</div>
                      <div className="text-cyan-300">Cat5e/Cat6</div>
                    </div>
                    <div className="bg-cyan-500/10 p-2 rounded">
                      <div className="text-gray-400">Velocità</div>
                      <div className="text-cyan-300">1 Gbps</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-4 border border-orange-500/30">
                <h3 className="text-sm font-bold text-orange-400 mb-3">L2 - FRAME ETHERNET</h3>

                <div className="space-y-2 text-xs">
                  <div className="bg-orange-500/10 p-2 rounded font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Dest MAC:</span>
                      <span className="text-green-400">78:45:C4:AB:CD:EF ✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Src MAC:</span>
                      <span className="text-orange-300">00:11:22:33:44:55</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">EtherType:</span>
                      <span className="text-orange-300">0x0800 (IPv4)</span>
                    </div>
                  </div>

                  <div className="bg-green-500/20 p-2 rounded border border-green-500/50">
                    <div className="text-green-400 font-bold">✓ FCS Verificato (CRC-32)</div>
                    <div className="text-gray-300">Frame integro, passa al L3</div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-400">
                  <span className="text-orange-400 font-bold">549 byte</span> → rimuovi header → 489 byte
                </div>
              </div>
            </div>
          </div>
        );

      case 8: // L3-L4 Up
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">🔍</span>
              <div>
                <h2 className="text-2xl font-bold text-purple-400">L3 + L4 - Verifica e Consegna</h2>
                <p className="text-gray-400">IP Verification + TCP ACK</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-lg p-4 border border-purple-500/30">
                <h3 className="text-sm font-bold text-purple-400 mb-3">L3 - VERIFICA IP</h3>

                <div className="space-y-2 text-xs">
                  <div className="bg-purple-500/10 p-2 rounded font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Src IP:</span>
                      <span className="text-purple-300">157.240.1.52</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Dest IP:</span>
                      <span className="text-green-400">192.168.2.50 ✓ (questo PC)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">TTL:</span>
                      <span className="text-purple-300">55</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Protocol:</span>
                      <span className="text-purple-300">6 → TCP</span>
                    </div>
                  </div>

                  <div className="bg-green-500/20 p-2 rounded border border-green-500/50">
                    <div className="text-green-400 font-bold">✓ Header Checksum OK</div>
                    <div className="text-green-400 font-bold">✓ IP è per questo host</div>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-4 border border-green-500/30">
                <h3 className="text-sm font-bold text-green-400 mb-3">L4 - TCP PROCESSING</h3>

                <div className="space-y-2 text-xs">
                  <div className="bg-green-500/10 p-2 rounded font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Src Port:</span>
                      <span className="text-green-300">443</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Dest Port:</span>
                      <span className="text-green-400">58234 ✓ (Browser socket)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Seq:</span>
                      <span className="text-green-300">8756432100</span>
                    </div>
                  </div>

                  <div className="bg-green-500/20 p-2 rounded border border-green-500/50">
                    <div className="text-green-400 font-bold">✓ Checksum TCP valido</div>
                    <div className="text-green-400 font-bold">✓ Sequence number corretto</div>
                    <div className="text-green-400 font-bold">✓ PSH flag → push immediato</div>
                  </div>

                  <div className="bg-blue-500/20 p-2 rounded border border-blue-500/50">
                    <div className="text-blue-400 font-bold">📤 Invio ACK</div>
                    <div className="text-gray-300">ACK: 8756432537</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 9: // L5-L6-L7 Up
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">🔓</span>
              <div>
                <h2 className="text-2xl font-bold text-yellow-400">L5-L6-L7 - Decifratura e Visualizzazione</h2>
                <p className="text-gray-400">WebSocket → TLS → Signal → "ciao"</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-3">
              <div className="bg-black/30 rounded-lg p-3 border border-cyan-500/30">
                <h3 className="text-sm font-bold text-cyan-400 mb-2">L5 - WEBSOCKET</h3>
                <div className="text-xs space-y-2">
                  <div className="bg-cyan-500/10 p-2 rounded">
                    <div>FIN: 1 ✓</div>
                    <div>Opcode: binary ✓</div>
                    <div>MASK: 0 (server)</div>
                  </div>
                  <div className="text-cyan-400">437 → 429 byte</div>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-3 border border-yellow-500/30">
                <h3 className="text-sm font-bold text-yellow-400 mb-2">L6 - TLS DECRYPT</h3>
                <div className="text-xs space-y-2">
                  <div className="bg-yellow-500/10 p-2 rounded">
                    <div>Verify Auth Tag ✓</div>
                    <div>AES-256-GCM</div>
                    <div>Deserialize Protobuf</div>
                  </div>
                  <div className="text-yellow-400">429 → 324 byte</div>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-3 border border-red-500/30">
                <h3 className="text-sm font-bold text-red-400 mb-2">L7 - SIGNAL E2E</h3>
                <div className="text-xs space-y-2">
                  <div className="bg-red-500/10 p-2 rounded">
                    <div>ECDH Key Exchange</div>
                    <div>Double Ratchet</div>
                    <div>AES-256-GCM</div>
                  </div>
                  <div className="text-red-400">324 → 4 byte</div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-lg border border-green-500/50">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">Messaggio decifrato:</div>
                <div className="text-5xl font-bold text-green-400 animate-pulse">
                  "ciao"
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-black/30 rounded-lg border border-gray-700">
              <div className="text-xs text-center text-gray-400">
                Il browser aggiorna il DOM e mostra il messaggio nella chat di WhatsApp Web
              </div>
            </div>
          </div>
        );

      case 10: // Summary
        return (
          <div className="h-full flex flex-col">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
              📊 Riepilogo del Viaggio
            </h2>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/30">
                <h3 className="text-sm font-bold text-cyan-400 mb-3">OVERHEAD DI INCAPSULAMENTO</h3>

                <div className="space-y-2">
                  {[
                    { layer: 'L7 App', from: 4, to: 324, color: '#ff6b6b' },
                    { layer: 'L6 Pres', from: 324, to: 429, color: '#feca57' },
                    { layer: 'L5 Sess', from: 429, to: 437, color: '#48dbfb' },
                    { layer: 'L4 Trans', from: 437, to: 469, color: '#1dd1a1' },
                    { layer: 'L3 Net', from: 469, to: 489, color: '#5f27cd' },
                    { layer: 'L2 Data', from: 489, to: 549, color: '#ff9f43' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <span className="w-16 font-bold" style={{ color: item.color }}>{item.layer}</span>
                      <div className="flex-1 h-4 bg-gray-800 rounded overflow-hidden">
                        <div
                          className="h-full rounded transition-all duration-1000"
                          style={{
                            width: `${(item.to / 549) * 100}%`,
                            backgroundColor: item.color,
                            transitionDelay: `${idx * 200}ms`
                          }}
                        />
                      </div>
                      <span className="w-20 text-right text-gray-400">{item.from}→{item.to}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-red-500/20 rounded border border-red-500/50 text-center">
                  <div className="text-red-400 font-bold text-lg">137× overhead</div>
                  <div className="text-xs text-gray-400">4 byte → 549 byte (13.625%)</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-black/30 rounded-lg p-4 border border-purple-500/30">
                  <h3 className="text-sm font-bold text-purple-400 mb-3">TRE LIVELLI DI CRITTOGRAFIA</h3>
                  <EncryptionLayers />
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-green-500/30">
                  <h3 className="text-sm font-bold text-green-400 mb-2">TEMPI STIMATI</h3>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Elaborazione telefono:</span>
                      <span className="text-green-300">~1-5 ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Trasmissione WiFi:</span>
                      <span className="text-green-300">~52 μs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Viaggio Internet:</span>
                      <span className="text-green-300">~20-100 ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Elaborazione PC:</span>
                      <span className="text-green-300">~1-5 ms</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-700 pt-1 mt-2">
                      <span className="text-green-400 font-bold">TOTALE:</span>
                      <span className="text-green-400 font-bold">~50-200 ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 11: // End
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-8xl mb-8">🎓</div>
            <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Fine della Simulazione
            </h1>

            <div className="max-w-xl text-gray-400 mb-8">
              <p className="mb-4">
                Abbiamo seguito il messaggio "ciao" attraverso tutti i 7 livelli ISO/OSI,
                dalla digitazione sul telefono alla visualizzazione sul PC.
              </p>
              <p>
                Ogni livello ha aggiunto il proprio contributo: crittografia, affidabilità,
                routing, e trasmissione fisica.
              </p>
            </div>

            <div className="flex gap-4 flex-wrap justify-center">
              {['Crittografia E2E', 'TCP/IP', 'WebSocket', 'WiFi/Ethernet', 'NAT', 'Routing'].map(topic => (
                <span key={topic} className="px-3 py-1 bg-cyan-500/20 border border-cyan-500 rounded-full text-cyan-400 text-sm">
                  {topic}
                </span>
              ))}
            </div>

            <div className="mt-12 text-sm text-gray-500">
              <div>ITTS Belluzzi Da Vinci - Rimini</div>
              <div>Corso: Sistemi e Reti</div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative">
      {/* Background effects */}
      <BinaryRain />
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-purple-900/20" />

      {/* Main content */}
      <div className="relative z-10 h-screen flex flex-col p-6">
        {/* Progress bar */}
        <div className="h-1 bg-gray-800 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
            style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          />
        </div>

        {/* Slide content */}
        <div className="flex-1 overflow-hidden">
          {renderSlide()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <span>←</span> Indietro
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-3 py-1 rounded-lg text-sm ${autoPlay ? 'bg-green-500 text-black' : 'bg-gray-800'}`}
            >
              {autoPlay ? '⏸ Pausa' : '▶ Auto'}
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentSlide
                      ? 'bg-cyan-400 scale-125'
                      : idx < currentSlide
                        ? 'bg-purple-500'
                        : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>

            <span className="text-sm text-gray-500">
              {currentSlide + 1} / {totalSlides}
            </span>
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="px-4 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            Avanti <span>→</span>
          </button>
        </div>
      </div>

      {/* Keyboard navigation hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-600">
        Usa ← → per navigare | Spazio per avanzare
      </div>
    </div>
  );
}
