import puppeteer from 'puppeteer';
import readline from 'readline';

async function scrapeCategoryToScrape() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://books.toscrape.com');

  const categoryData = await page.evaluate(() => {
    const category = document.querySelectorAll('ul.nav-list li');
    return Array.from(category).map(cdata => (cdata.querySelector('li a').textContent.trim().toLowerCase()
    )
    )
  });
  console.log(categoryData);
  await browser.close();
  return categoryData;
}

scrapeCategoryToScrape();

async function scrapeejBooksCategoryToScrape() {
  const categories = await scrapeCategoryToScrape();

  console.log(categories);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Inserta una categoría­: ', async (categoria) => {
    console.log("categoria: " + categoria);

    let dataSearch = categoria.toLocaleLowerCase().trim();

    const idx = categories.indexOf(dataSearch);
    if (idx === -1) {
      console.log("Categoría no encontrada.");
      rl.close();
      return;
    };
    let data = categoria.toLowerCase().trim().replace(/\s+/g, "-");
    
    const categoryPosition = idx + 1;
    const url = `https://books.toscrape.com/catalogue/category/books/${data}_${categoryPosition}/index.html`;
    console.log("URL:", url);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const categoryBookData = await page.evaluate(() => {
      const categorybook = document.querySelectorAll('article.product_pod');
      return Array.from(categorybook).map(category => ({
        title: category.querySelector('h3 a').getAttribute('title'),
        price: category.querySelector('.price_color').textContent,
        inStock: category.querySelector('.instock.availability').textContent.trim()
      }));
    });
    console.log(categoryBookData);
    await browser.close();
    rl.close();
  })
}

scrapeejBooksCategoryToScrape();

