import { Runtime } from "./runtime";

export function TextEditorDispatchers(runtime: Runtime): Record<string, (...data: any[]) => void> {
  return {
    "replace-one": (data: [string, string]) => {
      runtime.replaceOnce(data[0], data[1]);
    },
    "replace-all": (data: [string, string]) => {
      runtime.replaceAll(data[0], data[1]);
    }
  }
}