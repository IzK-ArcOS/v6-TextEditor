import { getAppById, spawnApp, spawnOverlay } from "$ts/apps";
import { AppRuntime } from "$ts/apps/runtime";
import { TextEditorIcon } from "$ts/images/apps";
import { SaveIcon } from "$ts/images/general";
import { Process } from "$ts/process";
import { textToBlob } from "$ts/server/fs/convert";
import { getParentDirectory } from "$ts/server/fs/dir";
import { readFile, writeFile } from "$ts/server/fs/file";
import { getMimeIcon } from "$ts/server/fs/mime";
import { FileProgress } from "$ts/server/fs/progress";
import { pathToFriendlyName, pathToFriendlyPath } from "$ts/server/fs/util";
import { GetSaveFilePath } from "$ts/stores/apps/file";
import { CountInstances, sleep } from "$ts/util";
import { Store } from "$ts/writable";
import type { App, AppMutator } from "$types/app";
import { ArcFile } from "$types/fs";
import { TextEditorAccelerators } from "./accelerators";
import { TextEditorAltMenu } from "./altmenu";
import { SearchReplace } from "./overlay/SearchReplace";
import { TextEditorDispatchers } from "./store";

export class Runtime extends AppRuntime {
  public File = Store<ArcFile>();
  public buffer = Store<string>();
  public path = Store<string>();
  public wordWrap = Store<boolean>(true);
  public monospace = Store<boolean>(true);
  public spellcheck = Store<boolean>(false);
  public isClient = Store<boolean>(false);
  public markdownPreview = Store<boolean>(false);
  public statusBar = Store<boolean>(true);
  public input: HTMLTextAreaElement;

  constructor(app: App, mutator: AppMutator, process: Process) {
    super(app, mutator, process);

    this.openedFile.subscribe(async (v) => {
      if (!v) return;

      await this.readFile(v);
    });

    if (process.args.length && typeof process.args[0] === "string") {
      this.handleOpenFile(process.args[0]);
    }

    this.loadAltMenu(...TextEditorAltMenu(this));
    this.process.accelerator.store.push(...TextEditorAccelerators(this));
    this.assignDispatchers();
  }

  public setTextarea(input: HTMLTextAreaElement) {
    if (!input) return;

    this.input = input;
  }

  async readFile(v: string) {
    this.path.set(v);

    const { setDone, setErrors } = await this.LoadProgress(v);

    const file = await readFile(v);

    if (!file) {
      setErrors(1);
      setDone(1);

      return;
    }

    const content = await file.data.text();

    this.buffer.set("");
    await sleep(10);
    this.buffer.set(content);

    this.isClient.set(v.startsWith("@client"));
    this.File.set(file);
    this.setWindowTitle(`Editing ${file.name}` + (this.isClient.get() ? " (Read-only)" : ""));
    this.setWindowIcon(getMimeIcon(file.name));

    setDone(1);
  }

  public async save() {
    if (this.isClient.get() || !this.path.get()) return;

    const content = this.buffer.get();
    const path = this.path.get();
    const file = this.File.get();

    const { setDone } = await this.SaveProgress(path);

    const written = await writeFile(path, textToBlob(content, file ? file.mime : null));

    setDone(1);

    return !!written;
  }

  public async saveAs() {
    const path = await GetSaveFilePath(this.pid, {
      title: "Select location to save file",
      icon: SaveIcon,
      startDir: getParentDirectory(this.path.get() || "./"),
    });

    if (!path) return;

    this.path.set(path);

    await this.save();

    this.openedFile.set(path);
  }

  public openFile() {
    spawnOverlay(getAppById("LoadSaveDialog"), this.pid, [
      {
        title: "Select any file to open",
        icon: TextEditorIcon,
        startDir: getParentDirectory(this.path.get() || "./"),
      },
    ]);
  }

  public openFileLocation() {
    const path = this.path.get();

    if (!path || this.isClient.get()) return;

    const split = path.split("/");
    const filename = split[split.length - 1];

    spawnApp("FileManager", 0, [path.replace(filename, "") || ".", path]);
  }

  public selectAll() {
    if (!this.input) return;

    this.input.select();
  }

  public replaceOnce(text: string, replacer: string) {
    const buffer = this.buffer.get();

    this.buffer.set(buffer.replace(text, replacer));
  }

  public async replaceAll(text: string, replacer: string) {
    const occurences = CountInstances(this.buffer.get(), text) + 1;

    for (let i = 0; i < occurences; i++) {
      this.buffer.set(this.buffer.get().replace(text, replacer));

      await sleep(10);
    }
  }

  private assignDispatchers() {
    const dispatchers = TextEditorDispatchers(this);

    for (const event in dispatchers) {
      const dispatcher = dispatchers[event];

      this.process.handler.dispatch.subscribe(this.pid, event, dispatcher);
    }
  }

  SearchReplaceDialog(args: any[] = []) {
    if (this.isClient.get()) return;

    spawnOverlay(SearchReplace, this.process.pid, args);
  }

  public async LoadProgress(v: string = this.path.get()) {
    return await FileProgress(
      {
        caption: "Reading File",
        subtitle: `${pathToFriendlyPath(v)}`,
        icon: TextEditorIcon,
        max: 1,
        done: 0,
        type: "quantity",
        waiting: false,
        working: true,
        errors: 0,
      },
      this.pid,
      false
    );
  }

  public async SaveProgress(v: string = this.path.get()) {
    const filename = pathToFriendlyName(v);

    return await FileProgress(
      {
        caption: `Saving ${filename}`,
        subtitle: `${pathToFriendlyPath(v)}`,
        icon: SaveIcon,
        max: 1,
        done: 0,
        type: "quantity",
        waiting: false,
        working: true,
        errors: 0,
      },
      this.pid,
      false
    );
  }
}
