<!-- Modal.svelte -->
<script>
    export let isOpen = false;
    export let onClose = () => {};
    export let content = '';
  </script>
  
  {#if isOpen}
    <div class="modal-overlay" on:click={onClose}>
      <div class="modal-content" on:click|stopPropagation>
        <img src={content} alt="Modal Content" />
        <button class="close-button" on:click={onClose}>Close</button>
      </div>
    </div>
  {/if}
  
  <style>
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      background: white;
      padding: 20px;
      border-radius: 5px;
      max-width: 500px;
      width: 100%;
      text-align: center;
    }
    .modal-content img {
      max-width: 100%;
      height: auto;
    }
    .close-button {
      margin-top: 10px;
    }
  </style>
  