# Quick Start Guide - Testing Your Voice Assistant

## 🚀 Start the Application

The dev server is already running at: **http://localhost:8080/**

If not, run:
```bash
npm run dev
```

## 📱 Testing Steps

### Step 1: Check the Interface
1. Open http://localhost:8080/ in **Chrome** or **Edge** (best support)
2. You should see:
   - ✅ **Language dropdown** at the top with 6 languages
   - ✅ Voice orb in the center
   - ✅ First Aid button
   - ✅ Quick action buttons

### Step 2: Open Developer Console (F12)
- This will show you detailed logs about what's happening
- Look for: TTS logs, voice recognition logs, language changes

### Step 3: Test Language Selection

#### Test in English:
1. Select "**English - English (en-US)**" from dropdown
2. Wait for greeting: "Hello! Tell me about your health concern..."
3. You should **hear** the greeting spoken
4. Tap the voice orb
5. Speak: **"I have a headache"**
6. Wait for response
7. You should **hear** advice in English

#### Test in Hindi:
1. Select "**हिंदी - Hindi (hi-IN)**" from dropdown
2. Wait for greeting in Hindi
3. Tap the voice orb
4. Speak: **"मुझे सिरदर्द है"** (I have a headache)
5. You should **hear** response in Hindi

#### Test in Kannada:
1. Select "**ಕನ್ನಡ - Kannada (kn-IN)**" from dropdown
2. Wait for greeting in Kannada
3. Tap the voice orb
4. Speak: **"ನನಗೆ ತಲೆನೋವು ಇದೆ"** (I have a headache)
5. You should **hear** response in Kannada

### Step 4: Verify TTS is Working

If you don't hear any speech, open browser console and run:

```javascript
// Test basic TTS
window.speechSynthesis.speak(new SpeechSynthesisUtterance('Hello, testing TTS'))

// Check available voices
console.log(window.speechSynthesis.getVoices())
```

### Step 5: Check Console Logs

You should see logs like:
```
Language changed: { from: 'kn', to: 'en' }
TTS: Language changed, greeting in en
TTS speak invoked { text: "Hello! Tell me about...", language: 'en', textLength: 45 }
TTS available voices count: 67
TTS voice selected { voice: "Microsoft Zira Desktop - English (United States)", lang: "en-US" }
TTS: Speech started
Voice recognition result: { transcript: "I have a headache", selectedLanguage: "en" }
AI Analysis: { input: "I have a headache", language: "en", response: "..." }
TTS: Speaking response in en
TTS: Speech ended
```

## ✅ Expected Behavior

### Language Selection:
- ✅ Dropdown changes language immediately
- ✅ Greeting plays in new language
- ✅ Previous conversation clears
- ✅ Dropdown is disabled during speech/listening

### Voice Recognition:
- ✅ Orb pulses when listening
- ✅ Status shows "Listening to you…" (in selected language)
- ✅ Recognizes speech in selected language only
- ✅ Shows "You said: [transcript]"

### AI Response:
- ✅ Response appears in text bubble
- ✅ Response is in selected language
- ✅ Status shows "Responding…"

### Text-to-Speech:
- ✅ You **HEAR** the greeting
- ✅ You **HEAR** the response
- ✅ Voice matches selected language
- ✅ Console shows TTS logs

## 🐛 Troubleshooting

### Not Hearing Any Speech?

**1. Check Browser:**
- ✅ Use Chrome or Edge (best TTS support)
- ❌ Firefox has limited voice support
- ❌ Safari on Windows has issues

**2. Check System Volume:**
- Make sure volume is turned up
- Make sure not muted

**3. Check Browser Console:**
- Look for "TTS:" logs
- Check for errors

**4. Manually Test TTS:**
```javascript
// In browser console:
window.speechSynthesis.speak(new SpeechSynthesisUtterance('test'))
```
If you hear "test", TTS is working.

**5. Check Available Voices:**
```javascript
// Should show a list of voices
window.speechSynthesis.getVoices()
```

### Voice Recognition Not Working?

**1. Check Microphone Permission:**
- Browser should ask for permission
- Click "Allow" when prompted
- Check browser address bar for mic icon

**2. Check HTTPS:**
- Localhost works
- For remote access, you need HTTPS

**3. Check Browser:**
- Chrome/Edge: ✅ Excellent support
- Safari: ✅ Good support  
- Firefox: ⚠️ Limited support

### Still Shows English When Speaking Hindi?

**This should NOT happen anymore!**

The system now strictly uses the selected language. If this happens:
1. Check browser console for errors
2. Verify you selected the correct language from dropdown
3. Make sure dropdown shows "Selected: Hindi"
4. Reload the page and try again

### Language Dropdown Not Showing?

1. Check browser console for errors
2. Reload the page (Ctrl+R)
3. Check if there are any import errors

## 📞 Test Scenarios

### Scenario 1: Fever (All Languages)
| Language | Say This | Expected Response |
|----------|----------|------------------|
| English | "I have fever" | Fever advice in English |
| Hindi | "मुझे बुखार है" | Fever advice in Hindi |
| Kannada | "ನನಗೆ ಜ್ವರ ಇದೆ" | Fever advice in Kannada |

### Scenario 2: Headache
| Language | Say This | Expected Response |
|----------|----------|------------------|
| English | "I have a headache" | Headache advice in English |
| Hindi | "मुझे सिरदर्द है" | Headache advice in Hindi |
| Kannada | "ನನಗೆ ತಲೆನೋವು ಇದೆ" | Headache advice in Kannada |

### Scenario 3: Emergency  
| Language | Say This | Expected Response |
|----------|----------|------------------|
| English | "Chest pain" | Emergency advice + call 108 |
| Hindi | "छाती में दर्द" | Emergency advice + call 108 |
| Kannada | "ಎದೆ ನೋವು" | Emergency advice + call 108 |

## 🎯 Success Criteria

Your implementation is working correctly if:

1. ✅ Language dropdown is visible and functional
2. ✅ Changing language plays greeting in new language
3. ✅ Voice recognition works in selected language
4. ✅ AI response is in selected language
5. ✅ **You HEAR the spoken response** (most important!)
6. ✅ Console shows detailed TTS and recognition logs
7. ✅ No language mixing or auto-switching
8. ✅ System strictly follows selected language

## 📊 What Changed?

### Before:
- ❌ Auto-detected language (unreliable)
- ❌ Mixed languages in responses
- ❌ Complex auto-switching logic
- ❌ Sometimes responded in wrong language

### After:
- ✅ User selects language explicitly
- ✅ Strict language following (no mixing)
- ✅ Simple, clean code
- ✅ Always responds in selected language
- ✅ Text-to-Speech working properly
- ✅ Full user control

## 🎉 You're Done!

Your multilingual voice assistant is now fully functional with:
- ✅ Language selection dropdown
- ✅ Strict language following
- ✅ Working Text-to-Speech
- ✅ Accurate voice recognition
- ✅ Consistent AI responses

Happy testing! 🚀
