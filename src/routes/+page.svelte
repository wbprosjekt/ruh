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
      success = true;

      // Clear form fields
      sted = dato = klokkeslett = beskrivelse = resultat = aarsak = tiltak = "";
      bildeUrl = "";
    }
    loading = false;
  }
</script>

<div class="container">
  <h1 class="text-3xl font-bold text-primary text-center">RUH Rapportering</h1>

  {#if success}
    <p class="success-message">✅ Rapport sendt inn!</p>
  {/if}

  <form on:submit|preventDefault={submitReport} class="mt-4">
    <label>Sted:</label>
    <input type="text" bind:value={sted} required />

    <label>Dato:</label>
    <input type="date" bind:value={dato} required />

    <label>Klokkeslett:</label>
    <input type="time" bind:value={klokkeslett} required />

    <label>Beskrivelse av hendelsen:</label>
    <textarea bind:value={beskrivelse} required></textarea>

    <label>Resultat/utfall:</label>
    <textarea bind:value={resultat} required></textarea>

    <label>Årsak:</label>
    <textarea bind:value={aarsak} required></textarea>

    <label>Tiltak:</label>
    <textarea bind:value={tiltak} required></textarea>

    <label>Last opp bilde:</label>
    <input type="file" accept="image/*" on:change={handleFileUpload} />

    <button type="submit" disabled={loading}>
      {loading ? '<span class="loading"></span> Sender...' : "Send inn rapport"}
    </button>
  </form>
</div>
