import re
import json
import os

def extract_thai_text(html_file, json_file, output_html):
    # Read the HTML file content
    with open(html_file, 'r', encoding='utf-8') as file:
        html_content = file.read()

    # Thai text pattern (adjust this as needed for your input data)
    thai_pattern = re.compile(r'[฀-๿]+')

    # Store the translations
    translations = {}

    file_key = os.path.splitext(os.path.basename(html_file))[0]  # Extract filename without extension
    translations[file_key] = {}

    # Function to replace Thai text with a placeholder
    def replace_thai_text(match):
        thai_text = match.group(0).strip()
        key = f"msg_{len(translations[file_key]) + 1}"
        translations[file_key][key] = thai_text
        return f"{{{{ '{file_key}.{key}' | translate }}}}"

    # Replace Thai text in the HTML content
    updated_html_content = re.sub(thai_pattern, replace_thai_text, html_content)

    # Write the translations to a JSON file
    with open(json_file, 'w', encoding='utf-8') as file:
        json.dump(translations, file, ensure_ascii=False, indent=4)

    # Write the updated HTML content to a new file
    with open(output_html, 'w', encoding='utf-8') as file:
        file.write(updated_html_content)

    print(f"Extraction complete! Translations saved in {json_file}, updated HTML saved in {output_html}")

# Example usage
extract_thai_text('/Users/nuttaponn/Desktop/KTB-Project/LEXS/py-script/i18n/sample/index.html', 'translations.json', 'output.html')
