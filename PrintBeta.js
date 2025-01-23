function printBeta() {

  // Ottieni i fogli di origine
  const file = SpreadsheetApp.getActiveSpreadsheet();
  const fileName = file.getName();
  const sourceSheetCalcolo = file.getSheetByName("Calcolo");
  const sourceSheetIntegra = file.getSheetByName("xintegra")
  const sourceSheetDatabase = file.getSheetByName("Database")

  // Colonne dati
  const sourceColumnName = 3; 
  const sourceColumnNumber = 4;
  const sourceColumnPrivacy = 5;

  // Ottieni il numero successivo per il nome del foglio "Track" e "Rubrica"
  let indCount = 1;
  let rubricaCount = 1;
  // Trova il prossimo numero disponibile per i fogli "Track" e "Rubrica"
  while (file.getSheetByName(`Track ${indCount}`)) {
    indCount++;
  }
  while (file.getSheetByName(`Rubrica ${rubricaCount}`)) {
    rubricaCount++;
  }
  // Crea i nomi dei nuovi fogli
  let newIndSheetName = `Track ${indCount}`;
  let newRubricaSheetName = `Rubrica ${rubricaCount}`;

  // Estrazione, saltando la prima riga (intestazione)
  const sourceDataNameCalcolo = sourceSheetCalcolo.getRange(2, sourceColumnName, sourceSheetCalcolo.getLastRow()).getValues(); 
  const sourceDataNumberCalcolo = sourceSheetCalcolo.getRange(2, sourceColumnNumber, sourceSheetCalcolo.getLastRow()).getValues(); 
  const sourceDataPrivacyCalcolo = sourceSheetCalcolo.getRange(2, sourceColumnPrivacy, sourceSheetCalcolo.getLastRow()).getValues(); 

  const sourceDataNameIntegra = sourceSheetIntegra.getRange(2, sourceColumnName, sourceSheetIntegra.getLastRow()).getValues(); 
  const sourceDataNumberIntegra = sourceSheetIntegra.getRange(2, sourceColumnNumber, sourceSheetIntegra.getLastRow()).getValues(); 
  const sourceDataPrivacyIntegra = sourceSheetIntegra.getRange(2, sourceColumnPrivacy, sourceSheetIntegra.getLastRow()).getValues(); 

  const uniqueNumbers = new Set(); // Per memorizzare numeri univoci
  const filteredRubrica = [];
  let rowsCountCalcolo = 0; // Contatore per le righe gestite Calcolo
  let rowsCountIntegra = 0; // Contatore per le righe gestite Integra
  let count = 0; // Contatore per i contatti validi

  if(sourceDataPrivacyCalcolo.length - 1 > 0){
    while(count < 30){
      for(let i = 0; i < sourceDataPrivacyCalcolo.length -1 && count < 30; i++) {
        if (sourceDataPrivacyCalcolo[i][0] === 0) {
          // Normalizza il numero
          const details = sourceSheetCalcolo.getRange("A2").getValue().replace(/\s+/g, '').replace(/,/g,"_");
          const name = fileName + "_" + details + "_" + sourceDataNameCalcolo[i][0];
          const number = Number(sourceDataNumberCalcolo[i][0]?.toString().replace(/\s+/g, '')); // Rimuovi gli spazi dai numeri

          if (number && !uniqueNumbers.has(number) && number.toString().length >= 9 && number.toString().length <= 10) {
            uniqueNumbers.add(number); // Aggiungi il numero al set
            filteredRubrica.push([name, number]); // Aggiungi il nome e il numero all'array
            count++; // Incrementa il contatore dei contatti validi
          }
        }
        rowsCountCalcolo++
      }
      for(let i = 0; i < sourceDataPrivacyIntegra.length - 1 && count < 30; i++) {
        if(sourceDataNameIntegra[i][0] === "Z-INTEGRA"){
          count = 30;
        } else {
            if (sourceDataPrivacyIntegra[i][0] === 0) {
              // Normalizza il numero
              const details = sourceSheetIntegra.getRange("A2").getValue().replace(/\s+/g, '').replace(/,/g,"_");
              const name = fileName + "_" + details + "_" + sourceDataNameIntegra[i][0];
              const number = Number(sourceDataNumberIntegra[i][0]?.toString().replace(/\s+/g, '')); // Rimuovi gli spazi dai numeri

              if (number && !uniqueNumbers.has(number) && number.toString().length >= 9 && number.toString().length <= 10) {
                uniqueNumbers.add(number); // Aggiungi il numero al set
                filteredRubrica.push([name, number]); // Aggiungi il nome e il numero all'array
                count++; // Incrementa il contatore dei contatti validi
              }
            }
            rowsCountIntegra++;
        }
       
      
      }
      break;
    }  
  } else {
      for(let i = 0; i < sourceDataPrivacyIntegra.length -1 && count < 30; i++) {
         if(sourceDataNameIntegra[i][0] === "Z-INTEGRA"){
          count = 30
        } else {
          if (sourceDataPrivacyIntegra[i][0] === 0) {
            // Normalizza il numero
            const details = sourceSheetIntegra.getRange("A2").getValue().replace(/\s+/g, '').replace(/,/g,"_");
            const name = fileName + "_" + details + "_" + sourceDataNameIntegra[i][0];
            const number = Number(sourceDataNumberIntegra[i][0]?.toString().replace(/\s+/g, '')); // Rimuovi gli spazi dai numeri

            if (number && !uniqueNumbers.has(number) && number.toString().length >= 9 && number.toString().length <= 10) {
              uniqueNumbers.add(number); // Aggiungi il numero al set
              filteredRubrica.push([name, number]); // Aggiungi il nome e il numero all'array
              count++; // Incrementa il contatore dei contatti validi
            }
          }
          rowsCountIntegra++
        }
      }
    
  }
Logger.log("count:" + " " + count)
Logger.log("count Calcolo:" + " " + rowsCountCalcolo)
Logger.log("count Integra:" + " " + rowsCountIntegra)
Logger.log(filteredRubrica)
Logger.log(filteredRubrica.length)


const datas = [];
if(rowsCountCalcolo !== 0 ){
  const dataCalcolo = sourceSheetCalcolo.getRange(2, 1, rowsCountCalcolo, sourceSheetCalcolo.getLastColumn()).getValues();
  datas.push(...dataCalcolo);
  // Elimina righe Calcolo
  sourceSheetCalcolo.deleteRows(2, rowsCountCalcolo);
}
if(rowsCountIntegra !== 0) {
  const dataIntegra = sourceSheetIntegra.getRange(2, 1, rowsCountIntegra, sourceSheetIntegra.getLastColumn()).getValues();
  datas.push(...dataIntegra);
  // Elimina righe Calcolo
  sourceSheetIntegra.deleteRows(2, rowsCountIntegra);
}
if(datas.length > 0) {
  // Crea il nuovo foglio "Track {numero}"
  const newIndSheet = file.insertSheet(newIndSheetName);
  // Scrivi le intestazioni nella riga 1
  newIndSheet.getRange(1, 1).setValue("DETTAGLI TASK");
  newIndSheet.getRange(1, 2).setValue("LINK");
  newIndSheet.getRange(1, 3).setValue("NOME");
  newIndSheet.getRange(1, 4).setValue("TELEFONO");
  newIndSheet.getRange(1, 5).setValue("IN PRIVACY - PAGANTI");
  newIndSheet.getRange(1, 6).setValue("DUPLICATO");
  newIndSheet.getRange(2, 1, datas.length, datas[0].length).setValues(datas); // Copia i dati
  // Crea il nuovo foglio "Rubrica {numero}"
  const newRubricaSheet = file.insertSheet(newRubricaSheetName);
  // Scrivi l'intestazione
  newRubricaSheet.getRange(1, 1).setValue("Nome");
  newRubricaSheet.getRange(1, 2).setValue("Telefono");
  // Scrivi i dati filtrati
  if (filteredRubrica.length > 0) {
    newRubricaSheet.getRange(2, 1, filteredRubrica.length, 2).setValues(filteredRubrica);
    Logger.log("Dati copiati con successo.");
  } else {
    Logger.log("Nessun dato da copiare. Tutti i valori di privacy sono diversi da 0.");
  }
  let databaseLastRow = sourceSheetDatabase.getLastRow() + 1;
  sourceSheetDatabase.getRange(databaseLastRow, 1, filteredRubrica.length, 2).setValues(filteredRubrica);
} else {
    const ui = SpreadsheetApp.getUi();
    ui.alert("Attenzione", "Non hai contatti da integrare, testa di cazzo.", ui.ButtonSet.OK);
}
}