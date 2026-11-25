# FUTURE/TECH — Компьютерын Цахим Дэлгүүр (Статик Веб Сайт)

ШУТИС МХТС **F.ITM202 — Веб зохиомж** хичээлийн багийн бие даалтын төсөл.  
Цэвэр **HTML5, CSS3, Vanilla JavaScript (ES6+), Bootstrap 5.3.3 (CDN)** болон Google Fonts **`Rubik`** ашиглан ямар ч build tool болон сервергүйгээр хөтөч дээр (`http://` болон `file://`) шууд ажиллах статик цахим дэлгүүр.

---

## 1. Хийгдэж дууссан хэсэг (Суурь ба Эхний 9 хуудас — Ж.Баярсайхан `B251890009`)

- `master.html` — Нүүр хуудасны мастер эх загвар
- `master-subpage.html` — Дэд хуудасны мастер эх загвар (**Шинэ хуудас бүр эндээс эхлүүлж хуулна**)
- `index.html` — `01` Нүүр хуудас (`FUTURE/TECH` лого, 5 ангиллын тавиур, 3 слайдтай Hero carousel, 5 онцлох хавтан, хямдрал ба ангиллын таб, баталгааны хэсэг, хялбар хайлт, Quick View модаль)
- `search.html` — `02` Хайлтын үр дүн (`?q=`, олон үгтэй хайлт, брэнд + үнийн шүүлтүүр, хурдан үнийн ангилал)
- `compare.html` — `03` Компьютер угсрах (PC Builder: CPU `socket` ба RAM `ramType` нийцэл шалгах) + 2 бараа харьцуулах модуль
- `categories.html` — `04` Бүх ангиллын тойм (динамик барааны тоотой)
- `category-desktop.html` — `05` Суурин компьютер
- `category-laptop.html` — `06` Зөөврийн компьютер
- `category-parts.html` — `07` Компьютерын эд анги
- `category-peripherals.html` — `08` Дагалдах хэрэгсэл ба монитор
- `category-network.html` — `09` Сүлжээ ба бусад төхөөрөмж
- `css/tokens.css` — Apple Store хэв маягийн өнгөний систем (`#F5F5F7`, `#FFFFFF`, `#1D1D1F`, `#0071E3`), `Rubik` фонт, зай, радиус, сүүдрийн токенууд
- `css/layout.css` — Frosted-glass Header, `FUTURE/TECH` Hyper Horizon лого, Subnav, цэвэр Footer, Responsive Grid
- `css/components.css` — Барааны карт (`tabular-nums`), хэмнэлт/үлдэгдлийн badge, `13px/14px/15px` товчны шатлал, шүүлтүүр, харьцуулах хүснэгт, toast, модаль
- `js/data/seed-data.js` — 5 ангиллын 31 жишиг бараа, ангиллын бүтэц, `typeLabels`, `specSchemas`
- `js/storage.js` — `localStorage` (+ in-memory fallback) унших/бичих нэгдсэн API (`window.FTStorage`)
- `js/common.js` — XSS цэвэрлэгч (`escapeHtml`, `sanitizeUrl`), Header хайлт, сагсны тоолуур шинэчлэл, `"Сагсанд нэмэх"`, Quick View модаль (`window.FTCommon`)
- `js/catalog.js` — Нүүр хуудас, ангиллын тойм, ангилал ба хайлтын шүүлтүүр (`window.FTCatalog`)
- `js/builder-compare.js` — Компьютер угсралтын нийцэл шалгах + 2 барааны харьцуулалт (`window.FTBuilderCompare`)

---

## 2. Багийн 2 гишүүний үргэлжлүүлэн хийх гарын авлага

> **Ерөнхий зарчим:** Нийтлэг `tokens.css`, `layout.css`, `components.css` болон `index.html–category-network.html` файлуудыг өөрчлөхгүйгээр зөвхөн **өөрийн хуудас болон тусдаа CSS/JS файл дээр** ажиллаарай. Ингэснээр нийт дизайн 100% нэгдмэл хэвээр хадгалагдаж, GitHub дээр конфликт гарахгүй.

### Хуваарилалт ба Файлууд

