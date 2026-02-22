import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── MOCK DATA ───────────────────────────────────────────
const allListings = [
  { id: 1,  cat: "Недвижимость", title: "Сдам 2-комнатную квартиру",        price: 25000, priceLabel: "25 000 ₽/мес", place: "Анджиевский", meta: "Сегодня",     desc: "Уютная квартира в центре посёлка. Есть мебель, бытовая техника. Без животных. Оплата ежемесячно.", phone: "+7 928 000-00-01", verified: true  },
  { id: 2,  cat: "Товары",       title: "Продам детскую коляску",           price: 6500,  priceLabel: "6 500 ₽",       place: "Анджиевский", meta: "Вчера",       desc: "Коляска в хорошем состоянии, пользовались 1 год. Все документы есть. Самовывоз.",                   phone: "+7 928 000-00-02", verified: false },
  { id: 3,  cat: "Услуги",       title: "Нужен электрик на сегодня",        price: null,  priceLabel: "Договорная",    place: "Анджиевский", meta: "1 дн. назад", desc: "Требуется опытный электрик для замены проводки в квартире. Срочно, оплата сразу.",                  phone: "+7 928 000-00-03", verified: false },
  { id: 4,  cat: "Животные",     title: "Отдам щенка в добрые руки",        price: null,  priceLabel: "Бесплатно",     place: "Анджиевский", meta: "2 дн. назад", desc: "Щенок метис, 2 месяца, здоровый. Отдам только в добрые руки, без цепи.",                            phone: "+7 928 000-00-04", verified: true  },
  { id: 5,  cat: "Услуги",       title: "Сварочные работы любой сложности", price: 1000,  priceLabel: "от 1 000 ₽",    place: "Анджиевский", meta: "2 дн. назад", desc: "Выполню сварочные работы: ворота, заборы, металлоконструкции. Выезд на объект.",                      phone: "+7 928 000-00-05", verified: true  },
  { id: 6,  cat: "Товары",       title: "Куплю б/у холодильник",            price: null,  priceLabel: "Договорная",    place: "Анджиевский", meta: "3 дн. назад", desc: "Куплю рабочий холодильник в любом состоянии. Рассмотрю все варианты, самовывоз.",                    phone: "+7 928 000-00-06", verified: false },
  { id: 7,  cat: "Работа",       title: "Требуется водитель кат. B",        price: 45000, priceLabel: "от 45 000 ₽",   place: "Анджиевский", meta: "3 дн. назад", desc: "Организации требуется водитель с категорией B. Опыт от 2 лет. График 5/2. Официальное трудоустройство.", phone: "+7 928 000-00-07", verified: true  },
  { id: 8,  cat: "Услуги",       title: "Уборка квартир и домов",           price: 900,   priceLabel: "от 900 ₽",      place: "Анджиевский", meta: "4 дн. назад", desc: "Профессиональная уборка квартир, домов, офисов. Качество гарантирую. Работаю без выходных.",         phone: "+7 928 000-00-08", verified: true  },
  { id: 9,  cat: "Недвижимость", title: "Продам дом с участком 6 соток",    price: 1800000, priceLabel: "1 800 000 ₽", place: "Анджиевский", meta: "5 дн. назад", desc: "Дом 80 кв.м, участок 6 соток. Газ, вода, свет подведены. Документы готовы к сделке.",               phone: "+7 928 000-00-09", verified: true  },
  { id: 10, cat: "Авто",         title: "Продам ВАЗ-2107, 2005 г.",         price: 85000, priceLabel: "85 000 ₽",      place: "Анджиевский", meta: "6 дн. назад", desc: "Автомобиль на ходу, свежее ТО. Кузов без ржавчины. Срочно, торг уместен.",                           phone: "+7 928 000-00-10", verified: false },
  { id: 11, cat: "Работа",       title: "Ищу работу — разнорабочий",        price: null,  priceLabel: "Договорная",    place: "Анджиевский", meta: "1 нед. назад", desc: "Ищу постоянную или разовую работу. Умею всё: строительство, ремонт, погрузка. Без вредных привычек.", phone: "+7 928 000-00-11", verified: false },
  { id: 12, cat: "Товары",       title: "Продам швейную машинку Singer",    price: 3500,  priceLabel: "3 500 ₽",       place: "Анджиевский", meta: "1 нед. назад", desc: "Машинка в рабочем состоянии, все иглы и лапки в комплекте. Самовывоз.",                             phone: "+7 928 000-00-12", verified: false },
];

const categories = ["Все", "Недвижимость", "Работа", "Услуги", "Товары", "Авто", "Животные"];
const sortOptions = [
  { value: "new",   label: "Сначала новые" },
  { value: "cheap", label: "Сначала дешевле" },
  { value: "exp",   label: "Сначала дороже" },
];

