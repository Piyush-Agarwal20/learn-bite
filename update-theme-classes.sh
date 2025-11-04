#!/bin/bash

# Add theme classes to pages
for file in src/pages/*.tsx; do
  # Add theme-text-primary to headings
  sed -i 's/text-secondary-900\([^"]*\)"/text-secondary-900 theme-text-primary\1"/g' "$file"
  
  # Add theme-text-secondary to secondary text
  sed -i 's/text-secondary-600\([^"]*\)"/text-secondary-600 theme-text-secondary\1"/g' "$file"
  
  # Add theme-text-tertiary to tertiary text  
  sed -i 's/text-secondary-500\([^"]*\)"/text-secondary-500 theme-text-tertiary\1"/g' "$file"
done

echo "✅ Theme classes added to all pages"
