//SCRAPE BOT TI AIUTO
// Funzione per eseguire scraping su pagine multiple
function scrapeAllPages(url) {

    const pageEndpoint = "&page=";
    const baseUrl = url + pageEndpoint; 
    const firstPageUrl = baseUrl + "1"; 
    const allLinks = []; 

    try {
        const lastPageNumber = getLastPageNumber(firstPageUrl);
        for (let i = 1; i <= lastPageNumber; i++) {
            const pageUrl = baseUrl + i;
            Logger.log("Scraping pagina: " + i);
            const pageLinks = scrapeLinksFromPage(pageUrl); 
            allLinks.push(...pageLinks); 
        }
        Logger.log("Numero totale di link trovati: " + allLinks.length);
    } catch (error) {
        Logger.log("Errore durante lo scraping: " + error.message);
    }

    return allLinks; 
}

// Funzione per ottenere il numero dell'ultima pagina
function getLastPageNumber(url) {
  const paginationRegex = /page=(\d+)/g;
  const paginationNavbarSelector = "#search-results-container > div.search-list-container > nav";
  const lastPageSelector = "#search-results-container > div.search-list-container > nav > span.page.obf-link";
  let lastPage;

  const response = UrlFetchApp.fetch(url);
  const html = response.getContentText();
  const $ = Cheerio.load(html);

 if ($(paginationNavbarSelector).length === 0) {
    // Caso: Nessuna barra di navigazione, quindi solo una pagina
    lastPage = 1;
    console.log("Solo una pagina");
} else if ($(lastPageSelector).length === 0) {
    // Caso: La barra di navigazione esiste, ma manca il link all'ultima pagina (2 pagine)
    lastPage = 2;
    console.log("Solo due pagine");
} else {
    // Caso: La barra di navigazione e il link all'ultima pagina esistono (più di 2 pagine)
    let urlPagination = $(lastPageSelector).attr('data-url');
    let pageMatch = urlPagination.match(paginationRegex);
    if(pageMatch[pageMatch.length - 1].match(/(\d+)/)[0] === "2"){
      lastPage = 3
      return lastPage
    } else{
        lastPage = pageMatch[pageMatch.length - 1].match(/(\d+)/)[0];
        console.log("Ultima pagina:", lastPage);
    }
}
  return lastPage
}



// Funzione per estrarre i link da una singola pagina
function scrapeLinksFromPage(url) {

  const links = [];
  const profileLinkSelector = "a.search-result-item__link"

  const response = UrlFetchApp.fetch(url);
  const html = response.getContentText();
  const $ = Cheerio.load(html);
    
  $(profileLinkSelector).each((index, element) => {
    let link = $(element).attr('href');
    link = link.replace("?back=true", "");
    links.push(link);
  });
  console.log(links)
  return links;
}









