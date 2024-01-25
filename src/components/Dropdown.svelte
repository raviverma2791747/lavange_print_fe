<script>
  //@ts-nocheck
  export let open = false;
  let class_ = "";
  export let classContent = "";
  export let triggerClass = "";

  export { class_ as class };
</script>

<div class={`relative ${class_}`}>
  <button
    class={triggerClass}
    on:click={() => {
      setTimeout(() => {
        open = !open;
      }, 200);
    }}
    on:blur={() => {
      setTimeout(() => {
        open = false;
      }, 200);
    }}
  >
    <slot name="trigger" />
  </button>
  <div class="absolute top-full right-0 z-20" class:hidden={!open}>
    <slot name="menu" />
  </div>
</div>
