# Scholar

A Chrome extension that helps you track your learning progress on documentation
websites. Perfect for developers who want to keep track of their progress while
reading through documentation like Playwright, VSCode docs, or any other
technical documentation.

## Features

- **Add Documentation Sites**: Easily add any documentation website to your
  learning list
- **Track Progress**: Automatically tracks the latest page you've visited on
  each site
- **Continue Learning**: One-click access to continue where you left off
- **Clean Interface**: Modern, intuitive UI built with React and Shadcn UI
- **Persistent Storage**: Your progress is saved locally and persists between
  sessions

## Workflow

1. **Add a Site**: Open the extension and add a URL (e.g.,
   https://playwright.dev/)
2. **Start Learning**: Click "Continue Learning" to open the site in a new tab
3. **Track Progress**: The extension automatically tracks your navigation within
   the site
4. **Close When Done**: Simply close the tab when you're finished for the day

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

### Project Structure

```
src/
├── popup/           # Extension popup UI
├── background/      # Background script for tab tracking
├── content/         # Content scripts (future enhancements)
├── components/      # Reusable UI components
├── lib/            # Utility functions
└── types/          # TypeScript type definitions
```

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Chrome Extension APIs** - Browser integration

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

## License

MIT License - feel free to use this project for your own learning tracker!
