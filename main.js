console.log("main.js loaded");

/* =========================
  PW入力画面
========================= */
const password = "masuga";

const input = prompt("パスワードを入力してください");

if(input === password){
  document.body.style.display = "block";
}else{
  document.body.innerHTML = "アクセス拒否";
}
/* =========================
   メールアドレスコピー（案①）
========================= */
const copyBtn = document.getElementById("copyMail");

copyBtn?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("t.masuga@lib-co-ltd.net");

    const originalText = copyBtn.textContent;
    copyBtn.textContent = "✓ コピーしました";
    copyBtn.disabled = true;

    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.disabled = false;
    }, 1500);
  } catch (e) {
    alert("コピーに失敗しました");
  }
});

/* =========================
   外部リンク通知（LIB用）
========================= */
const toast = document.getElementById("toast");

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
};

document.addEventListener("click", (e) => {
  const link = e.target.closest("a[data-external]");
  if (!link) return;

  e.preventDefault(); // ← 重要
  showToast("外部サイトへ移動します");

  setTimeout(() => {
    window.open(link.href, "_blank", "noopener");
  }, 800);
});

/* =========================
   スキル表の表示切替（案②）
========================= */
const toggleBtn = document.getElementById("toggleProjects");
const tableWrap = document.querySelector(".table-wrap");

toggleBtn?.addEventListener("click", () => {
  const isHidden = tableWrap.hasAttribute("hidden");

  tableWrap.toggleAttribute("hidden");
  toggleBtn.textContent = isHidden ? "表を非表示" : "表を表示";
});

/* =========================
   ページ内リンクのスムーススクロール
========================= */
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.classList.contains("skip-link")) return;

  const id = a.getAttribute("href");
  const target = document.querySelector(id);
  if (!target) return;

  e.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", location.pathname + location.search);
});

/* =========================
   sticky nav 高さをCSS変数に反映
========================= */
const setStickyOffset = () => {
  const nav = document.querySelector("nav");
  if (!nav) return;

  const height = nav.getBoundingClientRect().height;
  document.documentElement.style.setProperty("--sticky-offset", height + "px");
};

window.addEventListener("load", setStickyOffset);
window.addEventListener("resize", setStickyOffset);

/* =========================
   読んでいる章をナビでハイライト
========================= */
const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];

// href → navリンク配列
const linkMap = new Map();
navLinks.forEach((a) => {
  const href = a.getAttribute("href");
  if (!linkMap.has(href)) linkMap.set(href, []);
  linkMap.get(href).push(a);
});

const targets = [
  ...new Set(
    navLinks
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean),
  ),
];

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((a) => a.removeAttribute("aria-current"));
      const links = linkMap.get("#" + entry.target.id) || [];
      links.forEach((a) => a.setAttribute("aria-current", "page"));
    });
  },
  {
    rootMargin: "-40% 0px -55% 0px",
    threshold: 0,
  },
);

targets.forEach((target) => observer.observe(target));
