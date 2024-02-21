<script lang="ts">
  import { AppRuntime } from "$ts/apps";
  import { ProcessStack } from "$ts/stores/process";

  let search = "";
  let replace = "";

  export let runtime: AppRuntime;

  const pid = runtime.process.parentPid;

  function once() {
    ProcessStack.dispatch.dispatchToPid(pid, "replace-one", [search, replace]);
  }

  function all() {
    ProcessStack.dispatch.dispatchToPid(pid, "replace-all", [search, replace]);
  }

  function close() {
    runtime.closeApp();
  }
</script>

<div class="top">
  <div class="row">
    <span>Search:</span>
    <input type="text" placeholder="Windows" bind:value={search} />
  </div>
  <div class="row">
    <span>Replace With:</span>
    <input type="text" placeholder="ArcOS" bind:value={replace} />
  </div>
</div>

<div class="bottom">
  <button class="close" on:click={close}>Close</button>
  <button disabled={!search || !replace} on:click={once}>Once</button>
  <button disabled={!search || !replace} class="suggested" on:click={all}>All</button>
</div>

<style scoped>
  div.top {
    padding: 20px;
  }

  div.row {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    margin-bottom: 10px;
  }

  div.bottom {
    display: flex;
    gap: 10px;
    height: 50px;
    padding: 10px;
    background-color: var(--button-bg);
    border-top: var(--win-border);
    margin-top: 10px;
  }

  div.bottom button {
    margin: 0;
    height: 30px;
  }

  div.bottom button.close {
    margin-right: auto;
  }

  ::placeholder {
    opacity: 0.2;
  }
</style>
