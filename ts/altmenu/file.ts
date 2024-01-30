import { SEP_ITEM } from "$state/Desktop/ts/store";
import { ContextMenuItem } from "$types/app";
import { Runtime } from "../runtime";

export function FileMenu(runtime: Runtime): ContextMenuItem {
  return {
    caption: "File",
    subItems: [
      {
        caption: "Open...",
        action: () => runtime.openFile(),
      },
      SEP_ITEM,
      {
        caption: "Save",
        action: async () => {
          await runtime.save();
        },
        disabled: () => !runtime.path.get() || !runtime.buffer.get(),
      },
      {
        caption: "Save As...",
        disabled: () => !runtime.buffer.get(),
        action: async () => await runtime.saveAs(),
      },
      SEP_ITEM,
      {
        caption: "Open file location",
        action: () => {
          runtime.openFileLocation();
        },
        disabled: () => !runtime.path.get()
      },
      SEP_ITEM,
      {
        caption: "Exit",
        action: () => runtime.process.handler.kill(runtime.pid, true)
      }
    ]
  }
}