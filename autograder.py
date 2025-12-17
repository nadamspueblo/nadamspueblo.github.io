import requests
from bs4 import BeautifulSoup
import re

# Student List
students = [
  {"name": "Michell Alonso Miranda", "url": "https://1301311267-cyber.github.io/soccer-website/"},
  {"name": "David Alvarez", "url": "https://davidcelealva01.github.io/volleyball/"},
  {"name": "Dominic Arambula", "url": "https://datboiidom.github.io/Final-Project/"},
  {"name": "Jesus Armenta Carino", "url": "https://mamamiajazz.github.io/final-website-project/"},
  {"name": "Lilyrose Bryant", "url": "https://0715431007-hue.github.io/final-project-3/"},
  {"name": "Emmanuel Castro Contreras", "url": "https://emmanuel778-tech.github.io/Final-Project-UofAHistory/"},
  {"name": "Amysaday Castro Cuadras", "url": "https://amysadayc.github.io/Css-final-website-project/"},
  {"name": "Joseangel Chavez Ruiz", "url": "https://0415120004-alt.github.io/final-project/"},
  {"name": "Donald Cooke", "url": "https://donaldcookeatphs-star.github.io/tickle-bob-449/"},
  {"name": "Jose Fabian Cubillas Lujan", "url": "https://fabian5511.github.io/final-personal-website-project/"},
  {"name": "Aiden Doubleday", "url": "https://aidendoubleday.github.io/final-website-project/"},
  {"name": "Santos Duarte-Cabrera", "url": "https://0516233001-star.github.io/Horror-Movies/"},
  {"name": "Jose Duran Meza", "url": "https://joseduran67.github.io/final-project/"},
  {"name": "Alejandro Encinas", "url": "https://alejandroe345.github.io/cs1-final-project/"},
  {"name": "Jose Escalante", "url": "https://0414231012.github.io/cs1-Final-Website-Project/"},
  {"name": "Charles Foster", "url": "https://1214419004-cmyk.github.io/Deepwoken-Final-Project/"},
  {"name": "Isabella Arias Galaz", "url": "https://isabellaaa-a.github.io/final-website-project/"},
  {"name": "Felix Garcia", "url": "https://felixxgarcia064-web.github.io/final-project/"},
  {"name": "Reymond Gutierrez Campos", "url": "https://1301312165-creator.github.io/Final-Project/"},
  {"name": "Dalia Hernandez", "url": "https://dalih-4cls.github.io/Final-Website-Project/"},
  {"name": "Nicholas Ingersoll", "url": "https://nicholasreedingersoll-debug.github.io/Final-website/"},
  {"name": "Isaac Lopez", "url": "https://blankisaac4345.github.io/Final-Project/"},
  {"name": "Leilan Martinez", "url": "https://leilanmartinez.github.io/project/"},
  {"name": "Santiago Martinez", "url": "https://1301235340-commits.github.io/Music-topic/"},
  {"name": "Aubrey McIntyre", "url": "https://1301318619-ctrl.github.io/horror-movie-website/"},
  {"name": "Aimee Millanes Velazquez", "url": "https://aimeemillanes13-commits.github.io/final-wensite-day-1-/"},
  {"name": "Minh Nguyen", "url": "https://1301310347-ctrl.github.io/cs1-final-project7/"},
  {"name": "Roberto Peraza Cordova", "url": "https://perazaroberto69.github.io/Final-project/index.html"},
  {"name": "Alberto Peraza Vasquez", "url": "https://albbertooo499-lgtm.github.io/cs1-final-website-project/"},
  {"name": "Oscar Peru", "url": "http://1301318956-glitch.github.io/cs1-final-website-project/"},
  {"name": "Antoinette Polanco", "url": "https://antoinettefpolanco-cloud.github.io/Final-Website-Project/"},
  {"name": "Miguel Rivera", "url": "https://0915371010-bot.github.io/Final-project/"},
  {"name": "Cynthia Rodriguez", "url": "https://cynthiamia300-del.github.io/softball-tops/"},
  {"name": "Anthony Ruiz", "url": "https://anthonyruiz3.github.io/final-project/"},
  {"name": "Darian Soto Gonzalez", "url": "https://dariann-ss.github.io/cs1-final-website-project/"},
  {"name": "Kamilah Soto", "url": "https://kamilahs0308-dotcom.github.io/final-project/"},
  {"name": "Alexander Valdez Leyva", "url": "https://alexander832-svg.github.io/Fianl-project-website/"},
  {"name": "Abraham Valenzuela", "url": "https://i-luv-monster.github.io/Final-Website-Project-Semester-1/"},
  {"name": "Ivan Vargas Erunes", "url": "https://1301315780-svg.github.io/Albums/"},
  {"name": "San Juan Vicente", "url": "https://0315311001-ops.github.io/cs1-final-website-project/"},
  {"name": "Dali Villarreal Jasso", "url": "https://0814231028-bot.github.io/final-project/"},
  {"name": "Isaiah Yebra", "url": "https://isaiah51354.github.io/cs1-final-website-project/"}
]

