import xml.etree.ElementTree as ET

def extract_text_from_docx_xml(xml_file_path):
    tree = ET.parse(xml_file_path)
    root = tree.getroot()
    
    # WordprocessingML namespace
    namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    
    text_content = []
    for paragraph in root.findall('.//w:p', namespaces):
        paragraph_text = []
        for text_run in paragraph.findall('.//w:t', namespaces):
            paragraph_text.append(text_run.text)
        text_content.append(''.join(paragraph_text))
    
    return '\n'.join(text_content)

xml_file_path = '/home/ubuntu/mcp_saas_doc/word/document.xml'
output_file_path = '/home/ubuntu/MCP-SaaS_extracted.txt'

text = extract_text_from_docx_xml(xml_file_path)

with open(output_file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print(f'Text extracted and saved to {output_file_path}')