// ─── CARD ────────────────────────────────────────────────
function ListingCard({ item, onClick }) {
  return (
    <article
      onClick={() => onClick(item)}
      className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden cursor-pointer group"
    >
      <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
        <span className="text-4xl opacity-30">📷</span>
        {item.verified && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            ✓ Проверено
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur text-xs font-medium text-gray-600 px-2 py-0.5 rounded-full">
          {item.meta}
        </div>
      </div>
      <div className="p-4">
        <div className="text-xs text-blue-600 font-semibold mb-1">{item.cat}</div>
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-blue-700 transition">
          {item.title}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs text-gray-400">{item.place}</div>
          <div className="text-sm font-bold text-gray-900">{item.priceLabel}</div>
        </div>
      </div>
    </article>
  );
}

// ─── SINGLE LISTING PAGE ─────────────────────────────────
function ListingPage({ item, onBack }) {
  const navigate = useNavigate();
  const [contacted, setContacted] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
          >
            ← Назад
          </button>
          <div className="h-4 w-px bg-gray-200" />
          <span className="text-sm text-gray-400 truncate">{item.title}</span>
          <div className="ml-auto flex items-center gap-2">
            <button className="rounded-xl border bg-white px-3 py-1.5 text-xs font-semibold hover:bg-gray-50">
              Пожаловаться
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left — фото + описание */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Фото */}
            <div className="rounded-2xl border bg-white overflow-hidden">
              <div className="h-72 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-6xl opacity-20">📷</span>
              </div>
              {/* Миниатюры */}
              <div className="p-3 flex gap-2">
                {[0,1,2].map(i => (
                  <div key={i} className={`h-14 w-20 rounded-lg bg-gray-100 cursor-pointer ${i===0 ? 'ring-2 ring-blue-500' : 'opacity-50 hover:opacity-100 transition'}`} />
                ))}
              </div>
            </div>

            {/* Описание */}
            <div className="rounded-2xl border bg-white p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="text-xs text-blue-600 font-semibold mb-1">{item.cat}</div>
                  <h1 className="text-xl font-bold leading-snug">{item.title}</h1>
                </div>
                {item.verified && (
                  <div className="flex-shrink-0 bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    ✓ Проверено
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-4">{item.priceLabel}</div>
              <div className="border-t pt-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">Описание</div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
              <div className="border-t mt-4 pt-4 flex items-center gap-4 text-xs text-gray-400">
                <span>📍 {item.place}</span>
                <span>🕐 {item.meta}</span>
                <span>👁 42 просмотра</span>
              </div>
            </div>
          </div>

          {/* Right — контакт */}
          <div className="flex flex-col gap-4">
            {/* Продавец */}
            <div className="rounded-2xl border bg-white p-5">
              <div className="text-sm font-semibold text-gray-700 mb-3">Продавец</div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 grid place-items-center font-bold text-base flex-shrink-0">
                  А
                </div>
                <div>
                  <div className="text-sm font-semibold">Житель посёлка</div>
                  <div className="text-xs text-gray-400">На сайте с 2025</div>
                </div>
              </div>

              {!contacted ? (
                <button
                  onClick={() => setContacted(true)}
                  className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 transition"
                >
                  Показать телефон
                </button>
              ) : (
                <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-center">
                  <div className="text-xs text-blue-500 mb-1">Телефон продавца</div>
                  <div className="text-lg font-bold text-blue-700 tracking-wide">{item.phone}</div>
                </div>
              )}

              <button className="mt-2 w-full rounded-xl border py-2.5 text-sm font-semibold hover:bg-gray-50 transition">
                Написать сообщение
              </button>
            </div>

            {/* Безопасность */}
            <div className="rounded-2xl border bg-amber-50 border-amber-200 p-4">
              <div className="text-xs font-bold text-amber-700 mb-2">⚠️ Совет по безопасности</div>
              <p className="text-xs text-amber-700 leading-relaxed">
                Не переводите деньги заранее. Встречайтесь в людном месте. Проверяйте товар перед оплатой.
              </p>
            </div>

            {/* Поделиться */}
            <div className="rounded-2xl border bg-white p-4">
              <div className="text-xs font-semibold text-gray-500 mb-2">Поделиться</div>
              <div className="flex gap-2">
                {["ВК", "TG", "WA"].map(s => (
                  <button key={s} className="flex-1 rounded-lg border text-xs font-semibold py-2 hover:bg-gray-50 transition">{s}</button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// ─── LISTINGS PAGE ───────────────────────────────────────
export default function ListingsPage() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat]     = useState("Все");
  const [sort, setSort]               = useState("new");
  const [search, setSearch]           = useState("");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  if (selectedItem) {
    return <ListingPage item={selectedItem} onBack={() => setSelectedItem(null)} />;
  }

  // Фильтрация
  let filtered = allListings
    .filter(l => activeCat === "Все" || l.cat === activeCat)
    .filter(l => !onlyVerified || l.verified)
    .filter(l => !search || l.title.toLowerCase().includes(search.toLowerCase()));

  if (sort === "cheap") filtered = [...filtered].sort((a,b) => (a.price||999999) - (b.price||999999));
  if (sort === "exp")   filtered = [...filtered].sort((a,b) => (b.price||0) - (a.price||0));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="flex items-center gap-3 flex-shrink-0">
            <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white grid place-items-center font-bold">С</div>
            <div className="leading-tight">
              <div className="text-base font-bold tracking-tight">Свои</div>
              <div className="text-xs text-gray-500 -mt-0.5">Анджиевский</div>
            </div>
          </a>

          <div className="flex-1 hidden md:flex">
            <div className="w-full flex items-center gap-2 rounded-2xl border bg-white px-3 py-2 shadow-sm">
              <span className="text-gray-400">⌕</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full outline-none text-sm"
                placeholder="Поиск по объявлениям…"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-700 text-xs">✕</button>
              )}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50">Вход</button>
            <button onClick={() => navigate("/post-ad")} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition">
              + Подать объявление
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <a href="#" className="hover:text-blue-600 transition">Главная</a>
          <span>→</span>
          <span className="text-gray-700 font-medium">Объявления</span>
          {activeCat !== "Все" && (
            <>
              <span>→</span>
              <span className="text-gray-700 font-medium">{activeCat}</span>
            </>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid lg:grid-cols-4 gap-6">

          {/* ── Sidebar фильтры ── */}
          <aside className="hidden lg:block">
            <div className="rounded-2xl border bg-white shadow-sm p-5 sticky top-24">
              <div className="text-sm font-bold text-gray-800 mb-3">Категория</div>
              <div className="flex flex-col gap-1">
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setActiveCat(c)}
                    className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition ${
                      activeCat === c
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="border-t my-4" />

              <div className="text-sm font-bold text-gray-800 mb-3">Фильтры</div>

              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={e => setOnlyVerified(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Только проверенные</span>
              </label>

              <div className="text-xs text-gray-500 mb-2">Цена от</div>
              <input type="number" placeholder="0 ₽" className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 mb-2" />
              <div className="text-xs text-gray-500 mb-2">Цена до</div>
              <input type="number" placeholder="Любая" className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400" />

              <button
                onClick={() => { setActiveCat("Все"); setOnlyVerified(false); setSearch(""); }}
                className="mt-4 w-full rounded-xl border text-sm font-semibold py-2 hover:bg-gray-50 transition text-gray-500"
              >
                Сбросить фильтры
              </button>
            </div>
          </aside>

          {/* ── Список ── */}
          <div className="lg:col-span-3">
            {/* Мобильные категории */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4 lg:hidden">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setActiveCat(c)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
                    activeCat === c ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Сортировка + счётчик */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="text-sm text-gray-500">
                Найдено: <span className="font-semibold text-gray-800">{filtered.length}</span> объявлений
              </div>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="border rounded-xl px-3 py-2 text-sm font-medium bg-white outline-none cursor-pointer"
              >
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Сетка */}
            {filtered.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(item => (
                  <ListingCard key={item.id} item={item} onClick={setSelectedItem} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border bg-white p-12 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <div className="font-semibold text-gray-700">Ничего не найдено</div>
                <div className="text-sm text-gray-400 mt-1">Попробуйте изменить фильтры или категорию</div>
                <button
                  onClick={() => { setActiveCat("Все"); setSearch(""); setOnlyVerified(false); }}
                  className="mt-4 rounded-xl bg-blue-600 text-white px-5 py-2 text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Сбросить фильтры
                </button>
              </div>
            )}

            {/* Подать объявление CTA */}
            {filtered.length > 0 && (
              <div className="mt-8 rounded-2xl border bg-blue-50 border-blue-100 p-5 flex items-center gap-4">
                <div className="text-2xl">📝</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-blue-800">Не нашли нужное?</div>
                  <div className="text-xs text-blue-600 mt-0.5">Подайте своё объявление — это бесплатно</div>
                </div>
                <button onClick={() => navigate("/post-ad")} className="flex-shrink-0 rounded-xl bg-blue-600 text-white px-4 py-2 text-sm font-bold hover:bg-blue-700 transition">
                  Подать
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-gray-500 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Свои — Анджиевский</div>
          <div className="flex gap-4">
            <a className="hover:text-gray-900" href="#">Правила</a>
            <a className="hover:text-gray-900" href="#">Поддержка</a>
            <a className="hover:text-gray-900" href="#">Контакты</a>
          </div>
        </div>
      </footer>
    </div>
  );
}