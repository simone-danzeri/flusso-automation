function input() {
  const ui = SpreadsheetApp.getUi(); // Ottiene l'interfaccia utente del foglio
  const risposta = ui.prompt("Inserisci un valore", " Quanti contatti vuoi stampare?", ui.ButtonSet.OK_CANCEL);
  let valore = risposta.getResponseText();

    // Controlla se l'utente ha premuto "OK"
  if (risposta.getSelectedButton() == ui.Button.OK) {
    return Number(valore)
  } else if (risposta.getSelectedButton() == ui.Button.CANCEL) {
    return valore = 0
  }else {
    return valore = 0
  }
}