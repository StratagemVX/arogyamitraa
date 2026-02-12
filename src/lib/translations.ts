import type { Language } from '@/components/LanguageSelector';

/**
 * Centralized translations for ALL UI text in Arogya Mitra.
 * Every component pulls its strings from here so the entire
 * interface switches when the user picks a language.
 */
export const t = {
  /* ── Header ── */
  appName: {
    kn: 'ಆರೋಗ್ಯ ಮಿತ್ರ',
    hi: 'आरोग्य मित्र',
    ta: 'ஆரோக்கிய நண்பன்',
    te: 'ఆరోగ్య మిత్ర',
    mr: 'आरोग्य मित्र',
    en: 'Arogya Mitra',
  } satisfies Record<Language, string>,

  appSubtitle: {
    kn: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಹಾಯಕ',
    hi: 'आपका स्वास्थ्य सहायक',
    ta: 'உங்கள் சுகாதார உதவியாளர்',
    te: 'మీ ఆరోగ్య సహాయకుడు',
    mr: 'तुमचे आरोग्य सहाय्यक',
    en: 'Your Health Assistant',
  } satisfies Record<Language, string>,

  safe: {
    kn: 'ಸುರಕ್ಷಿತ',
    hi: 'सुरक्षित',
    ta: 'பாதுகாப்பு',
    te: 'సురక్షితం',
    mr: 'सुरक्षित',
    en: 'Safe',
  } satisfies Record<Language, string>,

  /* ── Voice Orb states ── */
  tapToSpeak: {
    kn: 'ಮಾತನಾಡಲು ಒತ್ತಿ',
    hi: 'बोलने के लिए दबाएं',
    ta: 'பேச தட்டவும்',
    te: 'మాట్లాడటానికి నొక్కండి',
    mr: 'बोलण्यासाठी दाबा',
    en: 'Tap to speak',
  } satisfies Record<Language, string>,

  listening: {
    kn: 'ಕೇಳುತ್ತಿದ್ದೇನೆ…',
    hi: 'सुन रहा हूं…',
    ta: 'கேட்கிறேன்…',
    te: 'వింటున్నాను…',
    mr: 'ऐकतोय…',
    en: 'Listening…',
  } satisfies Record<Language, string>,

  listeningLong: {
    kn: 'ನಿಮ್ಮ ಮಾತನ್ನು ಕೇಳುತ್ತಿದ್ದೇನೆ…',
    hi: 'आपकी बात सुन रहा हूं…',
    ta: 'உங்களை கேட்கிறேன்…',
    te: 'మీ మాట వింటున్నాను…',
    mr: 'तुमचे ऐकतोय…',
    en: 'Listening to you…',
  } satisfies Record<Language, string>,

  processing: {
    kn: 'ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ…',
    hi: 'सोच रहा हूं…',
    ta: 'செயலாக்கம்…',
    te: 'ప్రాసెస్ చేస్తున్నాను…',
    mr: 'विचार करतोय…',
    en: 'Processing…',
  } satisfies Record<Language, string>,

  responding: {
    kn: 'ಉತ್ತರಿಸುತ್ತಿದೆ…',
    hi: 'उत्तर दे रहा हूं…',
    ta: 'பதில் தருகிறேன்…',
    te: 'జవాబు ఇస్తున్నాను…',
    mr: 'उत्तर देतोय…',
    en: 'Responding…',
  } satisfies Record<Language, string>,

  emergency: {
    kn: 'ತುರ್ತು',
    hi: 'आपातकाल',
    ta: 'அவசரநிலை',
    te: 'అత్యవసరం',
    mr: 'आपत्कालीन',
    en: 'Emergency',
  } satisfies Record<Language, string>,

  /* ── Transcript ── */
  heard: {
    kn: 'ನೀವು ಹೇಳಿದ್ದು',
    hi: 'आपने कहा',
    ta: 'நீங்கள் சொன்னது',
    te: 'మీరు చెప్పింది',
    mr: 'तुम्ही सांगितले',
    en: 'You said',
  } satisfies Record<Language, string>,

  /* ── First Aid ── */
  firstAid: {
    kn: 'ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ ಮಾರ್ಗದರ್ಶಿ',
    hi: 'प्राथमिक उपचार गाइड',
    ta: 'முதலுதவி வழிகாட்டி',
    te: 'ప్రథమ చికిత్స గైడ్',
    mr: 'प्रथमोपचार मार्गदर्शक',
    en: 'First Aid Guide',
  } satisfies Record<Language, string>,

  /* ── Quick Actions ── */
  findHospital: {
    kn: 'ಆಸ್ಪತ್ರೆ ಹುಡುಕಿ',
    hi: 'अस्पताल खोजें',
    ta: 'மருத்துவமனை கண்டறி',
    te: 'ఆసుపత్రి కనుగొనండి',
    mr: 'रुग्णालय शोधा',
    en: 'Find Hospital',
  } satisfies Record<Language, string>,

  callAmbulance: {
    kn: 'ಆಂಬುಲೆನ್ಸ್ ಕರೆ',
    hi: 'एम्बुलेंस कॉल',
    ta: 'அம்புலன்ஸ் அழை',
    te: 'అంబులెన్స్ కాల్',
    mr: 'रुग्णवाहिका कॉल',
    en: 'Call Ambulance',
  } satisfies Record<Language, string>,

  ambulanceCall: {
    kn: 'ಆಂಬುಲೆನ್ಸ್ ಕರೆಯಿರಿ',
    hi: 'एम्बुलेंस बुलाएं',
    ta: 'அம்புலன்ஸ் அழைக்கவும்',
    te: 'అంబులెన్స్ పిలవండి',
    mr: 'रुग्णवाहिका बोलवा',
    en: 'Call Ambulance',
  } satisfies Record<Language, string>,

  /* ── Hospital Map ── */
  nearbyHospitals: {
    kn: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು',
    hi: 'नजदीकी अस्पताल',
    ta: 'அருகிலுள்ள மருத்துவமனைகள்',
    te: 'సమీపంలోని ఆసుపత్రులు',
    mr: 'जवळील रुग्णालये',
    en: 'Nearby Hospitals',
  } satisfies Record<Language, string>,

  findingLocation: {
    kn: 'ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಹುಡುಕುತ್ತಿದೆ...',
    hi: 'आपका स्थान खोज रहे हैं...',
    ta: 'உங்கள் இருப்பிடத்தைக் கண்டறிகிறது...',
    te: 'మీ స్థానాన్ని కనుగొంటోంది...',
    mr: 'तुमचे स्थान शोधत आहे...',
    en: 'Finding your location...',
  } satisfies Record<Language, string>,

  locationDetected: {
    kn: 'ಸ್ಥಳ ಪತ್ತೆಯಾಗಿದೆ',
    hi: 'स्थान पता चला',
    ta: 'இருப்பிடம் கண்டறியப்பட்டது',
    te: 'స్థానం గుర్తించబడింది',
    mr: 'स्थान सापडले',
    en: 'Location detected',
  } satisfies Record<Language, string>,

  viewHospitals: {
    kn: 'ಆಸ್ಪತ್ರೆ ನೋಡಿ',
    hi: 'अस्पताल देखें',
    ta: 'மருத்துவமனை காண்க',
    te: 'ఆసుపత్రి చూడండి',
    mr: 'रुग्णालय पहा',
    en: 'View Hospitals on Map',
  } satisfies Record<Language, string>,

  getDirections: {
    kn: 'ದಾರಿ ತೋರಿಸಿ',
    hi: 'रास्ता दिखाएं',
    ta: 'வழி காட்டு',
    te: 'దారి చూపించు',
    mr: 'रस्ता दाखवा',
    en: 'Get Directions',
  } satisfies Record<Language, string>,

  call108: {
    kn: '108 ಕರೆ ಮಾಡಿ',
    hi: '108 पर कॉल करें',
    ta: '108 அழைக்கவும்',
    te: '108 కు కాల్ చేయండి',
    mr: '108 वर कॉल करा',
    en: 'Call 108',
  } satisfies Record<Language, string>,

  govtHospitalTip: {
    kn: 'ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳು ಮೊದಲು ತೋರಿಸಲಾಗುತ್ತದೆ',
    hi: 'सरकारी अस्पताल पहले दिखाए जाते हैं',
    ta: 'அரசு மருத்துவமனைகள் முதலில் காட்டப்படும்',
    te: 'ప్రభుత్వ ఆసుపత్రులు మొదట చూపబడతాయి',
    mr: 'सरकारी रुग्णालये प्रथम दाखवली जातात',
    en: 'Government hospitals shown first',
  } satisfies Record<Language, string>,

  /* ── Disclaimer ── */
  disclaimer: {
    kn: 'ಇದು ವೈದ್ಯರ ಬದಲಿ ಅಲ್ಲ. ವೃತ್ತಿಪರ ವೈದ್ಯಕೀಯ ಸಲಹೆಗಾಗಿ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.',
    hi: 'यह डॉक्टर का विकल्प नहीं है। पेशेवर चिकित्सा सलाह के लिए डॉक्टर से मिलें।',
    ta: 'இது மருத்துவரின் மாற்று அல்ல. தொழில்முறை மருத்துவ ஆலோசனைக்கு மருத்துவரை அணுகுங்கள்.',
    te: 'ఇది డాక్టర్ కు ప్రత్యామ్నాయం కాదు. వృత్తిపరమైన వైద్య సలహా కోసం డాక్టర్‌ను సంప్రదించండి.',
    mr: 'हे डॉक्टरांचा पर्याय नाही. व्यावसायिक वैद्यकीय सल्ल्यासाठी डॉक्टरांना भेटा.',
    en: 'Not a doctor replacement. Visit a doctor for professional medical advice.',
  } satisfies Record<Language, string>,

  /* ── Buttons / misc ── */
  enableMic: {
    kn: 'ಮೈಕ್ ಸಕ್ರಿಯಗೊಳಿಸಿ',
    hi: 'माइक चालू करें',
    ta: 'மைக் இயக்கவும்',
    te: 'మైక్ ప్రారంభించండి',
    mr: 'माइक सुरू करा',
    en: 'Enable Microphone',
  } satisfies Record<Language, string>,

  httpsWarning: {
    kn: 'ಧ್ವನಿ ವೈಶಿಷ್ಟ್ಯಗಳಿಗೆ ಮೊಬೈಲ್‌ನಲ್ಲಿ HTTPS ಅಗತ್ಯ',
    hi: 'वॉइस फ़ीचर्स के लिए मोबाइल पर HTTPS ज़रूरी है',
    ta: 'குரல் அம்சங்களுக்கு மொபைலில் HTTPS தேவை',
    te: 'వాయిస్ ఫీచర్లకు మొబైల్‌లో HTTPS అవసరం',
    mr: 'व्हॉइस वैशिष्ट्यांसाठी मोबाइलवर HTTPS आवश्यक',
    en: 'Voice features require HTTPS on mobile',
  } satisfies Record<Language, string>,

  httpsSubtext: {
    kn: 'https:// ಮೂಲಕ ಪ್ರವೇಶಿಸಿ ಅಥವಾ ಡೆಸ್ಕ್‌ಟಾಪ್‌ನಲ್ಲಿ localhost ಬಳಸಿ',
    hi: 'https:// से खोलें या डेस्कटॉप पर localhost इस्तेमाल करें',
    ta: 'https:// வழியாக அணுகவும் அல்லது டெஸ்க்டாப்பில் localhost பயன்படுத்தவும்',
    te: 'https:// ద్వారా యాక్సెస్ చేయండి లేదా డెస్క్‌టాప్‌లో localhost వాడండి',
    mr: 'https:// द्वारे प्रवेश करा किंवा डेस्कटॉपवर localhost वापरा',
    en: 'Access via https:// or use localhost on desktop',
  } satisfies Record<Language, string>,

  unsupportedBrowser: {
    kn: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಬೆಂಬಲಿಸುವುದಿಲ್ಲ. Chrome, Edge ಅಥವಾ Safari ಬಳಸಿ.',
    hi: 'इस ब्राउज़र में वॉइस पहचान समर्थित नहीं है। Chrome, Edge या Safari का उपयोग करें।',
    ta: 'இந்த உலாவியில் குரல் அங்கீகாரம் ஆதரிக்கப்படவில்லை. Chrome, Edge அல்லது Safari பயன்படுத்தவும்.',
    te: 'ఈ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ మద్దతు లేదు. Chrome, Edge లేదా Safari వాడండి.',
    mr: 'या ब्राउझरमध्ये व्हॉइस ओळख समर्थित नाही. Chrome, Edge किंवा Safari वापरा.',
    en: 'Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.',
  } satisfies Record<Language, string>,
};
