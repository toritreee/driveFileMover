const CONFIG = {
  SOURCE_FOLDER_ID: "",
  DEST_PARENT_FOLDER_ID: "",
  DEST_FOLDER_NAME: "Moved Files",
  MAX_FILES_PER_RUN: 100
};

function runMove() {
  validateConfig_();

  var source = DriveApp.getFolderById(CONFIG.SOURCE_FOLDER_ID);
  var destParent = DriveApp.getFolderById(CONFIG.DEST_PARENT_FOLDER_ID);
  var dest = getOrCreateDestFolder_(destParent, CONFIG.DEST_FOLDER_NAME);

  var files = source.getFiles();
  var moved = 0;

  while (files.hasNext() && moved < CONFIG.MAX_FILES_PER_RUN) {
    var file = files.next();
    file.moveTo(dest);
    moved++;
  }

  Logger.log("Moved " + moved + " file(s).");
}

function setupTrigger() {
  removeExistingTriggers_("runMove");
  ScriptApp.newTrigger("runMove")
    .timeBased()
    .everyHours(1)
    .create();
}

function getOrCreateDestFolder_(parent, name) {
  var existing = parent.getFoldersByName(name);
  if (existing.hasNext()) {
    return existing.next();
  }
  return parent.createFolder(name);
}

function removeExistingTriggers_(handlerFunctionName) {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    var trigger = triggers[i];
    if (trigger.getHandlerFunction() === handlerFunctionName) {
      ScriptApp.deleteTrigger(trigger);
    }
  }
}

function validateConfig_() {
  if (!CONFIG.SOURCE_FOLDER_ID) {
    throw new Error("SOURCE_FOLDER_ID is required.");
  }
  if (!CONFIG.DEST_PARENT_FOLDER_ID) {
    throw new Error("DEST_PARENT_FOLDER_ID is required.");
  }
}
