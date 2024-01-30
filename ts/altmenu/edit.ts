import { SEP_ITEM } from "$state/Desktop/ts/store";
import { ContextMenuItem } from "$types/app";
import { Runtime } from "../runtime";

export function EditMenu(runtime: Runtime): ContextMenuItem {
  return {
    caption: "Edit",
    subItems: [
      {
        caption: "Select All",
        icon: "select_all",
        action() {
          runtime.selectAll();
        }
      },
      SEP_ITEM,
      {
        caption: "Search & Replace...",
        action() {
          runtime.SearchReplaceDialog();
        }
      }
    ]
  }
}