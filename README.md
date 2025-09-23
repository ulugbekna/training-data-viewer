# Training Data Viewer - TypeScript Version

A modern, type-safe web application for viewing training data conversations with System, User, and Assistant messages, completely rewritten in TypeScript with a modular architecture.

## 🚀 Features

- **TypeScript Implementation**: Full type safety with comprehensive interfaces and strict compilation
- **Modular Architecture**: Clean separation of concerns with dedicated modules for each functionality
- **File Format Support**: Both JSON arrays and JSONL (line-delimited JSON) files
- **Language Detection**: Automatic programming language detection from file paths
- **Advanced Filtering**: Filter conversations by programming language or view all
- **Smart Pagination**: Configurable items per page with navigation controls
- **Tag Highlighting**: Visual highlighting of special tags in content with color coding
- **Language Statistics**: Sidebar showing language distribution with clickable filters
- **Responsive Design**: Clean, modern UI with proper accessibility

## 📁 Project Structure

```
src/
├── script.ts                 # Main application entry point
├── types.ts                  # TypeScript type definitions
├── modules/
│   ├── DataManager.ts        # Data loading and processing
│   ├── UIRenderer.ts         # DOM manipulation and rendering
│   ├── FilterManager.ts      # Data filtering logic
│   ├── PaginationManager.ts  # Pagination functionality
│   └── TagHighlighter.ts     # Tag detection and highlighting
├── index.html               # HTML template
├── styles.css               # Application styles
└── *.jsonl                  # Sample data files

dist/                        # Compiled JavaScript output
├── script.js               # Compiled main application
├── modules/                # Compiled modules
├── *.d.ts                  # Generated type declarations
└── *.js.map               # Source maps for debugging
```

## 🏗️ Architecture

### Core Components

1. **TrainingDataViewer**: Main application class orchestrating all modules
2. **DataManager**: Handles file processing, language detection, and data statistics
3. **UIRenderer**: Manages all DOM manipulation and user interface rendering
4. **FilterManager**: Implements filtering logic for conversations by language
5. **PaginationManager**: Handles data pagination and page calculations
6. **TagHighlighter**: Detects and highlights special tags with color coding

### Type System

- **Message**: Individual message structure with role and content
- **Conversation**: Collection of messages
- **TrainingData**: Array of conversations
- **FilterType**: Union type for available filters
- **PaginationConfig**: Pagination state and configuration
- **LanguageStats**: Language occurrence statistics
- **UIElements**: DOM element references with proper typing

## 🛠️ Development

### Prerequisites

- Node.js (v14 or higher)
- npm

### Setup

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start development server
npm run dev

# Build and serve production
npm start
```

### Available Scripts

- `npm run build`: Compile TypeScript to JavaScript
- `npm run build:watch`: Watch mode compilation
- `npm start`: Build and serve the application
- `npm run dev`: Development mode with watch compilation
- `npm run serve`: Serve the built application

### TypeScript Configuration

The project uses strict TypeScript settings:
- Strict null checks and type checking
- ES2020 target with ES modules
- Source maps for debugging
- Declaration files generation
- Comprehensive compiler options for type safety

## 📝 Usage

1. **Load Data**: 
   - Click "Load Sample Data" for demo data
   - Or upload your own JSON/JSONL files

2. **Filter Content**:
   - Use the sidebar language statistics (clickable)
   - Use the dropdown filter in the main area

3. **Navigate Data**:
   - Use pagination controls at top and bottom
   - Adjust items per page as needed

4. **View Details**:
   - Each conversation shows all messages with role-based styling
   - Special tags are highlighted with colors
   - Language statistics update based on current filter

## 🔧 File Formats

### JSON Array Format
```json
[
  {
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user", 
        "content": "Hello, can you help me?"
      },
      {
        "role": "assistant",
        "content": "Of course! What can I help you with?"
      }
    ]
  }
]
```

### JSONL Format
Each line contains a separate conversation object:
```jsonl
{"messages": [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}
{"messages": [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}
```

## 🎨 Features Detail

### Language Detection
Automatically detects programming languages from file path patterns in user messages:
- Supports 20+ programming languages
- File extension mapping to language names
- Handles complex paths with fragments

### Tag Highlighting
Detects and highlights special tags with format `<|tag_name|>`:
- Consistent color assignment per tag type
- Supports opening/closing tag pairs
- 20 predefined highlight colors

### Smart Filtering
- Filter by specific programming language
- "All Languages" view
- Real-time statistics updates
- Maintains pagination state across filters

## 🚀 Production Deployment

The application compiles to standard ES modules and can be deployed to any static hosting service:

1. Run `npm run build`
2. Deploy the `dist/` directory
3. Ensure your server serves ES modules with proper MIME types

## 🔄 Migration from JavaScript

This TypeScript version provides:
- **100% type safety** with comprehensive interfaces
- **Modular architecture** replacing the monolithic script
- **Better error handling** with compile-time checks
- **Enhanced maintainability** with clear separation of concerns
- **Development productivity** with IntelliSense and refactoring support
- **Runtime reliability** with strict type checking

The application maintains complete compatibility with existing data formats while providing a modern, scalable codebase.

## Sample Data
The repository includes several sample data files:
- `sample.jsonl` - Basic conversation examples
- `code-sample.jsonl` - Programming-related conversations
- `language-sample.jsonl` - Multi-language programming examples
- `notebook-sample.jsonl` - Jupyter notebook conversations
- `large-sample.jsonl` - Larger dataset for testing pagination

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Ensure `npm run build` passes without errors
5. Submit a pull request

---

**Built with TypeScript ❤️ for type safety and developer experience**

## Usage

1. Install dependencies:

   ```
   npm install
   ```

2. Run the application:

   ```
   npm start
   ```
   or
   ```
   npm run dev
   ```

3. Either:
   - Click "Load Sample Data" to view example conversations
   - Select a JSON or JSONL file using the file input to load your own data

4. Use pagination controls to navigate through conversations:
   - Click "Previous" or "Next" buttons to move between pages
   - Use the dropdown to change the number of conversations displayed per page

5. Filter conversations by programming language:
   - Use the language filter dropdown to select a specific language
   - Only conversations with user messages containing files of that language will be displayed
   - The filter is based on the file extension in `current_file_path: <path>` patterns in user messages

6. View language statistics:
   - The left sidebar shows statistics for all languages detected in the dataset
   - Each language is displayed with its count of conversations
   - Statistics update automatically when loading new data

## Code Block Rendering

Messages containing code blocks (wrapped in triple backticks ```) will be rendered with special formatting:
- Code blocks are displayed in a monospace font with syntax highlighting-like styling
- Code blocks are contained within a bordered box with background color for better visibility
- Regular text and code blocks are properly separated in the display

## Language Detection

The application automatically detects programming languages from user messages that contain:
```
current_file_path: <file-path>
```

It extracts the file extension and maps it to a language name for filtering purposes. The application now also handles file paths with fragments (e.g., `project_1.ipynb#W1sZmlsZQ==`) by extracting the extension from the file name before the fragment identifier.

Currently supported languages:
- JavaScript
- TypeScript
- Python
- Java
- C++
- C
- C#
- PHP
- Ruby
- Go
- Rust
- Swift
- Kotlin
- HTML
- CSS
- SCSS
- JSON
- XML
- Markdown
- SQL
- Shell
- YAML
- Jupyter Notebook (.ipynb)

## Development

- HTML for structure
- CSS for styling
- JavaScript for functionality
