function privacyFormatting() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Determina l'ultima riga della colonna
  let lastRow = sheet.getLastRow();
  
  // Formatta i numeri per rimuovere gli spazi nella colonna D (colonna 4)
  let numberColumnValues = sheet.getRange(2, 4, lastRow - 1).getValues();
  numberColumnValues = numberColumnValues.map(function(row) {
    return [row[0].toString().replace(/\s+/g, "")]; // Rimuove tutti gli spazi
  });

  // Aggiorna i valori nella colonna D
  sheet.getRange(2, 4, numberColumnValues.length).setValues(numberColumnValues);
  
  // Ottieni i valori della colonna E (colonna 5) partendo dalla riga 2
  let columnValues = sheet.getRange(2, 5, lastRow - 1).getValues();
  
  // Ottieni colonna E
  let range = sheet.getRange(2, 5, lastRow - 1);

  // Colora le celle in rosso se il valore non è 0
  columnValues.forEach(function(row, index) {
    if (row[0] !== 0) {
      // Colora la cella di rosso
      range.getCell(index + 1, 1).setBackground("red");
    }
  });
}