import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';

// Lagre brukerens rapportdata
export const reportData = writable({
  sted: '',
  dato: '',
  klokkeslett: '',
  beskrivelse: '',
  resultat: '',
  aarsak: '',
  tiltak: '',
  bilde: null
});
