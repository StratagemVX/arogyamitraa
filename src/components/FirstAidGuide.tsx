import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Flame, 
  Droplets, 
  AlertTriangle, 
  Heart,
  Wind,
  Thermometer,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Language } from '@/components/LanguageSelector';

interface FirstAidGuideProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface FirstAidCard {
  id: string;
  icon: typeof Flame;
  title: Record<Language, string>;
  color: string;
  steps: Record<Language, string>[];
}

// Translations for First Aid Guide
const firstAidTranslations = {
  title: {
    kn: 'ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ',
    hi: 'प्राथमिक उपचार',
    ta: 'முதலுதவி',
    te: 'ప్రథమ చికిత్స',
    mr: 'प्रथमोपचार',
    en: 'First Aid Guide',
  },
  subtitle: {
    kn: 'ತುರ್ತು ಸಹಾಯ ಮಾರ್ಗದರ್ಶಿ',
    hi: 'आपातकालीन सहायता गाइड',
    ta: 'அவசர உதவி வழிகாட்டி',
    te: 'అత్యవసర సహాయ గైడ్',
    mr: 'आपत्कालीन मदत मार्गदर्शक',
    en: 'Emergency Help Guide',
  },
  callAmbulance: {
    kn: '108 ಕರೆ ಮಾಡಿ - ಆಂಬುಲೆನ್ಸ್',
    hi: '108 पर कॉल करें - एम्बुलेंस',
    ta: '108 அழைக்கவும் - அம்புலன்ஸ்',
    te: '108 కు కాల్ చేయండి - అంబులెన్స్',
    mr: '108 वर कॉल करा - रुग्णवाहिका',
    en: 'Call 108 - Ambulance',
  },
  disclaimer: {
    kn: 'ಇದು ವೈದ್ಯರ ಸಲಹೆ ಅಲ್ಲ. ಇದು ಮೊದಲ ಸಹಾಯ ಮಾತ್ರ.',
    hi: 'यह डॉक्टर की सलाह नहीं है। यह केवल प्राथमिक उपचार है।',
    ta: 'இது மருத்துவ ஆலோசனை அல்ல. இது முதலுதவி மட்டுமே.',
    te: 'ఇది వైద్య సలహా కాదు. ఇది ప్రథమ చికిత్స మాత్రమే.',
    mr: 'ही डॉक्टरांची सल्ला नाही. हे केवळ प्रथमोपचार आहे.',
    en: 'This is first aid only, not medical advice.',
  },
};

