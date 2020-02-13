require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
const endpoint = `https://stagemarkt.nl/Zoeken/Home/Resultaten`; 
const endpointv2 = 'https://stagemarkt.nl/Zoeken/Home/details';
const crebo = '25604';
// Resultaten?t=25187  // LeerbedrijfId=<id> // &s=10 (straal) // &p=6431MH (postcode) // &pg=1 (pagenumber) // &l=Nederland
// Resultaten?t=25187&s=10&p=6431MH
// crebos[0].parentNode.parentNode.children[0].children[0].children[0].click
const getCompanies = async (_education, _radius, _zip, _country) => {
    const requestUrl = `${endpoint}?t=${_education}&p=${_zip}&s=${_radius}&l=${_country}`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const data = [];
    let pageNumber = 1;
    let count = 0;
    // Fetch all data untill there are no more pages left.
    while(true) {
        try {
            // Go to the next page and grab the company id
            await page.goto(requestUrl + `&pg=${pageNumber}`);
            data.push(await page.evaluate(
                () => [...document.querySelectorAll('.card__footer__link.link-details')].map(elem => elem.dataset.leerbedrijfid)
            ));
            count++;

            // Check if there are more pages
            const button = await page.evaluate(() => document.querySelector(`[aria-label='volgende']`).innerText);
            if(button == null || button === undefined) {
                await browser.close();
                return data;
            }
            // Setup for next page
            pageNumber++;
        } catch(err) {
            // Incase something went wrong, just return the data.
            await browser.close();
            return data;
        }
    }
};

const getDetails = async (_companies, _crebo) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const data = [];
    const pages = _companies.length;

    try {
        for(let i = 0; i < pages; i++) {
            for(let x = 0; x < _companies[i].length - 1; ++x) {
                await page.goto(endpointv2 + `?LeerbedrijfId=${_companies[i][x]}`);
                const companyName = await page.evaluate(
                    () => document.querySelector(`#leerbedrijfNaam`)
                    .innerText
                );
                
                const education = await page.evaluate(() => [...document.querySelectorAll(`.crebo`)].map(item => {
                    if(item.innerText === '25604' && item.parentNode.parentNode.nextElementSibling.children[0] != null) {
                        return item
                            .parentNode
                            .parentNode
                            .nextElementSibling
                            .children[0].querySelector('.extraspace')
                            .children[1].innerText; 
                    } 
                }).filter(arr => arr != null));

                // 27
                data.push({
                    id: _companies[i][x],
                    name: companyName,
                    body: education[0],
                });
            }
        }
        return data;
    }  catch(err) {
        console.error(err);
    }

}

app.post('/companies', async (req, res) => {
    try {
        const { education, radius, zip, country  } = req.body._data;
        const companies = await getCompanies(education, radius, zip, country);
        const details = await getDetails(companies, education);
        res.json({
            details
        });
    } catch(err) {
        console.error(err);
    }
});


app.listen(process.env.SV_PORT, () => console.log(`Server running on port: ${process.env.SV_PORT}!`))