#### А.Атилла (`B252270224`) — Хуудсууд `10–18`
- **Салбарын нэр (Branch):** `feat/pdp-pages`, `feat/cart-checkout`
- **Үүсгэх HTML хуудаснууд:**
  - `10` `product-desktop.html` (Жишиг ID: `desk-01`)
  - `11` `product-laptop.html` (Жишиг ID: `lap-01`)
  - `12` `product-parts.html` (Жишиг ID: `part-01`)
  - `13` `product-peripherals.html` (Жишиг ID: `per-01`)
  - `14` `product-network.html` (Жишиг ID: `net-01`)
  - `15` `auth.html` (Бүртгүүлэх, Нэвтрэх, Админы туршилтын горимд шилжих)
  - `16` `profile.html` (Хэрэглэгчийн овог нэр, утас, хаяг засах, нууц үг солих жишээ шалгалт)
  - `17` `checkout.html` (Хүргэлтийн хаяг, QPay/карт/данс туршилтын сонголт, захиалга үүсгэх)
  - `18` `cart.html` (Сагс: тоо нэмэх/хасах, устгах, нийлбэр дүн, checkout руу шилжих)
- **Үүсгэх CSS / JS модулиуд:** `css/product-checkout.css`, `js/product-detail.js`, `js/auth-profile.js`, `js/cart.js`, `js/checkout.js`
- **Анхаарах нарийн дэлгэрэнгүй:**
  1. **Барааны дэлгэрэнгүй (`product-*.html`):** URL-аас `?id=...` уншина (`new URLSearchParams(location.search).get('id')`). Хэрэв `id` хоосон бол тухайн хуудасны жишиг барааг (`desk-01`, `lap-01`, `part-01`, `per-01`, `net-01`) харуулна. Дутуу техникийн талбарыг `"Мэдээлэл ороогүй"` гэж үзүүлнэ (`FTCommon.formatSpecValue`). Үлдэгдэл `<= 0` эсвэл `active === false` үед `"Сагсанд нэмэх"` товчийг `disabled` болгоно.
  2. **Сагс ба Checkout:** Хүргэлтийн төлбөр энэ хувилбарт **`0 ₮`** байна. Нэвтрэхээс өмнөх сагсыг нэвтэрсний дараа нэгтгэн, үнийг баталгаажуулахаас өмнө `FTStorage.getProductById(id, { activeOnly: true })`-аар дахин шалгана. Шинэ захиалгын анхны төлөв заавал `orderStatus: 'Шинэ'`, `paymentStatus: 'Хүлээгдэж буй'` байна (хэрэглэгч төлбөрийн хэлбэр сонгосноор өөрөө `'Төлөгдсөн'` болохгүй).

#### Э.Билиг-Очир (`B251890021`) — Хуудсууд `19–26`
- **Салбарын нэр (Branch):** `feat/orders-help`, `feat/admin-portal`
- **Үүсгэх HTML хуудаснууд:**
  - `19` `orders.html` (`sessionStorage.getItem('activeUserId')`-д харгалзах захиалгуудын түүх)
  - `20` `help.html` (`ft_content` дээрх `published === true` заавар, FAQ, мэдээ, салбарын холбоо барих жишээ маягт)
  - `21` `admin/categories.html` (5 үндсэн ангиллын нэр/тайлбар засах, дэд ангилал нэмэх; `category.id` ба `.html` зам тогтмол үлдэнэ)
  - `22` `admin/products.html` (Бараа нэмэх, засах, зураг холбох, устгах буюу `active: false` болгох)
  - `23` `admin/orders.html` (`orderId`-аар хайх, `'Шинэ'` → `'Бэлтгэж буй'` → `'Хүргэгдсэн'`; зөвхөн `paymentStatus === 'Төлөгдсөн'` үед бэлтгэж эхэлнэ)
  - `24` `admin/payments.html` (`"Туршилтын төлбөр баталгаажуулах"` үйлдлээр `'Хүлээгдэж буй'` → `'Төлөгдсөн'` болгох)
  - `25` `admin/customers.html` (`ft_users` жагсаалтыг харах)
  - `26` `admin/content.html` (`ft_content` доторх заавар, FAQ, мэдээ нэмэх/засах/`published` солих)
