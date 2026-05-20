import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, Download, Image as ImageIcon, FileText, AlertTriangle, Sun, Moon } from 'lucide-react';
import { generateAscii, exportAsPng, charSets } from './utils/ascii';

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [asciiArt, setAsciiArt] = useState('');

  // Settings
  const [charSet, setCharSet] = useState('standard');
  const [customCharSet, setCustomCharSet] = useState('░▒▓█');
  const [phraseText, setPhraseText] = useState('PHRASE');
  const [invert, setInvert] = useState(false);
  const [charColors, setCharColors] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [textColor, setTextColor] = useState('#1800ff');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [resolution, setResolution] = useState(100);
  const [zoomLevel, setZoomLevel] = useState(1);

  // UI States
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [badgeText, setBadgeText] = useState('261207');

  const fileInputRef = useRef(null);

  const processImage = useCallback(async () => {
    if (!imageUrl) return;
    setIsProcessing(true);
    try {
      const ascii = await generateAscii(imageUrl, {
        width: resolution,
        charSet: charSet,
        customChars: charSet === 'custom' ? customCharSet : null,
        phraseText: phraseText,
        invert: invert
      });
      setAsciiArt(ascii);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [imageUrl, resolution, charSet, customCharSet, phraseText, invert]);

  useEffect(() => {
    if (imageUrl) {
      const timer = setTimeout(() => {
        processImage();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [imageUrl, processImage]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const downloadText = () => {
    if (!asciiArt) return;
    const blob = new Blob([asciiArt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ascii-art.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPng = async () => {
    if (!asciiArt) return;
    try {
      const dataUrl = await exportAsPng(asciiArt, {
        textColor,
        bgColor,
        fontSize: 12,
        charColors
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'ascii-art.png';
      a.click();
    } catch (err) {
      console.error(err);
    }
  };

  const renderAscii = () => {
    if (!asciiArt) return null;
    if (!charColors) return asciiArt;

    const colorMap = {};
    charColors.split(',').forEach(pair => {
      if (!pair.includes(':')) return;
      const [char, color] = pair.split(':').map(s => s.trim());
      if (char && color) {
        colorMap[char] = color;
      }
    });

    if (Object.keys(colorMap).length === 0) return asciiArt;

    let html = '';
    // Use simple string replacement to avoid huge DOM trees where possible
    // Actually, iterating chars is safest for raw text
    for (let i = 0; i < asciiArt.length; i++) {
      const char = asciiArt[i];
      if (colorMap[char] && char !== '\n' && char !== ' ') {
        html += `<span style="color: ${colorMap[char]}">${char === '<' ? '&lt;' : char === '>' ? '&gt;' : char}</span>`;
      } else {
        html += char === '<' ? '&lt;' : char === '>' ? '&gt;' : char;
      }
    }
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="app-container">

      <div className="top-meta">
        <span>ASCII™ GEN+/001</span>
        <span>NEO METHOD™</span>
      </div>

      <header className="header">
        <h1>ASCII™ GEN+</h1>
      </header>

      <div className="sub-header">
        <span>ASCII™ GEN+ — FOR WEB</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <AlertTriangle size={14} /> OUTPUT IS COMPLETELY BASED ON UPLOADED IMAGE
        </span>
      </div>

      <main className="main-content">
        <aside className="panel settings-panel">

          <div className="blue-block-container">
            <div className="blue-block-title">
              ASCII<br />GEN+
            </div>

            {!imageUrl ? (
              <div
                className={`upload-zone ${isDragging ? 'drag-active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="upload-icon" />
                <p className="upload-text">
                  Drag & Drop <br />or <span>Click Here</span>
                </p>
                <input
                  type="file"
                  className="hidden-input"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFile(e.target.files[0]);
                  }}
                />
              </div>
            ) : (
              <div
                className="upload-zone"
                style={{ padding: '1rem', cursor: 'pointer', flexDirection: 'row' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="upload-icon" style={{ width: 20, height: 20 }} />
                <span className="upload-text" style={{ fontSize: '0.85rem' }}>Change Image</span>
                <input
                  type="file"
                  className="hidden-input"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFile(e.target.files[0]);
                  }}
                />
              </div>
            )}
          </div>

          <div className="settings-group">
            <div className="setting-item">
              <label>Character Set</label>
              <select value={charSet} onChange={e => setCharSet(e.target.value)} disabled={!imageUrl}>
                <option value="standard">Standard</option>
                <option value="simple">Simple</option>
                <option value="blocks">Blocks</option>
                <option value="binary">Binary</option>
                <option value="custom">Custom</option>
                <option value="phrase">Phrase</option>
              </select>
              {charSet !== 'custom' && charSet !== 'phrase' && charSets[charSet] && (
                <div style={{ fontSize: '0.65rem', fontWeight: 500, color: '#000', opacity: 0.6, marginTop: '0.25rem', wordBreak: 'break-all', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.2 }}>
                  {charSets[charSet]}
                </div>
              )}
              {charSet === 'custom' && (
                <input
                  type="text"
                  value={customCharSet}
                  onChange={e => setCustomCharSet(e.target.value)}
                  className="hex-input"
                  style={{ width: '100%', marginTop: '0.5rem', textAlign: 'left', textTransform: 'none' }}
                  spellCheck="false"
                  disabled={!imageUrl}
                  placeholder="Enter characters (dark to light)"
                />
              )}
              {charSet === 'phrase' && (
                <input
                  type="text"
                  value={phraseText}
                  onChange={e => setPhraseText(e.target.value)}
                  className="hex-input"
                  style={{ width: '100%', marginTop: '0.5rem', textAlign: 'left', textTransform: 'none' }}
                  spellCheck="false"
                  disabled={!imageUrl}
                  placeholder="Enter phrase"
                />
              )}
            </div>

            <div className="setting-item">
              <div className="range-header">
                <label>Resolution</label>
                <div className="range-input-wrapper">
                  <input
                    type="number"
                    min="1"
                    max="2000"
                    value={resolution}
                    onChange={e => setResolution(Number(e.target.value))}
                    disabled={!imageUrl}
                    className="range-number-input"
                  />
                  <span className="range-value-unit">px</span>
                </div>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                value={resolution}
                onChange={e => setResolution(Number(e.target.value))}
                disabled={!imageUrl}
              />
            </div>

            <div className="setting-item">
              <div className="range-header">
                <label>Zoom</label>
                <span className="range-value">{zoomLevel.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={zoomLevel}
                onChange={e => setZoomLevel(Number(e.target.value))}
                disabled={!imageUrl}
              />
            </div>

            <div className="setting-item">
              <label>Colors</label>
              <div className="color-pickers">
                <label className="color-picker-wrap">
                  <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} disabled={!imageUrl} />
                  <input type="text" className="hex-input" value={textColor} onChange={e => setTextColor(e.target.value)} disabled={!imageUrl} spellCheck="false" />
                  <span>Text</span>
                </label>
                <label className="color-picker-wrap">
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} disabled={!imageUrl} />
                  <input type="text" className="hex-input" value={bgColor} onChange={e => setBgColor(e.target.value)} disabled={!imageUrl} spellCheck="false" />
                  <span>BG</span>
                </label>
              </div>
            </div>

            <div className="setting-item" style={{ borderBottom: 'none' }}>
              <div
                className="range-header"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <label style={{ cursor: 'pointer' }}>Advanced Options</label>
                <span className="range-value" style={{ fontSize: '1rem', padding: '0.1rem 0.3rem' }}>{showAdvanced ? '[-]' : '[+]'}</span>
              </div>

              {showAdvanced && (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', textTransform: 'uppercase', fontWeight: 900, fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={invert}
                      onChange={e => setInvert(e.target.checked)}
                      disabled={!imageUrl}
                      style={{ width: '18px', height: '18px', accentColor: '#1800ff', cursor: 'pointer' }}
                    />
                    Invert Contrast
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Char Colors (char:hex)</label>
                    <input
                      type="text"
                      value={charColors}
                      onChange={e => setCharColors(e.target.value)}
                      className="hex-input"
                      style={{ width: '100%', textAlign: 'left', textTransform: 'none' }}
                      spellCheck="false"
                      disabled={!imageUrl}
                      placeholder="e.g. N:#ff0000, I:#00ff00"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="action-buttons">
              <button
                className="btn btn-secondary"
                onClick={downloadText}
                disabled={!asciiArt}
              >
                <FileText size={16} /> TXT
              </button>
              <button
                className="btn btn-primary"
                onClick={downloadPng}
                disabled={!asciiArt}
              >
                <Download size={16} /> PNG
              </button>
            </div>
          </div>
        </aside>

        <section className="panel preview-container">
          <div className="preview-header">
            <div className="preview-title">OUTPUT //</div>
            <input
              type="text"
              className="preview-title"
              style={{
                fontWeight: 500,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                textAlign: 'right',
                width: '120px',
                color: 'inherit',
                fontFamily: 'inherit',
                padding: 0
              }}
              value={badgeText}
              onChange={e => setBadgeText(e.target.value)}
              spellCheck="false"
            />
          </div>
          <div className="preview-box" style={{ backgroundColor: bgColor }}>
            {!imageUrl ? (
              <div className="empty-state">
                <ImageIcon size={48} />
                <p>WAITING</p>
              </div>
            ) : isProcessing && !asciiArt ? (
              <div className="empty-state">
                <p>RUNNING...</p>
              </div>
            ) : (
              <div
                className="ascii-output"
                style={{
                  color: textColor,
                  fontSize: resolution > 400 ? '1px' : resolution > 300 ? '2px' : resolution > 200 ? '3px' : resolution > 120 ? '4px' : resolution > 80 ? '6px' : '8px',
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.1s ease-out',
                  transformOrigin: 'center top'
                }}
              >
                {renderAscii()}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
