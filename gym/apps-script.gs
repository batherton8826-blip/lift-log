/**
 * Gym app sync script.
 *
 * Paste this into the Gym Google Sheet: Extensions > Apps Script, replace the code,
 * then Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 * Send the web app URL back so the one-tap set-up link can be made.
 *
 * The script creates the Log, Body, Plan and Setup tabs if they are missing.
 */

// Put your own private phrase between the quotes before deploying. The set-up link
// must use the same phrase. The script refuses to work while it is empty.
var SECRET = "";

var TABS = {
  Log: ["Date", "Session", "Exercise ID", "Exercise", "Type", "Weight (kg)", "Set 1", "Set 2", "Set 3"],
  Body: ["Date", "Weight (kg)"],
  Plan: ["Session", "Order", "Exercise ID", "Exercise", "Catalogue", "Type", "Per", "Start", "Step (kg)", "Settings note", "Equipment", "No weight", "How to"],
  Setup: ["Setting", "Value"]
};

function doPost(e) {
  var req;
  try {
    req = JSON.parse(e.postData.contents);
  } catch (err) {
    return out_({ ok: false, error: "bad request" });
  }
  if (!SECRET) return out_({ ok: false, error: "secret key not set" });
  if (req.key !== SECRET) return out_({ ok: false, error: "wrong key" });

  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (req.action === "read") {
      return out_({
        ok: true,
        log: sheet_(ss, "Log").getDataRange().getDisplayValues(),
        body: sheet_(ss, "Body").getDataRange().getDisplayValues(),
        plan: sheet_(ss, "Plan").getDataRange().getDisplayValues(),
        setup: sheet_(ss, "Setup").getDataRange().getDisplayValues()
      });
    }
    if (req.action === "append") {
      if ((req.tab !== "Log" && req.tab !== "Body") || !Array.isArray(req.row)) {
        return out_({ ok: false, error: "bad append request" });
      }
      var sh = sheet_(ss, req.tab);
      var r = sh.getLastRow() + 1;
      sh.getRange(r, 1).setNumberFormat("@");
      sh.getRange(r, 1, 1, req.row.length).setValues([req.row]);
      return out_({ ok: true });
    }
    if (req.action === "plan") {
      // Replaces the whole plan with the one on the phone.
      if (!Array.isArray(req.rows)) return out_({ ok: false, error: "bad plan request" });
      var p = sheet_(ss, "Plan");
      var last = p.getLastRow();
      if (last > 1) p.getRange(2, 1, last - 1, TABS.Plan.length).clearContent();
      var rows = req.rows.filter(function (x) { return Array.isArray(x); }).map(function (x) {
        var row = x.slice(0, TABS.Plan.length);
        while (row.length < TABS.Plan.length) row.push("");
        return row;
      });
      if (rows.length) {
        p.getRange(2, 3, rows.length, 1).setNumberFormat("@");
        p.getRange(2, 1, rows.length, TABS.Plan.length).setValues(rows);
      }
      return out_({ ok: true });
    }
    if (req.action === "setup") {
      // req.values is { label: value, ... }; each label gets one row.
      var values = req.values || {};
      var setup = sheet_(ss, "Setup");
      var have = setup.getRange(1, 1, Math.max(setup.getLastRow(), 1), 1).getDisplayValues();
      Object.keys(values).forEach(function (label) {
        var row = 0;
        for (var i = 1; i < have.length; i++) {
          if (have[i][0] === label) { row = i + 1; break; }
        }
        if (!row) {
          row = setup.getLastRow() + 1;
          setup.getRange(row, 1).setValue(label);
          have.push([label]);
        }
        setup.getRange(row, 2).setNumberFormat("@");
        setup.getRange(row, 2).setValue(values[label] == null ? "" : String(values[label]));
      });
      return out_({ ok: true });
    }
    return out_({ ok: false, error: "unknown action" });
  } finally {
    lock.releaseLock();
  }
}

// Open the web app URL in a browser to check the deployment.
function doGet() {
  return out_({ ok: true, message: "Gym script is running. Use the app to save and read entries." });
}

function sheet_(ss, name) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, TABS[name].length).setValues([TABS[name]]).setFontWeight("bold");
    sh.setFrozenRows(1);
    if (name !== "Setup" && name !== "Plan") sh.getRange("A2:A").setNumberFormat("@");
  }
  return sh;
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
