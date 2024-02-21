import { AppKeyCombinations } from "$types/accelerator";
import { Runtime } from "./runtime";

export const TextEditorAccelerators: (runtime: Runtime) => AppKeyCombinations = (runtime) => {
  return [
    {
      key: "o",
      alt: true,
      shift: true,
      action() {
        runtime.openFileLocation();
      },
    },
    {
      key: "o",
      alt: true,
      action() {
        runtime.openFile();
      },
    },
    {
      key: "s",
      alt: true,
      action() {
        runtime.save();
      },
    },
    {
      key: "s",
      alt: true,
      shift: true,
      action() {
        runtime.saveAs();
      },
    },
    {
      key: "f3",
      action() {
        runtime.SearchReplaceDialog();
      },
    },
  ];
};