def analyze_site(student):
    report = f"--- Report for {student['name']} ---\n"
    
    try:
        # Fetch HTML
        r = requests.get(student['url'], timeout=5)
        if r.status_code != 200:
            print(report + f"ERROR: Could not access site (Status {r.status_code})\n")
            return
        
        soup = BeautifulSoup(r.text, 'html.parser')
        
        # 1. FILES CHECK
        # Heuristic: Count internal links ending in .html
        links = soup.find_all('a', href=True)
        internal_pages = set([l['href'] for l in links if l['href'].endswith('.html') and 'http' not in l['href']])
        report += f"Estimated Pages Found: {len(internal_pages) + 1} (Index + {len(internal_pages)})\n"
        
        # Check for styles.css link
        css_link = soup.find('link', rel='stylesheet')
        css_url = ""
        if css_link and 'href' in css_link.attrs:
            report += f"CSS Linked: YES ({css_link['href']})\n"
            css_filename = css_link['href']
            # Handle relative vs absolute CSS paths
            if "http" in css_filename:
                css_url = css_filename
            else:
                base_url = student['url'].rsplit('/', 1)[0]
                if student['url'].endswith('.html'):
                    css_url = f"{base_url}/{css_filename}"
                else:
                    css_url = f"{student['url'].rstrip('/')}/{css_filename}"
        else:
            report += "CSS Linked: NO (Critical Deduction)\n"

        # 2. LAYOUT & ORGANIZATION (Updated)
        # Check for divs with class or id instead of semantic tags
        divs = soup.find_all('div')
        # Filter for divs that have a 'class' or 'id' attribute
        component_divs = [d for d in divs if d.get('class') or d.get('id')]
        report += f"Divs with Class/ID Found: {len(component_divs)}\n"
        
        # 3. CSS ANALYSIS (Flexbox, Animation, Design)
        if css_url:
            try:
                css_r = requests.get(css_url, timeout=5)
                css_text = css_r.text
                
                # Check Flexbox
                if "display: flex" in css_text or "display:flex" in css_text:
                    report += "Flexbox Used: YES\n"
                else:
                    report += "Flexbox Used: NO\n"
                
                # Check Animations/Transitions
                has_transition = "transition" in css_text
                has_keyframes = "@keyframes" in css_text
                report += f"Transitions: {'YES' if has_transition else 'NO'} | Keyframes: {'YES' if has_keyframes else 'NO'}\n"
                
                # Check Font (Design)
                if "font-family" in css_text:
                    report += "Font-Family Set: YES\n"
                else:
                    report += "Font-Family Set: NO (Check for default Times New Roman)\n"
                    
            except:
                report += "Could not fetch CSS file for detailed analysis.\n"
        
        # 4. CONTENT (Images)
        imgs = soup.find_all('img')
        report += f"Images Found on Home: {len(imgs)}\n"

    except Exception as e:
        report += f"Error analyzing site: {str(e)}\n"
    
    print(report)

# Run analysis
for s in students:
    analyze_site(s)