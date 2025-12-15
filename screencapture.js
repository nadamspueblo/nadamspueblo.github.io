import { launch } from 'puppeteer';

const websites = [
  {
    name: "Michell Alonso Miranda",
    url: "https://1301311267-cyber.github.io/soccer-website/"
  },
  {
    name: "David Alvarez",
    url: "https://davidcelealva01.github.io/volleyball/"
  },
  {
    name: "Dominic Arambula",
    url: "https://datboiidom.github.io/Final-Project/"
  },
  {
    name: "Jesus Armenta Carino",
    url: "https://mamamiajazz.github.io/final-website-project/"
  },
  {
    name: "Lilyrose Bryant",
    url: "https://0715431007-hue.github.io/final-project-3/"
  },
  {
    name: "Emmanuel Castro Contreras",
    url: "https://emmanuel778-tech.github.io/Final-Project-UofAHistory/"
  },
  {
    name: "Amysaday Castro Cuadras",
    url: "https://amysadayc.github.io/Css-final-website-project/"
  },
  {
    name: "Joseangel Chavez Ruiz",
    url: "https://0415120004-alt.github.io/final-project/"
  },
  {
    name: "Donald Cooke",
    url: "https://donaldcookeatphs-star.github.io/tickle-bob-449/"
  },
  {
    name: "Jose Fabian Cubillas Lujan",
    url: "https://fabian5511.github.io/final-personal-website-project/"
  },
  {
    name: "Aiden Doubleday",
    url: "https://aidendoubleday.github.io/final-website-project/"
  },
  {
    name: "Santos Duarte-Cabrera",
    url: "https://0516233001-star.github.io/Horror-Movies/"
  },
  {
    name: "Jose Duran Meza",
    url: "https://joseduran67.github.io/final-project/"
  },
  {
    name: "Alejandro Encinas",
    url: "https://alejandroe345.github.io/cs1-final-project/"
  },
  {
    name: "Jose Escalante",
    url: "https://0414231012.github.io/cs1-Final-Website-Project/"
  },
  {
    name: "Charles Foster",
    url: "https://1214419004-cmyk.github.io/Deepwoken-Final-Project/"
  },
  {
    name: "Isabella Arias Galaz",
    url: "https://isabellaaa-a.github.io/final-website-project/"
  },
  {
    name: "Felix Garcia",
    url: "https://felixxgarcia064-web.github.io/final-project/"
  },
  {
    name: "Reymond Gutierrez Campos",
    url: "https://1301312165-creator.github.io/Final-Project/"
  },
  {
    name: "Dalia Hernandez",
    url: "https://dalih-4cls.github.io/Final-Website-Project/"
  },
  {
    name: "Nicholas Ingersoll",
    url: "https://nicholasreedingersoll-debug.github.io/Final-website/"
  },
  {
    name: "Isaac Lopez",
    url: "https://blankisaac4345.github.io/Final-Project/"
  },
  {
    name: "Leilan Martinez",
    url: "https://leilanmartinez.github.io/project/"
  },
  {
    name: "Santiago Martinez",
    url: "https://1301235340-commits.github.io/Music-topic/"
  },
  {
    name: "Aubrey McIntyre",
    url: "https://1301318619-ctrl.github.io/horror-movie-website/"
  },
  {
    name: "Aimee Millanes Velazquez",
    url: "https://aimeemillanes13-commits.github.io/final-wensite-day-1-/"
  },
  {
    name: "Minh Nguyen",
    url: "https://1301310347-ctrl.github.io/cs1-final-project7/"
  },
  {
    name: "Roberto Peraza Cordova",
    url: "https://perazaroberto69.github.io/Final-project/index.html"
  },
  {
    name: "Alberto Peraza Vasquez",
    url: "https://albbertooo499-lgtm.github.io/cs1-final-website-project/"
  },
  {
    name: "Oscar Peru",
    url: "http://1301318956-glitch.github.io/cs1-final-website-project/"
  },
  {
    name: "Antoinette Polanco",
    url: "https://antoinettefpolanco-cloud.github.io/Final-Website-Project/"
  },
  {
    name: "Miguel Rivera",
    url: "https://0915371010-bot.github.io/Final-project/"
  },
  {
    name: "Cynthia Rodriguez",
    url: "https://cynthiamia300-del.github.io/softball-tops/"
  },
  {
    name: "Anthony Ruiz",
    url: "https://anthonyruiz3.github.io/final-project/"
  },
  {
    name: "Darian Soto Gonzalez",
    url: "https://dariann-ss.github.io/cs1-final-website-project/"
  },
  {
    name: "Kamilah Soto",
    url: "https://kamilahs0308-dotcom.github.io/final-project/"
  },
  {
    name: "Alexander Valdez Leyva",
    url: "https://alexander832-svg.github.io/Fianl-project-website/"
  },
  {
    name: "Abraham Valenzuela",
    url: "https://i-luv-monster.github.io/Final-Website-Project-Semester-1/"
  },
  {
    name: "Ivan Vargas Erunes",
    url: "https://1301315780-svg.github.io/Albums/"
  },
  {
    name: "San Juan Vicente",
    url: "https://0315311001-ops.github.io/cs1-final-website-project/"
  },
  {
    name: "Dali Villarreal Jasso",
    url: "https://0814231028-bot.github.io/final-project/"
  },
  {
    name: "Isaiah Yebra",
    url: "https://isaiah51354.github.io/cs1-final-website-project/"
  }
];

for (let site of websites) {
    await getScreenShots(site, 'assets/images/cs1-2/25-26_site_thumbnails/');
}

const webapps = [
  {
    name: "Armando Bernal",
    url: "https://armbernal7-dotcom.github.io/final-project/"
  },
  {
    name: "Antonio Campas Ortiz",
    url: "https://ant2235.github.io/App-project/"
  },
  {
    name: "Shawn-Jacob Campbell",
    url: "https://glitterfart9000.github.io/final-app-project/"
  },
  {
    name: "Anavay Cano",
    url: "https://anavaycano.github.io/final-app-project/"
  },
  {
    name: "Santiago Cazares Flores",
    url: "https://santithe78-alt.github.io/FInal-project-app/"
  },
  {
    name: "Scarlett Herrle-Rios",
    url: "https://lowklettie.github.io/cs3-final-app-project/"
  },
  {
    name: "Alec Martinez",
    url: "https://theduckinduck.github.io/final-app-project/"
  },
  {
    name: "Dante Matanza",
    url: "https://dantem-max.github.io/Final-project/"
  },
  {
    name: "Erik Mercado",
    url: "https://erik-merc09.github.io/Final-App-Project-/"
  },
  {
    name: "Patricia Moraga Ramirez",
    url: "https://itsjustpaty4ever.github.io/final-project/"
  },
  {
    name: "Jassiel Ramirez Othon",
    url: "https://jaasiel790.github.io/final-project-ap-computer-science/"
  },
  {
    name: "Aaron Robledo",
    url: "https://aaronrobledo187-beep.github.io/final-app-project/"
  }
]


for (let site of webapps) {
    await getScreenShots(site, 'assets/images/cs3-4/fall_25_project_thumbnails/');
}

async function getScreenShots(website, path) {
    const browser = await launch();
    const page = await browser.newPage();
    try {
      await page.goto(website.url);
      const imagePath = path + website.name.replaceAll(" ", "_") + ".png";
      await page.screenshot({ path: imagePath });
    }
    catch (error) {
      console.log(error);
      console.log(website.url);
    }
    finally {
      await browser.close();
    }   
}