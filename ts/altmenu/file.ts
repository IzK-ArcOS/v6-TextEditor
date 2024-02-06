import { SEP_ITEM } from "$state/Desktop/ts/store";
import { SaveIcon } from "$ts/images/general";
import { ContextMenuItem } from "$types/app";
import { Runtime } from "../runtime";

export function FileMenu(runtime: Runtime): ContextMenuItem {
  return {
    caption: "File",
    subItems: [
      {
        caption: "Open...",
        action: () => runtime.openFile(),
        icon: "file_open",
        accelerator: "Alt+O"
      },
      SEP_ITEM,
      {
        caption: "Save",
        image: SaveIcon,
        action: async () => {
          await runtime.save();
        },
        disabled: () => !runtime.path.get() || !runtime.buffer.get() || runtime.isClient.get(),
        accelerator: "Alt+S"
      },
      {
        caption: "Save As...",
        disabled: () => !runtime.buffer.get(),
        action: async () => await runtime.saveAs(),
        accelerator: "Alt+Shift+S"
      },
      SEP_ITEM,
      {
        caption: "Open file location",
        icon: "folder_open",
        action: () => {
          runtime.openFileLocation();
        },
        disabled: () => !runtime.path.get() || runtime.isClient.get(),
        accelerator: "Alt+Shift+O"
      },
      SEP_ITEM,
      {
        caption: "Exit",
        action: () => { runtime.process.handler.kill(runtime.pid, true) },
        accelerator: "Alt+Q"
      }
    ]
  }
}