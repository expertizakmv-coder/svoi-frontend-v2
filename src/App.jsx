import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ListingsPage from "./Listings";
import PostAdPage from "./PostAd";

// ─── DATA ───────────────────────────────────────────────
const portalSections = [
  { title: "Объявления",    hint: "Куплю, продам, сдам",   emoji: "📋", color: "bg-blue-50   text-blue-700",  dot: "bg-blue-500"   },
  { title: "События",       hint: "Афиша и мероприятия",   emoji: "🎉", color: "bg-orange-50 text-orange-700", dot: "bg-orange-500" },
  { title: "Карта",         hint: "Объекты поселка",        emoji: "🗺️", color: "bg-green-50  text-green-700", dot: "bg-green-500"  },
  { title: "Интересное",    hint: "Люди, история, жизнь",  emoji: "✨", color: "bg-purple-50 text-purple-700", dot: "bg-purple-500" },
];

const adCategories = [
  { title: "Недвижимость", hint: "Аренда/продажа", emoji: "🏠" },
  { title: "Работа",       hint: "Вакансии",        emoji: "💼" },
  { title: "Услуги",       hint: "Мастера рядом",   emoji: "🧰" },
  { title: "Товары",       hint: "Куплю/продам",    emoji: "🛒" },
  { title: "Авто",         hint: "Транспорт",       emoji: "🚗" },
  { title: "Другое",       hint: "Всё остальное",   emoji: "📦" },
];

const listings = [
  { title: "Сдам 2-комнатную квартиру",   price: "25 000 ₽",    place: "Анджиевский", meta: "Сегодня"     },
  { title: "Продам детскую коляску",      price: "6 500 ₽",     place: "Анджиевский", meta: "Вчера"       },
  { title: "Нужен электрик на сегодня",   price: "—",            place: "Анджиевский", meta: "1 дн. назад" },
  { title: "Отдам щенка в добрые руки",   price: "—",            place: "Анджиевский", meta: "2 дн. назад" },
];

const events = [
  { day: "25", month: "ФЕВ", title: "Масленица на центральной площади", place: "Центральная пл.", tag: "Праздник" },
  { day: "1",  month: "МАР", title: "Субботник — весенняя уборка",      place: "Весь посёлок",   tag: "Общее"   },
  { day: "8",  month: "МАР", title: "Концерт ко Дню 8 Марта",           place: "ДК Анджиевский", tag: "Культура" },
];

const interesting = [
  { emoji: "📸", tag: "История", title: "Как выглядел Анджиевский 50 лет назад", hint: "Фотоархив посёлка" },
  { emoji: "👤", tag: "Люди",    title: "Учитель года — о школе и детях",        hint: "Интервью"         },
  { emoji: "🌿", tag: "Природа", title: "Лучшие места для прогулок рядом",       hint: "Карта маршрутов"  },
];

const navLinks = [
  { label: "Объявления", emoji: "📋", sub: "Все категории" },
  { label: "События",    emoji: "🎉", sub: "Афиша поселка" },
  { label: "Карта",      emoji: "🗺️", sub: "Инфраструктура" },
  { label: "Интересное", emoji: "✨", sub: "Люди и истории" },
];

