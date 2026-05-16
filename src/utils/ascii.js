export const charSets = {
  standard: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
  simple: "@%#*+=-:. ",
  blocks: "█▓▒░ ",
  binary: "10 "
};

export const generateAscii = (imageUrl, options) => {
  return new Promise((resolve, reject) => {
    const { width = 100, charSet = 'standard', customChars = null, phraseText = '', invert = false } = options;
    
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const aspect = img.height / img.width;
      // Multiply height by roughly 0.55 to account for font aspect ratio
      const height = Math.floor(width * aspect * 0.55);
      
      if (width === 0 || height === 0) {
        reject(new Error("Invalid image dimensions"));
        return;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      try {
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        
        const chars = customChars && customChars.length > 0 ? customChars : (charSets[charSet] || charSets.standard);
        const charLen = chars.length;
        
        let asciiText = '';
        let phraseIndex = 0;
        const actualPhrase = (phraseText && !phraseText.endsWith(' ')) ? phraseText + ' ' : phraseText;
        
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const offset = (y * width + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const a = data[offset + 3];
            
            if (a < 128) { // transparent
              asciiText += ' ';
              continue;
            }
            
            const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            
            if (charSet === 'phrase' && actualPhrase && actualPhrase.length > 0) {
              const drawCondition = invert ? luminance >= 200 : luminance < 200;
              if (drawCondition) {
                asciiText += actualPhrase[phraseIndex % actualPhrase.length];
                phraseIndex++;
              } else {
                asciiText += ' ';
              }
            } else {
              // Map luminance (0-255) to character index
              // Assuming first char is dense (black) and last is light (white)
              let charIndex = Math.floor((luminance / 255) * (charLen - 1));
              if (invert) {
                charIndex = (charLen - 1) - charIndex;
              }
              asciiText += chars[charIndex];
            }
          }
          asciiText += '\n';
        }
        
        resolve(asciiText);
      } catch (err) {
        reject(err);
      }
    };
    
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });
};

export const exportAsPng = (asciiText, options) => {
  return new Promise((resolve) => {
    const { 
      textColor = '#f8fafc', 
      bgColor = '#000000',
      fontSize = 12,
      charColors = ''
    } = options;

    const colorMap = {};
    if (charColors) {
      charColors.split(',').forEach(pair => {
        if (!pair.includes(':')) return;
        const [char, color] = pair.split(':').map(s => s.trim());
        if (char && color) colorMap[char] = color;
      });
    }

    const lines = asciiText.split('\n');
    // Remove last empty line if exists
    if (lines[lines.length - 1] === '') lines.pop();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set font to measure text width accurately
    ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
    
    // Calculate canvas size
    const maxLineLen = Math.max(...lines.map(l => l.length));
    const textWidth = ctx.measureText('M'.repeat(maxLineLen)).width;
    // JetBrains Mono aspect ratio varies, but standard monospace width is generally ~0.6 * height
    
    const width = maxLineLen * (fontSize * 0.6); // Approximate width
    const height = lines.length * fontSize * 1.2; // Line height 1.2

    canvas.width = Math.max(width, 1);
    canvas.height = Math.max(height, 1);

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
    ctx.textBaseline = 'top';

    const hasColorMap = Object.keys(colorMap).length > 0;
    const charWidth = ctx.measureText('M').width;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (hasColorMap) {
        let currentX = 0;
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          ctx.fillStyle = colorMap[char] || textColor;
          ctx.fillText(char, currentX, i * (fontSize * 1.2));
          currentX += charWidth;
        }
      } else {
        ctx.fillStyle = textColor;
        ctx.fillText(line, 0, i * (fontSize * 1.2));
      }
    }

    resolve(canvas.toDataURL('image/png'));
  });
};
