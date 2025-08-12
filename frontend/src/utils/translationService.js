/**
 * Translation service using LibreTranslate API
 */

const translateText = async (text, targetLang = 'en') => {
  try {
    if (!text) return '';
    if (targetLang === 'en') return text; // No need to translate if target is English
    
    // Use the correct API format for LibreTranslate
    const res = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      body: JSON.stringify({
        q: text,
        source: "en", // Source is English
        target: targetLang, // Target is Hindi
        format: "text",
        api_key: "" // Add your API key if needed
      }),
      headers: { "Content-Type": "application/json" }
    });
    
    const data = await res.json();
    console.log('Translation response:', data); // Debug log
    return data.translatedText || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
};

// Batch translate multiple texts at once
const translateBatch = async (texts, targetLang = 'en') => {
  try {
    const promises = texts.map(text => translateText(text, targetLang));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts; // Return original texts if translation fails
  }
};

export { translateText, translateBatch };