- **Үүсгэх CSS / JS модулиуд:** `css/admin.css`, `js/admin-crud.js` (мөн шаардлагатай бол `orders-help.js`)
- **Анхаарах нарийн дэлгэрэнгүй:**
  1. **`admin/` дэд хавтасны зам:** `admin/*.html` хуудсууд нь дэд хавтсанд байрлах тул бүх холбоосыг `../` угтвараар бичнэ (`../css/tokens.css`, `../css/layout.css`, `../css/components.css`, `../js/storage.js`, `../index.html` г.м).
  2. **Админ нэвтрэлтийн шалгалт:** `auth.html` дээр админ туршилтын горим сонгоогүй үед `admin/*.html` рүү орвол `../auth.html` руу чиглүүлнэ.
  3. **Бараа устгах дүрэм:** Барааг массиваас устгахгүй, `active: false` болгон `FTStorage.saveProducts(...)`-ээр хадгална. Ингэснээр өмнөх захиалгын түүх эвдрэхгүй ба каталог/хайлтаас автоматаар нуугдана.

---

## 3. Шинэ хуудас үүсгэх стандарт алхмууд

1. `master-subpage.html` файлыг хуулж шинэ файлынхаа нэрээр хадгална (`<head>` доторх Rubik фонт, SVG Favicon, Frosted Header, цэвэр Footer хэвээрээ орно).
2. Хэрэв өөрийн нэмэлт CSS бичсэн бол `components.css`-ийн **доор** холбоно (`css/product-checkout.css` эсвэл `../css/admin.css`).
3. **`<script type="module">` ашиглахгүй** (`file://` дээр CORS алдаагүй ажиллахын тулд). Скриптүүдийг яг дараах дарааллаар `</body>`-ийн өмнө холбоно:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
   <script src="js/data/seed-data.js"></script>
   <script src="js/storage.js"></script>
   <script src="js/common.js"></script>
   <script src="js/таны-скрипт.js"></script>
   ```
4. Дизайны өнгө ба бэлэн классууд (`tokens.css`, `components.css`):
   - Дэвсгэр `#F5F5F7` (`var(--ft-bg)`), Карт `#FFFFFF` (`ft-compare-panel` эсвэл `rounded-4 shadow-sm`), Үндсэн текст `#1D1D1F`, Саарал текст `#6E6E73`, Үндсэн товч `.btn.btn-ft-primary`, Хүрээтэй товч `.btn.btn-ft-outline`, Бэлэн үлдэгдлийн шошго `.ft-badge-stock.in-stock / .low-stock / .out-stock`.
5. HTML бичихдээ `&` тэмдгийг `&amp;` гэж бичих, `<label for="...">` холбох, зурагт `alt` өгөх, динамик утга `innerHTML`-д хийхдээ заавал `FTCommon.escapeHtml(...)` болон `FTCommon.sanitizeUrl(...)` ашиглах.

---

## 4. `localStorage` Өгөгдлийн гэрээ ба JavaScript API (`FTStorage`, `FTCommon`)

### `localStorage` түлхүүрүүд
- `ft_products`: Бүтээгдэхүүнүүд (`id`, `name`, `category`, `type`, `brand`, `price`, `oldPrice`, `stock`, `active`, `featured`, `image`, `detailUrl`, `shortDesc`, `specs`; эд ангид `partType`, `socket`, `ramType`)
- `ft_cart`: Сагсны жагсаалт `[{ productId, qty }]`
- `ft_categories`: 5 үндсэн ангилал (`id`, `name`, `description`, `url`, `subCategories`)
- `ft_orders`: Захиалгууд (`orderId`, `userId`, `createdAt`, `items`, `subtotal`, `deliveryFee`, `total`, `paymentMethod`, `paymentStatus`, `orderStatus`, `shippingAddress`, `phone`)
- `ft_users`: Туршилтын хэрэглэгчид
- `ft_content`: Тусламж, угсрах заавар, FAQ, мэдээ

