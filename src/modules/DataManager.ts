/**
 * DataManager - Handles data loading, processing, and language detection
 */

import { LanguageStats, TrainingData } from '../types.js';

export class DataManager {
  private sampleData: TrainingData = [
    {
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful assistant."
        },
        {
          "role": "user",
          "content": "Hello, can you help me with something?"
        },
        {
          "role": "assistant",
          "content": "Of course! What can I help you with today?"
        }
      ]
    },
    {
      "messages": [
        {
          "role": "system",
          "content": "You are a coding expert."
        },
        {
          "role": "user",
          "content": "How do I reverse a string in Python?"
        },
        {
          "role": "assistant",
          "content": "You can reverse a string in Python using slicing: `reversed_string = original_string[::-1]`"
        }
      ]
    }
  ];

  /**
   * Get sample data
   */
  public getSampleData(): TrainingData {
    return this.sampleData;
  }

  /**
   * Process uploaded file (JSON or JSONL)
   */
  public async processFile(file: File): Promise<{ data: TrainingData; indices: number[] }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          
          if (file.name.endsWith('.jsonl')) {
            // Process JSONL file - each line is a separate JSON object
            const lines = content.split('\n');
            const data: TrainingData = [];
            const indices: number[] = [];
            
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i].trim();
              if (line !== '') {
                data.push(JSON.parse(line));
                indices.push(i); // Store line index (0-based)
              }
            }
            
            resolve({ data, indices });
          } else {
            // Process regular JSON file
            const data: TrainingData = JSON.parse(content);
            const indices = data.map((_, index) => index);
            resolve({ data, indices });
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsText(file);
    });
  }

  /**
   * Extract language from file path in content
   */
  public extractLanguageFromPath(content: string): string | null {
    const pathMatch = content.match(/current_file_path:\s*([^\s\n]+)/);
    if (pathMatch && pathMatch[1]) {
      const filePath = pathMatch[1];
      // Handle file paths with fragments (e.g., project_1.ipynb#W1sZmlsZQ==)
      const actualFilePath = filePath.split('#')[0];
      const extension = actualFilePath.split('.').pop()?.toLowerCase();
      
      if (!extension) return null;
      
      // Map common extensions to language names
      const extensionMap: Record<string, string> = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'cs': 'csharp',
        'php': 'php',
        'rb': 'ruby',
        'go': 'go',
        'rs': 'rust',
        'swift': 'swift',
        'kt': 'kotlin',
        'html': 'html',
        'css': 'css',
        'scss': 'scss',
        'json': 'json',
        'xml': 'xml',
        'md': 'markdown',
        'sql': 'sql',
        'sh': 'shell',
        'bash': 'shell',
        'yml': 'yaml',
        'yaml': 'yaml',
        'ipynb': 'jupyter'
      };
      
      return extensionMap[extension] || extension;
    }
    return null;
  }

  /**
   * Get language statistics from training data
   */
  public getLanguageStats(data: TrainingData): LanguageStats {
    const languageCounts: LanguageStats = {};
    
    data.forEach(conversation => {
      conversation.messages.forEach(message => {
        if (message.role === 'user') {
          const language = this.extractLanguageFromPath(message.content);
          if (language) {
            languageCounts[language] = (languageCounts[language] || 0) + 1;
          }
        }
      });
    });
    
    return languageCounts;
  }

  /**
   * Get all unique languages from data
   */
  public getAllLanguages(data: TrainingData): string[] {
    const languages = new Set<string>();
    
    data.forEach(conversation => {
      conversation.messages.forEach(message => {
        if (message.role === 'user') {
          const language = this.extractLanguageFromPath(message.content);
          if (language) {
            languages.add(language);
          }
        }
      });
    });
    
    return Array.from(languages).sort();
  }
}