const firstAidCards: FirstAidCard[] = [
  {
    id: 'burns',
    icon: Flame,
    title: {
      kn: 'ಸುಟ್ಟ ಗಾಯ',
      hi: 'जलन',
      ta: 'தீக்காயம்',
      te: 'కాలిన గాయం',
      mr: 'भाजणे',
      en: 'Burns',
    },
    color: 'from-orange-500 to-red-500',
    steps: [
      {
        kn: 'ತಣ್ಣನೆಯ ನೀರಿನಲ್ಲಿ 10-20 ನಿಮಿಷ ಇರಿಸಿ',
        hi: 'ठंडे पानी में 10-20 मिनट रखें',
        ta: 'குளிர்ந்த நீரில் 10-20 நிமிடம் வைக்கவும்',
        te: 'చల్లని నీటిలో 10-20 నిమిషాలు ఉంచండి',
        mr: 'थंड पाण्यात 10-20 मिनिटे ठेवा',
        en: 'Hold under cool running water for 10-20 minutes',
      },
      {
        kn: 'ಬಟ್ಟೆ ಅಥವಾ ಆಭರಣ ತೆಗೆಯಿರಿ',
        hi: 'कपड़े या गहने हटाएं',
        ta: 'ஆடைகள் அல்லது நகைகளை அகற்றவும்',
        te: 'బట్టలు లేదా ఆభరణాలు తీసివేయండి',
        mr: 'कपडे किंवा दागिने काढा',
        en: 'Remove clothing or jewelry near the burn',
      },
      {
        kn: 'ಶುಭ್ರ ಬಟ್ಟೆಯಿಂದ ಮುಚ್ಚಿ',
        hi: 'साफ कपड़े से ढकें',
        ta: 'சுத்தமான துணியால் மூடவும்',
        te: 'శుభ్రమైన గుడ్డతో కప్పండి',
        mr: 'स्वच्छ कपड्याने झाकून ठेवा',
        en: 'Cover with a clean cloth',
      },
      {
        kn: 'ಐಸ್ ಅಥವಾ ಬೆಣ್ಣೆ ಹಾಕಬೇಡಿ',
        hi: 'बर्फ या मक्खन न लगाएं',
        ta: 'பனிக்கட்டி அல்லது வெண்ணெய் போடாதீர்கள்',
        te: 'ఐస్ లేదా వెన్న రాయకండి',
        mr: 'बर्फ किंवा लोणी लावू नका',
        en: 'Do NOT apply ice or butter',
      },
    ],
  },
  {
    id: 'cuts',
    icon: Droplets,
    title: {
      kn: 'ರಕ್ತಸ್ರಾವ / ಗಾಯ',
      hi: 'रक्तस्राव / कटना',
      ta: 'இரத்தப்போக்கு / வெட்டு',
      te: 'రక్తస్రావం / గాయం',
      mr: 'रक्तस्राव / कापणे',
      en: 'Bleeding / Cuts',
    },
    color: 'from-red-500 to-pink-500',
    steps: [
      {
        kn: 'ಶುಭ್ರ ಬಟ್ಟೆಯಿಂದ ಒತ್ತಿ ಹಿಡಿಯಿರಿ',
        hi: 'साफ कपड़े से दबाकर रखें',
        ta: 'சுத்தமான துணியால் அழுத்தி வைக்கவும்',
        te: 'శుభ్రమైన గుడ్డతో అదిమి పట్టండి',
        mr: 'स्वच्छ कपड्याने दाबून ठेवा',
        en: 'Apply pressure with a clean cloth',
      },
      {
        kn: 'ಗಾಯವನ್ನು ಮೇಲೆತ್ತಿ ಇರಿಸಿ',
        hi: 'घायल हिस्से को ऊपर उठाएं',
        ta: 'காயமான பகுதியை உயர்த்தி வைக்கவும்',
        te: 'గాయపడిన భాగాన్ని పైకి ఎత్తండి',
        mr: 'जखमी भाग वर उचला',
        en: 'Elevate the injured area',
      },
      {
        kn: '10-15 ನಿಮಿಷ ಒತ್ತಿ ಹಿಡಿಯಿರಿ',
        hi: '10-15 मिनट दबाकर रखें',
        ta: '10-15 நிமிடம் அழுத்தி வைக்கவும்',
        te: '10-15 నిమిషాలు అదిమి పట్టండి',
        mr: '10-15 मिनिटे दाबून ठेवा',
        en: 'Maintain pressure for 10-15 minutes',
      },
      {
        kn: 'ರಕ್ತಸ್ರಾವ ನಿಲ್ಲದಿದ್ದರೆ 108 ಕರೆಯಿರಿ',
        hi: 'रक्तस्राव न रुके तो 108 पर कॉल करें',
        ta: 'இரத்தப்போக்கு நிற்கவில்லை என்றால் 108 அழைக்கவும்',
        te: 'రక్తస్రావం ఆగకపోతే 108 కు కాల్ చేయండి',
        mr: 'रक्तस्राव थांबत नसेल तर 108 वर कॉल करा',
        en: 'If bleeding doesn\'t stop, call 108',
      },
    ],
  },
  {
    id: 'fainting',
    icon: AlertTriangle,
    title: {
      kn: 'ಮೂರ್ಛೆ ಹೋಗುವುದು',
      hi: 'बेहोश होना',
      ta: 'மயக்கம்',
      te: 'మూర్ఛ పోవడం',
      mr: 'बेशुद्ध पडणे',
      en: 'Fainting',
    },
    color: 'from-purple-500 to-indigo-500',
    steps: [
      {
        kn: 'ವ್ಯಕ್ತಿಯನ್ನು ಮಲಗಿಸಿ',
        hi: 'व्यक्ति को लिटा दें',
        ta: 'நபரை படுக்க வையுங்கள்',
        te: 'వ్యక్తిని పడుకోబెట్టండి',
        mr: 'व्यक्तीला झोपवा',
        en: 'Lay the person down',
      },
      {
        kn: 'ಕಾಲುಗಳನ್ನು ಮೇಲೆತ್ತಿ',
        hi: 'पैर ऊपर उठाएं',
        ta: 'கால்களை உயர்த்துங்கள்',
        te: 'కాళ్ళను పైకి ఎత్తండి',
        mr: 'पाय वर उचला',
        en: 'Raise their legs',
      },
      {
        kn: 'ಬಿಗಿಯಾದ ಬಟ್ಟೆ ಸಡಿಲಿಸಿ',
        hi: 'तंग कपड़े ढीले करें',
        ta: 'இறுக்கமான ஆடைகளை தளர்த்துங்கள்',
        te: 'బిగుతుగా ఉన్న బట్టలు సడలించండి',
        mr: 'घट्ट कपडे सैल करा',
        en: 'Loosen tight clothing',
      },
      {
        kn: '1 ನಿಮಿಷದಲ್ಲಿ ಎಚ್ಚರಾಗದಿದ್ದರೆ 108 ಕರೆಯಿರಿ',
        hi: '1 मिनट में होश न आए तो 108 कॉल करें',
        ta: '1 நிமிடத்தில் சுயநினைவு வரவில்லை என்றால் 108 அழைக்கவும்',
        te: '1 నిమిషంలో మెలకువ రాకపోతే 108 కు కాల్ చేయండి',
        mr: '1 मिनिटात शुद्धीवर न आल्यास 108 वर कॉल करा',
        en: 'If not awake in 1 minute, call 108',
      },
    ],
  },
  {
    id: 'choking',
    icon: Wind,
    title: {
      kn: 'ಉಸಿರುಗಟ್ಟುವುದು',
      hi: 'दम घुटना',
      ta: 'மூச்சுத்திணறல்',
      te: 'ఊపిరి ఆడకపోవడం',
      mr: 'गुदमरणे',
      en: 'Choking',
    },
    color: 'from-blue-500 to-cyan-500',
    steps: [
      {
        kn: 'ಬೆನ್ನ ಮೇಲೆ 5 ಬಾರಿ ಹೊಡೆಯಿರಿ',
        hi: 'पीठ पर 5 बार थपथपाएं',
        ta: 'முதுகில் 5 முறை தட்டுங்கள்',
        te: 'వీపుపై 5 సార్లు కొట్టండి',
        mr: 'पाठीवर 5 वेळा थोपटा',
        en: 'Give 5 back blows between shoulder blades',
      },
      {
        kn: 'ಹೊಟ್ಟೆ ಒತ್ತಿ 5 ಬಾರಿ',
        hi: 'पेट दबाकर 5 बार',
        ta: 'வயிற்றை அழுத்தி 5 முறை',
        te: 'పొట్ట నొక్కి 5 సార్లు',
        mr: 'पोट दाबून 5 वेळा',
        en: 'Give 5 abdominal thrusts',
      },
      {
        kn: 'ವಸ್ತು ಹೊರಬರುವವರೆಗೆ ಮುಂದುವರಿಸಿ',
        hi: 'वस्तु बाहर आने तक जारी रखें',
        ta: 'பொருள் வெளியேறும் வரை தொடருங்கள்',
        te: 'వస్తువు బయటకు వచ్చే వరకు కొనసాగించండి',
        mr: 'वस्तू बाहेर येईपर्यंत सुरू ठेवा',
        en: 'Continue until object comes out',
      },
      {
        kn: 'ಎಚ್ಚರ ತಪ್ಪಿದರೆ 108 ಕರೆಯಿರಿ',
        hi: 'बेहोश हो जाए तो 108 कॉल करें',
        ta: 'சுயநினைவு இழந்தால் 108 அழைக்கவும்',
        te: 'స్పృహ తప్పితే 108 కు కాల్ చేయండి',
        mr: 'बेशुद्ध पडल्यास 108 वर कॉल करा',
        en: 'If unconscious, call 108',
      },
    ],
  },
  {
    id: 'heartattack',
    icon: Heart,
    title: {
      kn: 'ಎದೆ ನೋವು',
      hi: 'छाती में दर्द',
      ta: 'நெஞ்சு வலி',
      te: 'ఛాతీ నొప్పి',
      mr: 'छातीत दुखणे',
      en: 'Chest Pain',
    },
    color: 'from-red-600 to-rose-500',
    steps: [
      {
        kn: 'ತಕ್ಷಣ 108 ಕರೆಯಿರಿ',
        hi: 'तुरंत 108 पर कॉल करें',
        ta: 'உடனடியாக 108 அழைக்கவும்',
        te: 'వెంటనే 108 కు కాల్ చేయండి',
        mr: 'लगेच 108 वर कॉल करा',
        en: 'Call 108 immediately',
      },
      {
        kn: 'ವ್ಯಕ್ತಿಯನ್ನು ಕೂರಿಸಿ',
        hi: 'व्यक्ति को बिठाएं',
        ta: 'நபரை உட்கார வையுங்கள்',
        te: 'వ్యక్తిని కూర్చోబెట్టండి',
        mr: 'व्यक्तीला बसवा',
        en: 'Help them sit down',
      },
      {
        kn: 'ಬಿಗಿ ಬಟ್ಟೆ ಸಡಿಲಿಸಿ',
        hi: 'तंग कपड़े ढीले करें',
        ta: 'இறுக்கமான ஆடைகளை தளர்த்துங்கள்',
        te: 'బిగుతుగా ఉన్న బట్టలు సడలించండి',
        mr: 'घट्ट कपडे सैल करा',
        en: 'Loosen tight clothing',
      },
      {
        kn: 'ಶಾಂತವಾಗಿರಲು ಹೇಳಿ',
        hi: 'शांत रहने को कहें',
        ta: 'அமைதியாக இருக்க சொல்லுங்கள்',
        te: 'ప్రశాంతంగా ఉండమని చెప్పండి',
        mr: 'शांत राहायला सांगा',
        en: 'Keep them calm',
      },
    ],
  },
  {
    id: 'fever',
    icon: Thermometer,
    title: {
      kn: 'ಜ್ವರ',
      hi: 'तेज़ बुखार',
      ta: 'காய்ச்சல்',
      te: 'జ్వరం',
      mr: 'ताप',
      en: 'High Fever',
    },
    color: 'from-yellow-500 to-orange-500',
    steps: [
      {
        kn: 'ತಣ್ಣನೆಯ ಬಟ್ಟೆಯಿಂದ ಒರೆಸಿ',
        hi: 'ठंडे कपड़े से पोंछें',
        ta: 'குளிர்ந்த துணியால் துடைக்கவும்',
        te: 'చల్లని గుడ్డతో తుడవండి',
        mr: 'थंड कपड्याने पुसा',
        en: 'Sponge with cool water',
      },
      {
        kn: 'ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಸಿ',
        hi: 'खूब पानी पिलाएं',
        ta: 'நிறைய தண்ணீர் குடிக்க வையுங்கள்',
        te: 'ఎక్కువ నీళ్ళు తాగించండి',
        mr: 'भरपूर पाणी प्यायला द्या',
        en: 'Give plenty of fluids',
      },
      {
        kn: 'ಹಗುರ ಬಟ್ಟೆ ಹಾಕಿ',
        hi: 'हल्के कपड़े पहनाएं',
        ta: 'இலகுவான ஆடைகள் அணியவும்',
        te: 'తేలిక బట్టలు వేయండి',
        mr: 'हलके कपडे घाला',
        en: 'Dress in light clothing',
      },
      {
        kn: '3 ದಿನಕ್ಕಿಂತ ಹೆಚ್ಚು ಇದ್ದರೆ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಿ',
        hi: '3 दिन से ज्यादा बुखार रहे तो डॉक्टर दिखाएं',
        ta: '3 நாட்களுக்கு மேல் காய்ச்சல் இருந்தால் மருத்துவரை அணுகுங்கள்',
        te: '3 రోజులకు మించి జ్వరం ఉంటే డాక్టర్‌ను సంప్రదించండి',
        mr: '3 दिवसांपेक्षा जास्त ताप असेल तर डॉक्टरांना भेटा',
        en: 'See a doctor if fever lasts more than 3 days',
      },
    ],
  },
];

