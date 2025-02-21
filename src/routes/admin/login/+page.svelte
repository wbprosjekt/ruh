<script>
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';

  let email = '';
  let password = '';
  let errorMessage = '';

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      errorMessage = 'Feil e-post eller passord';
    } else {
      window.location.href = '/admin'; // Redirect after login
    }
  }

  async function checkIfLoggedIn() {
    const { data: userData, error } = await supabase.auth.getUser();
    if (userData?.user) {
      window.location.href = '/admin'; // Redirect if already logged in
    }
  }

  onMount(checkIfLoggedIn);
</script>

<div class="min-h-screen flex flex-col items-center justify-center p-6">
  <h1 class="text-3xl font-bold mb-6">Admin Login</h1>

  {#if errorMessage}
    <p class="text-red-600">{errorMessage}</p>
  {/if}

  <form on:submit|preventDefault={login} class="bg-white p-6 shadow-md rounded-lg w-full max-w-md">
    <label>
      E-post:
      <input type="email" bind:value={email} required class="w-full p-2 border rounded-md" />
    </label>
    <label>
      Passord:
      <input type="password" bind:value={password} required class="w-full p-2 border rounded-md" />
    </label>
    <button type="submit" class="w-full bg-blue-600 text-white p-3 rounded-md mt-4">
      Logg inn
    </button>
  </form>
</div>
