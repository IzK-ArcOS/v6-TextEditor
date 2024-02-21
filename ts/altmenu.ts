import { ContextMenuItem } from "$types/app";
import { EditMenu } from "./altmenu/edit";
import { FileMenu } from "./altmenu/file";
import { OpenMenu } from "./altmenu/open";
import { ViewMenu } from "./altmenu/view";
import { Runtime } from "./runtime";

export const TextEditorAltMenu: (runtime: Runtime) => ContextMenuItem[] = (runtime: Runtime) => [
  FileMenu(runtime),
  EditMenu(runtime),
  ViewMenu(runtime),
  OpenMenu(runtime),
];
