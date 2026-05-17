/**
 * 10_CycleNet通帳管理 テンプレート設定
 * 拡張機能 > Apps Script に貼り付け → setupPassbookTemplate → installPassbookTriggers
 */
var PASSBOOK_SHEET_ID = "11WIRlDb80m5UPq0q2dqINdi5H3PTlRPtsGZt6Pv-Si4";

var PASSBOOK_HEADER_ROW = 4;
var PASSBOOK_DATA_START_ROW = 5;

var FILTER_MODE_LIST = ["年のみ", "月のみ", "年と月"];

var KUBUN_LIST = [
  "外注費",
  "制作費",
  "出演費",
  "宣伝・協賛費",
  "営業費",
  "修繕・開発費",
  "仕入れ",
  "人件費",
  "資金移動",
  "手数料",
  "返済・リース",
  "その他",
];

var BANK_LIST = ["GMOあおぞら銀行", "三井住友銀行", "りそな銀行"];

var DEPT_LIST = [
  "制作・運営費",
  "協賛金",
  "参加費（チケット）",
  "物販",
  "資金移動",
  "借入",
  "その他",
];

var HEADER_LABELS = [
  "日付",
  "取引先",
  "入金金額",
  "出金金額",
  "手数料",
  "区分",
  "銀行名",
  "部署区分",
];

var SORTABLE_HEADER_COLS = [1, 2, 3, 4, 6, 7, 8];

var SETUP_MARKER = "通帳テンプレ設定済";

function getPassbookSpreadsheet_() {
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}
  return SpreadsheetApp.openById(PASSBOOK_SHEET_ID);
}

function getPassbookSheet_(ss) {
  var preferred = [
    "CycleNet通帳管理_import",
    "10_CycleNet通帳管理",
    "通帳管理",
  ];
  for (var i = 0; i < preferred.length; i++) {
    var s = ss.getSheetByName(preferred[i]);
    if (s) return s;
  }
  var sheets = ss.getSheets();
  for (var j = 0; j < sheets.length; j++) {
    if (sheets[j].getName().indexOf("通帳") !== -1) return sheets[j];
  }
  return sheets[0];
}

function isDateLike_(v) {
  if (v instanceof Date) return true;
  if (typeof v === "number" && v > 30000 && v < 60000) return true;
  if (typeof v === "string" && /^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(v)) return true;
  return false;
}

function extractPassbookData_(sheet) {
  var rows = [];
  var lastRow = Math.max(sheet.getLastRow(), 1);
  for (var r = 1; r <= lastRow; r++) {
    var a = sheet.getRange(r, 1).getValue();
    if (!isDateLike_(a)) continue;
    rows.push(sheet.getRange(r, 1, 1, 8).getValues()[0]);
  }
  return rows;
}

function parseYear_(v) {
  if (v === null || v === "" || v === undefined) return null;
  if (typeof v === "number") return Math.floor(v);
  var m = String(v).match(/(\d{4})/);
  return m ? parseInt(m[1], 10) : null;
}

function parseMonth_(v) {
  if (v === null || v === "" || v === undefined) return null;
  if (typeof v === "number") return Math.floor(v);
  var m = String(v).match(/(\d{1,2})/);
  if (!m) return null;
  var mo = parseInt(m[1], 10);
  return mo >= 1 && mo <= 12 ? mo : null;
}

