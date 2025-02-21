<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';

  let sted = '';
  let dato = '';
  let klokkeslett = '';
  let beskrivelse = '';
  let resultat = '';
  let aarsak = '';
  let tiltak = '';
  let bildeUrl = '';
  let reports = [];

  async function fetchReports() {
    const { data, error } = await supabase.from('ruh_rapporter').select('*').order('opprettet', { ascending: false });
    if (error) console.error('Feil ved henting:', error);
    else reports = data;
  }

  async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `images/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from('ruh-bilder').upload(filePath, file);

      if (error) {
        console.error('Feil ved opplasting:', error);
      } else {
        bildeUrl = supabase.storage.from('ruh-bilder').getPublicUrl(filePath);
      }
    }
  }

  async function submitReport() {
    const { data, error } = await supabase.from('ruh_rapporter').insert([
      {
        sted,
        dato,
        klokkeslett,
        beskrivelse,
        resultat,
        aarsak,
        tiltak,
        bilde_url: bildeUrl
      }
    ]);
    if (error) {
      console.error('Feil ved innsending:', error);
    } else {
      alert('RUH-rapport sendt inn!');
      sted = dato = klokkeslett = beskrivelse = resultat = aarsak = tiltak = '';
      bildeUrl = '';
      fetchReports();
    }
  }

  onMount(() => {
    fetchReports();

    // Lytt etter sanntidsoppdateringer
    supabase
      .channel('ruh_rapporter')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ruh_rapporter' }, (payload) => {
        reports = [payload.new, ...reports];
      })
      .subscribe();
  });
</script>

<h1>RUH-rapportering</h1>
<form on:submit|preventDefault={submitReport}>
  <label>Sted:
    <input type="text" bind:value={sted} required />
  </label>
  
  <label>Dato:
    <input type="date" bind:value={dato} required />
  </label>
  
  <label>Klokkeslett:
    <input type="time" bind:value={klokkeslett} required />
  </label>
  
  <label>Beskrivelse av hendelsen:
    <textarea bind:value={beskrivelse} required></textarea>
  </label>
  
  <label>Resultat/utfall:
    <textarea bind:value={resultat} required></textarea>
  </label>
  
  <label>Årsak:
    <textarea bind:value={aarsak} required></textarea>
  </label>
  
  <label>Tiltak:
    <textarea bind:value={tiltak} required></textarea>
  </label>
  
  <label>Last opp bilde:
    <input type="file" accept="image/*" on:change={handleFileUpload} />
  </label>
  
  <button type="submit">Send inn rapport</button>
</form>

<h1>RUH-rapporter</h1>
{#if reports.length === 0}
  <p>Ingen rapporter ennå.</p>
{:else}
  <ul>
    {#each reports as report}
      <li>
        <strong>{report.sted}</strong> - {report.dato}
        <p>{report.beskrivelse}</p>
        {#if report.bilde_url}
          <img src={report.bilde_url} alt="Vedlagt bilde" width="200">
        {/if}
      </li>
    {/each}
  </ul>
{/if}
