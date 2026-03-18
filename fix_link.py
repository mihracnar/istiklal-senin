import os
import re

def fix_extensionless_links():
    root_dir = os.getcwd()

    def replace_link(match):
        link = match.group(1)
        
        # Boş linkleri, sayfa içi çapaları (#), kök dizin işaretlerini ve dış linkleri atla
        if not link or link.startswith(("http", "mailto:", "#", "./", "../")):
            # Ancak "../" veya "./" ile başlayıp uzantısı olmayanları yakalamamız lazım
            # Bu yüzden aşağıda sadece http, mailto ve # leri eleyip devam ediyoruz
            if link.startswith(("http", "mailto:", "#")):
                return match.group(0)
        
        # Eğer linkin en son parçasında nokta (.) yoksa (yani .html, .css, .jpg değilse)
        # Bu bir klasör yönlendirmesidir, sonuna /index.html ekle
        filename = link.split("/")[-1]
        if "." not in filename and link != "/":
            # Linkin sonunda zaten '/' varsa temizle ki çift slash olmasın (örn: mekanlar//index.html)
            clean_link = link.rstrip("/")
            return f'href="{clean_link}/index.html"'
            
        return match.group(0)

    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".html"):
                file_path = os.path.join(root, file)
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # href="..." içindeki değerleri bul ve replace_link fonksiyonuna gönder
                new_content = re.sub(r'href="([^"]*)"', replace_link, content)

                if new_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Linkler güncellendi: {file_path}")

if __name__ == "__main__":
    fix_extensionless_links()
    print("\nİşlem tamamlandı! Uzantısı olmayan klasör linklerine /index.html eklendi.")