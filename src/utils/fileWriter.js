const fs = require("fs");

/**
 * Save data to a JSON file
 * @param {Array|Object} data - Data to save
 * @param {string} filename - Output filename (defaults to apartments.json)
 */
function saveToJson(data, filename = "apartments.json") {
  try {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf-8");
    console.log(`\n💾 Data saved to ${filename}`);
  } catch (error) {
    console.error(`Error saving JSON file:`, error.message);
    throw error;
  }
}

/**
 * Save data to a CSV file
 * @param {Array} data - Array of objects to save as CSV
 * @param {string} filename - Output filename (defaults to apartments.csv)
 */
function saveToCsv(data, filename = "apartments.csv") {
  if (!data || data.length === 0) {
    console.log("No data to save.");
    return;
  }

  try {
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(",")];

    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header] || "";
        // Escape quotes and wrap in quotes
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }

    fs.writeFileSync(filename, csvRows.join("\n"), "utf-8");
    console.log(`💾 Data saved to ${filename}`);
  } catch (error) {
    console.error(`Error saving CSV file:`, error.message);
    throw error;
  }
}

/**
 * Display a summary of the first few results
 * @param {Array} data - Array of listings
 * @param {number} count - Number of results to display (default: 3)
 */
function displayResults(data, count = 3) {
  if (!data || data.length === 0) {
    console.log("\nNo results to display.");
    return;
  }

  console.log(`\n--- First ${Math.min(count, data.length)} results ---`);

  data.slice(0, count).forEach((item, i) => {
    console.log(`\n${i + 1}. ${item.title}`);
    console.log(`   Price: ${item.price}`);
    console.log(`   Bedrooms: ${item.bedrooms}`);
    console.log(`   Area: ${item.area}`);
    console.log(`   Tags: ${item.tags}`);
    console.log(`   URL: ${item.url}`);
  });
}

module.exports = {
  saveToJson,
  saveToCsv,
  displayResults,
};
