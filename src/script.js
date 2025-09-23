// Sample data structure
const sampleData = [
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

// DOM elements
const fileInput = document.getElementById('fileInput');
const loadSampleBtn = document.getElementById('loadSampleBtn');
const messagesContainer = document.getElementById('messagesContainer');
const languageStatsContainer = document.getElementById('languageStats');

// Pagination variables
let currentPage = 1;
let itemsPerPage = 5;
let currentData = [];
let currentFilter = 'all';
// New variable to store global indices
let globalIndices = [];

// Tag highlighting colors - more visible background colors
const tagColors = [
    '#FFD700', // Gold
    '#98FB98', // PaleGreen
    '#87CEEB', // SkyBlue
    '#DDA0DD', // Plum
    '#F0E68C', // Khaki
    '#FFB6C1', // LightPink
    '#20B2AA', // LightSeaGreen
    '#FFA07A', // LightSalmon
    '#B0C4DE', // LightSteelBlue
    '#FFE4B5', // Moccasin
    '#D3D3D3', // LightGray
    '#F5DEB3', // Wheat
    '#E0E0E0', // Gainsboro
    '#AFEEEE', // PaleTurquoise
    '#DB7093', // PaleVioletRed
    '#90EE90', // LightGreen
    '#FFE4E1', // MistyRose
    '#FAFAD2', // LightGoldenrodYellow
    '#E6E6FA', // Lavender
    '#FFC0CB'  // Pink
];

// Function to extract unique tag names from content
function extractTagNames(content) {
    const tagRegex = /<\|([^|]+)\|>/g;
    const tagNames = new Set();
    let match;
    
    while ((match = tagRegex.exec(content)) !== null) {
        // Add the full tag name (including forward slash if present)
        tagNames.add(match[1]);
        
        // For tags with forward slash, also add the base name for color consistency
        // e.g., both 'code_block' and '/code_block' get the same color
        if (match[1].startsWith('/')) {
            tagNames.add(match[1].substring(1)); // Remove the leading slash
        }
    }
    
    return Array.from(tagNames);
}

// Function to highlight tags in content
function highlightTags(content) {
    const tagNames = extractTagNames(content);
    
    if (tagNames.length === 0) {
        return content;
    }
    
    let highlightedContent = content;
    
    // Assign colors to each unique tag name (base name without slash)
    const tagColorMap = {};
    const baseTagNames = new Set();
    
    // First, collect all base tag names for consistent color assignment
    tagNames.forEach(tagName => {
        const baseName = tagName.startsWith('/') ? tagName.substring(1) : tagName;
        baseTagNames.add(baseName);
    });
    
    // Assign colors to base tag names
    Array.from(baseTagNames).forEach((baseName, index) => {
        tagColorMap[baseName] = tagColors[index % tagColors.length];
    });
    
    // Replace all individual tags with highlighted versions
    const allTagRegex = /<\|([^|]+)\|>/g;
    highlightedContent = highlightedContent.replace(allTagRegex, (match, tagName) => {
        // Use base name for color lookup (remove leading slash if present)
        const baseName = tagName.startsWith('/') ? tagName.substring(1) : tagName;
        const color = tagColorMap[baseName];
        
        return `<span class="tag-highlight" style="background-color: ${color}">${match}</span>`;
    });
    
    return highlightedContent;
}

// Helper function to escape special regex characters
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Event listeners
fileInput.addEventListener('change', handleFileSelect);
loadSampleBtn.addEventListener('click', loadSampleData);

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            // Check if file is JSONL (line-delimited JSON)
            if (file.name.endsWith('.jsonl')) {
                // Process JSONL file - each line is a separate JSON object
                const lines = e.target.result.split('\n');
                const data = [];
                const indices = [];
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    if (line.trim() !== '') {
                        data.push(JSON.parse(line));
                        indices.push(i); // Store line index (0-based)
                    }
                }
                currentData = data;
                globalIndices = indices;
                renderMessagesWithPaginationAndFilter(data, indices, currentPage, itemsPerPage, currentFilter);
            } else {
                // Process regular JSON file
                const data = JSON.parse(e.target.result);
                currentData = data;
                // For JSON arrays, indices are just the array indices (0-based)
                globalIndices = data.map((_, index) => index);
                renderMessagesWithPaginationAndFilter(data, globalIndices, currentPage, itemsPerPage, currentFilter);
            }
        } catch (error) {
            console.error('Error parsing file:', error);
            alert('Invalid file format. Please check the file.');
        }
    };
    reader.readAsText(file);
}

