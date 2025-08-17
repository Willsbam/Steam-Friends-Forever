
const { parse } = require('csv-parse');
const fs = require('fs');

let allGames = new Map(); // This will hold all games with their IDs as keys

class Game{
    //int, string, list of strings
    constructor(id, name, inputCategories) {
        this.id = id; // Game ID
        this.name = name; // Game Name
        this.inputCategories = inputCategories; // Array of input categories
    }
}

function readGameCSV()
{
    return loadCSVToMap("./model/games.csv");
}

function loadCSVToMap(filePath, processRow = null) {
console.log("Loading CSV file:", filePath);
  return new Promise((resolve, reject) => {
    
    fs.createReadStream(filePath)
      .pipe(
        parse({
         columns: true,
          skip_empty_lines: true,
          trim: true,
          // These options handle quoted fields properly:
          quote: '"',           // Character used to quote fields
          escape: '"',          // Character used to escape quotes within quoted fields
          relax_quotes: false,  // Don't be relaxed about quotes (ensures proper handling)
          relax_column_count: true, // Allow rows to have inconsistent column counts (safer)
          trim: true
        })
      )
      .on('data', (row) => {
        // Get the key from the specified column
        const id = row["AppID"];
        const name = row["Name"];
        const tags=row["Screenshots"];
        
        allGames.set(id, new Game(id, name, tags.split(',')));

      })
      .on('end', () => {
        console.log("Finished loading CSV file:");
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}
module.exports = { Game, allGames, readGameCSV };