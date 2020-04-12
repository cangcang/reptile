const puppeteer = require('puppeteer-core');
const fs        = require('fs');
const YAML      = require('yamljs');

function loadYAMLFile (file) {
  return YAML.parse(fs.readFileSync(file).toString());
}

var config = loadYAMLFile('./config/application.yaml');

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


(async () => {
    const  config = loadYAMLFile('./config/application.yaml');

    console.log(typeof config)
    console.log(typeof config.executablePath)
    console.log(config.executablePath)

    const browser = await puppeteer.launch({headless: false ,args:[
      '–-disable-gpu',
      '–-no-sandbox',
      '–disable-setuid-sandbox'
    ] ,executablePath: config.executablePath,
    ignoreDefaultArgs:["--enable-automation"] });
    //this page
    const page = await browser.newPage();
    await page.evaluate(async () => {
      Object.defineProperty(navigator, 'webdriver', { get: ()=> undefined });
    });
    await page.setViewport({
      width: 1280,
      height: 1366
    });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');

    await page.goto(config.needHost,timeout=30);
    await sleep(5000);


    // await page.click(config.loginSelector);
    // await sleep(1000);
    await page.type(config.userNameSelector, config.userName, {delay: 150});
    await page.type(config.passwdSelector, config.userPasswd, {delay: 120});
    await page.click(config.loginSelector);
    await sleep(5000);

    await page.goto(config.needUrl,timeout=30);

    await browser.close();
  })();