### Түгээмэл ашиглах функцүүд (`window.FTStorage` ба `window.FTCommon`)
```js
// Бараа унших / хадгалах
var activeProducts = FTStorage.getProducts();                    // зөвхөн active !== false
var allProducts    = FTStorage.getProducts({ includeInactive: true }); // админ хүснэгтэд
var item           = FTStorage.getProductById('desk-01', { activeOnly: true });
FTStorage.saveProducts(updatedArray);

// Сагс ба тоолуур
var res = FTStorage.addToCart('part-01', 1); // { ok, capped, message, count } буцаана
FTCommon.syncCartCounter();                  // header сагсны тоолуурыг шинэчилнэ
FTCommon.showToast(res.message, !res.ok);    // баруун доод мэдэгдэл харуулна

// Формат ба аюулгүй байдал
FTStorage.formatPrice(6890000);              // "6,890,000 ₮"
FTCommon.escapeHtml(userInput);              // XSS хамгаалалт
FTCommon.sanitizeUrl(imgUrl, 'categories.html');
```

---

## 5. Жинхэнэ бүтээгдэхүүний зураг оруулах заавар

1. Төслийн үндсэн хавтсанд `images/` (эсвэл `images/products/`) хавтас үүсгээд `.webp` / `.png` зургуудаа хийнэ (нэг зургийн хэмжээг `100–200 KB`-аас бага байлгах).
2. `js/data/seed-data.js` доторх барааны `image:` талбарт `'images/rtx5080.webp'` гэж бичнэ (эсвэл `admin/products.html`-аас шинэчлэнэ).
3. Өмнө нь нээсэн хөтчийн хуучин SVG кэшийг арилгахын тулд `F12` → Console дээр **`FTStorage.resetToSeed()`** гэж бичээд хуудсаа Refresh хийнэ.

---

## 6. GitHub дээр 3-уулаа хамтран ажиллах дараалал

### Анх удаа GitHub руу оруулах (Репо эзэмшигч)
```bash
git init
git branch -M main
git add .
git commit -m "feat: FUTURE/TECH design system and pages 01-09"
git remote add origin https://github.com/<username>/future-tech.git
git push -u origin main
```
Дараа нь GitHub → **Settings → Collaborators** хэсгээс А.Атилла болон Э.Билиг-Очир хоёрыг нэмж, **Settings → Pages** дээрээс `main` салбарыг асааж онлайн линк үүсгэж болно.

### Багийн гишүүд өдөр тутам ажиллах дүрэм (Конфликтгүй)
```bash
# 1. Төслийг татах
git clone https://github.com/<username>/future-tech.git
cd future-tech

# 2. Ажил эхлэхийн өмнө main-ээс шинэчлэх ба өөрийн салбар үүсгэх
git checkout main
git pull origin main
git checkout -b feat/pdp-pages   # эсвэл feat/admin-portal

# 3. Зөвхөн өөрийн хариуцсан файлыг бичээд commit + push хийх
git add product-*.html css/product-checkout.css js/product-detail.js
git commit -m "feat: implement 5 product detail pages"
git push -u origin feat/pdp-pages
```
Дараа нь GitHub дээр **Compare & pull request** товч дарж шалгасны үндсэн дээр `main` рүү Merge хийнэ. Хүн бүр өдөр бүр `git pull origin main` хийж бие биеийнхээ ажилтай синхрон явна.

---

## 7. Нэгтгэсний дараа шалгах жагсаалт

1. `index.html`, `categories.html`, `compare.html`, `search.html`, `product-*.html`, `cart.html`, `checkout.html`, `orders.html`, `auth.html`, `admin/*.html` хооронд бүх `href` холбоос тасрахгүй байх.
2. Responsive харагдацыг DevTools дээр **`375px`**, **`768px`**, **`1280px`** өргөн дээр `0px` хэвтээ гүйлгэгчгүйгээр шалгах.
3. `compare.html` дээр DDR5 RAM + DDR4 эх хавтан сонгоход улаан анхааруулга гарах, харьцуулалтад хоосон талбар **"Мэдээлэл ороогүй"** харагдах, мөн админ дээр шинэ бараа нэмэх/идэвхгүй болгоход каталог ба хайлт шинэчлэгдэх эсэхийг шалгах.
