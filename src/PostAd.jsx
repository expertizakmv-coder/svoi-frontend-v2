import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── CONSTANTS ───────────────────────────────────────────
const CATEGORIES = [
  { value: "",             label: "Выберите категорию" },
  { value: "Недвижимость", label: "🏠 Недвижимость — аренда/продажа" },
  { value: "Работа",       label: "💼 Работа — вакансии и резюме" },
  { value: "Услуги",       label: "🧰 Услуги — мастера рядом" },
  { value: "Товары",       label: "🛒 Товары — куплю/продам" },
  { value: "Авто",         label: "🚗 Авто — транспорт/запчасти" },
  { value: "Животные",     label: "🐾 Животные" },
  { value: "Другое",       label: "📦 Другое" },
];

const PRICE_TYPES = [
  { value: "fixed",    label: "Фиксированная цена" },
  { value: "contract", label: "Договорная" },
  { value: "free",     label: "Бесплатно / Отдам" },
];

const STEPS = ["Категория", "Объявление", "Контакты", "Превью"];

// ─── HELPERS ─────────────────────────────────────────────
function validate(step, data) {
  const errors = {};
  if (step === 0) {
    if (!data.category) errors.category = "Выберите категорию";
  }
  if (step === 1) {
    if (!data.title.trim())       errors.title = "Введите заголовок";
    else if (data.title.length < 5) errors.title = "Минимум 5 символов";
    if (!data.description.trim()) errors.description = "Добавьте описание";
    else if (data.description.length < 20) errors.description = "Минимум 20 символов";
    if (data.priceType === "fixed" && !data.price) errors.price = "Укажите цену";
  }
  if (step === 2) {
    if (!data.phone.trim())       errors.phone = "Укажите телефон";
    else if (!/^[\d\s\+\-\(\)]{10,}$/.test(data.phone)) errors.phone = "Некорректный номер";
    if (!data.name.trim())        errors.name = "Укажите имя";
  }
  return errors;
}

