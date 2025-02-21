<script>
  import { supabase } from "$lib/supabase";
  import { onMount } from "svelte";

  let sted = "";
  let dato = "";
  let klokkeslett = "";
  let beskrivelse = "";
  let resultat = "";
  let aarsak = "";
  let tiltak = "";
  let bildeUrl = "";
  let loading = false;
  let success = false;
  let reports = [];

  async function fetchReports() {
    const { data, error } = await supabase.from("ruh_rapporter").select("*").order("dato", { ascending: false });
    if (error) {
      console.error("❌ Error fetching reports:", error);
    } else {
      reports = data;
    }
  }

  async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const filePath = `images/${Date.now()}_${file.name}`;
    console.log("Uploading file to:", filePath);
    const { data, error } = await supabase.storage
      .from("ruh-bilder")
      .upload(filePath, file);

    if (error) {
      console.error("❌ File upload error:", error);
      alert("Feil ved opplasting: " + error.message);
    } else {
      bildeUrl = supabase.storage.from("ruh-bilder").getPublicUrl(filePath);
      console.log("✅ File uploaded successfully:", bildeUrl);
    }
  }

  async function submitReport() {
    loading = true;
    success = false;
    console.log("Submitting report...");

    const reportData = {
      sted,
      dato,
      klokkeslett,
      beskrivelse,
      resultat,
      aarsak,
      tiltak,
      bilde_url: bildeUrl,
    };

    const { data, error } = await supabase
      .from("ruh_rapporter")
      .insert([reportData], { returning: "minimal" });

    if (error) {
      console.error("❌ Error submitting report:", error);
      alert("Feil ved innsending: " + error.message);
    } else {
      console.log("✅ Report successfully submitted:", data);
      setTimeout(() => {
        success = true;
      }, 2000); // Delay success message by 2 seconds
      fetchReports();

      // Clear form fields
      sted = dato = klokkeslett = beskrivelse = resultat = aarsak = tiltak = "";
      bildeUrl = "";
    }
    loading = false;
  }

  onMount(fetchReports);
</script>

<div class="min-h-screen w-full p-4 bg-gray-100 flex flex-col items-center">
  <img src="/logo.png" alt="Company Logo" class="w-24 h-auto mb-4" />
  <h1 class="text-3xl font-bold text-primary text-center mb-6">RUH Rapportering</h1>

  {#if success}
    <p class="success-message bg-green-200 text-green-800 p-3 rounded-md">✅ Rapport sendt inn!</p>
  {/if}

  <form on:submit|preventDefault={submitReport} class="w-full max-w-lg bg-white shadow-md rounded-lg p-6 space-y-4">
    <div class="flex flex-col space-y-4">
      <label class="block">
        <span>Sted:</span>
        <input type="text" bind:value={sted} required class="w-full p-2 border rounded-md" />
      </label>
      <label class="block">
        <span>Dato:</span>
        <input type="date" bind:value={dato} required class="w-full p-2 border rounded-md" />
      </label>
      <label class="block">
        <span>Klokkeslett:</span>
        <input type="time" bind:value={klokkeslett} required class="w-full p-2 border rounded-md" />
      </label>
      <label class="block">
        <span>Beskrivelse:</span>
        <textarea bind:value={beskrivelse} required class="w-full p-2 border rounded-md"></textarea>
      </label>
      <label class="block">
        <span>Resultat:</span>
        <textarea bind:value={resultat} required class="w-full p-2 border rounded-md"></textarea>
      </label>
      <label class="block">
        <span>Årsak:</span>
        <textarea bind:value={aarsak} required class="w-full p-2 border rounded-md"></textarea>
      </label>
      <label class="block">
        <span>Tiltak:</span>
        <textarea bind:value={tiltak} required class="w-full p-2 border rounded-md"></textarea>
      </label>
    </div>
    <button type="submit" disabled={loading} class="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700">
      {loading ? '<span class="loading"></span> Sender...' : "Send inn rapport"}
    </button>
  </form>
</div>

