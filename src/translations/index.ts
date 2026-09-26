import { Language, StyleType, DepthLevel, LightingType, ShadowType, BackgroundType, AspectRatioType, QualityType } from '../types';

export const translations = {
  en: {
    appTitle: '3D Picture Studio',
    tagline: 'AI-Powered 3D Photo Transformation',
    heroHeading: 'Create Your 3D Picture',
    heroSubtitle: 'Upload your photo and turn it into a stunning 3D-style image with realistic depth and lighting.',
    
    // Workflow Steps
    step1: '1. Upload Photo',
    step2: '2. Select 3D Style',
    step3: '3. Create 3D Picture',
    step4: '4. Preview & Download',

    // Upload section
    uploadAreaTitle: 'Drag & drop your photo here',
    uploadAreaSubtitle: 'or click to browse from device',
    uploadFormats: 'Supports JPG, JPEG and PNG up to 20MB',
    uploadButton: 'Upload Photo',
    orTrySample: 'Or try with instant sample photos:',
    sampleFemale: 'Female Portrait',
    sampleMale: 'Male Portrait',
    changePhoto: 'Change Photo',
    uploadedPreview: 'Uploaded Photo Preview',

    // Face Preservation Guarantee
    faceGuaranteeTitle: 'Face Preservation Guarantee',
    faceGuaranteeDesc: "Your original facial features, proportions, skin texture, and natural expression are strictly preserved. The result will look like the real you in 3D.",

    // Action buttons
    createButton: 'Create 3D Picture',
    creating: 'Transforming into 3D...',
    createAnother: 'Create Another Picture',
    downloadHD: 'Download HD Image',
    downloadOptions: 'Download Options',
    reset: 'Reset All',
    share: 'Share Image',
    share3DPortrait: 'Share 3D Portrait',
    shareWithFriends: 'Share with Friends',
    shareViaDevice: 'Share via Device (WhatsApp, AirDrop, Apps)',
    sharing: 'Opening Share...',
    shareSuccess: '3D Portrait shared successfully!',
    shareModalTitle: 'Share Your 3D Portrait',
    shareModalSubtitle: 'Quickly share with friends or post directly to social media apps.',
    copyShareLink: 'Copy Share Link',
    copyImage: 'Copy Image',
    imageCopiedSuccess: 'Image copied to clipboard!',
    socialPlatforms: 'Social Platforms',
    moreSharingOptions: 'Social Channels',
    webShareHint: 'Uses your device’s native share sheet for instant sharing to any app.',
    saveFavorite: 'Favorite',
    favorited: 'Saved to Favorites',
    removeFromFavorites: 'Remove from Favorites',

    // Style options
    styleSectionTitle: 'Choose 3D Style',
    styles: {
      realistic_3d: {
        name: 'Realistic 3D Look',
        desc: 'Photorealistic dimensional render with natural physical depth and real-world textures.'
      },
      cinematic_3d: {
        name: 'Cinematic 3D Look',
        desc: 'Blockbuster movie CGI aesthetics with anamorphic rim lighting and shallow focus.'
      },
      portrait_3d: {
        name: '3D Portrait',
        desc: 'High-end studio headshot with silky depth of field and soft dimensional illumination.'
      },
      character_3d: {
        name: '3D Character Style',
        desc: 'Stylized 3D animation feature film character aesthetic with smooth polished surfaces.'
      },
      gaming_3d: {
        name: '3D Gaming Style',
        desc: 'Next-gen AAA Unreal Engine 5 aesthetic with raytraced specular highlights.'
      },
      studio_3d: {
        name: '3D Studio Style',
        desc: 'Clean editorial cyclorama studio lighting with crisp dimensional silhouette.'
      }
    } as Record<StyleType, { name: string; desc: string }>,

    // Enhancements
    enhancementsTitle: 'Fine-Tune 3D Enhancements',
    enhancementsSubtitle: 'Customize depth, lighting, shadows and background',
    depthLabel: 'Depth Effect',
    depthOptions: {
      low: 'Subtle Depth',
      medium: 'Medium Depth',
      high: 'Pronounced Depth',
      ultra: 'Ultra 3D Relief'
    } as Record<DepthLevel, string>,

    lightingLabel: 'Lighting Enhancement',
    lightingOptions: {
      studio_softbox: 'Studio Softbox',
      dramatic_rim: 'Dramatic Rim Light',
      cyberpunk_neon: 'Cyberpunk Neon',
      golden_hour: 'Golden Hour Sunset',
      volumetric_sun: 'Volumetric Sunlight'
    } as Record<LightingType, string>,

    shadowLabel: 'Shadow Enhancement',
    shadowOptions: {
      subtle: 'Natural Subtle Shadows',
      deep_ao: 'Deep Ambient Occlusion',
      soft_diffused: 'Soft Diffused Shadows'
    } as Record<ShadowType, string>,

    backgroundLabel: 'Background Replacement',
    backgroundOptions: {
      original_stylized: 'Keep Original (3D Blurred)',
      studio_backdrop: 'Studio 3D Backdrop',
      cyber_holo: 'Cyber Holographic',
      architectural_minimal: 'Architectural Minimalist',
      dark_bokeh: 'Dark Studio Bokeh'
    } as Record<BackgroundType, string>,

    aspectRatioLabel: 'Aspect Ratio',
    aspectRatioOptions: {
      '1:1': '1:1 Square (Instagram / Profile)',
      '4:5': '4:5 Portrait (Feed)',
      '9:16': '9:16 Story / Reels / Mobile',
      '16:9': '16:9 Landscape (Widescreen)'
    } as Record<AspectRatioType, string>,

    qualityLabel: 'Render Quality',
    qualityOptions: {
      standard: 'Standard (Fast)',
      hd: 'HD High Definition',
      ultra_hd: 'Ultra HD (Maximum Detail)'
    } as Record<QualityType, string>,

    watermarkLabel: 'Studio Watermark',
    watermarkOn: 'Watermark: On',
    watermarkOff: 'Watermark: Off',

    // Processing steps
    processingTitle: 'Crafting Your 3D Masterpiece',
    processingSteps: [
      'Scanning facial landmarks and preserving identity...',
      'Generating stereoscopic depth map...',
      'Calculating volumetric lighting and rim reflections...',
      'Applying ambient occlusion and 3D surface shaders...',
      'Rendering final high-definition 3D image...'
    ],

    // Before / After Comparison
    beforeAfterTitle: 'Before & After Comparison',
    beforeAfterSubtitle: 'Drag the slider horizontally to compare your original photo with the 3D result.',
    originalLabel: 'Original Photo',
    resultLabel: '3D Picture',
    viewModeSlider: 'Comparison Slider',
    viewMode3DTilt: 'Interactive 3D Tilt',
    tiltInstruction: 'Move cursor or tilt device to experience dynamic 3D depth and specular reflection',
    fullscreen: 'Fullscreen View',
    close: 'Close',

    // Recent Gallery
    recentTitle: 'Your Recent 3D Pictures',
    recentSubtitle: 'Saved in your browser for quick access and download.',
    noRecent: 'No pictures yet. Upload a photo above to start your 3D gallery!',
    clearAll: 'Clear All',
    viewResult: 'View',
    download: 'Download',
    deleteItem: 'Delete',

    // Notifications & Messages
    imageCopied: 'Image copied to clipboard!',
    linkCopied: 'Share link copied to clipboard!',
    downloadStarted: 'Download started!',
    errorNoImage: 'Please upload or select a photo first.',
    errorProcessing: 'Failed to process image. A 3D rendered version was generated using the studio depth engine.',
    copiedSuccess: 'Copied successfully!',
    formatError: 'Please upload a valid JPG, JPEG, or PNG image.'
  },

  ur: {
    appTitle: '3D پکچر اسٹوڈیو',
    tagline: 'مصنوعی ذہانت سے لیس 3D فوٹو ٹرانسفارمیشن',
    heroHeading: 'اپنی تصویر کو 3D بنائیں',
    heroSubtitle: 'اپنی عام تصویر اپلوڈ کریں اور اسے حقیقت پسندانہ گہرائی اور روشنی کے ساتھ شاندار 3D شاہکار میں تبدیل کریں۔',
    
    // Workflow Steps
    step1: '1. تصویر اپلوڈ کریں',
    step2: '2. 3D انداز منتخب کریں',
    step3: '3. 3D تصویر تیار کریں',
    step4: '4. جائزہ اور ڈاؤنلوڈ',

    // Upload section
    uploadAreaTitle: 'اپنی تصویر یہاں ڈریگ اور ڈراپ کریں',
    uploadAreaSubtitle: 'یا اپنے فون/کمپیوٹر سے منتخب کرنے کے لیے کلک کریں',
    uploadFormats: 'JPG, JPEG اور PNG فارمیٹس (زیادہ سے زیادہ 20MB)',
    uploadButton: 'تصویر اپلوڈ کریں',
    orTrySample: 'یا فوری نمونہ تصویر کے ساتھ آزمائیں:',
    sampleFemale: 'خاتون کی تصویر',
    sampleMale: 'مرد کی تصویر',
    changePhoto: 'تصویر تبدیل کریں',
    uploadedPreview: 'اپلوڈ شدہ تصویر کا جائزہ',

    // Face Preservation Guarantee
    faceGuaranteeTitle: 'چہرے کی اصل شناخت محفوظ رکھنے کی مکمل ضمانت',
    faceGuaranteeDesc: 'آپ کے چہرے کے قدرتی نقوش، بناوٹ، جلد کی تفصیل اور تاثرات بالکل محفوظ رہیں گے۔ تیار شدہ 3D تصویر میں آپ کی اصل پہچان برقرار رہے گی۔',

    // Action buttons
    createButton: '3D تصویر بنائیں',
    creating: '3D تصویر تیار ہو رہی ہے...',
    createAnother: 'ایک اور تصویر بنائیں',
    downloadHD: 'HD تصویر ڈاؤنلوڈ کریں',
    downloadOptions: 'ڈاؤنلوڈ کے اختیارات',
    reset: 'دوبارہ شروع کریں',
    share: 'شیئر کریں',
    share3DPortrait: '3D پورٹریٹ شیئر کریں',
    shareWithFriends: 'دوستوں کے ساتھ شیئر کریں',
    shareViaDevice: 'ڈیوائس سے شیئر کریں (واٹس ایپ، ایپس وغیرہ)',
    sharing: 'شیئر کھل رہا ہے...',
    shareSuccess: '3D تصویر کامیابی سے شیئر ہو گئی!',
    shareModalTitle: 'اپنی 3D تصویر شیئر کریں',
    shareModalSubtitle: 'دوستوں کو فوری بھیجیں یا سوشل میڈیا ایپس پر پوسٹ کریں۔',
    copyShareLink: 'لنک کاپی کریں',
    copyImage: 'تصویر کاپی کریں',
    imageCopiedSuccess: 'تصویر کلپ بورڈ میں کاپی ہو گئی!',
    socialPlatforms: 'سوشل میڈیا پلیٹ فارمز',
    moreSharingOptions: 'سوشل چینلز',
    webShareHint: 'کسی بھی ایپ پر فوری شیئرنگ کے لیے ڈیوائس کا شیئر مینو استعمال کریں۔',
    saveFavorite: 'پسندیدہ میں شامل کریں',
    favorited: 'پسندیدہ میں محفوظ ہو گئی',
    removeFromFavorites: 'پسندیدہ سے ہٹائیں',

    // Style options
    styleSectionTitle: '3D انداز کا انتخاب کریں',
    styles: {
      realistic_3d: {
        name: 'حقیقت پسندانہ 3D انداز',
        desc: 'قدرتی گہرائی، حقیقی مٹیریل اور حقیقت سے قریب تر 3D لک۔'
      },
      cinematic_3d: {
        name: 'سنیماٹک 3D انداز',
        desc: 'ہالی ووڈ فلموں کی طرز پر رم لائٹنگ، ڈرامائی فوکس اور سنیما لک۔'
      },
      portrait_3d: {
        name: '3D پورٹریٹ',
        desc: 'اسٹوڈیو ہیڈ شاٹ، پس منظر کی نرم دھندلاہٹ اور دلکش اسٹوڈیو لائٹنگ۔'
      },
      character_3d: {
        name: '3D اینیمیشن کیریکٹر',
        desc: 'پکسار اور جدید اینیمیشن فلموں کی طرز پر چکنی اور خوبصورت 3D شکل۔'
      },
      gaming_3d: {
        name: '3D گیمنگ انداز',
        desc: 'Unreal Engine 5 گیم کریکٹر اسٹائل، شعاعی روشنی اور تفصیلی شیڈنگ۔'
      },
      studio_3d: {
        name: '3D اسٹوڈیو فیشن',
        desc: 'پروفیشنل فوٹو اسٹوڈیو بیک ڈراپ اور خوبصورت متوازن روشنی۔'
      }
    } as Record<StyleType, { name: string; desc: string }>,

    // Enhancements
    enhancementsTitle: '3D سیٹنگز اور فیچرز',
    enhancementsSubtitle: 'گہرائی، لائٹنگ، سائے اور پس منظر کو اپنی مرضی کے مطابق ترتیب دیں',
    depthLabel: '3D گہرائی کا اثر',
    depthOptions: {
      low: 'ہلکی گہرائی',
      medium: 'درمیانی گہرائی',
      high: 'واضح 3D گہرائی',
      ultra: 'انتہائی گہرا 3D اثر'
    } as Record<DepthLevel, string>,

    lightingLabel: 'روشنی کی بہتری (Lighting)',
    lightingOptions: {
      studio_softbox: 'اسٹوڈیو سافٹ باکس',
      dramatic_rim: 'شاندار رم لائٹ (کناروں پر چمک)',
      cyberpunk_neon: 'سائبر پنک نیون لائٹنگ',
      golden_hour: 'سنہری شام کی روشنی (Golden Hour)',
      volumetric_sun: 'سورج کی شعاعیں (Volumetric Sun)'
    } as Record<LightingType, string>,

    shadowLabel: 'سایوں کی ترتیب (Shadows)',
    shadowOptions: {
      subtle: 'قدرتی ہلکے سائے',
      deep_ao: 'گہرے تفصیلی سائے (Ambient Occlusion)',
      soft_diffused: 'پھیلے ہوئے نرم سائے'
    } as Record<ShadowType, string>,

    backgroundLabel: 'پس منظر کا انتخاب (Background)',
    backgroundOptions: {
      original_stylized: 'اصل پس منظر (3D دھندلاہٹ کے ساتھ)',
      studio_backdrop: 'پروفیشنل 3D اسٹوڈیو دیوار',
      cyber_holo: 'سائبر ہولوگرافک اسٹوڈیو',
      architectural_minimal: 'جدید خوبصورت انٹیریئر',
      dark_bokeh: 'ڈارک اسٹوڈیو بوکے لائٹس'
    } as Record<BackgroundType, string>,

    aspectRatioLabel: 'تصویر کا سائز (Aspect Ratio)',
    aspectRatioOptions: {
      '1:1': '1:1 چوکور (انسٹاگرام / پروفائل)',
      '4:5': '4:5 پورٹریٹ (فیڈ کے لیے)',
      '9:16': '9:16 موبائل اسٹوری / ریلز',
      '16:9': '16:9 وائڈ اسکرین (کمپیوٹر)'
    } as Record<AspectRatioType, string>,

    qualityLabel: 'تصویر کا معیار (Quality)',
    qualityOptions: {
      standard: 'معیاری (تیز ترین)',
      hd: 'ایچ ڈی (HD High Definition)',
      ultra_hd: 'الٹرا ایچ ڈی (بہترین تفصیل)'
    } as Record<QualityType, string>,

    watermarkLabel: 'اسٹوڈیو واٹر مارک',
    watermarkOn: 'واٹر مارک: آن',
    watermarkOff: 'واٹر مارک: بغیر واٹر مارک',

    // Processing steps
    processingTitle: 'آپ کی 3D تصویر تیار کی جا رہی ہے',
    processingSteps: [
      'چہرے کے خدوخال کا جائزہ اور اصل شناخت کی حفاظت...',
      '3D گہرائی کا نقشہ (Depth Map) تیار ہو رہا ہے...',
      'اسٹوڈیو لائٹنگ اور سائے لاگو کیے جا رہے ہیں...',
      '3D سرفیس اور ساخت پر کام جاری ہے...',
      'اعلیٰ معیار کی حتمی 3D تصویر مکمل ہو رہی ہے...'
    ],

    // Before / After Comparison
    beforeAfterTitle: 'پہلے اور بعد کا موازنہ',
    beforeAfterSubtitle: 'اصل تصویر اور 3D نتیجے کا موازنہ کرنے کے لیے سلائیڈر کو دائیں بائیں گھمائیں۔',
    originalLabel: 'اصل تصویر',
    resultLabel: '3D تصویر',
    viewModeSlider: 'موازنہ سلائیڈر',
    viewMode3DTilt: 'انٹرایکٹو 3D جھکاؤ',
    tiltInstruction: 'حقیقی 3D گہرائی اور روشنی دیکھنے کے لیے ماؤس کو گھمائیں یا فون کو جھکائیں',
    fullscreen: 'پوری اسکرین پر دیکھیں',
    close: 'بند کریں',

    // Recent Gallery
    recentTitle: 'حالیہ تیار کردہ 3D تصاویر',
    recentSubtitle: 'آپ کے براؤزر میں فوری رسائی کے لیے محفوظ ہیں۔',
    noRecent: 'ابھی تک کوئی تصویر نہیں۔ شروع کرنے کے لیے اوپر اپنی تصویر اپلوڈ کریں!',
    clearAll: 'سب صاف کریں',
    viewResult: 'دیکھیں',
    download: 'ڈاؤنلوڈ',
    deleteItem: 'حذف کریں',

    // Notifications & Messages
    imageCopied: 'تصویر کلپ بورڈ میں کاپی ہو گئی!',
    linkCopied: 'شیئر لنک کاپی ہو گیا!',
    downloadStarted: 'ڈاؤنلوڈ شروع ہو گیا!',
    errorNoImage: 'براہ کرم پہلے ایک تصویر منتخب کریں۔',
    errorProcessing: 'تصویر کی پروسیسنگ میں مسئلہ آیا۔ اسٹوڈیو انجن سے 3D ورژن تیار کیا گیا۔',
    copiedSuccess: 'کامیابی سے کاپی ہو گیا!',
    formatError: 'براہ کرم درست JPG یا PNG تصویر منتخب کریں۔'
  }
};
