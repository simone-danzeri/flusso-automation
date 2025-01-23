function searchInTotaloni() {
  try {
    // File attivo e sheet di lavoro
    const activeFile = SpreadsheetApp.getActiveSpreadsheet();
    const activeSheet = activeFile.getSheetByName("Calcolo");  
    const fileName =  activeFile.getName();

   // Determino l'ultima riga non vuota nella colonna B
   // const lastRow = activeSheet.getLastRow();
   // const dataColumn = activeSheet.getRange(2, 2, lastRow - 1, 1).getValues().flat();
   // const validLinks = dataColumn.filter(link => link.trim() !== "");
   
   // Trasformo i link nel caso in cui ci sia il back=true
  const lastRow = activeSheet.getLastRow();
  const dataColumn = activeSheet.getRange(2, 3, lastRow - 1, 1).getValues().flat(); // Colonna C
  // Filtra i valori non vuoti e rimuove "?back=true" solo se presente alla fine
  const validLinks = dataColumn
    .filter(link => link.trim() !== "") // Filtra i valori non vuoti
    .map(link => link.endsWith("?back=true") ? link.slice(0, -10) : link); // Rimuove "?back=true" solo se alla fine
  // Aggiorna i valori nel foglio
  validLinks.forEach((link, index) => {
    activeSheet.getRange(index + 2, 3).setValue(link); // Aggiorna i valori nella colonna C
  });
    // Modifico i link per ottenere solo la parte dopo '.it/'
    const linkArray = validLinks.map(link => {
      if (link.includes(".it/")) {
        return link.split(".it/")[1]; // Prendo solo la parte dopo ".it/"
      }
      return ""; // Gestione dei valori non validi
    });

    let totalone = [];
   
    if(fileName.includes("BB")){
      // File esterno e sheet di riferimento BABYSITTER
      const originFileBabysitter = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1cNBDved6smX_0I8DQaLSrc95zK-_FCb1amzDMivq1Nw/edit?gid=0#gid=0");
      const originSheetBabysitter = originFileBabysitter.getSheetByName("Foglio1");
      const lastRowBabysitter = originSheetBabysitter.getLastRow();
      const dataBabysitter = originSheetBabysitter.getRange(1, 1, lastRowBabysitter, 4).getValues();
      totalone.push(...dataBabysitter)
      Logger.log("File BABYSITTER aperto correttamente.");
    } else if(fileName.includes("BAD")){
      // File esterno e sheet di riferimento BADANTI
      const originFileBadanti = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1VpJSRufeI1CQylQsUK8HFGsAmCy2uo4blbCxhLspfow/edit?gid=0#gid=0");
      const originSheetBadanti = originFileBadanti.getSheetByName("Foglio1");
      const lastRowBadanti = originSheetBadanti.getLastRow();
      const dataBadanti = originSheetBadanti.getRange(1, 1, lastRowBadanti, 4).getValues();
      totalone.push(...dataBadanti);
      Logger.log("File BADANTI aperto correttamente.");
    } else if(fileName.includes("PET")){
      // File esterno e sheet di riferimento PETSITTER
      const originFilePetsitter = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1g3RLlMeT4RRXx8SR4tQW6-jyX9wxZzvUZIFgWW1xP6I/edit?gid=0#gid=0");
      const originSheetPetsitter = originFilePetsitter.getSheetByName("Foglio1");
       const lastRowPetsitter = originSheetPetsitter.getLastRow();
      const dataPetsitter = originSheetPetsitter.getRange(1,1,lastRowPetsitter,4).getValues();
      totalone.push(...dataPetsitter);
      Logger.log("File PETSITTER aperto correttamente.")
    }

    // Raccolgo dati dello sheet esterno (colonne A:D)
    const data = totalone;
    Logger.log(`Dati raccolti dal file esterno. Numero di righe: ${data.length}`);

    // Creazione di una mappa per velocizzare la ricerca
    const dataMap = new Map();
    data.forEach(row => {
      const link = row[3]; // Link nella colonna D
      if (link) {
        const modifiedLink = link.includes(".it/") ? link.split(".it/")[1] : link;
        dataMap.set(modifiedLink, { nome: row[0], numero: row[2] }); // Colonne A e C
      }
    });
    Logger.log(`Mappa creata con ${dataMap.size} link.`);

    // Ciclo sui link e confronto con i dati dello sheet esterno
    validLinks.forEach((link, index) => {
      const modifiedLink = link.includes(".it/") ? link.split(".it/")[1] : link;
      if (dataMap.has(modifiedLink)) {
        const { nome, numero } = dataMap.get(modifiedLink);
        // Scrivo nome e numero nello sheet attivo (colonne B e D)
        activeSheet.getRange(index + 2, 2).setValue(nome); // Colonna B
        activeSheet.getRange(index + 2, 4).setValue(numero); // Colonna D
      } else {
        // Scrivo "Z-INTEGRA" nello sheet attivo (colonne B e D)
        activeSheet.getRange(index + 2, 2).setValue("Z-INTEGRA"); // Colonna B
        activeSheet.getRange(index + 2, 4).setValue("Z-INTEGRA"); // Colonna D
      }
    });
    // Estensione delle formule in colonne E e F fino all'ultima riga della colonna B
    const formulaE = '=COUNTIF(Privacy!$A$2:$P$680,D2)+COUNTIF(Privacy!$Z:$Z,D2)'
    // const formulaE = activeSheet.getRange("E2").getFormula(); // Formula in E2
    const formulaF = '=COUNTIF(D:D,D2)'
    // const formulaF = activeSheet.getRange("F2").getFormula(); // Formula in F2

    if (formulaE) {
      activeSheet.getRange(2, 5, validLinks.length, 1).setFormula(formulaE); // Estendi E2
    }
    if (formulaF) {
      activeSheet.getRange(2, 6, validLinks.length, 1).setFormula(formulaF); // Estendi F2
    }
    Logger.log("Formule estese correttamente nelle colonne E e F.");
    Logger.log("Importazione completata con successo.");
  } catch (error) {
    Logger.log("Errore durante l'importazione: " + error.message);
  }

  // Sposta contatti Z-INTEGRA
  moveToIntegra();
}