// ─── STEP INDICATOR ──────────────────────────────────────
function StepBar({ current }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i < current  ? "bg-green-500 text-white" :
              i === current ? "bg-blue-600 text-white ring-4 ring-blue-100" :
                              "bg-gray-100 text-gray-400"
            }`}>
              {i < current ? "✓" : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === current ? "text-blue-600" : "text-gray-400"}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-4 transition-all ${i < current ? "bg-green-400" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── FIELD WRAPPER ───────────────────────────────────────
function Field({ label, hint, error, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
      {error && (
        <div className="flex items-center gap-1 text-xs text-red-500">
          <span>⚠</span> {error}
        </div>
      )}
    </div>
  );
}

const inputCls = (error) =>
  `w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition font-['Golos_Text',sans-serif] ${
    error ? "border-red-400 focus:border-red-500 bg-red-50" : "border-gray-200 focus:border-blue-400 bg-white"
  }`;

// ─── STEP 0 — КАТЕГОРИЯ ──────────────────────────────────
function StepCategory({ data, errors, onChange }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Выберите категорию</h2>
        <p className="text-sm text-gray-500 mt-1">Это поможет найти ваше объявление нужным людям</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORIES.slice(1).map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onChange("category", c.value)}
            className={`text-left p-4 rounded-2xl border-2 transition-all ${
              data.category === c.value
                ? "border-blue-500 bg-blue-50 shadow-sm"
                : "border-gray-100 bg-white hover:border-gray-300"
            }`}
          >
            <div className="text-2xl mb-2">{c.label.split(" ")[0]}</div>
            <div className={`text-xs font-semibold leading-snug ${data.category === c.value ? "text-blue-700" : "text-gray-700"}`}>
              {c.label.split(" — ")[0].replace(/^\S+\s/, "")}
            </div>
            {c.label.includes("—") && (
              <div className="text-xs text-gray-400 mt-0.5">{c.label.split(" — ")[1]}</div>
            )}
          </button>
        ))}
      </div>

      {errors.category && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">
          ⚠ {errors.category}
        </div>
      )}
    </div>
  );
}

// ─── STEP 1 — ОБЪЯВЛЕНИЕ ─────────────────────────────────
function StepDetails({ data, errors, onChange }) {
  const titleLen = data.title.length;
  const descLen  = data.description.length;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Опишите объявление</h2>
        <p className="text-sm text-gray-500 mt-1">Чем подробнее — тем быстрее найдёте покупателя</p>
      </div>

      <Field label="Заголовок" required hint={`${titleLen}/80`} error={errors.title}>
        <input
          className={inputCls(errors.title)}
          placeholder="Например: Сдам 2-комнатную квартиру"
          value={data.title}
          maxLength={80}
          onChange={e => onChange("title", e.target.value)}
        />
      </Field>

      <Field label="Описание" required hint={`${descLen}/2000`} error={errors.description}>
        <textarea
          className={`${inputCls(errors.description)} resize-none`}
          placeholder="Расскажите подробнее: состояние, особенности, условия сделки..."
          value={data.description}
          maxLength={2000}
          rows={5}
          onChange={e => onChange("description", e.target.value)}
        />
        {descLen < 20 && descLen > 0 && (
          <div className="text-xs text-gray-400">Ещё {20 - descLen} символов для минимума</div>
        )}
      </Field>

      {/* Цена */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-gray-700">Цена <span className="text-red-500">*</span></label>
        <div className="flex gap-2 flex-wrap">
          {PRICE_TYPES.map(pt => (
            <button
              key={pt.value}
              type="button"
              onClick={() => onChange("priceType", pt.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                data.priceType === pt.value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {pt.label}
            </button>
          ))}
        </div>

        {data.priceType === "fixed" && (
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-xs">
              <input
                className={inputCls(errors.price)}
                placeholder="0"
                type="number"
                min="0"
                value={data.price}
                onChange={e => onChange("price", e.target.value)}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₽</span>
            </div>
            {errors.price && <span className="text-xs text-red-500">⚠ {errors.price}</span>}
          </div>
        )}
      </div>

      {/* Фото */}
      <Field label="Фотографии" hint="до 5 фото, JPG/PNG">
        <div className="flex gap-3 flex-wrap">
          {data.photos.map((p, i) => (
            <div key={i} className="relative h-20 w-24 rounded-xl overflow-hidden bg-gray-100">
              <img src={p.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange("photos", data.photos.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center"
              >✕</button>
            </div>
          ))}
          {data.photos.length < 5 && (
            <label className="h-20 w-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
              <span className="text-2xl text-gray-300">+</span>
              <span className="text-xs text-gray-400 mt-1">Добавить</span>
              <input
                type="file" accept="image/*" multiple className="hidden"
                onChange={e => {
                  const files = Array.from(e.target.files).slice(0, 5 - data.photos.length);
                  const newPhotos = files.map(f => ({ url: URL.createObjectURL(f), file: f }));
                  onChange("photos", [...data.photos, ...newPhotos]);
                }}
              />
            </label>
          )}
        </div>
        <p className="text-xs text-gray-400">Первое фото будет главным. Хорошие фото увеличивают отклики в 3 раза.</p>
      </Field>
    </div>
  );
}

// ─── STEP 2 — КОНТАКТЫ ───────────────────────────────────
function StepContacts({ data, errors, onChange }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Контактные данные</h2>
        <p className="text-sm text-gray-500 mt-1">Как с вами связаться по объявлению</p>
      </div>

      <Field label="Ваше имя" required error={errors.name}>
        <input
          className={inputCls(errors.name)}
          placeholder="Имя или nickname"
          value={data.name}
          onChange={e => onChange("name", e.target.value)}
        />
      </Field>

      <Field label="Телефон" required error={errors.phone}>
        <input
          className={inputCls(errors.phone)}
          placeholder="+7 928 000-00-00"
          value={data.phone}
          onChange={e => onChange("phone", e.target.value)}
          type="tel"
        />
        <p className="text-xs text-gray-400">Номер будет скрыт — показывается только по запросу</p>
      </Field>

      <Field label="Способ связи" hint="необязательно">
        <div className="flex gap-2 flex-wrap">
          {["Звонок", "WhatsApp", "Telegram"].map(m => (
            <button
              key={m}
              type="button"
              onClick={() => {
                const cur = data.contactMethods;
                onChange("contactMethods", cur.includes(m) ? cur.filter(x => x !== m) : [...cur, m]);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                data.contactMethods.includes(m)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </Field>

      <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-xs text-blue-700 leading-relaxed">
        🔒 Ваши данные защищены. Телефон скрыт до тех пор, пока потенциальный покупатель не нажмёт «Показать номер».
      </div>
    </div>
  );
}

// ─── STEP 3 — ПРЕВЬЮ ─────────────────────────────────────
function StepPreview({ data }) {
  const priceLabel =
    data.priceType === "fixed"    ? `${Number(data.price).toLocaleString("ru")} ₽` :
    data.priceType === "contract" ? "Договорная" : "Бесплатно";

  const catEmoji = CATEGORIES.find(c => c.value === data.category)?.label.split(" ")[0] || "📋";

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Проверьте объявление</h2>
        <p className="text-sm text-gray-500 mt-1">Так оно будет выглядеть для других жителей</p>
      </div>

      {/* Карточка превью */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        {/* Фото */}
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
          {data.photos.length > 0
            ? <img src={data.photos[0].url} alt="" className="h-full w-full object-cover" />
            : <span className="text-5xl opacity-20">📷</span>
          }
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-semibold px-3 py-1 rounded-full text-gray-700">
            {catEmoji} {data.category}
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 leading-snug">{data.title || "—"}</h3>
          <div className="text-xl font-bold text-blue-700 mt-1">{priceLabel}</div>
          <p className="text-sm text-gray-500 mt-2 line-clamp-3 leading-relaxed">{data.description || "—"}</p>

          <div className="border-t mt-4 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-sm font-bold">
                {data.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <div className="text-sm font-semibold">{data.name || "—"}</div>
                <div className="text-xs text-gray-400">Анджиевский · Сегодня</div>
              </div>
            </div>
            <div className="text-xs text-gray-400 flex gap-2">
              {data.contactMethods.map(m => (
                <span key={m} className="bg-gray-100 px-2 py-0.5 rounded-full">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Сводка */}
      <div className="rounded-2xl border bg-gray-50 p-4 flex flex-col gap-2 text-sm">
        {[
          ["Категория",  data.category],
          ["Цена",       priceLabel],
          ["Телефон",    data.phone],
          ["Фото",       data.photos.length ? `${data.photos.length} шт.` : "Нет"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-gray-500">{k}</span>
            <span className="font-semibold text-gray-800">{v}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-green-50 border border-green-100 p-4 text-xs text-green-700">
        ✅ После публикации объявление появится на сайте. Редактировать и удалить можно из личного кабинета.
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────
export default function PostAdPage() {
  const navigate = useNavigate();

  const [step, setStep]       = useState(0);
  const [errors, setErrors]   = useState({});
  const [submitted, setSubmitted] = useState(false);

  const [data, setData] = useState({
    category:       "",
    title:          "",
    description:    "",
    priceType:      "fixed",
    price:          "",
    photos:         [],
    name:           "",
    phone:          "",
    contactMethods: ["Звонок"],
  });

  const onChange = (key, value) => {
    setData(d => ({ ...d, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
  };

  const handleNext = () => {
    const errs = validate(step, data);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setErrors({});
    if (step === 0) navigate(-1);
    else { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  const handleSubmit = () => {
    // здесь будет POST на API
    setSubmitted(true);
  };

  // ── Success screen ──
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-3xl border shadow-sm p-10 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900">Объявление подано!</h2>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Ваше объявление <strong>«{data.title}»</strong> отправлено на проверку и скоро появится на сайте.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => navigate("/listings")}
              className="w-full rounded-xl bg-blue-600 text-white py-3 text-sm font-bold hover:bg-blue-700 transition"
            >
              Смотреть объявления
            </button>
            <button
              onClick={() => { setSubmitted(false); setStep(0); setData({ category:"", title:"", description:"", priceType:"fixed", price:"", photos:[], name:"", phone:"", contactMethods:["Звонок"] }); }}
              className="w-full rounded-xl border py-3 text-sm font-semibold hover:bg-gray-50 transition text-gray-600"
            >
              Подать ещё одно
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
          >
            ← {step === 0 ? "Отмена" : "Назад"}
          </button>
          <div className="h-4 w-px bg-gray-200" />
          <span className="text-sm font-semibold text-gray-800">Подать объявление</span>
          <div className="ml-auto text-xs text-gray-400 font-medium">
            Шаг {step + 1} из {STEPS.length}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <StepBar current={step} />

        <div className="bg-white rounded-2xl border shadow-sm p-6 sm:p-8">
          {step === 0 && <StepCategory  data={data} errors={errors} onChange={onChange} />}
          {step === 1 && <StepDetails   data={data} errors={errors} onChange={onChange} />}
          {step === 2 && <StepContacts  data={data} errors={errors} onChange={onChange} />}
          {step === 3 && <StepPreview   data={data} />}
        </div>

        {/* Navigation buttons */}
        <div className="mt-4 flex gap-3 justify-between">
          <button
            onClick={handleBack}
            className="rounded-xl border bg-white px-6 py-3 text-sm font-semibold hover:bg-gray-50 transition text-gray-600"
          >
            {step === 0 ? "Отмена" : "← Назад"}
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              className="rounded-xl bg-blue-600 text-white px-8 py-3 text-sm font-bold hover:bg-blue-700 transition"
            >
              Далее →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="rounded-xl bg-green-500 text-white px-8 py-3 text-sm font-bold hover:bg-green-600 transition"
            >
              Опубликовать ✓
            </button>
          )}
        </div>

        {/* Progress hint */}
        <p className="text-center text-xs text-gray-400 mt-4">
          {["Выберите категорию объявления", "Заполните описание и цену", "Укажите контакты для связи", "Проверьте и опубликуйте"][step]}
        </p>
      </main>
    </div>
  );
}
