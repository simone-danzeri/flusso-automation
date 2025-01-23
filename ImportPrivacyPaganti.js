// Funzione per sincronizzare privacy e pafanti
function importSheet() {
  try {
    const originFile = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/14zY_FN_3qxnMjqEkte7P7Lw_W7oneTu5tigmI5MpcTg/edit");
    const originSheet = originFile.getSheetByName("Foglio1");
    if (!originSheet) throw new Error("Foglio 'Foglio1' non trovato");
    
    const data = originSheet.getRange("A:T").getValues();

    // Pulizia dei dati
    const cleanedData = data.map(row => row.map(cell => {
      // Se la cella è vuota, lasciala come è
      if (cell === "" || cell === null) {
        return cell;
      }
      // Se la cella è un numero, mantienilo come numero
      if (typeof cell === "number") {
        return cell;
      }
      // Se la cella è una stringa, rimuovi gli spazi superflui
      return String(cell).replace(/ +/g, "");
    }));

    Logger.log(cleanedData);

    // Scrittura su foglio
    scriviSuFoglio(cleanedData);
  } catch (error) {
    Logger.log("Errore durante l'importazione: " + error.message);
  }
}

function scriviSuFoglio(data) {
  try {
    const fileAttivo = SpreadsheetApp.getActiveSpreadsheet();
    const foglio = fileAttivo.getSheetByName("Privacy");
    const formula = '={arrayformula(importrange("https://docs.google.com/spreadsheets/d/1dVyn2wKaZHnrYVnY9YCPUvA5AZbLodyEEDyi6yXwhcg/edit#gid=1005073227","BB-BO!E2:E"));arrayformula(importrange("https://docs.google.com/spreadsheets/d/1dVyn2wKaZHnrYVnY9YCPUvA5AZbLodyEEDyi6yXwhcg/edit#gid=1005073227","BB-RM!E2:E"));arrayformula(importrange("https://docs.google.com/spreadsheets/d/1dVyn2wKaZHnrYVnY9YCPUvA5AZbLodyEEDyi6yXwhcg/edit#gid=1005073227","BB-MI!E2:E"));arrayformula(importrange("https://docs.google.com/spreadsheets/d/1dVyn2wKaZHnrYVnY9YCPUvA5AZbLodyEEDyi6yXwhcg/edit#gid=1005073227","BB-TO!E2:E"));arrayformula(importrange("https://docs.google.com/spreadsheets/d/1dVyn2wKaZHnrYVnY9YCPUvA5AZbLodyEEDyi6yXwhcg/edit#gid=1005073227","BB-GE!E2:E"));arrayformula(importrange("https://docs.google.com/spreadsheets/d/1dVyn2wKaZHnrYVnY9YCPUvA5AZbLodyEEDyi6yXwhcg/edit#gid=1005073227","BB-FI!E2:E"));arrayformula(importrange("https://docs.google.com/spreadsheets/d/1dVyn2wKaZHnrYVnY9YCPUvA5AZbLodyEEDyi6yXwhcg/edit#gid=1005073227","BB-PD!E2:E"));arrayformula(importrange("https://docs.google.com/spreadsheets/d/1dVyn2wKaZHnrYVnY9YCPUvA5AZbLodyEEDyi6yXwhcg/edit#gid=1005073227","BB-MB!E2:E"));arrayformula(importrange("https://docs.google.com/spreadsheets/d/1dVyn2wKaZHnrYVnY9YCPUvA5AZbLodyEEDyi6yXwhcg/edit#gid=1005073227","BB-BS!E2:E"));arrayformula(importrange("https://docs.google.com/spreadsheets/d/1dVyn2wKaZHnrYVnY9YCPUvA5AZbLodyEEDyi6yXwhcg/edit#gid=1005073227","BB-VR!E2:E"));arrayformula(importrange("https://docs.google.com/spreadsheets/d/1dVyn2wKaZHnrYVnY9YCPUvA5AZbLodyEEDyi6yXwhcg/edit#gid=1005073227","BB-BG!E2:E"))}';
    if (!foglio) throw new Error("Foglio 'Privacy' non trovato");

    if (!data || data.length === 0 || !Array.isArray(data[0])) {
      Logger.log("Nessun dato valido da scrivere nel foglio.");
      return;
    }

    // Scrive i dati nel foglio partendo dalla riga 1
    foglio.getRange(1, 26).setValue("PAFANTI");
    foglio.getRange(1, 1, data.length, data[0].length).setValues(data);
    foglio.getRange(2, 26,).setFormula(formula);
  } catch (error) {
    Logger.log("Errore durante la scrittura: " + error.message);
  }
}

