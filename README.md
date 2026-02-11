# Drive File Mover (GAS)

## Overview
- Moves up to 100 files per run from a source folder to an auto-created destination folder.
- Runs every hour via a time-driven trigger.
- Files are moved from the source folder root only (no recursion).

## Setup (clasp)
1. Create a new Apps Script project:

   ```bash
   clasp create --type standalone --title "Drive File Mover"
   ```

2. Push this code to Apps Script:

   ```bash
   clasp push
   ```

3. Set script properties in Apps Script:
   - SOURCE_FOLDER_ID
   - DEST_PARENT_FOLDER_ID
   - DEST_FOLDER_NAME (optional)
   - MAX_FILES_PER_RUN (optional)

4. Optional: run setConfig once from the editor to create the keys, then edit values
   in Project Settings > Script properties.

5. Run these functions once from the editor:
   - runMove
   - setupTrigger

## Setup (Git + GitHub)
1. Initialize a git repo and commit:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a GitHub repo and push:

   ```bash
   gh repo create driveFileMover --public --source . --remote origin --push
   ```

## Notes
- If more than 100 files exist, remaining files move on the next run.
- To reset the schedule, run setupTrigger again (it replaces existing triggers).
