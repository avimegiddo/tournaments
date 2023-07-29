// This script contains functions related to tournament management in a
// spreadsheet. The script includes functionality for pairing cells, clearing
// checkboxes, and randomizing names.It is designed to be used as an event
// handler and provides helper functions for retrieving tournament types.

// Function to handle edits in the spreadsheet
function onEdit(e) {
 // Get the active sheet and edited cell information
 const sheet = e.range.getSheet();
 const cell = e.range.getA1Notation();
 const activeSheetName = sheet.getName();
 const tournamentType = getTournamentType(activeSheetName);

 // Retrieve the pairs based on the tournament type
 const pairs = pairConfig[tournamentType];

 // Check if pairs exist for the tournament type
 if (pairs) {
   // Iterate over the pairs and perform necessary actions
   for (let i = 0; i < pairs.length; i++) {
     const pair = pairs[i];

     // Check if the edited cell is part of the pair
     if (pair.includes(cell)) {
       const pairCell = pair[0] === cell ? pair[1] : pair[0];
       const isChecked = e.value === "TRUE";
       const pairRange = sheet.getRange(pairCell);

       // Check if the pair range is already checked and uncheck if needed
       if (isChecked && pairRange.isChecked()) {
         pairRange.uncheck();
       }
     }
   }
 }
}

/**
* Retrieves the tournament type based on the sheet name.
* The tournament type is determined from the numeric part of the sheet name and an optional suffix.
*
* @param {string} sheetName - The name of the sheet.
* @returns {string|number} - The tournament type or 0 if it cannot be determined.
*/
function getTournamentType(sheetName) {
 const match = sheetName.match(/(\d+)([a-z])?/i);
 if (match && match[1]) {
   const tournamentType = match[1].toLowerCase();
   const suffix = match[2] ? match[2].toLowerCase() : '';
   return tournamentType + suffix;
 }
 return 0; // Default value if tournament type cannot be determined
}

/**
* Clears all checkboxes in the active sheet of the spreadsheet.
* Displays a confirmation dialog before clearing the checkboxes.
* If confirmed, it loops through all cells and sets the checked checkboxes to false.
*/
function clearAllCheckboxes() {
 // Get the active sheet and data range
 var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 var range = sheet.getDataRange();
 var values = range.getValues();

 // Check if any checkboxes are checked
 var hasCheckedBoxes = values.some(row => row.some(cellValue => typeof cellValue === "boolean" && cellValue === true));

 if (hasCheckedBoxes) {
   // Ask for confirmation using a dialog box
   var ui = SpreadsheetApp.getUi();
   var response = ui.alert('Confirm Clear', 'Are you sure you want to clear all of the checkboxes and start a new tournament?', ui.ButtonSet.YES_NO);

   if (response == ui.Button.YES) {
     // User confirmed, clear all checkboxes
     for (var row = 0; row < values.length; row++) {
       for (var column = 0; column < values[row].length; column++) {
         var cellValue = values[row][column];

         if (typeof cellValue === "boolean" && cellValue === true) {
           var cell = sheet.getRange(row + 1, column + 1);
           cell.setValue(false);
         }
       }
     }
   } else {
     // User canceled, do nothing
     return;
   }
 } else {
   // No checkboxes checked, no action required
   return;
 }
}

