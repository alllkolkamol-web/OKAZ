import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not configured in environment variables.');
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'assistant';
  content: string;
}

export interface ProductCatalogItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  inStock: boolean;
  stockCount: number;
  rating: number;
}

// Generate chat response for "مساعد عكاظ AI"
export async function generateCustomerAssistantResponse(
  history: ChatMessage[],
  currentMessage: string,
  catalogSummary?: ProductCatalogItem[]
): Promise<{ text: string; recommendedProductIds?: string[] }> {
  const ai = getAiClient();

  const catalogContext = catalogSummary && catalogSummary.length > 0
    ? `\n\nكتالوج المنتجات الحالية في متجر عكاظ (الأسعار بالدينار الليبي د.ل):\n` +
      catalogSummary.map(p => `- معرف [${p.id}]: ${p.name} | التصنيف: ${p.category} | السعر: ${p.price} د.ل | التوفر: ${p.inStock ? `متوفر (${p.stockCount} قطعة)` : 'نفذت الكمية'} | التقييم: ${p.rating}/5 | نبذة: ${p.description}`).join('\n')
    : '';

  const systemInstruction = `أنت "مساعد عكاظ الذكي" (Okaz AI Assistant)، المساعد الافتراضي الودود والذكي لمتجر "عكاظ" الإلكتروني الرائد في ليبيا.
مهمتك:
1. مساعدة العملاء في استكشاف وشراء المنتجات المناسبة لاحتياجاتهم وميزانيتهم.
2. الإجابة عن استفسارات المنتجات، المواصفات، الضمان، والأسعار بالدينار الليبي (د.ل).
3. تقديم نصائح وتوصيات مخصصة ومقارنات دقيقة ومفيدة.
4. الإجابة عن سياسات المتجر في ليبيا:
   - التوصيل: متوفر لجميع المدن الليبية (طرابلس، بنغازي، مصراتة، الزاوية، البيضاء، طبرق، سبها، سرت، الخمس، زليتن وغيرها) خلال 24-48 ساعة.
   - الدفع: الدفع عند الاستلام (كاش) متاح لجميع الطلبات، مع دعم قادم للبطاقات المصرفية المحلية (تداول، سداد، مو Mobicashe).
   - الإرجاع والاستبدال: إمكانية المعاينة عند الاستلام، وإرجاع مجاني خلال 7 أيام للمنتجات غير المستخدمة في عبوتها الأصلية.
   - الضمان: ضمان أصلي لمدة عام على الأجهزة الإلكترونية والكهربائية.
5. الأسلوب: ودود، احترافي، راقي، باللهجة الليبية المهذبة الممزوجة بالعربية الفصحى البسيطة والواضحة.
6. إذا اقترحت منتجات محددة من الكتالوج المتوفر لديك، اذكر اسم المنتج وسعره، وضع في نهاية ردك سطراً بتنسيق خاص:
RECOMMENDED_IDS:[id1, id2]
(إذا لم تكن هناك منتجات محددة، لا تضع هذا السطر).
${catalogContext}`;

  if (!ai) {
    // Fallback if API key is not yet set in environment
    return getSmartFallbackResponse(currentMessage, catalogSummary);
  }

  try {
    const formattedContents = [
      ...history.map(m => ({
        role: m.role === 'assistant' ? 'model' : m.role,
        parts: [{ text: m.content }]
      })),
      {
        role: 'user',
        parts: [{ text: currentMessage }]
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    });

    const rawText = response.text || 'أهلاً بك في متجر عكاظ! كيف يمكنني مساعدتك اليوم؟';
    
    // Extract recommended IDs if present
    const idMatch = rawText.match(/RECOMMENDED_IDS:\[(.*?)\]/);
    let cleanText = rawText.replace(/RECOMMENDED_IDS:\[.*?\]/, '').trim();
    let recommendedIds: string[] = [];

    if (idMatch && idMatch[1]) {
      recommendedIds = idMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    }

    return {
      text: cleanText,
      recommendedProductIds: recommendedIds.length > 0 ? recommendedIds : undefined
    };
  } catch (error) {
    console.error('Error calling Gemini API for customer chat:', error);
    return getSmartFallbackResponse(currentMessage, catalogSummary);
  }
}

