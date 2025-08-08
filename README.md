# Scholar

A Chrome extension that helps you track your progress when reading docs

## Development

### Prerequisites

- Node.js (v18 or higher)
- Yarn package manager

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Build the extension:
   ```bash
   yarn build
   ```
4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from this project

### Development Commands

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn format` - Format code with Prettier

## Permissions

The extension requires the following permissions:

- `storage` - To save your learning progress
- `tabs` - To track and manage tabs
- `activeTab` - To interact with the current tab

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `yarn format` to format your code
5. Submit a pull request

## Releasing

```bash
zip -r scholar.zip 'dist/**'
```
