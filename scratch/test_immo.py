from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('http://localhost:5173/services/immo')
        time.sleep(2)
        content = page.content()
        if 'Oups, un impr' in content:
            print('CRASH REPRODUCED')
        elif 'Nos Offres' in content:
            print('PAGE LOADED FINE')
        else:
            print('UNEXPECTED CONTENT')
            print(content[:500])
        browser.close()

if __name__ == '__main__':
    run()
