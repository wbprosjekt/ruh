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

<style>
  .container {
    max-width: 600px;
    width: 100%;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  label {
    display: flex;
    flex-direction: column;
    font-weight: bold;
  }
  input, textarea, button {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    background-color: #007bff;
    color: white;
    font-weight: bold;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
  .success-message {
    text-align: center;
    font-weight: bold;
    padding: 0.5rem;
    border-radius: 4px;
    background-color: #d4edda;
    color: #155724;
  }
</style>

<div class="min-h-screen w-full p-4 bg-gray-100 flex flex-col items-center">
  <img src="/logo.png" alt="Company Logo" class="w-12 h-auto mb-4 max-w-xs" />
  <h1 class="text-3xl font-bold text-primary text-center mb-6 w-full flex justify-center">Registrer avvik</h1>

  {#if success}
    <p class="success-message">✅ Rapport sendt inn!</p>
  {/if}

  <div class="container bg-white p-6 shadow-md rounded-lg">
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
      <label>Beskrivelse:
        <textarea bind:value={beskrivelse} required></textarea>
      </label>
      <label>Resultat:
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
      <button type="submit" disabled={loading}>
        {loading ? 'Sender...' : "Send inn rapport"}
      </button>
    </form>
  </div>
</div>

