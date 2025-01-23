function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Task Manager')
    .addItem('Importa privacy', 'importSheet')
    .addItem('Cerca in Totaloni', 'searchInTotaloni')
    .addItem('Verifica privacy', 'privacyFormatting')
    .addItem('Stampa rubrica', 'printRubrica')
    .addToUi();
}
