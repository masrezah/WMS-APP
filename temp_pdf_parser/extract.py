import PyPDF2

def extract_text_from_pdf(pdf_path, txt_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += f'--- Page {page_num + 1} ---\n'
            text += page.extract_text() + '\n\n'
    
    with open(txt_path, 'w', encoding='utf-8') as file:
        file.write(text)

if __name__ == '__main__':
    extract_text_from_pdf('../WAREHOUSE MANAGEMENT SYSTEM.pdf', 'extracted_wms.txt')
    print('Successfully extracted PDF text to extracted_wms.txt')
