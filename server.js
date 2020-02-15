require("dotenv").config();
const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const uuid = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const endpoint = `https://stagemarkt.nl/Zoeken/Home/Resultaten`;
const endpointv2 = "https://stagemarkt.nl/Zoeken/Home/details";
const crebo = "25604";

const getCompanies = async (_education, _radius, _zip, _country) => {
  const requestUrl = `${endpoint}?t=${_education}&p=${_zip}&s=${_radius}&l=${_country}`;
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();

  const data = [];
  let pageNumber = 1;

  // Fetch all data untill there are no more pages left.
  while (true) {
    try {
      // Go to the next page and grab the company id
      await page.goto(requestUrl + `&pg=${pageNumber}`);
      data.push(
        await page.evaluate(() =>
          [
            ...document.querySelectorAll(".card__footer__link.link-details")
          ].map(elem => elem.dataset.leerbedrijfid)
        )
      );
      // Check if there are more pages
      const button = await page.evaluate(
        () => document.querySelector(`[aria-label='volgende']`).innerText
      );
      if (button == null || button === undefined) {
        await browser.close();
        return data;
      }
      // Setup for next page
      pageNumber++;
    } catch (err) {
      // Incase something went wrong, just return the data.
      await browser.close();
      const sum = data.reduce((acc, curr) => acc + curr.length, 0)
      return [data, sum];
    }
  }
};

const getDetails = async (_companies, _crebo, pollId, entries) => {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  const data = [];
  const pages = _companies.length;

  try {
    for (let i = 0; i < pages; i++) {
      for (let x = 0; x < _companies[i].length - 1; ++x) {
        await page.goto(endpointv2 + `?LeerbedrijfId=${_companies[i][x]}`);
        const companyName = await page.evaluate(
          () => document.querySelector(`#leerbedrijfNaam`).innerText
        );
        
        // @WISHLIST: Remove static crebos, so that it can be used for every study.
        // Get based on education. 
        const education = await page.evaluate(() =>
          [...document.querySelectorAll(`.crebo`)]
            .map(item => {
              if (
                item.innerText === "25604" &&
                item.parentNode.parentNode.nextElementSibling.children[0] !=
                  null
              ) {
                return item.parentNode.parentNode.nextElementSibling.children[0].querySelector(
                  ".extraspace"
                ).children[1].innerText;
              }
            })
            .filter(arr => arr != null)
        );

        // @TODO: Handle filtering based on criteria here, instead of clientside.
        
        data.push({
          id: _companies[i][x],
          name: companyName,
          body: education[0]
        });


        updatePoll(pollId, {
          finished: false,
          current: data.length,
          entries,
          data,
        });
      }
    }
    updatePoll(pollId, {
      finished: true,
      current: data.length,
      entries,
      data,
    });
    await browser.close();
    return data;
  } catch (err) {
    await browser.close();
    console.error(err);
  }
};


function Poll(id, data) {
  this.id = id;
  this.entries = data;
}

const createPoll = (entries) => {
  const id = uuid.v4();
  pollingData.push(new Poll(id, {
    finished: false,
    current: 0,
    entries,
    data: null,
  }));

  return id;
};

const updatePoll = (pollId, data) => {
  pollingData.map(poll => poll.id === pollId ? poll.entries = data : poll.entries);
};

const getPollProgress = (pollId) => {
  const progress = pollingData.find(poll => poll.id === pollId);
  return progress;
}

const pollingData = [];

app.post("/companies", async (req, res) => {
  try {
    const { education, radius, zip, country } = req.body._data;
    const [companies, entries] = await getCompanies(education, radius, zip, country);
    const pollId = createPoll(entries);
    // Start scraping the data, we won't be returning it in this endpoint!
    getDetails(companies, education, pollId, entries);
    res.json({
      progress: getPollProgress(pollId),
    });
  } catch (err) {
    console.error(err);
  }
});

app.get('/companies/:id', async (req, res) => { 
  try {
    // Client sends PollID
    const { id } = req.params;
    // Find poll data
    const data = pollingData.find(poll => poll.id === id);
    // If not polling data exists with that id
    if(data == null || data === undefined) {
      res.status(404).json({
        data: null,
      });
    }
    // Show current progress
    res.json({
      data,
    }) 
  } catch(err) {
    console.error(err);
  }
});

app.get('/poll/:id', (req, res) => {
  const { id } = req.params;

  const pollData = getPollProgress(id);
  const data = pollData.entries.data || [];
  const finished = pollData.entries.finished;
  res.json({
    finished,
    progress: data,
  });
});


if(process.env.NODE_ENV === 'production') {
  app.use(express.static("./client/dist"));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server running on port: ${PORT}!`));
