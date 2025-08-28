# Lighting Room - Three.js

A professional 3D lighting visualization tool built with Three.js featuring modular architecture, BEM CSS methodology, and comprehensive camera controls.

## Features

### 🎯 Precise Lighting Control
- **Fine Light Positioning**: 0.1% increments for precise light placement
- **Arc-based System**: Position lights along customizable arcs
- **Multiple Light Types**: Ambient, directional, and point lights
- **Real-time Visualization**: See lighting changes instantly

### 📷 Advanced Camera Controls
- **Orbit Mode**: Rotate camera around room center
- **Pan Mode**: Move camera in viewing plane
- **Enable/Disable Toggle**: Prevent accidental camera movement
- **Reset Position**: Return to default view

### 💾 Room Management
- **Save/Load Rooms**: Store and recall lighting configurations
- **Reset to Defaults**: Quick return to initial settings
- **Local Storage**: Persistent room configurations

### 🏗️ Professional Architecture
- **Modular JavaScript**: Feature-based file organization
- **BEM CSS Methodology**: Scalable, maintainable styling
- **Code Standards**: ESLint + Stylelint enforcement
- **Modern ES Modules**: Clean import/export structure

## Project Structure

```
lighting-room/
├── js/
│   ├── main.js              # Entry point, scene initialization
│   ├── scene/
│   │   ├── room.js          # Room geometry creation
│   │   ├── lighting.js      # Light system management
│   │   └── camera.js        # Camera controls & modes
│   ├── controls/
│   │   ├── ui-controls.js   # UI event handlers
│   │   ├── camera-controls.js # Camera UI setup
│   │   └── draggable.js     # Panel dragging
│   ├── features/
│   │   ├── arc-system.js    # Arc positioning system
│   │   └── save-load.js     # Room persistence
│   └── utils/
│       └── defaults.js      # Default values
├── css/
│   ├── main.css             # Base styles, BEM blocks
│   ├── layout/
│   │   ├── canvas.css       # Canvas styling
│   │   └── panels.css       # Panel positioning
│   ├── components/
│   │   ├── controls.css     # Control sections
│   │   ├── sliders.css      # Input styling
│   │   ├── buttons.css      # Button variants
│   │   └── dropdowns.css    # Saved rooms list
│   └── themes/
│       └── dark.css         # Dark theme
└── index.html               # BEM-structured HTML
```

## Getting Started

### Prerequisites
- Node.js (v18.16.0 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/[username]/lighting-room.git
cd lighting-room
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5174`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint JavaScript files
- `npm run lint:fix` - Fix JavaScript linting issues
- `npm run lint:css` - Lint CSS files
- `npm run lint:css:fix` - Fix CSS linting issues
- `npm run format` - Format all files with Prettier
- `npm run lint:all` - Run all linting checks

### Code Standards

This project enforces strict code standards:

- **JavaScript**: ESLint with 4-space indentation, single quotes
- **CSS**: Stylelint with BEM methodology enforcement
- **Formatting**: Prettier for consistent code formatting

### BEM Methodology

CSS follows BEM (Block Element Modifier) naming convention:

- **Blocks**: `.lr-controls`, `.lr-canvas`, `.lr-btn`
- **Elements**: `.lr-controls__title`, `.lr-control-group__label`
- **Modifiers**: `.lr-btn--primary`, `.lr-canvas--disabled`

## Usage

### Basic Controls

1. **Light Position**: Use the slider for precise light positioning (0.1% increments)
2. **Arc Configuration**: Adjust arc length, center position, and rotation
3. **Light Intensity**: Control ambient, directional, and point light intensities
4. **Camera Movement**: 
   - Enable/disable camera controls
   - Switch between orbit and pan modes
   - Reset camera to default position

### Saving Rooms

1. Configure your desired lighting setup
2. Enter a room name in the text field
3. Click "Save Current Room"
4. Load saved rooms by clicking their names
5. Delete rooms using the delete button

## Technology Stack

- **Three.js**: 3D graphics and rendering
- **Vite**: Build tool and development server
- **ESLint**: JavaScript linting
- **Stylelint**: CSS linting with BEM enforcement
- **Prettier**: Code formatting

## Contributing

1. Follow the established code standards
2. Use BEM methodology for CSS
3. Maintain modular JavaScript architecture
4. Run linting before committing: `npm run lint:all`

## License

MIT License