export function FirstAidGuide({ isOpen, onClose, language }: FirstAidGuideProps) {
  const [selectedCard, setSelectedCard] = useState<FirstAidCard | null>(null);

  const handleClose = () => {
    setSelectedCard(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-background/80 backdrop-blur-md"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-lg max-h-[85vh] bg-card rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-safe to-accent flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {selectedCard ? selectedCard.title[language] : firstAidTranslations.title[language]}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedCard ? selectedCard.title.en : firstAidTranslations.subtitle[language]}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={selectedCard ? () => setSelectedCard(null) : handleClose}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <AnimatePresence mode="wait">
                {selectedCard ? (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {selectedCard.steps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 p-4 rounded-2xl bg-muted/50"
                      >
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedCard.color} flex items-center justify-center text-white font-bold shrink-0`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{step[language]}</p>
                          <p className="text-sm text-muted-foreground">{step.en}</p>
                        </div>
                      </motion.div>
                    ))}

                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      onClick={() => window.location.href = 'tel:108'}
                      className="w-full mt-4 py-4 px-6 rounded-2xl bg-gradient-to-br from-emergency to-red-400 text-emergency-foreground font-bold text-lg shadow-glow-emergency"
                      whileTap={{ scale: 0.98 }}
                    >
                      🚨 {firstAidTranslations.callAmbulance[language]}
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    {firstAidCards.map((card, index) => (
                      <motion.button
                        key={card.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedCard(card)}
                        className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg flex flex-col items-center gap-2 aspect-square justify-center`}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <card.icon className="w-10 h-10" />
                        <div className="text-center">
                          <p className="font-bold">{card.title[language]}</p>
                          <p className="text-xs opacity-80">{card.title.en}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-60" />
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Disclaimer */}
            <div className="p-4 border-t border-border bg-muted/30 shrink-0">
              <p className="text-xs text-center text-muted-foreground">
                ⚠️ {firstAidTranslations.disclaimer[language]}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
