const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000; // You can change the port number as needed

app.get('/', async (req, res) => {
    const url = req?.query?.url || '';
    console.log(url);

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
  
      // Replace 'https://example.com' with the URL of the webpage you want to scrape.
      await page.goto(url);
      
      // Add your scraping logic here.
      const textStyles = await page.evaluate(() => {
        let textStyles = [];
        document.body.querySelectorAll('*').forEach((element) => {
          let style = window.getComputedStyle(element);
          let textStyle = {
            tagName: element.tagName,
            fontSize: style.fontSize,
            lineHeight: style.lineHeight,
            letterSpacing: style.letterSpacing,
            fontFamily: style.fontFamily,
            fontWeight: style.fontWeight,
          };
          textStyles.push(textStyle);
        });
        return textStyles;
      });
  
      await browser.close();
  
      // Respond with the scraped data.
      res.json(textStyles);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while scraping the webpage.');
    }
  });
  
// API endpoint to get the extracted text styles as JSON
app.get('/textStyles', (req, res) => {
    const allTextStyles = extractTextStyles();
    res.json(allTextStyles);
});

// Serve your HTML file with the client-side script
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Replace 'index.html' with your HTML file
});

// Start the Express app
app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});
