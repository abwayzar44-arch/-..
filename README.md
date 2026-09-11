# MM - WhatsApp MVP (Firebase + Expo/EAS)

تحديث الفرع: firebase-setup — هذا الفرع يحتوي على إعداد MVP للتجربة على أندرويد باستخدام Firebase (Phone Auth + Firestore chat).

ماذا تم إضافته:
- توحيد package name إلى com.abwayzar.whatsapp في app.json
- إضافة google-services.json (مُقدّم)
- App.js: شاشة تسجيل/تأكيد رقم الهاتف باستخدام @react-native-firebase/auth، والتنقّل إلى قائمة المحادثات
- شاشات: src/screens/ChatsList.js و src/screens/ChatScreen.js (Firestore realtime)
- src/firebase.js: مكونات firebase (auth, firestore, storage)
- eas.json: ملف البناء (profile production يصدر APK)
- README (هذا الملف)
- تحديث package.json: إضافة الحزم المطلوبة للـ MVP

ملاحظات هامة قبل البناء
1. مشروعنا الآن معدّ ليعمل بعد تنفيذ Expo prebuild (إعداد Native) لأن @react-native-firebase يتطلب Native modules.

خطوات تشغيل محلي وتجهيز APK (مختصر)
1. انسخ/تحميل المستودع وادخل إلى الفرع firebase-setup:
   git checkout firebase-setup

2. ثبت الحزم:
   npm install

3. ضع ملفات التهيئة (تأكد إن google-services.json موجود في جذر المشروع — تم إضافته هنا بناءً على موافقتك).

4. استخرج SHA-1 وSHA-256 لمفتاح التطوير وأضفهم في Firebase console (Project settings -> Your apps -> Add fingerprint):
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

5. Prebuild (يفضل استخدام node 18+):
   npx expo prebuild

6. بناء APK عبر EAS (تأكد من تسجيل الدخول إلى حساب Expo على جهازك: `eas login`):
   eas build --platform android --profile production
   (أو استخدم `npm run build:android`)

7. بعد انتهاء البناء، حمّل الـ APK من Expo dashboard أو من الـ artifacts التي يعطيها EAS.

تنبيهات أمنيّة وخصوصية
- google-services.json تحتوي على api_key وهي مضمّنة هنا بطلبك. إن أردت عدم رفعها للمستودع، حذّرني وسأنقل تعليمات لوضعها محلياً.
- لا أضف keystore إلى المستودع. استعمل EAS لإدارة المفاتيح أو أنشئ keystore محلياً.

ما الذي يجب فعله بعد البناء الأولي
- تحقق من عمل Phone Auth. إن ظهرت أخطاء متعلّقة بـ SHA fingerprints أو SafetyNet، أضف SHA-1/256 في Firebase console.
- قم باختبار إرسال/استقبال الرسائل، وإن أردت دعم إرسال الصور سأضيف واجهات رفع إلى Firebase Storage.

المساعدة التالية التي أقدّمها
- أقدر أعدل شريط الواجهات، أضيف رفع وسائط، أو أدمج مزيد من ميزات WhatsApp (مكالمات، تشفير) بمشاورات إضافية.


