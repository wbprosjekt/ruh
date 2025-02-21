<script>
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';

  let sted = '';
  let dato = '';
  let klokkeslett = '';
  let beskrivelse = '';
  let resultat = '';
  let aarsak = '';
  let tiltak = '';
  let bildeUrl = '';
  let reports = [];
  let loading = false;

  async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const filePath = `images/${Date.now()}_${file.name}`;
    console.log("Uploading file to:", filePath);
    const { data, error } = await supabase.storage.from('ruh-bilder').upload(filePath, file);
    
    if (error) {
      console.error("❌ File upload error:", error);
      alert("Feil ved opplasting: " + error.message);
    } else {
      bildeUrl = supabase.storage.from('ruh-bilder').getPublicUrl(filePath);
      console.log("✅ File uploaded successfully:", bildeUrl);
    }
  }

  async function submitReport() {
    loading = true;
    console.log("Submitting report...");

    const reportData = {
      sted,
      dato,
      klokkeslett,
      beskrivelse,
      resultat,
      aarsak,
      tiltak,
      bilde_url: bildeUrl
    };

    const { data, error } = await supabase.from('ruh_rapporter').insert([reportData], { returning: 'minimal' });
    
    if (error) {
      console.error("❌ Error submitting report:", error);
      alert("Feil ved innsending: " + error.message);
    } else {
      console.log("✅ Report successfully submitted:", data);
      alert("RUH-rapport sendt inn!");

      // Clear form fields
      sted = dato = klokkeslett = beskrivelse = resultat = aarsak = tiltak = '';
      bildeUrl = '';
      fetchReports();
    }
    loading = false;
  }

  async function fetchReports() {
    console.log("Fetching reports...");
    const { data, error } = await supabase.from('ruh_rapporter').select('*').order('opprettet', { ascending: false });
    
    if (error) {
      console.error("❌ Error fetching reports:", error);
    } else {
      reports = data;
      console.log("✅ Reports fetched successfully:", reports);
    }
  }

  onMount(fetchReports);
</script>

<div class="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
  <h1 class="text-2xl font-bold text-gray-800 mb-4">RUH Rapportering</h1>

  <form on:submit|preventDefault={submitReport} class="space-y-4">
    <label class="block">
      <span class="text-gray-700">Sted:</span>
      <input type="text" bind:value={sted} required class="mt-1 block w-full p-2 border rounded-md focus:ring focus:ring-blue-300">
    </label>

    <label class="block">
      <span class="text-gray-700">Dato:</span>
      <input type="date" bind:value={dato} required class="mt-1 block w-full p-2 border rounded-md focus:ring focus:ring-blue-300">
    </label>

    <label class="block">
      <span class="text-gray-700">Klokkeslett:</span>
      <input type="time" bind:value={klokkeslett} required class="mt-1 block w-full p-2 border rounded-md focus:ring focus:ring-blue-300">
    </label>

    <label class="block">
      <span class="text-gray-700">Beskrivelse av hendelsen:</span>
      <textarea bind:value={beskrivelse} required class="mt-1 block w-full p-2 border rounded-md focus:ring focus:ring-blue-300"></textarea>
    </label>

    <label class="block">
      <span class="text-gray-700">Resultat/utfall:</span>
      <textarea bind:value={resultat} required class="mt-1 block w-full p-2 border rounded-md focus:ring focus:ring-blue-300"></textarea>
    </label>

    <label class="block">
      <span class="text-gray-700">Årsak:</span>
      <textarea bind:value={aarsak} required class="mt-1 block w-full p-2 border rounded-md focus:ring focus:ring-blue-300"></textarea>
    </label>

    <label class="block">
      <span class="text-gray-700">Tiltak:</span>
      <textarea bind:value={tiltak} required class="mt-1 block w-full p-2 border rounded-md focus:ring focus:ring-blue-300"></textarea>
    </label>

    <label class="block">
      <span class="text-gray-700">Last opp bilde:</span>
      <input type="file" accept="image/*" on:change={handleFileUpload} class="mt-1 block w-full p-2 border rounded-md focus:ring focus:ring-blue-300">
    </label>

    <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition" {disabled:loading}>
      {loading ? 'Sender...' : 'Send inn rapport'}
    </button>
  </form>
</div>