function toDate_(v) {
  if (v instanceof Date) return v;
  if (typeof v === "number") return new Date(Math.round((v - 25569) * 86400 * 1000));
  var d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

function passesFilter_(dateVal, mode, year, month) {
  var d = toDate_(dateVal);
  if (!d) return false;
  var y = d.getFullYear();
  var m = d.getMonth() + 1;
  if (mode === "年のみ") return year ? y === year : true;
  if (mode === "月のみ") return month ? m === month : true;
  if (mode === "年と月") {
    if (year && month) return y === year && m === month;
    if (year) return y === year;
    if (month) return m === month;
    return true;
  }
  return true;
}

function setupPassbookTemplate() {
  var ss = getPassbookSpreadsheet_();
  var sheet = getPassbookSheet_(ss);
  var data = extractPassbookData_(sheet);

  setupListsSheet_(ss);
  setupLayoutRows_(sheet);
  setupFilterRow_(sheet, ss);
  setupHeaderRow_(sheet);
  setupSummaryFormulas_(sheet);

  var lastDataRow = Math.max(sheet.getLastRow(), PASSBOOK_DATA_START_ROW + 50);
  if (lastDataRow >= PASSBOOK_DATA_START_ROW) {
    sheet.getRange(PASSBOOK_DATA_START_ROW, 1, lastDataRow - PASSBOOK_DATA_START_ROW + 1, 8).clearContent();
  }

  if (data.length > 0) {
    sheet.getRange(PASSBOOK_DATA_START_ROW, 1, data.length, 8).setValues(data);
  }

  setupValidations_(sheet, ss);
  applyFormatting_(sheet);
  applyPassbookFilter_(sheet);
  sheet.getRange("J1").setValue(SETUP_MARKER);
  sheet.getRange("J4").clearContent();
  sheet.getRange("J5").setValue("asc");

  SpreadsheetApp.flush();
  Logger.log("完了: " + sheet.getName());
  return ss.getUrl();
}

function setupLayoutRows_(sheet) {
  sheet.getRange("C1").setValue("入金合計");
  sheet.getRange("D1").setValue("出金合計");
  sheet.getRange("A2").setValue("絞込");
  sheet.getRange("E3").setValue("年");
  sheet.getRange("F3").setValue("月");
  sheet.getRange(1, 1, 1, 2).setFontWeight("bold");
  sheet.getRange(1, 3, 1, 4).setFontWeight("bold");
}

function setupListsSheet_(ss) {
  var lists =
    ss.getSheetByName("_Lists") ||
    ss.insertSheet("_Lists").hideSheet();
  lists.clear();

  lists.getRange(1, 1, KUBUN_LIST.length, 1).setValues(
    KUBUN_LIST.map(function (v) {
      return [v];
    }),
  );
  lists.getRange(1, 2, BANK_LIST.length, 1).setValues(
    BANK_LIST.map(function (v) {
      return [v];
    }),
  );
  lists.getRange(1, 3, DEPT_LIST.length, 1).setValues(
    DEPT_LIST.map(function (v) {
      return [v];
    }),
  );

  var years = [];
  for (var y = new Date().getFullYear() + 1; y >= 2022; y--) {
    years.push([y + "年"]);
  }
  lists.getRange(1, 4, years.length, 1).setValues(years);

  var months = [];
  for (var m = 1; m <= 12; m++) {
    months.push([m + "月"]);
  }
  lists.getRange(1, 5, months.length, 1).setValues(months);

  lists.getRange(1, 6, FILTER_MODE_LIST.length, 1).setValues(
    FILTER_MODE_LIST.map(function (v) {
      return [v];
    }),
  );
}

function setupFilterRow_(sheet, ss) {
  var lists = ss.getSheetByName("_Lists");

  var modeRule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(lists.getRange(1, 6, FILTER_MODE_LIST.length, 1), true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange("B2").setDataValidation(modeRule);

  var yearCount = lists.getRange("D:D").getValues().filter(function (r) {
    return r[0] !== "";
  }).length;
  var yearRule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(lists.getRange(1, 4, yearCount, 1), true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange("E2").setDataValidation(yearRule);

  var monthRule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(lists.getRange(1, 5, 12, 1), true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange("F2").setDataValidation(monthRule);

  var now = new Date();
  if (!sheet.getRange("B2").getValue()) sheet.getRange("B2").setValue("年と月");
  if (!sheet.getRange("E2").getValue()) sheet.getRange("E2").setValue(now.getFullYear() + "年");
  if (!sheet.getRange("F2").getValue()) sheet.getRange("F2").setValue(now.getMonth() + 1 + "月");

  sheet.getRange("C2").setNumberFormat("#,##0");
  sheet.getRange("D2").setNumberFormat("#,##0");
  updateFilterInputs_(sheet);
}

function updateFilterInputs_(sheet) {
  var mode = sheet.getRange("B2").getValue();
  var e2 = sheet.getRange("E2");
  var f2 = sheet.getRange("F2");

  if (mode === "年のみ") {
    e2.setBackground("#ffffff").setFontColor("#000000");
    f2.clearContent().setBackground("#f0f0f0").setFontColor("#999999");
  } else if (mode === "月のみ") {
    e2.clearContent().setBackground("#f0f0f0").setFontColor("#999999");
    f2.setBackground("#ffffff").setFontColor("#000000");
  } else {
    e2.setBackground("#ffffff").setFontColor("#000000");
    f2.setBackground("#ffffff").setFontColor("#000000");
    var now = new Date();
    if (!e2.getValue()) e2.setValue(now.getFullYear() + "年");
    if (!f2.getValue()) f2.setValue(now.getMonth() + 1 + "月");
  }
}

function setupHeaderRow_(sheet) {
  var headers = [HEADER_LABELS.slice()];
  headers[0][0] = "日付 ▼";
  headers[0][1] = "取引先 ▼";
  headers[0][2] = "入金金額 ▼";
  headers[0][3] = "出金金額 ▼";
  headers[0][5] = "区分 ▼";
  headers[0][6] = "銀行名 ▼";
  headers[0][7] = "部署区分 ▼";
  sheet
    .getRange(PASSBOOK_HEADER_ROW, 1, 1, 8)
    .setValues(headers)
    .setFontWeight("bold")
    .setBackground("#e8eef4");
}

function updateHeaderSortIndicators_(sheet, activeCol, ascending) {
  var arrow = ascending ? " ▲" : " ▼";
  var labels = HEADER_LABELS.slice();
  for (var i = 0; i < SORTABLE_HEADER_COLS.length; i++) {
    var c = SORTABLE_HEADER_COLS[i];
    labels[c - 1] = HEADER_LABELS[c - 1] + (c === activeCol ? arrow : " ▼");
  }
  sheet.getRange(PASSBOOK_HEADER_ROW, 1, 1, 8).setValues([labels]);
}

function setupSummaryFormulas_(sheet) {
  sheet.getRange("C2").setFormula("=SUBTOTAL(109,C5:C3000)");
  sheet.getRange("D2").setFormula("=SUBTOTAL(109,D5:D3000)");
}

function setupValidations_(sheet, ss) {
  var lists = ss.getSheetByName("_Lists");
  var lastRow = Math.max(sheet.getLastRow(), 500);
  var numRows = lastRow - PASSBOOK_DATA_START_ROW + 1;

  var kubunRule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(lists.getRange(1, 1, KUBUN_LIST.length, 1), true)
    .setAllowInvalid(false)
    .build();
  var bankRule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(lists.getRange(1, 2, BANK_LIST.length, 1), true)
    .setAllowInvalid(false)
    .build();
  var deptRule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(lists.getRange(1, 3, DEPT_LIST.length, 1), true)
    .setAllowInvalid(false)
    .build();

  if (numRows > 0) {
    sheet.getRange(PASSBOOK_DATA_START_ROW, 6, numRows, 1).setDataValidation(kubunRule);
    sheet.getRange(PASSBOOK_DATA_START_ROW, 7, numRows, 1).setDataValidation(bankRule);
    sheet.getRange(PASSBOOK_DATA_START_ROW, 8, numRows, 1).setDataValidation(deptRule);
    sheet.getRange(PASSBOOK_DATA_START_ROW, 1, numRows, 1).setNumberFormat("yyyy/mm/dd");
    sheet.getRange(PASSBOOK_DATA_START_ROW, 3, numRows, 3).setNumberFormat("#,##0");
  }
}

function applyPassbookFilter_(sheet) {
  var mode = sheet.getRange("B2").getValue();
  var year = parseYear_(sheet.getRange("E2").getValue());
  var month = parseMonth_(sheet.getRange("F2").getValue());
  var lastRow = sheet.getLastRow();
  if (lastRow < PASSBOOK_DATA_START_ROW) return;

  var totalRows = lastRow - PASSBOOK_DATA_START_ROW + 1;
  sheet.showRows(PASSBOOK_DATA_START_ROW, totalRows);

  var r = PASSBOOK_DATA_START_ROW;
  while (r <= lastRow) {
    var dateVal = sheet.getRange(r, 1).getValue();
    if (passesFilter_(dateVal, mode, year, month)) {
      r++;
      continue;
    }
    var hideStart = r;
    while (r <= lastRow) {
      dateVal = sheet.getRange(r, 1).getValue();
      if (passesFilter_(dateVal, mode, year, month)) break;
      r++;
    }
    sheet.hideRows(hideStart, r - hideStart);
  }
}

function sortPassbookData_(sheet, col) {
  var lastRow = sheet.getLastRow();
  if (lastRow < PASSBOOK_DATA_START_ROW) return;

  var prevCol = sheet.getRange("J4").getValue();
  var ascending = true;
  if (prevCol === col) {
    ascending = sheet.getRange("J5").getValue() !== "asc";
  }
  sheet.getRange("J4").setValue(col);
  sheet.getRange("J5").setValue(ascending ? "asc" : "desc");

  var numRows = lastRow - PASSBOOK_DATA_START_ROW + 1;
  var range = sheet.getRange(PASSBOOK_DATA_START_ROW, 1, numRows, 8);

  if (col === 2) {
    range.sort({ column: 2, ascending: ascending });
  } else if (col === 3 || col === 4) {
    range.sort({ column: col, ascending: ascending });
  } else {
    range.sort({ column: col, ascending: ascending });
  }

  updateHeaderSortIndicators_(sheet, col, ascending);
  applyPassbookFilter_(sheet);
}

function applyFormatting_(sheet) {
  var lastRow = Math.max(sheet.getLastRow(), 500);
  var dataRange = sheet.getRange(1, 1, lastRow, 8);

  sheet.setFrozenRows(PASSBOOK_HEADER_ROW);

  sheet.getRange(2, 1, 1, 8).setBackground("#f3f6f9");
  sheet.getRange("C2").setBackground("#e8f4ea");
  sheet.getRange("D2").setBackground("#fdecea");

  var rules = sheet.getConditionalFormatRules().filter(function (r) {
    var notation = r.getRanges()[0].getA1Notation();
    return notation.indexOf(String(PASSBOOK_DATA_START_ROW) + ":") === -1;
  });

  var numRows = lastRow - PASSBOOK_DATA_START_ROW + 1;
  if (numRows > 0) {
    rules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(
          "=AND(ROW()>=" +
            PASSBOOK_DATA_START_ROW +
            ",ISEVEN(ROW()))",
        )
        .setBackground("#f7f9fc")
        .setRanges([sheet.getRange(PASSBOOK_DATA_START_ROW, 1, numRows, 8)])
        .build(),
    );
  }

  sheet.setConditionalFormatRules(rules);

  dataRange.setBorder(true, true, true, true, true, true, "#d0d7de", SpreadsheetApp.BorderStyle.SOLID);
  dataRange.setBorder(null, null, null, null, null, true, "#e8eaed", SpreadsheetApp.BorderStyle.SOLID);

  sheet.getRange(PASSBOOK_HEADER_ROW, 1, 1, 8).setNote(
    "見出しセルをクリックするとソートします（もう一度クリックで昇順・降順を切り替え）。",
  );
}

function installPassbookTriggers() {
  var ssId = getPassbookSpreadsheet_().getId();
  ScriptApp.getProjectTriggers().forEach(function (t) {
    var fn = t.getHandlerFunction();
    if (
      fn === "onEditPassbook" ||
      fn === "onSelectionChangePassbook"
    ) {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger("onEditPassbook").forSpreadsheet(ssId).onEdit().create();
  ScriptApp.newTrigger("onSelectionChangePassbook")
    .forSpreadsheet(ssId)
    .onSelectionChange()
    .create();
}

/** @deprecated installPassbookTriggers を使用 */
function installPassbookTrigger() {
  installPassbookTriggers();
}

function onEditPassbook(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  if (sheet.getRange("J1").getValue() !== SETUP_MARKER) return;

  var row = e.range.getRow();
  var col = e.range.getColumn();

  if (row === 2 && (col === 2 || col === 5 || col === 6)) {
    updateFilterInputs_(sheet);
    applyPassbookFilter_(sheet);
    return;
  }

  if (row >= PASSBOOK_DATA_START_ROW && col >= 2 && col <= 8) {
    var dateCell = sheet.getRange(row, 1);
    if (!dateCell.getValue()) {
      dateCell.setValue(new Date());
      dateCell.setNumberFormat("yyyy/mm/dd");
    }
  }
}

function onSelectionChangePassbook(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  if (sheet.getRange("J1").getValue() !== SETUP_MARKER) return;
  if (e.range.getRow() !== PASSBOOK_HEADER_ROW) return;

  var col = e.range.getColumn();
  if (SORTABLE_HEADER_COLS.indexOf(col) === -1) return;

  sortPassbookData_(sheet, col);
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("通帳管理")
    .addItem("テンプレートを再適用", "setupPassbookTemplate")
    .addItem("絞込を再適用", "menuApplyPassbookFilter")
    .addToUi();
}

function menuApplyPassbookFilter() {
  var sheet = getPassbookSheet_(getPassbookSpreadsheet_());
  applyPassbookFilter_(sheet);
}
