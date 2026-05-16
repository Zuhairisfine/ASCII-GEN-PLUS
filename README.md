# ASCII™ GEN+

<div align="center">
  <h3>A Swiss Design / Corporate Brutalism Inspired ASCII Art Generator</h3>
  <p>Transform your images into highly customizable, technical ASCII art right in the browser.</p>
</div>

---

## 👁️ Overview

**ASCII™ GEN+** (or *ASCII™ CONCEPT PIECE/001*) is a web-based utility that turns standard images into stunning ASCII art. Built with React and Vite, the application features a striking, high-contrast UI inspired by Swiss typographic design and neo-brutalism. It operates entirely on the client side, utilizing HTML5 Canvas to parse image luminance and render text efficiently.

## ✨ Features

- **Image-to-ASCII Conversion**: Accurately maps the luminance of image pixels to different character densities.
- **Multiple Character Sets**: Choose between Standard, Simple, Blocks, or Binary.
- **Custom Character Maps**: Define your own sequence of characters (from dark to light) to be used in the generation.
- **Phrase Mode (Experimental)**: Instead of mapping luminance to different characters, the generator paints the dark areas of your image using a repeating phrase of your choice (e.g., repeating "NIKE AIR " over and over).
- **Advanced Coloring**:
  - Global Text & Background color pickers via native color inputs or exact HEX codes.
  - **Invert Contrast**: Flip the density mapping or rendering logic.
  - **Per-Character Color Mapping**: Map specific characters to specific HEX codes (e.g., `N:#ff0000, I:#00ff00`) to create multi-colored typographic art.
- **Zoom & Resolution Controls**: Dial in the exact width (up to 2000px resolution scaling via inputs) and zoom in (up to 5x) to inspect the fine typographic details.
- **Export Options**: 
  - `TXT`: Download the raw text file of your ASCII art.
  - `PNG`: Generate and download a perfectly scaled, high-quality image of the colored ASCII grid using an off-screen canvas renderer.

## 🛠️ Technologies Used

- **React 18** (UI & State Management)
- **Vite** (Build Tool & Dev Server)
- **Vanilla CSS** (Custom CSS Variables, CSS Grid, Flexbox)
- **Lucide React** (SVG Iconography)
- **HTML5 Canvas API** (Image data parsing & PNG generation)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ascii-art-generator.git
   cd ascii-art-generator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173/`).

## 🎨 Design System

The frontend abandons traditional rounded corners and soft drop shadows in favor of a **Corporate Brutalist / Swiss** aesthetic. Key elements include:
- A stark, high-contrast palette (Black, White, Silver `#d6d6d6`, and Electric Blue `#1800ff`).
- Strict grid layouts and heavy use of `2px solid #000` horizontal rules.
- Bold, tightly-kerned uppercase typography (utilizing `Inter` and `Helvetica Neue`).
- Conceptual "poster-style" annotations embedded into the UI.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License
This project is open source and available under the [MIT License](LICENSE).
