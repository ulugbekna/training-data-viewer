# Training Data Viewer

A simple web application for viewing training data conversations with System, User, and Assistant messages.

## Features

- Load JSON files containing conversation data
- Display conversations with distinct styling for each message role:
  - System messages (blue)
  - User messages (green)
  - Assistant messages (purple)
- Sample data loading for demonstration
- Pagination support for large datasets
- Adjustable items per page (5, 10, 20, or 50 conversations per page)
- Enhanced code block rendering for messages containing programming code
- Language filtering based on file basename in user messages
- Language statistics showing count of samples per language

## Data Format

The application expects either:

1. A JSON array with the following structure:
   ```json
   [
     {
       "messages": [
         {
           "role": "system",
           "content": "System message content"
         },
         {
           "role": "user",
           "content": "User message content"
         },
         {
           "role": "assistant",
           "content": "Assistant message content"
         }
       ]
     }
   ]
   ```

2. A JSONL file where each line contains a JSON object with the same structure:
   ```
   {"messages": [{"role": "system", "content": "System message content"}, {"role": "user", "content": "User message content"}, {"role": "assistant", "content": "Assistant message content"}]}
   {"messages": [{"role": "system", "content": "Another system message"}, {"role": "user", "content": "Another user message"}, {"role": "assistant", "content": "Another assistant message"}]}
   ```

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