// Admin AI: Generate product descriptions
export async function generateProductDescription(params: {
  productName: string;
  category: string;
  targetPrice?: number;
  features?: string[];
}): Promise<{
  description: string;
  shortDescription: string;
  highlights: string[];
  suggestedTags: string[];
}> {
  const ai = getAiClient();

  const prompt = `أنت خبير تسويق إلكتروني لمتجر "عكاظ" في ليبيا.
قم بصياغة وصف تسويقي جذاب ومكتمل لمنتج بالمواصفات التالية:
- اسم المنتج: ${params.productName}
- القسم/التصنيف: ${params.category}
- السعر المقترح: ${params.targetPrice ? `${params.targetPrice} د.ل` : 'غير محدد'}
- أبرز الميزات: ${params.features ? params.features.join('، ') : 'مواصفات قياسية حديثة'}

أجب بصيغة JSON فقط بالتنسيق التالي:
{
  "shortDescription": "جملة موجزة وقوية تلخص قيمة المنتج للعميل",
  "description": "فقرة تفصيلية تسويقية تقنع المشتري الليبي بالجودة والاعتمادية والفوائد",
  "highlights": ["ميزة 1 قوية", "ميزة 2 عملية", "ميزة 3 عن الجودة", "ميزة 4 عن الراحة أو الضمان"],
  "suggestedTags": ["كلمة_مفتاحية1", "كلمة2", "عكاظ_ليبيا"]
}`;

  if (!ai) {
    return {
      shortDescription: `منتج فاخر عالي الجودة من متجر عكاظ يلبي احتياجاتك اليومية بأعلى معايير الأناقة والكفاءة.`,
      description: `يقدم لك متجر عكاظ ${params.productName}، الخيار الأمثل الباحثين عن التميز والعملية في السوق الليبي. يتمتع بجودة تصنيع متينة، وضمان متجر عكاظ الذهبي مع إمكانية المعاينة والدفع عند الاستلام في كافة أرجاء ليبيا.`,
      highlights: [
        'جودة أصلية ممتازة ومضمونة',
        'توصيل سريع لكافة المدن الليبية',
        'دفع عند الاستلام مع إمكانية المعاينة',
        'خدمة عملاء ودعم فني متواصل'
      ],
      suggestedTags: ['عكاظ_ليبيا', params.category, 'تسوق_ليبيا', 'توصيل_سريع']
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return {
      shortDescription: parsed.shortDescription || `${params.productName} عالي الجودة متوفر الآن لدى متجر عكاظ.`,
      description: parsed.description || `منتج رائع يلائم متطلباتك مع ضمان وتوصيل لكافة المدن.`,
      highlights: Array.isArray(parsed.highlights) ? parsed.highlights : ['جودة عالية', 'ضمان متجر عكاظ'],
      suggestedTags: Array.isArray(parsed.suggestedTags) ? parsed.suggestedTags : ['متجر_عكاظ']
    };
  } catch (error) {
    console.error('Error generating description with Gemini:', error);
    return {
      shortDescription: `${params.productName} المتميز من متجر عكاظ بأفضل سعر وجودة مضمونة.`,
      description: `اختر ${params.productName} لتحصل على تجربة استخدام راقية وموثوقة. متوفر مع خيار الدفع عند الاستلام والتوصيل السريع لجميع مناطق ليبيا.`,
      highlights: ['خامات عالية التحمل', 'توصيل سريع', 'دفع عند الاستلام'],
      suggestedTags: ['عكاظ', params.category]
    };
  }
}

// Compare multiple products
export async function compareProducts(products: ProductCatalogItem[]): Promise<{
  summary: string;
  winnerRecommendation: string;
  criteria: { criterion: string; winner: string; note: string }[];
}> {
  const ai = getAiClient();

  const productsText = products.map(p => 
    `المنتج: ${p.name} | السعر: ${p.price} د.ل | التصنيف: ${p.category} | الوصف: ${p.description} | التقييم: ${p.rating}/5`
  ).join('\n');

  const prompt = `قارن بين المنتجات التالية المتوفرة في متجر عكاظ (ليبيا):
${productsText}

قدم مقارنة ذكية وموضوعية بصيغة JSON بالتنسيق:
{
  "summary": "ملخص عام للمقارنة بين المنتجات والفروقات الجوهرية",
  "winnerRecommendation": "المنتج الأنسب ولمن نوصي به تحديداً مع مراعاة السعر والقيمة",
  "criteria": [
    {"criterion": "السعر مقابل القيمة", "winner": "اسم المنتج الفائز هنا", "note": "توضيح مختصر"},
    {"criterion": "الأداء والمواصفات", "winner": "اسم المنتج الفائز", "note": "توضيح مختصر"},
    {"criterion": "الاستخدام اليومي", "winner": "اسم المنتج الفائز", "note": "توضيح مختصر"}
  ]
}`;

  if (!ai) {
    return {
      summary: `مقارنة بين ${products.map(p => p.name).join(' و ')}، كلاهما يقدم جودة ممتازة في فئته السعرية مع ضمان متجر عكاظ.`,
      winnerRecommendation: products[0]?.name || 'كلا الخيارين ممتاز',
      criteria: [
        { criterion: 'السعر مقابل القيمة', winner: products[0]?.name || '', note: 'يوفر توازناً رائعاً بين السعر والمواصفات.' },
        { criterion: 'الأداء العام', winner: products[1]?.name || products[0]?.name || '', note: 'تصميم أنيق وميزات مناسبة.' }
      ]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.6
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      summary: parsed.summary || 'مقارنة دقيقة بين المنتجات المختارة.',
      winnerRecommendation: parsed.winnerRecommendation || 'جميع المنتجات مضمونة من متجر عكاظ.',
      criteria: Array.isArray(parsed.criteria) ? parsed.criteria : []
    };
  } catch (error) {
    console.error('Error in compareProducts:', error);
    return {
      summary: 'مقارنة بين المنتجات المختارة.',
      winnerRecommendation: products[0]?.name || '',
      criteria: []
    };
  }
}

// Fallback intelligent agent when API key is awaiting setup
function getSmartFallbackResponse(
  message: string,
  catalog?: ProductCatalogItem[]
): { text: string; recommendedProductIds?: string[] } {
  const lower = message.toLowerCase();

  // Check for shipping/delivery questions
  if (lower.includes('توصيل') || lower.includes('شحن') || lower.includes('طرابلس') || lower.includes('بنغازي') || lower.includes('مصراتة')) {
    return {
      text: `مرحباً بك! نوفر في متجر عكاظ خدمة التوصيل السريع إلى جميع المدن والمناطق الليبية:
• طرابلس وضواحيها: توصيل خلال 24 ساعة (15 د.ل أو مجاني للطلبات فوق 200 د.ل).
• بنغازي ومصراتة والزاوية: توصيل خلال 24 - 48 ساعة (20-25 د.ل).
• باقي المدن والجنوب: توصيل آمن وموثوق خلال 48 - 72 ساعة.
كما يمكنك معاينة طلبك والتأكد منه قبل السداد مع خيار الدفع عند الاستلام!`
    };
  }

  // Check for payment
  if (lower.includes('دفع') || lower.includes('كاش') || lower.includes('سداد') || lower.includes('تداول') || lower.includes('فلوس')) {
    return {
      text: `في متجر عكاظ نوفر خيار الدفع عند الاستلام (كاش) لجميع الطلبات في ليبيا، حتى تتسوق بكل راحة واطمئنان. كما نجهز حالياً لدعم وسائل الدفع الإلكتروني المصرفية المحلية (سداد، تداول، وموبي كاش) لتكون تجربتك سلسة وسريعة.`
    };
  }

  // Check for warranty / returns
  if (lower.includes('ضمان') || lower.includes('ارجاع') || lower.includes('استرجاع') || lower.includes('تبديل')) {
    return {
      text: `سياستنا في متجر عكاظ تركز على راحة العميل أولاً:
• ضمان أصلي لمدة 12 شهراً على الأجهزة الإلكترونية.
• إمكانية المعاينة المباشرة عند باب المنزل قبل الاستلام.
• حق الإرجاع أو الاستبدال خلال 7 أيام للمنتجات المغلفة وغير المستخدمة.
فريقنا دائماً في خدمتك!`
    };
  }

  // Check if looking for recommendations
  if (catalog && catalog.length > 0) {
    const matched = catalog.filter(p => 
      lower.includes(p.name.toLowerCase()) || 
      lower.includes(p.category.toLowerCase()) ||
      p.description.toLowerCase().includes(lower)
    );

    if (matched.length > 0) {
      const topP = matched.slice(0, 3);
      return {
        text: `بناءً على طلبك، وجدنا لك خيارات مميزة متوفرة الآن في متجر عكاظ:
${topP.map(p => `• **${p.name}** بسعر ${p.price} د.ل - ${p.description}`).join('\n')}

جميعها متوفرة للشحن الفوري مع الدفع عند الاستلام. هل تود تفاصيل أكثر عن أحد هذه المنتجات؟`,
        recommendedProductIds: topP.map(p => p.id)
      };
    }
  }

  // Generic friendly fallback
  return {
    text: `أهلاً بك في متجر عكاظ! أنا مساعدك الذكي AI، يمكنني مساعدتك في:
1. العثور على أفضل المنتجات والإلكترونيات والعطور والأزياء في ليبيا.
2. مقارنة الأسعار والمواصفات بالدينار الليبي (د.ل).
3. معرفة تفاصيل التوصيل وحالة طلباتك.
بماذا يمكنني خدمتك اليوم؟`
  };
}
