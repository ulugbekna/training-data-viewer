/**
 * TagHighlighter - Handles tag extraction and highlighting in content
 */

import { TagColors } from '../types.js';

export class TagHighlighter {
  private tagColors: string[] = [
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

  /**
   * Extract unique tag names from content
   */
  public extractTagNames(content: string): string[] {
    const tagRegex = /<\|([^|]+)\|>/g;
    const tagNames = new Set<string>();
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

  /**
   * Highlight tags in content with colors
   */
  public highlightTags(content: string): string {
    const tagNames = this.extractTagNames(content);
    
    if (tagNames.length === 0) {
      return content;
    }
    
    let highlightedContent = content;
    
    // Assign colors to each unique tag name (base name without slash)
    const tagColorMap: TagColors = {};
    const baseTagNames = new Set<string>();
    
    // First, collect all base tag names for consistent color assignment
    tagNames.forEach(tagName => {
      const baseName = tagName.startsWith('/') ? tagName.substring(1) : tagName;
      baseTagNames.add(baseName);
    });
    
    // Assign colors to base tag names
    Array.from(baseTagNames).forEach((baseName, index) => {
      tagColorMap[baseName] = this.tagColors[index % this.tagColors.length];
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

  /**
   * Check if content contains any tags
   */
  public hasTags(content: string): boolean {
    const tagRegex = /<\|([^|]+)\|>/;
    return tagRegex.test(content);
  }
}
