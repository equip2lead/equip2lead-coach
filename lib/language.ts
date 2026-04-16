export async function switchLanguage(
  newLang: 'en' | 'fr',
  userId: string,
  supabase: any,
  setLang: (lang: 'en' | 'fr') => void
) {
  setLang(newLang);
  await supabase
    .from('profiles')
    .update({ preferred_language: newLang })
    .eq('id', userId);
}