// Load sample data
function loadSampleData() {
    currentData = sampleData;
    // For sample data, indices are just the array indices (0-based)
    globalIndices = sampleData.map((_, index) => index);
    renderMessagesWithPaginationAndFilter(sampleData, globalIndices, currentPage, itemsPerPage, currentFilter);
}

// Extract language from file path
function extractLanguageFromPath(content) {
    const pathMatch = content.match(/current_file_path:\s*([^\s\n]+)/);
    if (pathMatch && pathMatch[1]) {
        const filePath = pathMatch[1];
        // Handle file paths with fragments (e.g., project_1.ipynb#W1sZmlsZQ==)
        // Split by '#' and take the first part to get the actual file path
        const actualFilePath = filePath.split('#')[0];
        const extension = actualFilePath.split('.').pop().toLowerCase();
        // Map common extensions to language names
        const extensionMap = {
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

// Get all unique languages from data with counts
function getLanguageStats(data) {
    const languageCounts = {};
    data.forEach(conversation => {
        conversation.messages.forEach(message => {
            if (message.role === 'user') {
                const language = extractLanguageFromPath(message.content);
                if (language) {
                    if (languageCounts[language]) {
                        languageCounts[language]++;
                    } else {
                        languageCounts[language] = 1;
                    }
                }
            }
        });
    });
    return languageCounts;
}

// Render language statistics
function renderLanguageStats(data) {
    const languageCounts = getLanguageStats(data);
    languageStatsContainer.innerHTML = '';
    
    const statsContainer = document.createElement('div');
    statsContainer.className = 'language-stats';
    
    // Add "All Languages" option at the top
    const allItem = document.createElement('div');
    allItem.className = 'language-stat-item clickable';
    if (currentFilter === 'all') {
        allItem.classList.add('active');
    }
    
    const allName = document.createElement('span');
    allName.className = 'language-name';
    allName.textContent = 'All Languages';
    
    const allCount = document.createElement('span');
    allCount.className = 'language-count';
    allCount.textContent = data.length;
    
    allItem.appendChild(allName);
    allItem.appendChild(allCount);
    
    // Add click handler for "All Languages"
    allItem.addEventListener('click', () => {
        currentFilter = 'all';
        currentPage = 1;
        renderMessagesWithPaginationAndFilter(currentData, globalIndices, currentPage, itemsPerPage, currentFilter);
    });
    
    statsContainer.appendChild(allItem);
    
    // Convert to array and sort by count (descending)
    const sortedLanguages = Object.entries(languageCounts)
        .sort((a, b) => b[1] - a[1]);
    
    sortedLanguages.forEach(([language, count]) => {
        const statItem = document.createElement('div');
        statItem.className = 'language-stat-item clickable';
        if (currentFilter === language) {
            statItem.classList.add('active');
        }
        
        const languageName = document.createElement('span');
        languageName.className = 'language-name';
        languageName.textContent = language.charAt(0).toUpperCase() + language.slice(1);
        
        const languageCount = document.createElement('span');
        languageCount.className = 'language-count';
        languageCount.textContent = count;
        
        statItem.appendChild(languageName);
        statItem.appendChild(languageCount);
        
        // Add click handler to filter by this language
        statItem.addEventListener('click', () => {
            currentFilter = language;
            currentPage = 1;
            renderMessagesWithPaginationAndFilter(currentData, globalIndices, currentPage, itemsPerPage, currentFilter);
        });
        
        statsContainer.appendChild(statItem);
    });
    
    languageStatsContainer.appendChild(statsContainer);
}

// Get all unique languages from data
function getAllLanguages(data) {
    const languages = new Set();
    data.forEach(conversation => {
        conversation.messages.forEach(message => {
            if (message.role === 'user') {
                const language = extractLanguageFromPath(message.content);
                if (language) {
                    languages.add(language);
                }
            }
        });
    });
    return Array.from(languages).sort();
}

// Filter data by language
function filterDataByLanguage(data, language) {
    if (language === 'all') {
        return data;
    }
    return data.filter(conversation => {
        return conversation.messages.some(message => {
            if (message.role === 'user') {
                const msgLanguage = extractLanguageFromPath(message.content);
                return msgLanguage === language;
            }
            return false;
        });
    });
}

// Get global indices for filtered data
function getGlobalIndicesForFilteredData(data, allGlobalIndices, language) {
    if (language === 'all') {
        return allGlobalIndices;
    }
    
    const filteredIndices = [];
    data.forEach((conversation, index) => {
        const hasLanguage = conversation.messages.some(message => {
            if (message.role === 'user') {
                const msgLanguage = extractLanguageFromPath(message.content);
                return msgLanguage === language;
            }
            return false;
        });
        
        if (hasLanguage) {
            filteredIndices.push(allGlobalIndices[index]);
        }
    });
    
    return filteredIndices;
}

// Render messages with pagination and filtering
function renderMessagesWithPaginationAndFilter(data, globalIndices, page, itemsPerPage, filter) {
    // Render language statistics
    renderLanguageStats(data);
    
    // Clear container
    messagesContainer.innerHTML = '';
    
    // Filter data by language
    const filteredData = filterDataByLanguage(data, filter);
    const filteredGlobalIndices = getGlobalIndicesForFilteredData(data, globalIndices, filter);
    
    // Calculate start and end index
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    const pageGlobalIndices = filteredGlobalIndices.slice(startIndex, endIndex);
    
    // Create filter controls
    const filterControls = document.createElement('div');
    filterControls.className = 'filter-controls';
    
    const filterLabel = document.createElement('label');
    filterLabel.textContent = 'Filter by language: ';
    filterLabel.htmlFor = 'languageFilter';
    
    const languageFilter = document.createElement('select');
    languageFilter.id = 'languageFilter';
    
    // Add "All" option
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All Languages';
    if (filter === 'all') {
        allOption.selected = true;
    }
    languageFilter.appendChild(allOption);
    
    // Get all languages and add them to the filter
    const languages = getAllLanguages(data);
    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
        if (lang === filter) {
            option.selected = true;
        }
        languageFilter.appendChild(option);
    });
    
    // Set the current filter value in the dropdown
    languageFilter.value = filter;
    
    // Event listener for language filter change
    languageFilter.addEventListener('change', (event) => {
        currentFilter = event.target.value;
        currentPage = 1;
        renderMessagesWithPaginationAndFilter(data, globalIndices, currentPage, itemsPerPage, currentFilter);
    });
    
    filterControls.appendChild(filterLabel);
    filterControls.appendChild(languageFilter);
    
    // Create pagination controls
    const paginationControls = document.createElement('div');
    paginationControls.className = 'pagination-controls';
    
    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = page === 1;
    prevButton.addEventListener('click', () => {
        if (page > 1) {
            currentPage = page - 1;
            renderMessagesWithPaginationAndFilter(data, globalIndices, currentPage, itemsPerPage, currentFilter);
        }
    });
    
    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = endIndex >= filteredData.length;
    nextButton.addEventListener('click', () => {
        if (endIndex < filteredData.length) {
            currentPage = page + 1;
            renderMessagesWithPaginationAndFilter(data, globalIndices, currentPage, itemsPerPage, currentFilter);
        }
    });
    
    // Page info
    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Page ${page} of ${Math.ceil(filteredData.length / itemsPerPage)}`;
    pageInfo.className = 'page-info';
    
    // Items per page selector
    const itemsPerPageSelector = document.createElement('select');
    itemsPerPageSelector.className = 'items-per-page';
    
    // Add options for items per page
    const options = [5, 10, 20, 50];
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = `${option} per page`;
        if (option === itemsPerPage) {
            optionElement.selected = true;
        }
        itemsPerPageSelector.appendChild(optionElement);
    });
    
    // Event listener for items per page change
    itemsPerPageSelector.addEventListener('change', (event) => {
        itemsPerPage = parseInt(event.target.value);
        currentPage = 1;
        renderMessagesWithPaginationAndFilter(data, globalIndices, currentPage, itemsPerPage, currentFilter);
    });
    
    paginationControls.appendChild(prevButton);
    paginationControls.appendChild(pageInfo);
    paginationControls.appendChild(nextButton);
    paginationControls.appendChild(itemsPerPageSelector);
    
    messagesContainer.appendChild(filterControls);
    messagesContainer.appendChild(paginationControls);
    
    // Iterate through each conversation in the page data
    pageData.forEach((conversation, index) => {
        const globalIndex = pageGlobalIndices[index];
        const conversationElement = document.createElement('div');
        conversationElement.className = 'conversation';
        conversationElement.innerHTML = `<h2>Conversation ${globalIndex}</h2>`;
        
        // Iterate through each message in the conversation
        conversation.messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${message.role}`;
            
            const roleElement = document.createElement('div');
            roleElement.className = `role ${message.role}`;
            roleElement.textContent = message.role;
            
            const contentElement = document.createElement('div');
            contentElement.className = 'content';
            const highlightedContent = highlightTags(message.content);
            
            // Check if content was highlighted (contains HTML spans)
            if (highlightedContent !== message.content && highlightedContent.includes('<span class="tag-highlight"')) {
                contentElement.innerHTML = highlightedContent;
            } else {
                // No tags found, use textContent to preserve formatting and avoid XSS
                contentElement.textContent = message.content;
            }
            
            const headerElement = document.createElement('div');
            headerElement.className = 'message-header';
            headerElement.appendChild(roleElement);
            
            messageElement.appendChild(headerElement);
            messageElement.appendChild(contentElement);
            conversationElement.appendChild(messageElement);
        });
        
        messagesContainer.appendChild(conversationElement);
    });
    
    // Add second set of pagination controls at the bottom
    const bottomPaginationControls = paginationControls.cloneNode(true);
    bottomPaginationControls.className = 'pagination-controls bottom';
    messagesContainer.appendChild(bottomPaginationControls);
    
    // Reattach event listeners for bottom pagination controls
    const bottomControls = messagesContainer.querySelectorAll('.pagination-controls.bottom button');
    const bottomPrevButton = bottomControls[0];
    const bottomNextButton = bottomControls[1];
    const bottomItemsPerPageSelector = messagesContainer.querySelector('.pagination-controls.bottom .items-per-page');
    
    bottomPrevButton.addEventListener('click', () => {
        if (page > 1) {
            currentPage = page - 1;
            renderMessagesWithPaginationAndFilter(data, globalIndices, currentPage, itemsPerPage, currentFilter);
        }
    });
    
    bottomNextButton.addEventListener('click', () => {
        if (endIndex < filteredData.length) {
            currentPage = page + 1;
            renderMessagesWithPaginationAndFilter(data, globalIndices, currentPage, itemsPerPage, currentFilter);
        }
    });
    
    bottomItemsPerPageSelector.addEventListener('change', (event) => {
        itemsPerPage = parseInt(event.target.value);
        currentPage = 1;
        renderMessagesWithPaginationAndFilter(data, globalIndices, currentPage, itemsPerPage, currentFilter);
    });
}