/**
* Randomizes the range of names in column A of the active sheet in the spreadsheet.
* Displays a confirmation dialog before performing the randomization.
* If confirmed, it applies the Fisher-Yates shuffle algorithm to the filtered non-blank values.
* Finally, it sets the randomized values back to the original range and applies font settings.
*/
function randomizeRange() {
 // Get the active sheet and range to randomize
 var sheet = SpreadsheetApp.getActiveSheet();
 var numberOfRandomizations = 100;
 var rangeToRandomize = sheet.getRange("A2:A17");
 var valuesToRandomize = rangeToRandomize.getValues();

 // Filter out any blank cells
 var filteredValues = valuesToRandomize.filter(function (row) {
   return row[0] != "";
 });

 // Ask for confirmation using a dialog box
 var ui = SpreadsheetApp.getUi();
 var response = ui.alert('Confirm Randomize', 'Are you sure you want to randomize all of the names and start a new tournament?', ui.ButtonSet.YES_NO);

 if (response == ui.Button.YES) {
   // User confirmed, perform randomization

   // Apply the Fisher-Yates shuffle algorithm
   for (var i = 0; i < numberOfRandomizations; i++) {
     for (var j = filteredValues.length - 1; j > 0; j--) {
       var k = Math.floor(Math.random() * (j + 1));
       var temp = filteredValues[j];
       filteredValues[j] = filteredValues[k];
       filteredValues[k] = temp;
     }
   }

   // Create a new 2D array with the same number of rows as the original range
   var newValues = new Array(valuesToRandomize.length);
   for (var i = 0; i < newValues.length; i++) {
     newValues[i] = new Array(1);
   }

   // Populate the new 2D array with the filtered values
   var j = 0;
   for (var i = 0; i < valuesToRandomize.length; i++) {
     if (valuesToRandomize[i][0] != "") {
       newValues[i][0] = filteredValues[j][0];
       j++;
     }
   }

   // Set the values in the original range to the new 2D array
   rangeToRandomize.setValues(newValues);
   sheet.getRange("A2:A17").setFontSize(12); // Set the font size to 12
   sheet.getRange("A2:A17").setFontFamily("Barlow"); // Set the font to Barlow
 } else {
   // User canceled, do nothing
   return;
 }
}

