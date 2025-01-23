const COOKIES = [
  // Array di cookie per gli account
  // Esempio: { name: 'session', value: 'abc123', domain: 'ti-aiuto.it' }

  // IACOPO 1 
];

let ACCOUNT_COOKIE_INDEX = 0;
let NAMES = [];
let PHONES = [];

/**
 * Funzione per eseguire login.
 */

function login() {
  const url = "https://ti-aiuto.it/accounts/sign_in"; // Modifica con l'URL del form di login
  const payload = {
    "account[email]": "iac66036@gmail.com",
    "account[password]": "Prova_0809"
  };
  
  const options = {
    method: 'post',
    payload: payload,
    followRedirects: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const cookies = response.getAllHeaders()['Set-Cookie'];
  Logger.log(cookies)
  return cookies;
}


/**
 * Funzione per eseguire la richiesta e ottenere il profilo.
 * @param {string} url
 * @returns {string|null} - URL del profilo o null
 */
function profileScraper(url) {
  const response = UrlFetchApp.fetch(url);
  const $ = Cheerio.load(response.getContentText());
  
  const contact = $("a#contact_button");

  if (contact.length > 0 && contact.attr("href")) {
    return "https://ti-aiuto.it" + contact.attr("href");
  } else {
    return null;
  }
}

/**
 * Funzione per estrarre informazioni dall'account.
 * @param {string} url
 * @returns {Array<string>} - [name, phone]
 */
function accountInformations(url) {
  if (ACCOUNT_COOKIE_INDEX >= COOKIES.length) {
    Logger.log("Richieste terminate");

    Logger.log("NOMI:");
    Logger.log(NAMES.join("\n"));

    Logger.log("NUMERI:");
    Logger.log(PHONES.join("\n"));

    return null;
  }

  const cookie = COOKIES[ACCOUNT_COOKIE_INDEX];
  const   headers = {
    'cookie': cookie,
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  };

  const options = {
    method: 'get',
    headers: headers,
  };

  const response = UrlFetchApp.fetch(url, options);
  const $ = Cheerio.load(response.getContentText());

  const name = $("span p").first().text().split(",")[0];
  const limit = $("#contact_phones_presentation > div > div");

  if (limit.length > 0 && limit.text().includes("non disponibile")) {
    ACCOUNT_COOKIE_INDEX++;
    Logger.log("Account successivo");
    return accountInformations(url);
  }

  let phone = $("#contact_phones_presentation > div > div > div:nth-child(2) > div");

  if (phone.length > 0) {
    phone = phone.attr("data-to-copy").replace(/\s+/g, "");
  } else {
    phone = name;
  }

  return [name, phone];
}

/**
 * Funzione principale per processare gli account.
 * @param {Array<string>} data - URL degli account
 */
function modeAccount(data) {
  COOKIES.push(login())
  data.forEach(account => {
    const profile = profileScraper(account);

    if (profile === null) {
      NAMES.push("Account eliminato");
      PHONES.push("Account eliminato");
    } else {
      const [name, phone] = accountInformations(profile);
      NAMES.push(name);
      PHONES.push(phone);
    }
  });

  Logger.log("NOMI:");
  Logger.log(NAMES.join("\n"));

  Logger.log("NUMERI:");
  Logger.log(PHONES.join("\n"));
}

/**
 * Avvio principale
 */
function integration() {
  const data = ["https://ti-aiuto.it/babysitting-39012-borgo-vittoria"];
  modeAccount(data);
}
