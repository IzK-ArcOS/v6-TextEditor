<script lang="ts">
  import { MarkdownMimeIcon } from "$ts/images/mime";
  import { onMount } from "svelte";
  import { Pane, Splitpanes } from "svelte-splitpanes";
  import Markdown from "./Components/Markdown.svelte";
  import "./css/main.css";
  import { Runtime } from "./ts/runtime";

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
    <Markdown {runtime} />
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