// Configuration object for cell pairs based on tournament type
const pairConfig = {
 // For a tournament of 16 players
 16: [
   ["O4", "O6"],
   ["O8", "O10"],
   ["O12", "O14"],
   ["O16", "O18"],
   ["O21", "O23"],
   ["O25", "O27"],
   ["O29", "O31"],
   ["O33", "O35"],
   ["Q5", "Q9"],
   ["Q13", "Q17"],
   ["Q22", "Q26"],
   ["Q30", "Q34"],
   ["M5", "M9"],
   ["M13", "M17"],
   ["M22", "M26"],
   ["M30", "M34"],
   ["S7", "S15"],
   ["S24", "S32"],
   ["K7", "K11"],
   ["K15", "K19"],
   ["K24", "K28"],
   ["K32", "K36"],
   ["U11", "U28"],
   ["I9", "I17"],
   ["I26", "I34"],
   ["G13", "G21"],
   ["G30", "G38"],
   ["W19", "W31"],
   ["E17", "E34"],
   ["Y25", "Y34"],
   ["C25", "C38"]
 ],

 //For a single-elimination tournament of 16 players

 "16s": [
   
   ["B4", "B6"],
   ["B8", "B10"],
   ["B12", "B14"],
   ["B16", "B18"],
   ["B21", "B23"],
   ["B25", "B27"],
   ["B29", "B31"],
   ["B33", "B35"],
   ["D5", "D9"],
   ["D13", "D17"],
   ["D22", "D26"],
   ["D30", "D34"],
   ["F7", "F15"],
   ["F24", "F32"],
   ["H11", "H28"],
   ["V19", "V31"]
 ],


 //for a tournament of 12 players
 12: [
   // Bracket pairs for 12-participant tournament
   ["X22", "X31"],
   ["V17", "V27"],
   ["T10", "T23"],
   ["R6", "R13"],
   ["R19", "R26"],
   ["P4", "P7"],
   ["P11", "P14"],
   ["P17", "P20"],
   ["P24", "P27"],
   ["N6", "N8"],
   ["N10", "N12"],
   ["N19", "N21"],
   ["N23", "N25"],
   ["L4", "L6"],
   ["L11", "L14"],
   ["L17", "L20"],
   ["L24", "L27"],
   ["J6", "J13"],
   ["J19", "J26"],
   ["H10", "H16"],
   ["H23", "H28"],
   ["F13", "F26"],
   ["D19", "D29"],
 ],

 //for a single-elimination tournament of 12 players
 "12s": [
   // Bracket pairs for 12-participant tournament
   ["L22", "L31"],
   ["J17", "J27"],
   ["H10", "H23"],
   ["F6", "F13"],
   ["F19", "F26"],
   ["D4", "D7"],
   ["D11", "D14"],
   ["D17", "D20"],
   ["D24", "D27"],
   ["B6", "B8"],
   ["B10", "B12"],
   ["B19", "B21"],
   ["B23", "B25"],
 ],

 //for a single-elimination tournament of 12 players NOT DONE YET
 "12a": [
   // Bracket pairs for 12-participant tournament

   ["B4", "B6"],
   ["B8", "B10"],
   ["B12", "B14"],
   ["B16", "B18"],
   ["B20", "B22"],
   ["B24", "B26"],
   ["D5", "D9"],
   ["D13", "D17"],
   ["D21", "D25"],
   ["F7", "F15"],
   ["H11", "H23"],
   ["K17", "K21"],
   ["M19", "M23"]
 ],


 //for a double-elimination tournament of 10 players
 10:
   [
     ["D16", "D22"],
     ["F12", "F20"],
     ["H10", "H14"],
     ["H18", "H22"],
     ["J8", "J11"],
     ["J16", "J19"],
     ["L6", "L9"],
     ["L17", "L20"],
     ["N8", "N10"],
     ["N16", "N18"],
     ["P4", "P7"],
     ["P9", "P12"],
     ["P14", "P17"],
     ["P19", "P22"],
     ["R6", "R11"],
     ["R16", "R21"],
     ["T8", "T18"],
     ["V13", "V25"],
     ["X20", "X28"]
   ],


 //for a single-elimination tournament of 10 players
 "10s": [

   ["C7", "C9"],
   ["C15", "C17"],
   ["E3", "E6"],
   ["E8", "E11"],
   ["E13", "E16"],
   ["E18", "E21"],
   ["G5", "G10"],
   ["G15", "G20"],
   ["I7", "I17"]
 ],


 //for a tournament of 8 players
 8: [

   ["C13", "C20"],
   ["E9", "E17"],
   ["G7", "G11"],
   ["G15", "G19"],
   ["I5", "I9"],
   ["I13", "I17"],
   ["K4", "K6"],
   ["K8", "K10"],
   ["K12", "K14"],
   ["K16", "K18"],
   ["M5", "M9"],
   ["M13", "M17"],
   ["O7", "O15"],
   ["Q11", "Q22"],
   ["S17", "S25"]
 ],

 //for a single-elimination tournament of 8 players NOT DONE YET
 "8s": [

   ["C3", "C5"],
   ["C7", "C9"],
   ["C11", "C13"],
   ["C15", "C17"],
   ["E4", "E8"],
   ["E12", "E16"],
   ["G6", "G14"]
 ],


 // For a symmetric 6-player tournament
 "6a": [
   ["C10", "C16"],
   ["E6", "E13"],
   ["G4", "G7"],
   ["G11", "G14"],
   ["I6", "I8"],
   ["I10", "I12"],
   ["K4", "K7"],
   ["K11", "K14"],
   ["M6", "M13"],
   ["O10", "O18"],
   ["Q14", "Q20"]
 ],


 // For a non-symmetric 6-player tournament
 "6b":
   [
     ["C14", "C21"],
     ["E10", "E19"],
     ["G8", "G14"],
     ["G17", "G21"],
     ["I6", "I9"],
     ["I12", "I15"],
     ["K4", "K8"],
     ["K14", "K18"],
     ["M6", "M16"],
     ["O12", "O24"],
     ["Q19", "Q27"]
   ],


 // For a single-elimination 6-player tournament
 "6s":
   [
     ["C5", "C8"],
     ["C11", "C14"],
     ["E3", "E7"],
     ["E13", "E17"],
     ["G5", "G15"],
   ],

 //for a tournament of 4 players

 4: [

   ["G4", "G6"],
   ["G8", "G10"],
   ["I5", "I9"],
   ["E5", "E9"],
   ["K7", "K14"],
   ["C7", "C11"],
   ["M10", "M16"]

 ],

 "4s": [
   ["C3", "C5"],
   ["C7", "C9"],
   ["E4", "E8"],

 ],

 //for a round-robin tournament of 3 players
 3: [

   ["C4", "C9"],
   ["E7", "E13"],
   ["G10", "G16"],
   ["I13", "I19"],
 ]
}

// Code by Avi Megiddo and ChatGPT