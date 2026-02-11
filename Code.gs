var CONFIG_DEFAULTS = {
  DEST_FOLDER_NAME: "Moved Files",
  MAX_FILES_PER_RUN: 100
};

function setConfig() {
  var props = PropertiesService.getScriptProperties();
  props.setProperties({
    SOURCE_FOLDER_ID: "",
    DEST_PARENT_FOLDER_ID: "",
    DEST_FOLDER_NAME: CONFIG_DEFAULTS.DEST_FOLDER_NAME,
    MAX_FILES_PER_RUN: String(CONFIG_DEFAULTS.MAX_FILES_PER_RUN)
  }, false);
}

function runMove() {
  var config = getConfig_();
  validateConfig_(config);

  var source = DriveApp.getFolderById(config.SOURCE_FOLDER_ID);
  var destParent = DriveApp.getFolderById(config.DEST_PARENT_FOLDER_ID);
  var dest = getOrCreateDestFolder_(destParent, config.DEST_FOLDER_NAME);

  var files = source.getFiles();
  var moved = 0;

  while (files.hasNext() && moved < config.MAX_FILES_PER_RUN) {
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
  var config = getConfig_();
  if (!config.SOURCE_FOLDER_ID) {
    throw new Error("SOURCE_FOLDER_ID is required.");
  }
  if (!config.DEST_PARENT_FOLDER_ID) {
    throw new Error("DEST_PARENT_FOLDER_ID is required.");
  }
}

function getConfig_() {
  var props = PropertiesService.getScriptProperties();
  var maxFilesRaw = props.getProperty("MAX_FILES_PER_RUN");
  var maxFiles = parseInt(maxFilesRaw, 10);

  if (isNaN(maxFiles)) {
    maxFiles = CONFIG_DEFAULTS.MAX_FILES_PER_RUN;
  }

  return {
    SOURCE_FOLDER_ID: props.getProperty("SOURCE_FOLDER_ID") || "",
    DEST_PARENT_FOLDER_ID: props.getProperty("DEST_PARENT_FOLDER_ID") || "",
    DEST_FOLDER_NAME: props.getProperty("DEST_FOLDER_NAME") || CONFIG_DEFAULTS.DEST_FOLDER_NAME,
    MAX_FILES_PER_RUN: maxFiles
  };
}
