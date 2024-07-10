<!-- src/lib/components/ImageModal.svelte -->
<script>
    export let imageURL = '';
    export let showModal = false;
    export let onClose = () => {};
  
    function closeModal() {
      onClose();
    }
  </script>
  
  {#if showModal}
    <div class="modal-background" on:click={closeModal}>
      <div class="modal-content" on:click|stopPropagation>
        <img src={imageURL} alt="Image" />
      </div>
    </div>
  {/if}
  
  <style>
    .modal-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal-content {
      max-width: 90%;
      max-height: 90%;
    }
    .modal-content img {
      width: 100%;
      height: auto;
    }
  </style>
  