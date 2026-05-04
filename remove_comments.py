import re
import os
import sys

def remove_html_comments(content):
    """Remove HTML comments <!-- ... -->"""
    return re.sub(r'<!--[\s\S]*?-->', '', content)

def remove_css_comments(content):
    """Remove CSS comments /* ... */"""
    return re.sub(r'/\*[\s\S]*?\*/', '', content)

def remove_js_single_line_comments(content):
    """Remove JS single-line comments // ... but not inside strings or URLs"""
    result = []
    i = 0
    while i < len(content):
        # Handle strings
        if content[i] in ('"', "'", '`'):
            quote = content[i]
            result.append(content[i])
            i += 1
            while i < len(content):
                if content[i] == '\\' and i + 1 < len(content):
                    result.append(content[i])
                    result.append(content[i+1])
                    i += 2
                elif content[i] == quote:
                    result.append(content[i])
                    i += 1
                    break
                else:
                    result.append(content[i])
                    i += 1
        # Handle multi-line comments
        elif content[i:i+2] == '/*':
            end = content.find('*/', i + 2)
            if end != -1:
                i = end + 2
            else:
                i += 2
        # Handle single-line comments
        elif content[i:i+2] == '//':
            # Check if it's a URL (preceded by : like http:// or https://)
            if i > 0 and content[i-1] == ':':
                result.append(content[i])
                i += 1
            else:
                # Skip to end of line
                while i < len(content) and content[i] != '\n':
                    i += 1
        else:
            result.append(content[i])
            i += 1
    return ''.join(result)

def remove_blank_lines_excess(content):
    """Remove excessive blank lines (more than 1 consecutive blank line)"""
    return re.sub(r'\n{3,}', '\n\n', content)

def process_html_file(filepath):
    """Process HTML file - remove HTML comments, CSS comments in <style>, JS comments in <script>"""
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    original = content
    
    # Remove HTML comments
    content = remove_html_comments(content)
    
    # Process <style> blocks - remove CSS comments
    def process_style(match):
        tag = match.group(1)
        css = match.group(2)
        end_tag = match.group(3)
        css = remove_css_comments(css)
        return tag + css + end_tag
    
    content = re.sub(r'(<style[^>]*>)([\s\S]*?)(</style>)', process_style, content, flags=re.IGNORECASE)
    
    # Process <script> blocks - remove JS comments
    def process_script(match):
        tag = match.group(1)
        js = match.group(2)
        end_tag = match.group(3)
        js = remove_js_single_line_comments(js)
        return tag + js + end_tag
    
    content = re.sub(r'(<script[^>]*>)([\s\S]*?)(</script>)', process_script, content, flags=re.IGNORECASE)
    
    content = remove_blank_lines_excess(content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  Updated: {filepath}")
    else:
        print(f"  No comments found: {filepath}")

def process_css_file(filepath):
    """Process CSS file - remove CSS comments"""
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    original = content
    content = remove_css_comments(content)
    content = remove_blank_lines_excess(content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  Updated: {filepath}")
    else:
        print(f"  No comments found: {filepath}")

def process_js_file(filepath):
    """Process JS file - remove both single and multi-line comments"""
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    original = content
    content = remove_js_single_line_comments(content)
    content = remove_blank_lines_excess(content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  Updated: {filepath}")
    else:
        print(f"  No comments found: {filepath}")

def main():
    base = r"c:\Code Club\WAD"
    folders = [f"PS{str(i).zfill(2)}" for i in range(1, 27)]
    
    for folder in folders:
        folder_path = os.path.join(base, folder)
        if not os.path.exists(folder_path):
            print(f"Skipping {folder} - not found")
            continue
        
        print(f"\nProcessing {folder}:")
        
        for root, dirs, files in os.walk(folder_path):
            # Skip node_modules
            if 'node_modules' in root:
                continue
            dirs[:] = [d for d in dirs if d != 'node_modules']
            
            for file in files:
                filepath = os.path.join(root, file)
                ext = os.path.splitext(file)[1].lower()
                
                if ext == '.html':
                    process_html_file(filepath)
                elif ext == '.css':
                    process_css_file(filepath)
                elif ext == '.js':
                    process_js_file(filepath)
                # Skip .json, package-lock.json, etc.
    
    print("\nDone! All comments removed.")

if __name__ == '__main__':
    main()
