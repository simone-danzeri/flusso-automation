function moveToIntegra() {
  // Ottieni il foglio di calcolo attivo
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const activeSheet = spreadsheet.getActiveSheet();

  // Ottieni tutti i dati e le formule dal foglio attivo
  const range = activeSheet.getDataRange();
  const data = range.getValues();
  const formulas = range.getFormulas();

  // Crea array per i dati filtrati e quelli da mantenere
  const filteredData = [];
  const filteredFormulas = [];
  const remainingData = [];
  const remainingFormulas = [];

  // Itera sui dati e separa in due array
  data.forEach((row, rowIndex) => {
    if (row[1] === "Z-INTEGRA" && row[3] === "Z-INTEGRA") {
      filteredData.push(row); // Riga da spostare nel nuovo foglio
      filteredFormulas.push(formulas[rowIndex]); // Formule corrispondenti
    } else {
      remainingData.push(row); // Riga da mantenere
      remainingFormulas.push(formulas[rowIndex]); // Formule corrispondenti
    }
  });

  // Controlla se ci sono dati filtrati
  if (filteredData.length === 0) {
    SpreadsheetApp.getUi().alert("Nessuna riga trovata con B e D uguali a 'Z-INTEGRA'.");
    return;
  }

  // Crea un nuovo foglio
  const newSheetName = "xintegra";
  const newSheet = spreadsheet.insertSheet(newSheetName);

  // Scrivi le intestazioni nella riga 1
  newSheet.getRange(1, 1).setValue("DETTAGLI TASK");
  newSheet.getRange(1, 2).setValue("NOME");
  newSheet.getRange(1, 3).setValue("LINK");
  newSheet.getRange(1, 4).setValue("TELEFONO");
  newSheet.getRange(1, 5).setValue("IN PRIVACY - PAGANTI");
  newSheet.getRange(1, 6).setValue("DUPLICATO");

  // Inserisci i dati e le formule nel nuovo foglio
  const targetRange = newSheet.getRange(2, 1, filteredData.length, filteredData[0].length);
  targetRange.setValues(filteredData); // Prima i valori

  // Inserisci le formule richieste nelle celle specifiche
  const lastRow = newSheet.getLastRow()
  newSheet.getRange(`E2:E${lastRow}`).setFormula(`=COUNTIF(Privacy!$A$2:$P$680,D2)+COUNTIF(Privacy!$Z:$Z,D2)`);
  
  newSheet.getRange(`F2:F${lastRow}`).setFormula("=COUNTIF(D:D,D2)");

  // Cancella i dati originali e sostituiscili con quelli rimanenti
  activeSheet.clear(); // Cancella tutti i dati
  const remainingRange = activeSheet.getRange(1, 1, remainingData.length, remainingData[0].length);
  remainingRange.setValues(remainingData); // Prima i valori

  // Opzionale: ridimensiona le colonne nel foglio originale e nel nuovo
  activeSheet.autoResizeColumns(1, 6);
  newSheet.autoResizeColumns(1, 6);

  Logger.log("Nuovo foglio creato con i dati filtrati e formule: " + newSheetName);
  Logger.log("Le righe filtrate sono state rimosse dal foglio originale.");
}