// ─── BURGER MENU ────────────────────────────────────────
function BurgerMenu({ open, onClose }) {
  return (
    <>
      {/* overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
      {/* panel */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl flex flex-col transition-transform duration-250 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 text-white grid place-items-center font-bold text-base">С</div>
            <div className="leading-tight">
              <div className="font-bold text-sm">Свои</div>
              <div className="text-xs text-gray-400">Анджиевский</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 grid place-items-center rounded-lg hover:bg-gray-100 text-gray-500 transition"
          >
            ✕
          </button>
        </div>

        {/* links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          <div className="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Разделы</div>
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.label === "Объявления" ? "/listings" : "#"}
              onClick={l.label === "Объявления" ? (e) => { e.preventDefault(); setMenuOpen(false); navigate("/listings"); } : () => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 group transition"
            >
              <span className="text-lg w-7 text-center">{l.emoji}</span>
              <div>
                <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition">{l.label}</div>
                <div className="text-xs text-gray-400">{l.sub}</div>
              </div>
            </a>
          ))}

          <div className="border-t my-3" />
          <div className="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Объявления</div>
          {adCategories.map((c) => (
            <a
              key={c.title}
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition"
            >
              <span className="text-base w-7 text-center">{c.emoji}</span>
              <div className="text-sm text-gray-700">{c.title}</div>
            </a>
          ))}
        </nav>

        {/* bottom */}
        <div className="px-5 py-4 border-t">
          <button onClick={() => { setMenuOpen(false); navigate("/post-ad"); }} className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition">
            + Подать объявление
          </button>
          <div className="mt-3 flex gap-4 justify-center text-xs text-gray-400">
            <a href="#" className="hover:text-gray-700">Правила</a>
            <a href="#" className="hover:text-gray-700">Поддержка</a>
            <a href="#" className="hover:text-gray-700">Контакты</a>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── LOGO BUTTON (hover → burger icon) ─────────────────
function LogoButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="h-10 w-10 rounded-2xl bg-blue-600 text-white grid place-items-center font-bold text-lg transition-all duration-150 hover:bg-blue-700 hover:scale-105 flex-shrink-0"
      aria-label="Открыть меню"
    >
      {hovered ? (
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
          <rect width="18" height="2" rx="1" fill="white"/>
          <rect y="6" width="12" height="2" rx="1" fill="white"/>
          <rect y="12" width="18" height="2" rx="1" fill="white"/>
        </svg>
      ) : (
        <span className="font-bold text-base">С</span>
      )}
    </button>
  );
}

// ─── APP ────────────────────────────────────────────────
export default function App() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const HomePage = () => (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <BurgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">

          <div className="flex items-center gap-3">
            <LogoButton onClick={() => setMenuOpen(true)} />
            <div className="leading-tight">
              <div className="text-lg font-semibold tracking-tight">Свои</div>
              <div className="text-xs text-gray-500 -mt-0.5">Анджиевский</div>
            </div>
          </div>

          <div className="flex-1 hidden md:flex">
            <div className="w-full flex items-center gap-2 rounded-2xl border bg-white px-3 py-2 shadow-sm">
              <span className="text-gray-400">⌕</span>
              <input
                className="w-full outline-none text-sm"
                placeholder="Поиск по объявлениям, услугам и событиям…"
              />
              <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition">
                Найти
              </button>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="hidden sm:inline-flex rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50">
              Вход
            </button>
            <button onClick={() => navigate("/post-ad")} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition">
              Подать объявление
            </button>
          </div>
        </div>

        {/* mobile search */}
        <div className="md:hidden px-6 pb-4">
          <div className="w-full flex items-center gap-2 rounded-2xl border bg-white px-3 py-2 shadow-sm">
            <span className="text-gray-400">⌕</span>
            <input className="w-full outline-none text-sm" placeholder="Поиск…" />
            <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Найти</button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-8">
        <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Инфраструктура доверия
            </div>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
              Всё местное — в одном месте
            </h1>
            <p className="mt-4 max-w-2xl text-gray-600 md:text-lg">
              Объявления, услуги и события. Простая платформа для своих: быстрее договориться, проще проверить, удобнее вернуться.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button onClick={() => navigate("/listings")} className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
                Смотреть объявления
              </button>
              <button className="rounded-2xl border bg-white px-6 py-3 text-sm font-semibold hover:bg-gray-50">
                Как работает «Свои»
              </button>
            </div>
          </div>
          <div className="h-24 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400" />
        </div>
      </section>

      {/* ── Portal Sections (4 плитки) ── */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Разделы портала</h2>
            <p className="text-sm text-gray-500">Что есть на «Свои»</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {portalSections.map((s) => (
            <button
              key={s.title}
              onClick={() => s.title === "Объявления" && navigate("/listings")}
              className={`group text-left rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}
            >
              <div className="text-3xl mb-3">{s.emoji}</div>
              <div className="font-bold text-base">{s.title}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.hint}</div>
              <div className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${s.color}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                Открыть
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Дайджест: объявления + события ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Свежие объявления — занимают 2/3 */}
          <div className="lg:col-span-2">
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Свежие объявления</h2>
                <p className="text-sm text-gray-500">Последние публикации по посёлку</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-xl border bg-white px-3 py-1.5 text-xs font-semibold hover:bg-gray-50">Фильтры</button>
                <button className="rounded-xl border bg-white px-3 py-1.5 text-xs font-semibold hover:bg-gray-50">Сортировка</button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {listings.map((x, idx) => (
                <article key={idx} onClick={() => navigate("/listings")} className="rounded-3xl border bg-white shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer">
                  <div className="h-36 bg-gray-100" />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold leading-snug line-clamp-2">{x.title}</h3>
                      <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{x.meta}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm text-gray-500">{x.place}</div>
                      <div className="text-sm font-semibold">{x.price}</div>
                    </div>
                    <button className="mt-3 w-full rounded-2xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black transition">
                      Открыть
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-4 text-center">
              <button onClick={() => navigate("/listings")} className="rounded-2xl border bg-white px-6 py-2.5 text-sm font-semibold hover:bg-gray-50 transition">
                Все объявления →
              </button>
            </div>
          </div>

          {/* Ближайшие события — занимают 1/3 */}
          <div>
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">События</h2>
                <p className="text-sm text-gray-500">Ближайшие мероприятия</p>
              </div>
              <button className="text-sm font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap">Афиша →</button>
            </div>

            <div className="flex flex-col gap-3">
              {events.map((e, idx) => (
                <article key={idx} className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition p-4 flex gap-4 cursor-pointer group">
                  {/* дата */}
                  <div className="flex-shrink-0 w-12 text-center">
                    <div className="text-2xl font-bold text-blue-600 leading-none">{e.day}</div>
                    <div className="text-xs font-semibold text-gray-400 mt-0.5">{e.month}</div>
                  </div>
                  {/* info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold leading-snug group-hover:text-blue-700 transition line-clamp-2">
                      {e.title}
                    </div>
                    <div className="mt-1 text-xs text-gray-400">{e.place}</div>
                    <div className="mt-1.5">
                      <span className="inline-block bg-orange-50 text-orange-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                        {e.tag}
                      </span>
                    </div>
                  </div>
                </article>
              ))}

              <button className="mt-1 w-full rounded-2xl border bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition">
                Все события →
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── Интересное ── */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Интересное</h2>
            <p className="text-sm text-gray-500">Люди, история и жизнь посёлка</p>
          </div>
          <button className="text-sm font-semibold text-blue-700 hover:text-blue-800">Все материалы →</button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {interesting.map((item, idx) => (
            <article key={idx} className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer group">
              <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-5xl">
                {item.emoji}
              </div>
              <div className="p-4">
                <span className="inline-block bg-purple-50 text-purple-600 text-xs font-semibold px-2 py-0.5 rounded-full mb-2">
                  {item.tag}
                </span>
                <h3 className="font-semibold text-sm leading-snug group-hover:text-blue-700 transition line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{item.hint}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Поддержать проект ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="rounded-2xl border bg-white shadow-sm px-6 py-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="text-2xl flex-shrink-0">☕</div>
          <div className="flex-1 text-center sm:text-left">
            <div className="font-semibold text-sm">Поддержать проект</div>
            <div className="text-xs text-gray-500 mt-0.5">
              «Свои» — некоммерческий портал. Любая поддержка помогает развивать сайт для посёлка.
            </div>
          </div>
          <a
            href="#"
            className="flex-shrink-0 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-900 px-5 py-2.5 text-sm font-bold transition whitespace-nowrap"
          >
            Поддержать ❤️
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 text-sm text-gray-600">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} Свои — Анджиевский</div>
            <div className="flex gap-4">
              <a className="hover:text-gray-900" href="#">Правила</a>
              <a className="hover:text-gray-900" href="#">Поддержка</a>
              <a className="hover:text-gray-900" href="#">Контакты</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/listings" element={<ListingsPage />} />
      <Route path="/post-ad" element={<PostAdPage />} />
    </Routes>
  );
}