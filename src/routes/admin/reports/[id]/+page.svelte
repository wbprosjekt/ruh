<script>
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let report = null;
  let errorMessage = '';
  let id = $page.params.id;
  let editing = false;

  async function fetchReport() {
    const { data, error } = await supabase
      .from('ruh_rapporter')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      errorMessage = 'Rapport ikke funnet';
    } else {
      report = data;
    }
  }

  async function updateReport() {
    const { error } = await supabase
      .from('ruh_rapporter')
      .update({
        sted: report.sted,
        dato: report.dato,
        beskrivelse: report.beskrivelse
      })
      .eq('id', id);

    if (!error) {
      editing = false;
      fetchReport(); // Refresh data
    }
  }

  async function deleteReport() {
    if (confirm('Er du sikker på at du vil slette denne rapporten?')) {
      await supabase.from('ruh_rapporter').delete().eq('id', id);
      window.location.href = '/admin'; // Redirect to admin page after deletion
    }
  }

  onMount(fetchReport);
</script>

<div class="min-h-screen flex flex-col items-center p-6">
  <h1 class="text-3xl font-bold mb-6">Detaljer for rapport</h1>

  {#if errorMessage}
    <p class="text-red-600">{errorMessage}</p>
  {:else if report}
    <div class="bg-white p-6 shadow-md rounded-lg w-full max-w-lg">
      <label>
        <span>Sted:</span>
        <input type="text" bind:value={report.sted} disabled={!editing} class="w-full p-2 border rounded-md" />
      </label>
      <label>
        <span>Dato:</span>
        <input type="date" bind:value={report.dato} disabled={!editing} class="w-full p-2 border rounded-md" />
      </label>
      <label>
        <span>Beskrivelse:</span>
        <textarea bind:value={report.beskrivelse} disabled={!editing} class="w-full p-2 border rounded-md"></textarea>
      </label>
      {#if report.bilde_url}
        <img src={report.bilde_url} class="mt-4 max-w-full rounded-lg" />
      {/if}

      <div class="flex gap-4 mt-4">
        <button on:click={() => (editing = !editing)} class="bg-yellow-500 text-white p-2 rounded-md">
          {editing ? 'Avbryt' : 'Rediger'}
        </button>
        {#if editing}
          <button on:click={updateReport} class="bg-blue-600 text-white p-2 rounded-md">Lagre</button>
        {/if}
        <button on:click={deleteReport} class="bg-red-600 text-white p-2 rounded-md">Slett</button>
      </div>
    </div>
  {/if}
</div>
