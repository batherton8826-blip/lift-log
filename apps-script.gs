/**
 * Lift Log sync script.
 *
 * Paste this into the Google Sheet you want the app to save to:
 *   Extensions > Apps Script, replace the code, change SECRET, then
 *   Deploy > New deployment > Web app.
 *   Execute as: Me. Who has access: Anyone.
 * Copy the web app URL it gives you into the app's Settings, with the same SECRET.
 *
 * The script creates the Lifts, Body and Setup tabs if they are missing.
 */

// Change this to your own private word or phrase before deploying.
var SECRET = "change-this-secret";

var TABS = {
  Lifts: ["Date", "Lift", "Weight (kg)", "Set 1 reps", "Set 2 reps", "Set 3 reps"],
  Body: ["Date", "Weight (kg)", "Calories eaten", "How I feel (1-5)"],
  Setup: ["Setting", "Value", "Notes"]
};

function doPost(e) {
  var req;
  try {
    req = JSON.parse(e.postData.contents);
  } catch (err) {
    return out_({ ok: false, error: "bad request" });
  }
  if (SECRET === "change-this-secret") {
    return out_({ ok: false, error: "Change SECRET in the script before using it (secret key not set)" });
  }
  if (req.key !== SECRET) {
    return out_({ ok: false, error: "wrong key" });
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (req.action === "read") {
      return out_({
        ok: true,
        lifts: sheet_(ss, "Lifts").getDataRange().getDisplayValues(),
        body: sheet_(ss, "Body").getDataRange().getDisplayValues(),
        setup: sheet_(ss, "Setup").getDataRange().getDisplayValues()
      });
    }
    if (req.action === "append") {
      if (!TABS[req.tab] || req.tab === "Setup" || !Array.isArray(req.row)) {
        return out_({ ok: false, error: "bad append request" });
      }
      var sh = sheet_(ss, req.tab);
      var r = sh.getLastRow() + 1;
      sh.getRange(r, 1).setNumberFormat("@"); // keep the date as plain text
      sh.getRange(r, 1, 1, req.row.length).setValues([req.row]);
      return out_({ ok: true });
    }
    if (req.action === "setup") {
      var setup = sheet_(ss, "Setup");
      var labels = setup.getRange(1, 1, Math.max(setup.getLastRow(), 1), 1).getValues();
      var row = 0;
      for (var i = 1; i < labels.length; i++) {
        if (String(labels[i][0]) === String(req.label)) { row = i + 1; break; }
      }
      if (!row) {
        row = setup.getLastRow() + 1;
        setup.getRange(row, 1).setValue(req.label);
      }
      setup.getRange(row, 2).setValue(req.value);
      return out_({ ok: true });
    }
    return out_({ ok: false, error: "unknown action" });
  } finally {
    lock.releaseLock();
  }
}

// Lets you check the deployment by opening the web app URL in a browser.
function doGet() {
  return out_({ ok: true, message: "Lift Log script is running. Use the app to save and read entries." });
}

function sheet_(ss, name) {
  var sh = ss.getSheetByName(name);
  if (sh && name === "Body" && sh.getRange(1, 4).getValue() === "Steps") {
    // Older versions of the app logged steps in column D. It now holds how the person feels.
    sh.getRange(1, 4).setValue(TABS.Body[3]);
  }
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, TABS[name].length).setValues([TABS[name]]).setFontWeight("bold");
    sh.setFrozenRows(1);
    if (name !== "Setup") sh.getRange("A2:A").setNumberFormat("@");
  }
  return sh;
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
