<script lang="ts">
  import { onMount } from "svelte";
  import "./css/main.css";
  import { Runtime } from "./ts/runtime";
  import { Pane, Splitpanes } from "svelte-splitpanes";
  import MarkdownRenderer from "$lib/Components/MarkdownRenderer.svelte";
  import { MarkdownMimeIcon } from "$ts/images/mime";

  export let runtime: Runtime;

  const {
    wordWrap,
    monospace,
    spellcheck,
    buffer,
    isClient,
    markdownPreview,
    statusBar,
    path,
    File,
  } = runtime;

  let input: HTMLTextAreaElement;

  onMount(() => {
    runtime.setTextarea(input);
  });
</script>

<Splitpanes>
  <Pane minSize={$markdownPreview ? 25 : 100}>
    <textarea
      bind:value={$buffer}
      bind:this={input}
      class:nowrap={!$wordWrap}
      class:monospace={$monospace}
      spellcheck={$spellcheck}
      readonly={$isClient}
      wrap="soft"
    />
  </Pane>
  {#if $markdownPreview}
    <Pane minSize={25}>
      <MarkdownRenderer content={$buffer}></MarkdownRenderer>
    </Pane>
  {/if}
</Splitpanes>
{#if $statusBar && $path && $File}
  <div class="statusbar">
    <div class="segment file">
      <img src={MarkdownMimeIcon} alt="" />
      <span>{$File.name}</span>
    </div>
  </div>
{/if}
