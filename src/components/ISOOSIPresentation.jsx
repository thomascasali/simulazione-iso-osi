import React, { useState, useEffect, useRef } from 'react';

// Info Modal Component - Full screen responsive
const InfoModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

      {/* Modal - Full screen responsive */}
      <div
        className="relative bg-gray-900 border-2 border-cyan-500/50 rounded-2xl p-6 lg:p-10 w-full h-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-500/30"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button - Larger for touch */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 lg:top-6 lg:right-6 text-gray-400 hover:text-white text-3xl lg:text-4xl font-bold w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-full hover:bg-gray-800 transition-colors border border-gray-700"
        >
          ×
        </button>

        {/* Title - Large responsive */}
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-cyan-400 mb-6 lg:mb-8 pr-16">
          {title}
        </h3>

        {/* Content - Large responsive text */}
        <div className="text-gray-300 text-lg md:text-xl lg:text-2xl space-y-6 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

// Info Button Component - Simple emoji button
const InfoButton = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`text-2xl lg:text-3xl hover:scale-125 transition-all cursor-pointer ${className}`}
      title="Maggiori informazioni"
    >
      ℹ️
    </button>
  );
};

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
    <div className="flex flex-col items-center gap-2">
      {direction === 'down' ? (
        visibleLayers.sort((a, b) => b - a).map((layer, idx) => (
          <div
            key={layer}
            className="transition-all duration-500 ease-out"
            style={{
              backgroundColor: layerColors[layer],
              padding: `${8 + idx * 3}px ${20 + idx * 10}px`,
              borderRadius: '6px',
              fontSize: '14px',
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
              padding: `${8 + (visibleLayers.length - idx - 1) * 3}px ${20 + (visibleLayers.length - idx - 1) * 10}px`,
              borderRadius: '6px',
              fontSize: '14px',
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
    <div className="font-mono text-sm lg:text-base bg-black/50 p-4 rounded border border-cyan-500/30 overflow-x-auto">
      <div className="flex flex-wrap gap-2">
        {data.map((byte, idx) => (
          <span
            key={idx}
            className={`px-2 py-1 rounded transition-all duration-300 ${
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
    { name: 'Messaggio', color: '#fff', bgColor: '#ffffff', textColor: '#000000', content: '"ciao"' },
    { name: 'Signal E2E', color: '#ff6b6b', bgColor: '#ff6b6b', textColor: '#ffffff', content: 'AES-256-GCM' },
    { name: 'TLS 1.3', color: '#feca57', bgColor: '#feca57', textColor: '#000000', content: 'AES-256-GCM' },
    { name: 'WPA2', color: '#ff9f43', bgColor: '#ff9f43', textColor: '#000000', content: 'AES-128-CCM' }
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      {layers.map((layer, idx) => (
        <div
          key={idx}
          className="transition-all duration-500 flex items-center justify-center"
          style={{
            width: `${280 - idx * 50}px`,
            padding: '10px 16px',
            backgroundColor: idx === 0 ? layer.bgColor : `${layer.bgColor}90`,
            border: `2px solid ${layer.color}`,
            borderRadius: '8px',
            transform: activeLayer >= idx ? 'scale(1)' : 'scale(0.9)',
            opacity: activeLayer >= idx ? 1 : 0.3,
            boxShadow: activeLayer === idx ? `0 0 20px ${layer.color}` : 'none'
          }}
        >
          <span
            className="text-sm lg:text-base font-bold"
            style={{
              color: layer.textColor,
              textShadow: idx > 0 ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
            }}
          >
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
  const [activeInfo, setActiveInfo] = useState(null);

  const totalSlides = 16;

  // Close info modal when changing slides
  useEffect(() => {
    setActiveInfo(null);
  }, [currentSlide]);

  // Base font size for projection - larger for digital boards
  const baseFontSize = "text-base md:text-lg lg:text-xl";

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
            <div className="mb-10">
              <h1 className="text-5xl lg:text-7xl font-black mb-6 pb-2.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Il Viaggio del Messaggio
              </h1>
              <h2 className="text-3xl lg:text-4xl text-gray-400">"ciao" attraverso ISO/OSI</h2>
            </div>

            <div className="flex items-center gap-12 my-10 w-full max-w-4xl">
              <div className="text-center">
                <div className="text-7xl lg:text-8xl mb-4">📱</div>
                <div className="text-lg lg:text-xl text-gray-400">WhatsApp App</div>
                <div className="text-base lg:text-lg text-cyan-400 font-mono">192.168.1.100</div>
              </div>

              <div className="flex-1 relative h-4">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-gray-900 px-6 text-2xl lg:text-3xl font-bold">→ "ciao" →</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-7xl lg:text-8xl mb-4">💻</div>
                <div className="text-lg lg:text-xl text-gray-400">WhatsApp Web</div>
                <div className="text-base lg:text-lg text-cyan-400 font-mono">192.168.2.50</div>
              </div>
            </div>

            <p className="text-gray-400 max-w-3xl text-xl lg:text-2xl">
              Seguiamo il percorso completo di un semplice messaggio attraverso
              i 7 livelli della pila ISO/OSI, dal telefono al PC
            </p>

            <div className="mt-12 text-lg text-gray-500">
              ITTS Belluzzi Da Vinci - Sistemi e Reti
            </div>
          </div>
        );

      case 1: // Overview
        return (
          <div className="h-full flex flex-col">
            <h2 className="text-3xl lg:text-4xl font-bold text-cyan-400 mb-6">📚 La Pila ISO/OSI</h2>

            <div className="flex-1 flex gap-8">
              <div className="flex-1">
                <div className="space-y-3">
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
                        className="flex items-center gap-4 p-3 lg:p-4 rounded transition-all duration-500"
                        style={{
                          backgroundColor: `${colors[7 - layer]}20`,
                          borderLeft: `6px solid ${colors[7 - layer]}`,
                          transform: animationStep >= (8 - layer) ? 'translateX(0)' : 'translateX(-100px)',
                          opacity: animationStep >= (8 - layer) ? 1 : 0
                        }}
                      >
                        <span className="text-3xl lg:text-4xl font-bold w-16" style={{ color: colors[7 - layer] }}>
                          L{layer}
                        </span>
                        <div>
                          <div className="font-bold text-lg lg:text-xl" style={{ color: colors[7 - layer] }}>
                            {names[7 - layer]}
                          </div>
                          <div className="text-sm lg:text-base text-gray-400">{desc[7 - layer]}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="w-72 lg:w-80 flex flex-col items-center justify-center">
                <h3 className="text-base lg:text-lg font-bold text-gray-400 mb-6">INCAPSULAMENTO</h3>
                <AnimatedPacket
                  layers={[7, 6, 5, 4, 3, 2, 1].slice(0, Math.min(animationStep, 7))}
                  currentLayer={Math.max(8 - animationStep, 1)}
                  direction="down"
                />
                <div className="mt-6 text-sm lg:text-base text-gray-500 text-center">
                  Ogni livello aggiunge<br/>il proprio header
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // L7 Down
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl lg:text-6xl">📱</span>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-red-400">Livello 7 - Applicazione</h2>
                <p className="text-lg lg:text-xl text-gray-400">WhatsApp + Signal Protocol</p>
              </div>
              <div className="ml-auto px-4 py-2 bg-red-500/20 border border-red-500 rounded text-red-400 text-base lg:text-lg">
                ↓ INCAPSULAMENTO
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-6">
              <div className="space-y-4 flex flex-col">
                <div className="bg-black/30 rounded-lg p-5 border border-red-500/30 flex-1 relative">
                  <InfoButton onClick={() => setActiveInfo('utf8')} className="absolute top-3 right-3" />
                  <h3 className="text-base lg:text-lg font-bold text-red-400 mb-3">MESSAGGIO ORIGINALE</h3>
                  <div className="text-5xl lg:text-6xl font-mono text-center py-6 bg-white/10 rounded">
                    "ciao"
                  </div>
                  <div className="text-base lg:text-lg text-gray-400 mt-3 text-center">
                    UTF-8: 63 69 61 6F (4 byte)
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-5 border border-red-500/30 flex-1 relative">
                  <InfoButton onClick={() => setActiveInfo('signal')} className="absolute top-3 right-3" />
                  <h3 className="text-base lg:text-lg font-bold text-red-400 mb-3">CRITTOGRAFIA END-TO-END</h3>
                  <div className="space-y-3 text-base lg:text-lg font-mono">
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

              <div className="space-y-4 flex flex-col">
                <div className="bg-black/30 rounded-lg p-5 border border-red-500/30 flex-1 relative">
                  <InfoButton onClick={() => setActiveInfo('whatsapp-structure')} className="absolute top-3 right-3" />
                  <h3 className="text-base lg:text-lg font-bold text-red-400 mb-3">STRUTTURA MESSAGGIO WHATSAPP</h3>
                  <div className="space-y-2 text-sm lg:text-base font-mono">
                    <div className="p-3 bg-red-500/20 rounded">
                      <span className="text-red-400">message_id:</span>
                      <span className="text-gray-300 ml-2">3EB0A8C7D2F4E6B8...</span>
                    </div>
                    <div className="p-3 bg-red-500/10 rounded">
                      <span className="text-red-400">sender_jid:</span>
                      <span className="text-gray-300 ml-2">393331234567@s.whatsapp.net</span>
                    </div>
                    <div className="p-3 bg-red-500/20 rounded">
                      <span className="text-red-400">recipient_jid:</span>
                      <span className="text-gray-300 ml-2">393479876543@s.whatsapp.net</span>
                    </div>
                    <div className="p-3 bg-red-500/10 rounded">
                      <span className="text-red-400">timestamp:</span>
                      <span className="text-gray-300 ml-2">1702640400</span>
                    </div>
                    <div className="p-3 bg-red-500/30 rounded border border-red-500">
                      <span className="text-red-400">encrypted_payload:</span>
                      <span className="text-gray-300 ml-2">[Signal Ciphertext]</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-5 border border-red-500/30 relative">
                  <InfoButton onClick={() => setActiveInfo('l7-output')} className="absolute top-3 right-3" />
                  <h3 className="text-base lg:text-lg font-bold text-red-400 mb-3">OUTPUT L7</h3>
                  <HexViewer
                    data={['7F', '2A', '8B', '4C', '9D', '1E', '6F', '3A', '5B', '2C', '8D', '4E', 'F1', 'A2', 'B3', 'C4']}
                    highlight={[0, 1, 2, 3]}
                  />
                  <div className="text-base lg:text-lg text-gray-400 mt-3">
                    4 byte → <span className="text-red-400 font-bold">324 byte</span> (criptato + metadata)
                  </div>
                </div>
              </div>
            </div>

            {/* Info Modals for Slide 2 */}
            <InfoModal isOpen={activeInfo === 'utf8'} onClose={() => setActiveInfo(null)} title="Codifica UTF-8">
              <p><strong>UTF-8</strong> (Unicode Transformation Format - 8 bit) è lo standard di codifica dei caratteri più utilizzato nel web. Ogni carattere viene rappresentato da 1 a 4 byte.</p>
              <div className="bg-black/50 p-4 lg:p-6 rounded-lg font-mono text-base lg:text-lg mt-4 lg:mt-6">
                <div className="text-cyan-400 mb-2">Conversione "ciao" → esadecimale:</div>
                <div className="space-y-1">
                  <div>'c' → ASCII 99 → <span className="text-green-400">0x63</span></div>
                  <div>'i' → ASCII 105 → <span className="text-green-400">0x69</span></div>
                  <div>'a' → ASCII 97 → <span className="text-green-400">0x61</span></div>
                  <div>'o' → ASCII 111 → <span className="text-green-400">0x6F</span></div>
                </div>
              </div>
              <p className="mt-4">I caratteri ASCII (0-127) usano 1 byte. Caratteri accentati (es. "è", "à") usano 2 byte. Emoji e caratteri speciali possono usare fino a 4 byte.</p>
            </InfoModal>

            <InfoModal isOpen={activeInfo === 'signal'} onClose={() => setActiveInfo(null)} title="Signal Protocol - Crittografia End-to-End">
              <p>Il <strong>Signal Protocol</strong> è il protocollo crittografico usato da WhatsApp, Signal e altri per garantire che solo mittente e destinatario possano leggere i messaggi.</p>
              <div className="space-y-4 lg:space-y-6 mt-4 lg:mt-6">
                <div className="bg-red-500/20 p-4 rounded-lg">
                  <h4 className="font-bold text-red-400 mb-2">🔐 AES-256-GCM</h4>
                  <p className="text-base lg:text-lg"><strong>Advanced Encryption Standard</strong> con chiave a 256 bit in modalità Galois/Counter Mode. Fornisce sia cifratura che autenticazione del messaggio (AEAD).</p>
                </div>
                <div className="bg-purple-500/20 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-400 mb-2">🔑 Curve25519 (ECDH)</h4>
                  <p className="text-base lg:text-lg"><strong>Elliptic Curve Diffie-Hellman</strong> su curva Curve25519. Permette a due parti di generare una chiave segreta condivisa senza mai trasmetterla.</p>
                </div>
                <div className="bg-green-500/20 p-4 rounded-lg">
                  <h4 className="font-bold text-green-400 mb-2">🔄 Double Ratchet</h4>
                  <p className="text-base lg:text-lg">Algoritmo che genera una nuova chiave per ogni messaggio. Se una chiave viene compromessa, i messaggi passati e futuri rimangono sicuri (forward secrecy).</p>
                </div>
              </div>
            </InfoModal>

            <InfoModal isOpen={activeInfo === 'whatsapp-structure'} onClose={() => setActiveInfo(null)} title="Struttura del Messaggio WhatsApp">
              <p>Ogni messaggio WhatsApp contiene metadati oltre al contenuto criptato:</p>
              <div className="space-y-4 lg:space-y-5 mt-4 lg:mt-6">
                <div className="bg-black/50 p-4 lg:p-5 rounded-lg">
                  <span className="text-red-400 font-bold">message_id</span>
                  <p className="text-base lg:text-lg mt-2">Identificatore univoco del messaggio (32 byte random). Usato per conferme di ricezione e sincronizzazione.</p>
                </div>
                <div className="bg-black/50 p-4 lg:p-5 rounded-lg">
                  <span className="text-red-400 font-bold">sender_jid / recipient_jid</span>
                  <p className="text-base lg:text-lg mt-2"><strong>JID</strong> = Jabber ID. Formato: <code>numero@s.whatsapp.net</code>. Il prefisso 39 è il codice Italia.</p>
                </div>
                <div className="bg-black/50 p-4 lg:p-5 rounded-lg">
                  <span className="text-red-400 font-bold">timestamp</span>
                  <p className="text-base lg:text-lg mt-2">Unix timestamp (secondi dal 1 gennaio 1970). Usato per ordinare i messaggi cronologicamente.</p>
                </div>
                <div className="bg-black/50 p-4 lg:p-5 rounded-lg">
                  <span className="text-red-400 font-bold">encrypted_payload</span>
                  <p className="text-base lg:text-lg mt-2">Il contenuto effettivo del messaggio cifrato con Signal Protocol.</p>
                </div>
              </div>
            </InfoModal>

            <InfoModal isOpen={activeInfo === 'l7-output'} onClose={() => setActiveInfo(null)} title="Output del Livello 7 - Crescita dei Dati">
              <p>Il messaggio originale di <strong>4 byte</strong> ("ciao") diventa <strong>324 byte</strong> dopo l'elaborazione del livello applicazione.</p>
              <div className="bg-black/50 p-4 lg:p-6 rounded-lg mt-4 lg:mt-6 font-mono text-base lg:text-lg">
                <div className="text-cyan-400 mb-2">Composizione dei 324 byte:</div>
                <div className="space-y-1">
                  <div>Messaggio originale: <span className="text-green-400">4 byte</span></div>
                  <div>Padding + IV + Auth Tag: <span className="text-yellow-400">~40 byte</span></div>
                  <div>Message ID + JIDs + timestamp: <span className="text-purple-400">~100 byte</span></div>
                  <div>Chiave pubblica + Ratchet info: <span className="text-red-400">~80 byte</span></div>
                  <div>Altri metadati: <span className="text-gray-400">~100 byte</span></div>
                </div>
              </div>
              <div className="bg-orange-500/20 p-4 lg:p-5 rounded-lg mt-4 lg:mt-6 text-orange-300 text-base lg:text-lg">
                <strong>Overhead:</strong> 4 byte → 324 byte = 81× di crescita! Questo è il prezzo della sicurezza, ma per messaggi più lunghi la percentuale di overhead diminuisce significativamente.
              </div>
            </InfoModal>
          </div>
        );

      case 3: // L6-L5 Down
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl lg:text-6xl">🔄</span>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-yellow-400">L6 Presentazione + L5 Sessione</h2>
                <p className="text-lg lg:text-xl text-gray-400">Protocol Buffers + TLS 1.3 + WebSocket</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-6">
              <div className="bg-black/30 rounded-lg p-5 border border-yellow-500/30 flex flex-col relative">
                <InfoButton onClick={() => setActiveInfo('protobuf-tls')} className="absolute top-3 right-3" />
                <h3 className="text-lg lg:text-xl font-bold text-yellow-400 mb-4">L6 - PRESENTAZIONE</h3>

                <div className="space-y-4 flex-1 flex flex-col justify-around">
                  <div className="bg-yellow-500/10 p-4 rounded">
                    <h4 className="text-base lg:text-lg font-bold text-yellow-300 mb-3">Serializzazione Protobuf</h4>
                    <div className="text-sm lg:text-base font-mono text-gray-300 space-y-1">
                      <div>0A 20 [message_id: 32 byte]</div>
                      <div>12 1E [sender: 30 byte]</div>
                      <div>1A 1E [recipient: 30 byte]</div>
                      <div>20 [timestamp: varint]</div>
                      <div>2A [encrypted: 300 byte]</div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 p-4 rounded">
                    <h4 className="text-base lg:text-lg font-bold text-yellow-300 mb-3">Crittografia TLS 1.3</h4>
                    <div className="text-sm lg:text-base space-y-2">
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

                  <div className="text-base lg:text-lg text-gray-400 text-center">
                    324 byte → <span className="text-yellow-400 font-bold">429 byte</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-5 border border-cyan-500/30 flex flex-col relative">
                <InfoButton onClick={() => setActiveInfo('websocket')} className="absolute top-3 right-3" />
                <h3 className="text-lg lg:text-xl font-bold text-cyan-400 mb-4">L5 - SESSIONE</h3>

                <div className="space-y-4 flex-1 flex flex-col justify-around">
                  <div className="bg-cyan-500/10 p-4 rounded">
                    <h4 className="text-base lg:text-lg font-bold text-cyan-300 mb-3">WebSocket Frame</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm lg:text-base">
                      <div className="bg-black/30 p-3 rounded">
                        <div className="text-gray-400">FIN</div>
                        <div className="text-cyan-300 font-mono text-lg">1</div>
                      </div>
                      <div className="bg-black/30 p-3 rounded">
                        <div className="text-gray-400">Opcode</div>
                        <div className="text-cyan-300 font-mono text-lg">0x2 (binary)</div>
                      </div>
                      <div className="bg-black/30 p-3 rounded">
                        <div className="text-gray-400">MASK</div>
                        <div className="text-cyan-300 font-mono text-lg">1</div>
                      </div>
                      <div className="bg-black/30 p-3 rounded">
                        <div className="text-gray-400">Length</div>
                        <div className="text-cyan-300 font-mono text-lg">429</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-cyan-500/10 p-4 rounded">
                    <h4 className="text-base lg:text-lg font-bold text-cyan-300 mb-3">Masking (XOR)</h4>
                    <div className="text-sm lg:text-base font-mono space-y-2">
                      <div><span className="text-gray-400">Key:</span> <span className="text-cyan-300">37 4E 8A F1</span></div>
                      <div><span className="text-gray-400">Original:</span> <span className="text-gray-300">17 03 03 01</span></div>
                      <div><span className="text-gray-400">Masked:</span> <span className="text-cyan-300">20 4D 89 F0</span></div>
                    </div>
                  </div>

                  <div className="text-base lg:text-lg text-gray-400 text-center">
                    429 byte → <span className="text-cyan-400 font-bold">437 byte</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Modals for Slide 3 */}
            <InfoModal isOpen={activeInfo === 'protobuf-tls'} onClose={() => setActiveInfo(null)} title="Protocol Buffers + TLS 1.3">
              <p><strong>Protocol Buffers</strong> è un formato di serializzazione binaria sviluppato da Google. È più compatto e veloce di JSON o XML.</p>
              <div className="bg-yellow-500/20 p-4 rounded-lg mt-4">
                <h4 className="font-bold text-yellow-400 mb-2">Struttura TLV (Tag-Length-Value)</h4>
                <p className="text-base lg:text-lg">Ogni campo è codificato come: Tag (tipo campo) + Length (lunghezza) + Value (dati)</p>
                <div className="font-mono text-xs mt-2">0A 20 [dati] = Tag 1, Length 32 byte, poi i dati</div>
              </div>
              <div className="bg-purple-500/20 p-4 rounded-lg mt-4">
                <h4 className="font-bold text-purple-400 mb-2">TLS 1.3</h4>
                <p className="text-base lg:text-lg">Cripta la comunicazione tra client e server. Usa AES-256-GCM per cifratura autenticata. L'Auth Tag di 16 byte garantisce integrità dei dati.</p>
              </div>
            </InfoModal>

            <InfoModal isOpen={activeInfo === 'websocket'} onClose={() => setActiveInfo(null)} title="WebSocket - Comunicazione Bidirezionale">
              <p><strong>WebSocket</strong> è un protocollo che permette comunicazione full-duplex su una singola connessione TCP.</p>
              <div className="bg-cyan-500/20 p-4 rounded-lg mt-4">
                <h4 className="font-bold text-cyan-400 mb-2">Frame WebSocket</h4>
                <div className="text-base lg:text-lg space-y-2">
                  <div><strong>FIN:</strong> 1 = ultimo frame del messaggio</div>
                  <div><strong>Opcode:</strong> 0x2 = dati binari</div>
                  <div><strong>MASK:</strong> 1 = client→server (obbligatorio)</div>
                  <div><strong>Masking:</strong> XOR con chiave random per sicurezza</div>
                </div>
              </div>
              <div className="bg-green-500/20 p-4 rounded-lg mt-4">
                <h4 className="font-bold text-green-400 mb-2">Vantaggi vs HTTP polling</h4>
                <p className="text-base lg:text-lg">Connessione persistente, bassa latenza, bidirezionale. Header minimi (2-14 byte vs ~800 byte HTTP).</p>
              </div>
            </InfoModal>
          </div>
        );

      case 4: // L4-L3 Down
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl lg:text-6xl">🚚</span>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-green-400">L4 Trasporto + L3 Rete</h2>
                <p className="text-lg lg:text-xl text-gray-400">TCP + IPv4 + NAT</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-6">
              <div className="bg-black/30 rounded-lg p-5 border border-green-500/30 flex flex-col relative">
                <InfoButton onClick={() => setActiveInfo('tcp')} className="absolute top-3 right-3" />
                <h3 className="text-lg lg:text-xl font-bold text-green-400 mb-4">L4 - TCP SEGMENT</h3>

                <div className="bg-green-500/10 p-4 rounded mb-4 flex-1">
                  <div className="grid grid-cols-2 gap-4 text-sm lg:text-base">
                    <div>
                      <span className="text-gray-400">Src Port:</span>
                      <div className="text-green-300 font-mono text-xl lg:text-2xl">52431</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Dst Port:</span>
                      <div className="text-green-300 font-mono text-xl lg:text-2xl">443</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Seq Number:</span>
                      <div className="text-green-300 font-mono text-lg">1513893917</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Ack Number:</span>
                      <div className="text-green-300 font-mono text-lg">2407431516</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mb-4">
                  {['ACK', 'PSH'].map(flag => (
                    <span key={flag} className="px-4 py-2 bg-green-500 text-black text-base lg:text-lg font-bold rounded">
                      {flag}
                    </span>
                  ))}
                  {['SYN', 'FIN', 'RST'].map(flag => (
                    <span key={flag} className="px-4 py-2 bg-gray-700 text-gray-400 text-base lg:text-lg rounded">
                      {flag}
                    </span>
                  ))}
                </div>

                <div className="text-base lg:text-lg text-gray-400">
                  Header: 32 byte | 437 byte → <span className="text-green-400 font-bold">469 byte</span>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-5 border border-purple-500/30 flex flex-col relative">
                <InfoButton onClick={() => setActiveInfo('ip-nat')} className="absolute top-3 right-3" />
                <h3 className="text-lg lg:text-xl font-bold text-purple-400 mb-4">L3 - IP PACKET + NAT</h3>

                <div className="bg-purple-500/10 p-4 rounded mb-4 flex-1">
                  <div className="space-y-4 text-sm lg:text-base">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 w-24">Src IP:</span>
                      <span className="text-red-400 line-through">192.168.1.100</span>
                      <span className="text-green-400 text-xl">→</span>
                      <span className="text-purple-300 font-mono">82.53.147.201</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 w-24">Dst IP:</span>
                      <span className="text-purple-300 font-mono">157.240.1.52</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 w-24">TTL:</span>
                      <span className="text-purple-300 font-mono text-xl">64</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 w-24">Protocol:</span>
                      <span className="text-purple-300 font-mono">6 (TCP)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-500/20 p-4 rounded border border-orange-500/50 mb-4">
                  <div className="text-base lg:text-lg font-bold text-orange-400 mb-2">🔄 NAT Translation</div>
                  <div className="text-base lg:text-lg text-gray-300 font-mono">
                    192.168.1.100:52431 → 82.53.147.201:34567
                  </div>
                </div>

                <div className="text-base lg:text-lg text-gray-400">
                  Header: 20 byte | 469 byte → <span className="text-purple-400 font-bold">489 byte</span>
                </div>
              </div>
            </div>
            {/* Info Modals for Slide 4 */}
            <InfoModal isOpen={activeInfo === 'tcp'} onClose={() => setActiveInfo(null)} title="TCP - Transmission Control Protocol">
              <p><strong>TCP</strong> è il protocollo di trasporto affidabile di Internet. Garantisce che i dati arrivino completi, in ordine e senza errori.</p>
              <div className="bg-green-500/20 p-4 rounded-lg mt-4">
                <h4 className="font-bold text-green-400 mb-2">Header TCP</h4>
                <div className="text-base lg:text-lg space-y-2">
                  <div><strong>Porte:</strong> 52431 (effimera) → 443 (HTTPS)</div>
                  <div><strong>Sequence:</strong> Posizione del primo byte nel flusso</div>
                  <div><strong>ACK:</strong> Conferma ricezione</div>
                  <div><strong>PSH:</strong> Consegna immediata all'applicazione</div>
                </div>
              </div>
            </InfoModal>

            <InfoModal isOpen={activeInfo === 'ip-nat'} onClose={() => setActiveInfo(null)} title="IPv4 + NAT">
              <p><strong>IPv4</strong> gestisce l'indirizzamento logico e il routing. <strong>NAT</strong> traduce IP privati in pubblici.</p>
              <div className="bg-purple-500/20 p-4 rounded-lg mt-4">
                <h4 className="font-bold text-purple-400 mb-2">Header IP</h4>
                <div className="text-base lg:text-lg space-y-2">
                  <div><strong>TTL:</strong> 64 = massimo hop prima dello scarto</div>
                  <div><strong>Protocol:</strong> 6 = TCP</div>
                </div>
              </div>
              <div className="bg-orange-500/20 p-4 rounded-lg mt-4">
                <h4 className="font-bold text-orange-400 mb-2">NAT (Network Address Translation)</h4>
                <p className="text-base lg:text-lg">Il router traduce 192.168.1.100:52431 → 82.53.147.201:34567. Permette a molti dispositivi di condividere un IP pubblico.</p>
              </div>
            </InfoModal>
          </div>
        );

      case 5: // L2-L1 Down (WiFi)
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl lg:text-6xl">📡</span>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-orange-400">L2 Data Link + L1 Fisico</h2>
                <p className="text-lg lg:text-xl text-gray-400">IEEE 802.11 WiFi + OFDM</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-6">
              <div className="bg-black/30 rounded-lg p-5 border border-orange-500/30 flex flex-col relative">
                <InfoButton onClick={() => setActiveInfo('wifi')} className="absolute top-3 right-3" />
                <h3 className="text-lg lg:text-xl font-bold text-orange-400 mb-4">L2 - WIFI FRAME (802.11)</h3>

                <div className="space-y-4 text-sm lg:text-base flex-1">
                  <div className="bg-orange-500/10 p-4 rounded">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400">Frame Control:</span>
                        <div className="text-orange-300 font-mono text-lg lg:text-xl">0x08 0x41</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Duration:</span>
                        <div className="text-orange-300 font-mono text-lg lg:text-xl">125 μs</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-500/10 p-4 rounded">
                    <div className="text-gray-400 mb-2 text-base">Indirizzi MAC:</div>
                    <div className="space-y-2 font-mono text-orange-300 text-base lg:text-lg">
                      <div>RA: AA:BB:CC:DD:EE:FF (AP)</div>
                      <div>TA: 11:22:33:44:55:66 (Phone)</div>
                      <div>DA: 00:11:22:33:44:55 (Router)</div>
                    </div>
                  </div>

                  <div className="bg-red-500/20 p-4 rounded border border-red-500/50">
                    <div className="text-red-400 font-bold mb-2 text-lg">🔐 WPA2-CCMP</div>
                    <div className="text-gray-300 text-base lg:text-lg">AES-128-CCM + MIC 8 byte</div>
                  </div>
                </div>

                <div className="text-base lg:text-lg text-gray-400 mt-4">
                  489 byte → <span className="text-orange-400 font-bold">549 byte</span>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-5 border border-cyan-500/30 flex flex-col relative">
                <InfoButton onClick={() => setActiveInfo('ofdm')} className="absolute top-3 right-3" />
                <h3 className="text-lg lg:text-xl font-bold text-cyan-400 mb-4">L1 - TRASMISSIONE RADIO</h3>

                <div className="space-y-4 text-sm lg:text-base flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-cyan-500/10 p-4 rounded">
                      <div className="text-gray-400">Frequenza</div>
                      <div className="text-cyan-300 font-bold text-xl lg:text-2xl">5180 MHz</div>
                    </div>
                    <div className="bg-cyan-500/10 p-4 rounded">
                      <div className="text-gray-400">Bandwidth</div>
                      <div className="text-cyan-300 font-bold text-xl lg:text-2xl">80 MHz</div>
                    </div>
                    <div className="bg-cyan-500/10 p-4 rounded">
                      <div className="text-gray-400">Modulazione</div>
                      <div className="text-cyan-300 font-bold text-xl lg:text-2xl">256-QAM</div>
                    </div>
                    <div className="bg-cyan-500/10 p-4 rounded">
                      <div className="text-gray-400">Tempo TX</div>
                      <div className="text-cyan-300 font-bold text-xl lg:text-2xl">~52 μs</div>
                    </div>
                  </div>

                  <div className="bg-cyan-500/10 p-4 rounded">
                    <div className="text-gray-400 mb-2">OFDM Symbol</div>
                    <div className="text-cyan-300 text-lg">234 subcarrier × 8 bit × 2 streams</div>
                  </div>
                </div>

                <SignalWave active={animationStep > 2} />

                <div className="text-center text-cyan-400 text-xl lg:text-2xl mt-4">
                  ∿∿∿ Onde Radio a 5 GHz ∿∿∿
                </div>
              </div>
            </div>
            {/* Info Modals for Slide 5 */}
            <InfoModal isOpen={activeInfo === 'wifi'} onClose={() => setActiveInfo(null)} title="WiFi 802.11 + WPA2">
              <p>Il frame <strong>IEEE 802.11</strong> trasporta dati sul collegamento wireless verso l'Access Point.</p>
              <div className="bg-orange-500/20 p-4 rounded-lg mt-4">
                <h4 className="font-bold text-orange-400 mb-2">Indirizzi MAC</h4>
                <p className="text-base lg:text-lg">WiFi usa fino a 4 indirizzi MAC: Receiver (AP), Transmitter (telefono), Destination (router), Source.</p>
              </div>
              <div className="bg-red-500/20 p-4 rounded-lg mt-4">
                <h4 className="font-bold text-red-400 mb-2">WPA2-CCMP</h4>
                <p className="text-base lg:text-lg">Crittografia AES-128-CCM con autenticazione. Protegge i dati sul collegamento radio. Terzo livello di crittografia del nostro messaggio!</p>
              </div>
            </InfoModal>

            <InfoModal isOpen={activeInfo === 'ofdm'} onClose={() => setActiveInfo(null)} title="OFDM + 256-QAM">
              <p><strong>OFDM</strong> (Orthogonal Frequency Division Multiplexing) divide la banda in 256 sottoportanti.</p>
              <div className="bg-cyan-500/20 p-4 rounded-lg mt-4">
                <h4 className="font-bold text-cyan-400 mb-2">256-QAM</h4>
                <p className="text-base lg:text-lg">Ogni sottoportante trasporta 8 bit per simbolo (256 = 2⁸ punti nel diagramma di costellazione).</p>
              </div>
              <div className="bg-green-500/20 p-4 rounded-lg mt-4">
                <h4 className="font-bold text-green-400 mb-2">Tempo trasmissione: ~52 μs</h4>
                <p className="text-base lg:text-lg">549 byte = 4392 bit viaggiano in meno di un decimo di millisecondo a 5 GHz!</p>
              </div>
            </InfoModal>
          </div>
        );

      case 6: // Internet Journey
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl lg:text-6xl">🌍</span>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Viaggio attraverso Internet
                </h2>
                <p className="text-lg lg:text-xl text-gray-400">Il pacchetto attraversa multiple reti</p>
              </div>
              <InfoButton onClick={() => setActiveInfo('internet-journey')} className="ml-auto" />
            </div>

            <NetworkDiagram activeHop={Math.min(animationStep, 7)} />

            <div className="flex-1 grid grid-cols-3 gap-4 mt-6">
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
                  className={`p-4 rounded border text-sm lg:text-base transition-all duration-300 ${
                    animationStep > idx
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-700 bg-gray-800/50 opacity-50'
                  }`}
                >
                  <div className="font-bold text-cyan-400 text-base lg:text-lg">HOP {item.hop}: {item.name}</div>
                  <div className="text-gray-400">{item.action}</div>
                  <div className="text-yellow-400 text-lg font-mono">TTL: {item.ttl}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-purple-500/20 rounded-lg border border-purple-500/50">
              <div className="text-base lg:text-lg text-purple-300">
                <span className="font-bold">⚠️ Sul server WhatsApp:</span> Il contenuto "ciao" rimane criptato E2E.
                Il server può solo leggere i metadata e inoltrare il messaggio.
              </div>
            </div>
            {/* Info Modal for Slide 6 */}
            <InfoModal isOpen={activeInfo === 'internet-journey'} onClose={() => setActiveInfo(null)} title="Il Viaggio su Internet">
              <p>Un pacchetto attraversa tipicamente <strong>10-20 router</strong> (hop) prima di raggiungere la destinazione.</p>
              <div className="bg-cyan-500/20 p-4 rounded-lg mt-4">
                <h4 className="font-bold text-cyan-400 mb-2">Ogni hop:</h4>
                <ol className="list-decimal ml-4 text-sm space-y-1">
                  <li>Router riceve pacchetto, legge IP destinazione</li>
                  <li>Consulta routing table per next hop</li>
                  <li>Decrementa TTL</li>
                  <li>Inoltra al prossimo router</li>
                </ol>
              </div>
              <div className="bg-purple-500/20 p-4 rounded-lg mt-4">
                <h4 className="font-bold text-purple-400 mb-2">Crittografia E2E sul server</h4>
                <p className="text-base lg:text-lg">Il server WhatsApp vede solo i metadati (chi parla con chi) ma NON può leggere "ciao" grazie al Signal Protocol!</p>
              </div>
            </InfoModal>
          </div>
        );

      case 7: // L1-L2 Up (Ethernet)
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl lg:text-6xl">💻</span>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-cyan-400">L1 + L2 - Ricezione sul PC</h2>
                <p className="text-lg lg:text-xl text-gray-400">Gigabit Ethernet (1000BASE-T)</p>
              </div>
              <div className="ml-auto px-4 py-2 bg-green-500/20 border border-green-500 rounded text-green-400 text-base lg:text-lg">
                ↑ DEINCAPSULAMENTO
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-6">
              <div className="bg-black/30 rounded-lg p-5 border border-cyan-500/30 flex flex-col">
                <h3 className="text-lg lg:text-xl font-bold text-cyan-400 mb-4">L1 - SEGNALE ELETTRICO</h3>

                <div className="space-y-4 flex-1">
                  <div className="bg-cyan-500/10 p-4 rounded">
                    <div className="text-base text-gray-400 mb-3">Codifica PAM-5 (5 livelli)</div>
                    <div className="flex justify-around items-end h-24">
                      {['+1V', '+0.5V', '0V', '-0.5V', '-1V'].map((v, i) => (
                        <div key={i} className="text-center">
                          <div
                            className="w-8 bg-cyan-500 rounded-t"
                            style={{ height: `${60 - i * 12}px` }}
                          />
                          <div className="text-sm lg:text-base text-cyan-300 mt-2">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-base">
                    <div className="bg-cyan-500/10 p-4 rounded">
                      <div className="text-gray-400">Cavo</div>
                      <div className="text-cyan-300 text-xl font-bold">Cat5e/Cat6</div>
                    </div>
                    <div className="bg-cyan-500/10 p-4 rounded">
                      <div className="text-gray-400">Velocità</div>
                      <div className="text-cyan-300 text-xl font-bold">1 Gbps</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-5 border border-orange-500/30 flex flex-col">
                <h3 className="text-lg lg:text-xl font-bold text-orange-400 mb-4">L2 - FRAME ETHERNET</h3>

                <div className="space-y-4 text-base flex-1">
                  <div className="bg-orange-500/10 p-4 rounded font-mono space-y-3">
                    <div className="flex justify-between text-base lg:text-lg">
                      <span className="text-gray-400">Dest MAC:</span>
                      <span className="text-green-400">78:45:C4:AB:CD:EF ✓</span>
                    </div>
                    <div className="flex justify-between text-base lg:text-lg">
                      <span className="text-gray-400">Src MAC:</span>
                      <span className="text-orange-300">00:11:22:33:44:55</span>
                    </div>
                    <div className="flex justify-between text-base lg:text-lg">
                      <span className="text-gray-400">EtherType:</span>
                      <span className="text-orange-300">0x0800 (IPv4)</span>
                    </div>
                  </div>

                  <div className="bg-green-500/20 p-4 rounded border border-green-500/50">
                    <div className="text-green-400 font-bold text-lg lg:text-xl">✓ FCS Verificato (CRC-32)</div>
                    <div className="text-gray-300 text-base lg:text-lg">Frame integro, passa al L3</div>
                  </div>
                </div>

                <div className="mt-4 text-base lg:text-lg text-gray-400">
                  <span className="text-orange-400 font-bold">549 byte</span> → rimuovi header → 489 byte
                </div>
              </div>
            </div>
          </div>
        );

      case 8: // L3-L4 Up
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl lg:text-6xl">🔍</span>
              <div className="flex-1">
                <h2 className="text-3xl lg:text-4xl font-bold text-purple-400">L3 + L4 - Verifica e Consegna</h2>
                <p className="text-lg lg:text-xl text-gray-400">IP Verification + TCP ACK</p>
              </div>
              <InfoButton onClick={() => setActiveInfo('l3l4-up')} />
            </div>

            <InfoModal isOpen={activeInfo === 'l3l4-up'} onClose={() => setActiveInfo(null)} title="L3 + L4 - Verifica e Consegna">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl lg:text-2xl font-bold text-purple-400 mb-3">🔍 Livello 3 - Verifica IP</h4>
                  <p className="mb-3">Quando il pacchetto arriva al PC destinatario, il livello Network verifica:</p>
                  <ul className="list-disc list-inside space-y-2 text-base lg:text-xl">
                    <li><strong>Header Checksum:</strong> Ricalcola il checksum dell'header IP per verificare che non ci siano stati errori durante il trasporto</li>
                    <li><strong>Indirizzo IP destinazione:</strong> Conferma che il pacchetto sia effettivamente per questo host (192.168.2.50)</li>
                    <li><strong>TTL (Time To Live):</strong> Il valore 55 indica che il pacchetto ha attraversato circa 9 router (partendo da 64)</li>
                    <li><strong>Protocol field:</strong> Il valore 6 indica che il payload deve essere passato al protocollo TCP</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl lg:text-2xl font-bold text-green-400 mb-3">📤 Livello 4 - TCP Processing & ACK</h4>
                  <p className="mb-3">Il livello Transport elabora il segmento TCP:</p>
                  <ul className="list-disc list-inside space-y-2 text-base lg:text-xl">
                    <li><strong>Checksum TCP:</strong> Verifica l'integrità includendo anche pseudo-header con IP sorgente/destinazione</li>
                    <li><strong>Sequence Number:</strong> Controlla che il numero di sequenza sia quello atteso per garantire l'ordine</li>
                    <li><strong>Port matching:</strong> La porta 58234 identifica la socket del browser che attende i dati</li>
                    <li><strong>PSH flag:</strong> Indica "push immediato" - i dati devono essere consegnati subito all'applicazione senza attendere ulteriori segmenti</li>
                    <li><strong>ACK di risposta:</strong> Il PC invia un ACK (8756432537) per confermare la ricezione del segmento</li>
                  </ul>
                </div>

                <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/50">
                  <p className="text-purple-300 text-base lg:text-xl">
                    <strong>💡 Nota:</strong> Il meccanismo ACK è fondamentale per l'affidabilità di TCP. Se il mittente non riceve l'ACK entro un timeout, ritrasmette automaticamente il segmento.
                  </p>
                </div>
              </div>
            </InfoModal>

            <div className="flex-1 grid grid-cols-2 gap-6">
              <div className="bg-black/30 rounded-lg p-5 border border-purple-500/30 flex flex-col">
                <h3 className="text-lg lg:text-xl font-bold text-purple-400 mb-4">L3 - VERIFICA IP</h3>

                <div className="space-y-4 text-base flex-1">
                  <div className="bg-purple-500/10 p-4 rounded font-mono space-y-3">
                    <div className="flex justify-between text-base lg:text-lg">
                      <span className="text-gray-400">Src IP:</span>
                      <span className="text-purple-300">157.240.1.52</span>
                    </div>
                    <div className="flex justify-between text-base lg:text-lg">
                      <span className="text-gray-400">Dest IP:</span>
                      <span className="text-green-400">192.168.2.50 ✓ (questo PC)</span>
                    </div>
                    <div className="flex justify-between text-base lg:text-lg">
                      <span className="text-gray-400">TTL:</span>
                      <span className="text-purple-300 text-xl">55</span>
                    </div>
                    <div className="flex justify-between text-base lg:text-lg">
                      <span className="text-gray-400">Protocol:</span>
                      <span className="text-purple-300">6 → TCP</span>
                    </div>
                  </div>

                  <div className="bg-green-500/20 p-4 rounded border border-green-500/50">
                    <div className="text-green-400 font-bold text-lg lg:text-xl">✓ Header Checksum OK</div>
                    <div className="text-green-400 font-bold text-lg lg:text-xl">✓ IP è per questo host</div>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-5 border border-green-500/30 flex flex-col">
                <h3 className="text-lg lg:text-xl font-bold text-green-400 mb-4">L4 - TCP PROCESSING</h3>

                <div className="space-y-4 text-base flex-1">
                  <div className="bg-green-500/10 p-4 rounded font-mono space-y-3">
                    <div className="flex justify-between text-base lg:text-lg">
                      <span className="text-gray-400">Src Port:</span>
                      <span className="text-green-300 text-xl">443</span>
                    </div>
                    <div className="flex justify-between text-base lg:text-lg">
                      <span className="text-gray-400">Dest Port:</span>
                      <span className="text-green-400">58234 ✓ (Browser socket)</span>
                    </div>
                    <div className="flex justify-between text-base lg:text-lg">
                      <span className="text-gray-400">Seq:</span>
                      <span className="text-green-300">8756432100</span>
                    </div>
                  </div>

                  <div className="bg-green-500/20 p-4 rounded border border-green-500/50">
                    <div className="text-green-400 font-bold text-base lg:text-lg">✓ Checksum TCP valido</div>
                    <div className="text-green-400 font-bold text-base lg:text-lg">✓ Sequence number corretto</div>
                    <div className="text-green-400 font-bold text-base lg:text-lg">✓ PSH flag → push immediato</div>
                  </div>

                  <div className="bg-blue-500/20 p-4 rounded border border-blue-500/50">
                    <div className="text-blue-400 font-bold text-lg lg:text-xl">📤 Invio ACK</div>
                    <div className="text-gray-300 text-lg font-mono">ACK: 8756432537</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 9: // L5-L6-L7 Up
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl lg:text-6xl">🔓</span>
              <div className="flex-1">
                <h2 className="text-3xl lg:text-4xl font-bold text-yellow-400">L5-L6-L7 - Decifratura e Visualizzazione</h2>
                <p className="text-lg lg:text-xl text-gray-400">WebSocket → TLS → Signal → "ciao"</p>
              </div>
              <InfoButton onClick={() => setActiveInfo('l567-up')} />
            </div>

            <InfoModal isOpen={activeInfo === 'l567-up'} onClose={() => setActiveInfo(null)} title="L5-L6-L7 - Decifratura e Visualizzazione">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl lg:text-2xl font-bold text-cyan-400 mb-3">🔌 Livello 5 - WebSocket Frame Processing</h4>
                  <p className="mb-3">Il browser elabora il frame WebSocket ricevuto:</p>
                  <ul className="list-disc list-inside space-y-2 text-base lg:text-xl">
                    <li><strong>FIN bit = 1:</strong> Indica che questo è l'ultimo (o unico) frame del messaggio</li>
                    <li><strong>Opcode binary:</strong> Il payload contiene dati binari (non testo)</li>
                    <li><strong>MASK = 0:</strong> I frame dal server al client non sono mascherati (solo client→server richiede masking)</li>
                    <li><strong>Rimozione header:</strong> 8 byte di overhead WebSocket rimossi (437→429 byte)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl lg:text-2xl font-bold text-yellow-400 mb-3">🔐 Livello 6 - TLS 1.3 Decryption</h4>
                  <p className="mb-3">Decifratura del canale sicuro TLS:</p>
                  <ul className="list-disc list-inside space-y-2 text-base lg:text-xl">
                    <li><strong>Verifica Auth Tag:</strong> I 16 byte finali sono il tag di autenticazione GCM che garantisce integrità</li>
                    <li><strong>AES-256-GCM:</strong> Algoritmo di cifratura simmetrica con chiave derivata dall'handshake TLS</li>
                    <li><strong>Deserializzazione Protobuf:</strong> Il payload decifrato è in formato Protocol Buffers, il formato binario usato da WhatsApp</li>
                    <li><strong>Rimozione overhead:</strong> Record header + Auth tag rimossi (429→324 byte)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl lg:text-2xl font-bold text-red-400 mb-3">🔒 Livello 7 - Signal Protocol E2E Decryption</h4>
                  <p className="mb-3">Decifratura end-to-end del messaggio:</p>
                  <ul className="list-disc list-inside space-y-2 text-base lg:text-xl">
                    <li><strong>ECDH Key Exchange:</strong> Le chiavi pubbliche scambiate permettono di derivare un segreto condiviso</li>
                    <li><strong>Double Ratchet:</strong> Algoritmo che genera una nuova chiave per ogni messaggio, garantendo forward secrecy</li>
                    <li><strong>AES-256-GCM finale:</strong> Il messaggio viene decifrato con la chiave derivata dal ratchet</li>
                    <li><strong>Risultato:</strong> I 4 byte originali "ciao" sono finalmente leggibili!</li>
                  </ul>
                </div>

                <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/50">
                  <p className="text-green-300 text-base lg:text-xl">
                    <strong>💡 Sicurezza:</strong> Neanche WhatsApp può leggere i messaggi! La crittografia E2E garantisce che solo mittente e destinatario possano decifrare il contenuto.
                  </p>
                </div>
              </div>
            </InfoModal>

            <div className="flex-1 grid grid-cols-3 gap-4">
              <div className="bg-black/30 rounded-lg p-5 border border-cyan-500/30 flex flex-col">
                <h3 className="text-lg lg:text-xl font-bold text-cyan-400 mb-4">L5 - WEBSOCKET</h3>
                <div className="text-base lg:text-lg space-y-4 flex-1">
                  <div className="bg-cyan-500/10 p-4 rounded space-y-2">
                    <div>FIN: 1 ✓</div>
                    <div>Opcode: binary ✓</div>
                    <div>MASK: 0 (server)</div>
                  </div>
                  <div className="text-cyan-400 text-xl font-bold">437 → 429 byte</div>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-5 border border-yellow-500/30 flex flex-col">
                <h3 className="text-lg lg:text-xl font-bold text-yellow-400 mb-4">L6 - TLS DECRYPT</h3>
                <div className="text-base lg:text-lg space-y-4 flex-1">
                  <div className="bg-yellow-500/10 p-4 rounded space-y-2">
                    <div>Verify Auth Tag ✓</div>
                    <div>AES-256-GCM</div>
                    <div>Deserialize Protobuf</div>
                  </div>
                  <div className="text-yellow-400 text-xl font-bold">429 → 324 byte</div>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-5 border border-red-500/30 flex flex-col">
                <h3 className="text-lg lg:text-xl font-bold text-red-400 mb-4">L7 - SIGNAL E2E</h3>
                <div className="text-base lg:text-lg space-y-4 flex-1">
                  <div className="bg-red-500/10 p-4 rounded space-y-2">
                    <div>ECDH Key Exchange</div>
                    <div>Double Ratchet</div>
                    <div>AES-256-GCM</div>
                  </div>
                  <div className="text-red-400 text-xl font-bold">324 → 4 byte</div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-6 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-lg border border-green-500/50">
              <div className="text-center">
                <div className="text-lg lg:text-xl text-gray-400 mb-3">Messaggio decifrato:</div>
                <div className="text-6xl lg:text-7xl font-bold text-green-400 animate-pulse">
                  "ciao"
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-black/30 rounded-lg border border-gray-700">
              <div className="text-base lg:text-lg text-center text-gray-400">
                Il browser aggiorna il DOM e mostra il messaggio nella chat di WhatsApp Web
              </div>
            </div>
          </div>
        );

      case 10: // Summary
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-center gap-4 mb-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                📊 Riepilogo del Viaggio
              </h2>
              <InfoButton onClick={() => setActiveInfo('summary')} />
            </div>

            <InfoModal isOpen={activeInfo === 'summary'} onClose={() => setActiveInfo(null)} title="Riepilogo del Viaggio">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl lg:text-2xl font-bold text-cyan-400 mb-3">📦 Overhead di Incapsulamento</h4>
                  <p className="mb-3">Ogni livello ISO/OSI aggiunge informazioni di controllo (header) al messaggio originale:</p>
                  <ul className="list-disc list-inside space-y-2 text-base lg:text-xl">
                    <li><strong>L7 Application (4→324):</strong> +320 byte per Signal Protocol (chiavi, metadata, padding, auth tag)</li>
                    <li><strong>L6 Presentation (324→429):</strong> +105 byte per TLS record (header, nonce, auth tag, padding)</li>
                    <li><strong>L5 Session (429→437):</strong> +8 byte per WebSocket frame header</li>
                    <li><strong>L4 Transport (437→469):</strong> +32 byte per header TCP (porte, seq, ack, flags, checksum)</li>
                    <li><strong>L3 Network (469→489):</strong> +20 byte per header IP (indirizzi, TTL, checksum)</li>
                    <li><strong>L2 Data Link (489→549):</strong> +60 byte per frame WiFi (indirizzi MAC, WPA2, FCS)</li>
                  </ul>
                  <p className="mt-3 text-yellow-400">Il rapporto 137:1 (4 byte → 549 byte) sembra enorme, ma per messaggi più lunghi l'overhead percentuale diminuisce drasticamente.</p>
                </div>

                <div>
                  <h4 className="text-xl lg:text-2xl font-bold text-purple-400 mb-3">🔐 I Tre Livelli di Crittografia</h4>
                  <p className="mb-3">Il messaggio è protetto da tre strati di cifratura indipendenti:</p>
                  <ul className="list-disc list-inside space-y-2 text-base lg:text-xl">
                    <li><strong>Signal E2E (interno):</strong> Solo mittente e destinatario possono leggere - neanche WhatsApp ha accesso</li>
                    <li><strong>TLS 1.3 (intermedio):</strong> Protegge la comunicazione tra il dispositivo e i server WhatsApp</li>
                    <li><strong>WPA2 (esterno):</strong> Protegge la trasmissione wireless tra dispositivo e access point WiFi</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl lg:text-2xl font-bold text-green-400 mb-3">⏱️ Tempi di Trasmissione</h4>
                  <p className="mb-3">Il viaggio completo richiede 50-200 ms, distribuiti così:</p>
                  <ul className="list-disc list-inside space-y-2 text-base lg:text-xl">
                    <li><strong>Elaborazione telefono (1-5 ms):</strong> Cifratura, incapsulamento, preparazione frame</li>
                    <li><strong>Trasmissione WiFi (~52 μs):</strong> Tempo fisico di trasmissione del frame a 100 Mbps</li>
                    <li><strong>Viaggio Internet (20-100 ms):</strong> Latenza di rete, attraversamento router, server WhatsApp</li>
                    <li><strong>Elaborazione PC (1-5 ms):</strong> Decifratura, de-incapsulamento, rendering nel browser</li>
                  </ul>
                </div>

                <div className="bg-cyan-500/20 p-4 rounded-lg border border-cyan-500/50">
                  <p className="text-cyan-300 text-base lg:text-xl">
                    <strong>💡 Curiosità:</strong> La maggior parte del tempo (~80%) è spesa nel "viaggio Internet", determinato principalmente dalla distanza fisica e dal numero di hop tra i router.
                  </p>
                </div>
              </div>
            </InfoModal>

            <div className="flex-1 grid grid-cols-2 gap-6">
              <div className="bg-black/30 rounded-lg p-5 border border-cyan-500/30 flex flex-col">
                <h3 className="text-lg lg:text-xl font-bold text-cyan-400 mb-4">OVERHEAD DI INCAPSULAMENTO</h3>

                <div className="space-y-3 flex-1">
                  {[
                    { layer: 'L7 App', from: 4, to: 324, color: '#ff6b6b' },
                    { layer: 'L6 Pres', from: 324, to: 429, color: '#feca57' },
                    { layer: 'L5 Sess', from: 429, to: 437, color: '#48dbfb' },
                    { layer: 'L4 Trans', from: 437, to: 469, color: '#1dd1a1' },
                    { layer: 'L3 Net', from: 469, to: 489, color: '#5f27cd' },
                    { layer: 'L2 Data', from: 489, to: 549, color: '#ff9f43' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm lg:text-base">
                      <span className="w-20 font-bold" style={{ color: item.color }}>{item.layer}</span>
                      <div className="flex-1 h-6 bg-gray-800 rounded overflow-hidden">
                        <div
                          className="h-full rounded transition-all duration-1000"
                          style={{
                            width: `${(item.to / 549) * 100}%`,
                            backgroundColor: item.color,
                            transitionDelay: `${idx * 200}ms`
                          }}
                        />
                      </div>
                      <span className="w-28 text-right text-gray-400">{item.from}→{item.to}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-red-500/20 rounded border border-red-500/50 text-center">
                  <div className="text-red-400 font-bold text-2xl lg:text-3xl">137× overhead</div>
                  <div className="text-base text-gray-400">4 byte → 549 byte (13.625%)</div>
                </div>
              </div>

              <div className="space-y-6 flex flex-col">
                <div className="bg-black/30 rounded-lg p-5 border border-purple-500/30 flex-1">
                  <h3 className="text-lg lg:text-xl font-bold text-purple-400 mb-4">TRE LIVELLI DI CRITTOGRAFIA</h3>
                  <EncryptionLayers />
                </div>

                <div className="bg-black/30 rounded-lg p-5 border border-green-500/30">
                  <h3 className="text-lg lg:text-xl font-bold text-green-400 mb-4">TEMPI STIMATI</h3>
                  <div className="text-sm lg:text-base space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Elaborazione telefono:</span>
                      <span className="text-green-300 font-mono">~1-5 ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Trasmissione WiFi:</span>
                      <span className="text-green-300 font-mono">~52 μs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Viaggio Internet:</span>
                      <span className="text-green-300 font-mono">~20-100 ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Elaborazione PC:</span>
                      <span className="text-green-300 font-mono">~1-5 ms</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-700 pt-3 mt-3">
                      <span className="text-green-400 font-bold text-lg">TOTALE:</span>
                      <span className="text-green-400 font-bold text-lg font-mono">~50-200 ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 11: // Appendix - Intro TCP Fragmentation
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl lg:text-6xl">📦</span>
              <div className="flex-1">
                <h2 className="text-3xl lg:text-4xl font-bold text-orange-400">Appendice: E se il messaggio fosse grande?</h2>
                <p className="text-lg lg:text-xl text-gray-400">Segmentazione TCP per file di grandi dimensioni</p>
              </div>
              <InfoButton onClick={() => setActiveInfo('tcp-fragmentation')} />
            </div>

            <InfoModal isOpen={activeInfo === 'tcp-fragmentation'} onClose={() => setActiveInfo(null)} title="Segmentazione TCP">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl lg:text-2xl font-bold text-orange-400 mb-3">📦 Perché segmentare?</h4>
                  <p className="mb-3">I messaggi piccoli come "ciao" (4 byte) viaggiano in un singolo pacchetto. Ma cosa succede con un'immagine da 150 KB?</p>
                  <ul className="list-disc list-inside space-y-2 text-base lg:text-xl">
                    <li><strong>MTU (Maximum Transmission Unit):</strong> Ethernet permette frame di max 1500 byte</li>
                    <li><strong>MSS (Maximum Segment Size):</strong> Payload TCP max ~1460 byte (1500 - 20 IP - 20 TCP)</li>
                    <li><strong>Necessità:</strong> File grandi devono essere divisi in segmenti più piccoli</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl lg:text-2xl font-bold text-cyan-400 mb-3">🔢 Sequence Numbers</h4>
                  <p className="mb-3">TCP assegna un numero di sequenza a ogni byte trasmesso:</p>
                  <ul className="list-disc list-inside space-y-2 text-base lg:text-xl">
                    <li><strong>Primo segmento:</strong> SEQ = 0, contiene byte 0-1459</li>
                    <li><strong>Secondo segmento:</strong> SEQ = 1460, contiene byte 1460-2919</li>
                    <li><strong>E così via...</strong> fino a coprire tutti i 153.600 byte</li>
                  </ul>
                </div>

                <div className="bg-orange-500/20 p-4 rounded-lg border border-orange-500/50">
                  <p className="text-orange-300 text-base lg:text-xl">
                    <strong>💡 Curiosità:</strong> Il sequence number è un intero a 32 bit, quindi può contare fino a ~4 GB prima di "ricominciare" (wrap-around).
                  </p>
                </div>
              </div>
            </InfoModal>

            <div className="flex-1 grid grid-cols-2 gap-6">
              {/* Left: Image representation */}
              <div className="bg-black/30 rounded-lg p-5 border border-orange-500/30 flex flex-col">
                <h3 className="text-lg lg:text-xl font-bold text-orange-400 mb-4">🖼️ IMMAGINE ORIGINALE</h3>

                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48 lg:w-56 lg:h-56 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg shadow-xl mb-4 flex items-center justify-center">
                    <span className="text-6xl">🏞️</span>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-white">foto.jpg</div>
                    <div className="text-xl lg:text-2xl text-orange-400 font-mono mt-2">150 KB</div>
                    <div className="text-base lg:text-lg text-gray-400 mt-1">153.600 byte</div>
                  </div>
                </div>
              </div>

              {/* Right: Segmentation */}
              <div className="bg-black/30 rounded-lg p-5 border border-cyan-500/30 flex flex-col">
                <h3 className="text-lg lg:text-xl font-bold text-cyan-400 mb-4">✂️ SEGMENTAZIONE TCP</h3>

                <div className="flex-1 space-y-4">
                  <div className="bg-cyan-500/10 p-4 rounded">
                    <div className="flex justify-between text-base lg:text-lg mb-2">
                      <span className="text-gray-400">Dimensione file:</span>
                      <span className="text-white font-mono">153.600 byte</span>
                    </div>
                    <div className="flex justify-between text-base lg:text-lg mb-2">
                      <span className="text-gray-400">MSS (Max Segment Size):</span>
                      <span className="text-cyan-400 font-mono">1.460 byte</span>
                    </div>
                    <div className="flex justify-between text-base lg:text-lg border-t border-gray-700 pt-2 mt-2">
                      <span className="text-gray-400">Segmenti necessari:</span>
                      <span className="text-green-400 font-mono font-bold text-xl">⌈153600/1460⌉ = 106</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-14 gap-0.5 p-2 bg-black/30 rounded">
                    {Array.from({ length: 100 }, (_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 lg:w-4 lg:h-4 rounded-sm transition-all duration-300"
                        style={{
                          backgroundColor: `hsl(${180 + i * 1.5}, 70%, 50%)`,
                          animationDelay: `${i * 30}ms`
                        }}
                      />
                    ))}
                    <div className="col-span-2 flex items-center justify-center text-gray-500 text-xs">+6</div>
                  </div>
                  <div className="text-center text-gray-400 text-sm lg:text-base">
                    Ogni quadrato = 1 segmento TCP (~1460 byte)
                  </div>

                  <div className="bg-green-500/20 p-3 rounded border border-green-500/50">
                    <div className="text-green-400 font-bold text-base lg:text-lg text-center">
                      106 pacchetti indipendenti sulla rete!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 12: // Appendix - Packet Transmission Animation
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl lg:text-6xl">🚀</span>
              <div className="flex-1">
                <h2 className="text-3xl lg:text-4xl font-bold text-blue-400">Trasmissione dei Pacchetti</h2>
                <p className="text-lg lg:text-xl text-gray-400">I segmenti viaggiano in modo indipendente sulla rete</p>
              </div>
              <InfoButton onClick={() => setActiveInfo('packet-transmission')} />
            </div>

            <InfoModal isOpen={activeInfo === 'packet-transmission'} onClose={() => setActiveInfo(null)} title="Trasmissione Indipendente">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl lg:text-2xl font-bold text-blue-400 mb-3">🌐 Routing Indipendente</h4>
                  <p className="mb-3">Ogni pacchetto IP è instradato indipendentemente:</p>
                  <ul className="list-disc list-inside space-y-2 text-base lg:text-xl">
                    <li><strong>Decisioni hop-by-hop:</strong> Ogni router decide il next-hop basandosi sulla propria tabella</li>
                    <li><strong>Percorsi diversi:</strong> Pacchetti consecutivi possono seguire strade diverse</li>
                    <li><strong>Latenze variabili:</strong> Congestione, code, e distanze causano ritardi diversi</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl lg:text-2xl font-bold text-green-400 mb-3">📊 Sliding Window</h4>
                  <p className="mb-3">TCP non aspetta l'ACK di ogni pacchetto (sarebbe troppo lento!):</p>
                  <ul className="list-disc list-inside space-y-2 text-base lg:text-xl">
                    <li><strong>Window Size:</strong> Numero di byte "in volo" senza ACK (es. 64 KB)</li>
                    <li><strong>Parallelismo:</strong> Con window 64KB e MSS 1460, ~44 pacchetti simultanei</li>
                    <li><strong>Flow Control:</strong> Il ricevente comunica quanta memoria ha disponibile</li>
                  </ul>
                </div>

                <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/50">
                  <p className="text-blue-300 text-base lg:text-xl">
                    <strong>💡 Esempio:</strong> Con RTT di 50ms e window 64KB, il throughput massimo è ~10 Mbps. Per connessioni veloci servono window più grandi (TCP Window Scaling).
                  </p>
                </div>
              </div>
            </InfoModal>

            <div className="flex-1 flex flex-col gap-4">
              {/* Network visualization */}
              <div className="bg-black/30 rounded-lg p-5 border border-blue-500/30 flex-1">
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">📱</span>
                      <div>
                        <div className="text-lg font-bold text-white">Mittente</div>
                        <div className="text-sm text-gray-400">Telefono</div>
                      </div>
                    </div>

                    <div className="flex-1 mx-8 relative h-32">
                      {/* Network cloud */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl opacity-20">☁️</div>
                        <div className="absolute text-lg text-gray-500">Internet</div>
                      </div>

                      {/* Animated packets */}
                      <div className="absolute inset-0 overflow-hidden">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                          <div
                            key={i}
                            className="absolute h-6 w-6 rounded font-mono text-xs flex items-center justify-center font-bold animate-pulse"
                            style={{
                              backgroundColor: `hsl(${180 + i * 20}, 70%, 50%)`,
                              left: `${10 + i * 11}%`,
                              top: `${20 + Math.sin(i * 0.8) * 30}%`,
                              animationDelay: `${i * 150}ms`,
                              boxShadow: `0 0 10px hsl(${180 + i * 20}, 70%, 50%)`
                            }}
                          >
                            {i + 1}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">Destinatario</div>
                        <div className="text-sm text-gray-400">PC</div>
                      </div>
                      <span className="text-4xl">💻</span>
                    </div>
                  </div>

                  {/* Sequence visualization */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-blue-500/10 p-4 rounded">
                      <h4 className="text-base font-bold text-blue-400 mb-3">📤 Ordine di INVIO</h4>
                      <div className="flex gap-1 flex-wrap">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <div
                            key={n}
                            className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold text-black"
                            style={{ backgroundColor: `hsl(${180 + n * 15}, 70%, 50%)` }}
                          >
                            {n}
                          </div>
                        ))}
                        <span className="text-gray-500 flex items-center px-2">...</span>
                      </div>
                      <div className="text-gray-400 text-sm mt-2">Sequenziale: 1, 2, 3, 4, 5...</div>
                    </div>

                    <div className="bg-orange-500/10 p-4 rounded">
                      <h4 className="text-base font-bold text-orange-400 mb-3">📥 Ordine di ARRIVO</h4>
                      <div className="flex gap-1 flex-wrap">
                        {[1, 3, 2, 5, 4, 8, 6, 7, 10, 9].map((n, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold text-black"
                            style={{ backgroundColor: `hsl(${180 + n * 15}, 70%, 50%)` }}
                          >
                            {n}
                          </div>
                        ))}
                        <span className="text-gray-500 flex items-center px-2">...</span>
                      </div>
                      <div className="text-orange-400 text-sm mt-2">Fuori ordine: 1, 3, 2, 5, 4...</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats bar */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-cyan-500/20 p-3 rounded border border-cyan-500/50 text-center">
                  <div className="text-cyan-400 font-bold text-xl lg:text-2xl">106</div>
                  <div className="text-gray-400 text-sm">Pacchetti totali</div>
                </div>
                <div className="bg-green-500/20 p-3 rounded border border-green-500/50 text-center">
                  <div className="text-green-400 font-bold text-xl lg:text-2xl">~44</div>
                  <div className="text-gray-400 text-sm">In volo (window)</div>
                </div>
                <div className="bg-orange-500/20 p-3 rounded border border-orange-500/50 text-center">
                  <div className="text-orange-400 font-bold text-xl lg:text-2xl">~50ms</div>
                  <div className="text-gray-400 text-sm">RTT medio</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 13: // Appendix - Image Reconstruction
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl lg:text-6xl">🧩</span>
              <div className="flex-1">
                <h2 className="text-3xl lg:text-4xl font-bold text-green-400">Ricostruzione dell'Immagine</h2>
                <p className="text-lg lg:text-xl text-gray-400">TCP riordina i pacchetti e riassembla i dati</p>
              </div>
              <InfoButton onClick={() => setActiveInfo('reconstruction')} />
            </div>

            <InfoModal isOpen={activeInfo === 'reconstruction'} onClose={() => setActiveInfo(null)} title="Ricostruzione e Riordinamento">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl lg:text-2xl font-bold text-green-400 mb-3">🧩 Buffer di Riordinamento</h4>
                  <p className="mb-3">Il ricevente mantiene un buffer per gestire i pacchetti fuori ordine:</p>
                  <ul className="list-disc list-inside space-y-2 text-base lg:text-xl">
                    <li><strong>Receive Buffer:</strong> Area di memoria dove TCP accumula i dati ricevuti</li>
                    <li><strong>Sequence tracking:</strong> TCP sa quali byte ha già ricevuto e quali mancano</li>
                    <li><strong>Gap filling:</strong> Quando arriva un pacchetto "mancante", il buco viene riempito</li>
                    <li><strong>Consegna ordinata:</strong> I dati passano all'applicazione solo in ordine corretto</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl lg:text-2xl font-bold text-yellow-400 mb-3">⚠️ Pacchetti Persi</h4>
                  <p className="mb-3">Cosa succede se un pacchetto non arriva mai?</p>
                  <ul className="list-disc list-inside space-y-2 text-base lg:text-xl">
                    <li><strong>Timeout:</strong> Se l'ACK non arriva entro RTO, il mittente ritrasmette</li>
                    <li><strong>Fast Retransmit:</strong> 3 ACK duplicati → ritrasmissione immediata (senza timeout)</li>
                    <li><strong>SACK:</strong> Selective ACK indica esattamente quali segmenti mancano</li>
                  </ul>
                </div>

                <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/50">
                  <p className="text-green-300 text-base lg:text-xl">
                    <strong>💡 Affidabilità:</strong> Grazie a questi meccanismi, TCP garantisce che TUTTI i byte arrivino, nell'ordine corretto, senza duplicati. Per questo è usato per trasferire file e pagine web.
                  </p>
                </div>
              </div>
            </InfoModal>

            <div className="flex-1 grid grid-cols-2 gap-6">
              {/* Left: Reordering buffer */}
              <div className="bg-black/30 rounded-lg p-5 border border-yellow-500/30 flex flex-col">
                <h3 className="text-lg lg:text-xl font-bold text-yellow-400 mb-4">📋 BUFFER DI RICEZIONE</h3>

                <div className="flex-1 space-y-4">
                  <div className="text-sm text-gray-400 mb-2">Pacchetti arrivati (in ordine di arrivo):</div>

                  <div className="space-y-2">
                    {[
                      { time: 't+0ms', packets: [1], new: 1 },
                      { time: 't+12ms', packets: [1, null, 3], new: 3 },
                      { time: 't+18ms', packets: [1, 2, 3], new: 2 },
                      { time: 't+25ms', packets: [1, 2, 3, null, 5], new: 5 },
                      { time: 't+31ms', packets: [1, 2, 3, 4, 5], new: 4 },
                    ].map((row, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-black/30 p-2 rounded">
                        <span className="text-xs text-gray-500 w-16 font-mono">{row.time}</span>
                        <div className="flex gap-1">
                          {row.packets.map((p, i) => (
                            <div
                              key={i}
                              className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${
                                p === null
                                  ? 'border-2 border-dashed border-gray-600 text-gray-600'
                                  : p === row.new
                                    ? 'ring-2 ring-white text-black'
                                    : 'text-black'
                              }`}
                              style={p ? { backgroundColor: `hsl(${180 + p * 15}, 70%, 50%)` } : {}}
                            >
                              {p || '?'}
                            </div>
                          ))}
                        </div>
                        {row.new && (
                          <span className="text-green-400 text-xs">← arriva #{row.new}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-500/20 p-3 rounded border border-green-500/50 mt-4">
                    <div className="text-green-400 text-sm lg:text-base">
                      ✓ TCP riempie i "buchi" man mano che i pacchetti arrivano
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Progressive image reconstruction */}
              <div className="bg-black/30 rounded-lg p-5 border border-green-500/30 flex flex-col">
                <h3 className="text-lg lg:text-xl font-bold text-green-400 mb-4">🖼️ IMMAGINE RICOSTRUITA</h3>

                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  {/* Progressive loading simulation */}
                  <div className="relative w-48 h-48 lg:w-56 lg:h-56 rounded-lg overflow-hidden border-2 border-green-500/50">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-6xl">🏞️</span>
                    </div>
                    {/* Simulated loading overlay */}
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gray-900/90 flex items-center justify-center transition-all duration-1000"
                      style={{ height: '20%' }}
                    >
                      <div className="text-gray-400 text-xs">Caricamento...</div>
                    </div>
                  </div>

                  <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-500"
                      style={{ width: '80%' }}
                    />
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">85/106 pacchetti</div>
                    <div className="text-gray-400">~80% completato</div>
                  </div>

                  <div className="w-full grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-cyan-500/20 p-2 rounded text-center">
                      <div className="text-cyan-400 font-bold">124 KB</div>
                      <div className="text-gray-400 text-xs">Ricevuti</div>
                    </div>
                    <div className="bg-orange-500/20 p-2 rounded text-center">
                      <div className="text-orange-400 font-bold">26 KB</div>
                      <div className="text-gray-400 text-xs">Mancanti</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 14: // Appendix - Technical Summary
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl lg:text-6xl">📊</span>
              <div className="flex-1">
                <h2 className="text-3xl lg:text-4xl font-bold text-purple-400">Riepilogo: Affidabilità TCP</h2>
                <p className="text-lg lg:text-xl text-gray-400">Meccanismi che garantiscono la consegna completa</p>
              </div>
              <InfoButton onClick={() => setActiveInfo('tcp-reliability')} />
            </div>

            <InfoModal isOpen={activeInfo === 'tcp-reliability'} onClose={() => setActiveInfo(null)} title="TCP vs UDP">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl lg:text-2xl font-bold text-purple-400 mb-3">🔄 TCP (Transmission Control Protocol)</h4>
                  <ul className="list-disc list-inside space-y-2 text-base lg:text-xl">
                    <li><strong>Connection-oriented:</strong> Handshake a 3 vie prima di trasmettere</li>
                    <li><strong>Affidabile:</strong> Garantisce consegna, ordine, no duplicati</li>
                    <li><strong>Flow control:</strong> Adatta la velocità al ricevente</li>
                    <li><strong>Congestion control:</strong> Rallenta se la rete è congestionata</li>
                    <li><strong>Uso:</strong> HTTP, HTTPS, FTP, SMTP, SSH</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl lg:text-2xl font-bold text-cyan-400 mb-3">📡 UDP (User Datagram Protocol)</h4>
                  <ul className="list-disc list-inside space-y-2 text-base lg:text-xl">
                    <li><strong>Connectionless:</strong> Nessun handshake, invia subito</li>
                    <li><strong>Best-effort:</strong> Nessuna garanzia di consegna o ordine</li>
                    <li><strong>Veloce:</strong> Meno overhead, latenza minima</li>
                    <li><strong>Uso:</strong> Streaming video/audio, gaming online, DNS, VoIP</li>
                  </ul>
                </div>

                <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/50">
                  <p className="text-purple-300 text-base lg:text-xl">
                    <strong>💡 Scelta:</strong> WhatsApp usa TCP per i messaggi (devono arrivare tutti) ma potrebbe usare UDP per le chiamate vocali (meglio perdere qualche frame che avere ritardo).
                  </p>
                </div>
              </div>
            </InfoModal>

            <div className="flex-1 grid grid-cols-2 gap-6">
              {/* Left: TCP Mechanisms */}
              <div className="bg-black/30 rounded-lg p-5 border border-purple-500/30 flex flex-col">
                <h3 className="text-lg lg:text-xl font-bold text-purple-400 mb-4">🔧 MECCANISMI TCP</h3>

                <div className="space-y-4 flex-1">
                  <div className="bg-purple-500/10 p-4 rounded">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📊</span>
                      <span className="font-bold text-purple-300 text-lg">Sliding Window</span>
                    </div>
                    <p className="text-gray-400 text-sm lg:text-base">
                      Permette di inviare più pacchetti senza attendere ACK, massimizzando il throughput.
                    </p>
                  </div>

                  <div className="bg-green-500/10 p-4 rounded">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">✅</span>
                      <span className="font-bold text-green-300 text-lg">ACK Cumulativi</span>
                    </div>
                    <p className="text-gray-400 text-sm lg:text-base">
                      Un singolo ACK conferma tutti i byte fino a quel punto, riducendo il traffico.
                    </p>
                  </div>

                  <div className="bg-orange-500/10 p-4 rounded">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">⚡</span>
                      <span className="font-bold text-orange-300 text-lg">Fast Retransmit</span>
                    </div>
                    <p className="text-gray-400 text-sm lg:text-base">
                      3 ACK duplicati = pacchetto perso → ritrasmissione immediata senza timeout.
                    </p>
                  </div>

                  <div className="bg-cyan-500/10 p-4 rounded">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🎯</span>
                      <span className="font-bold text-cyan-300 text-lg">SACK (Selective ACK)</span>
                    </div>
                    <p className="text-gray-400 text-sm lg:text-base">
                      Indica esattamente quali segmenti sono arrivati, evitando ritrasmissioni inutili.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: TCP vs UDP comparison */}
              <div className="bg-black/30 rounded-lg p-5 border border-cyan-500/30 flex flex-col">
                <h3 className="text-lg lg:text-xl font-bold text-cyan-400 mb-4">⚖️ TCP vs UDP</h3>

                <div className="flex-1">
                  <table className="w-full text-sm lg:text-base">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 text-gray-400">Caratteristica</th>
                        <th className="text-center py-2 text-purple-400">TCP</th>
                        <th className="text-center py-2 text-cyan-400">UDP</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-800">
                        <td className="py-2 text-gray-300">Connessione</td>
                        <td className="text-center text-purple-300">Sì (3-way)</td>
                        <td className="text-center text-cyan-300">No</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-2 text-gray-300">Affidabilità</td>
                        <td className="text-center text-green-400">✓ Garantita</td>
                        <td className="text-center text-red-400">✗ Best-effort</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-2 text-gray-300">Ordine</td>
                        <td className="text-center text-green-400">✓ Preservato</td>
                        <td className="text-center text-red-400">✗ Non garantito</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-2 text-gray-300">Overhead</td>
                        <td className="text-center text-orange-400">20+ byte</td>
                        <td className="text-center text-green-400">8 byte</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-2 text-gray-300">Latenza</td>
                        <td className="text-center text-orange-400">Maggiore</td>
                        <td className="text-center text-green-400">Minima</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-300">Uso tipico</td>
                        <td className="text-center text-purple-300 text-xs">Web, Email, File</td>
                        <td className="text-center text-cyan-300 text-xs">Stream, Gaming, VoIP</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded border border-purple-500/30">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white mb-1">WhatsApp Web usa TCP</div>
                      <div className="text-gray-400 text-sm">Perché ogni messaggio deve arrivare integro!</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 15: // End
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-9xl mb-8">🎓</div>
            <h1 className="text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Fine della Simulazione
            </h1>

            <div className="max-w-3xl text-gray-400 mb-10 text-xl lg:text-2xl">
              <p className="mb-6">
                Abbiamo seguito il messaggio "ciao" attraverso tutti i 7 livelli ISO/OSI,
                dalla digitazione sul telefono alla visualizzazione sul PC.
              </p>
              <p>
                Ogni livello ha aggiunto il proprio contributo: crittografia, affidabilità,
                routing, e trasmissione fisica.
              </p>
            </div>

            <div className="flex gap-4 flex-wrap justify-center">
              {['Crittografia E2E', 'TCP/IP', 'WebSocket', 'WiFi/Ethernet', 'NAT', 'Routing', 'Segmentazione'].map(topic => (
                <span key={topic} className="px-5 py-2 bg-cyan-500/20 border border-cyan-500 rounded-full text-cyan-400 text-lg lg:text-xl">
                  {topic}
                </span>
              ))}
            </div>

            <div className="mt-16 text-lg lg:text-xl text-gray-500">
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
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {renderSlide()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-3 text-lg"
          >
            <span>←</span> Indietro
          </button>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-4 py-2 rounded-lg text-base ${autoPlay ? 'bg-green-500 text-black' : 'bg-gray-800'}`}
            >
              {autoPlay ? '⏸ Pausa' : '▶ Auto'}
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentSlide
                      ? 'bg-cyan-400 scale-125'
                      : idx < currentSlide
                        ? 'bg-purple-500'
                        : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>

            <span className="text-base text-gray-500">
              {currentSlide + 1} / {totalSlides}
            </span>
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="px-6 py-3 bg-cyan-600 rounded-lg hover:bg-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-3 text-lg"
          >
            Avanti <span>→</span>
          </button>
        </div>
      </div>

      {/* Keyboard navigation hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm text-gray-600">
        Usa ← → per navigare | Spazio per avanzare
      </div>
    </div>
  );
}
