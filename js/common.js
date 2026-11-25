(function (global) {
  'use strict';

  var MAX_VISIBLE_TOASTS = 3;
  var lastFallbackFocusEl = null;

  function escapeHtml(value) {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function sanitizeUrl(url, fallback) {
    var safeFallback = fallback || '#';
    if (typeof url !== 'string') {
      return safeFallback;
    }
    var trimmed = url.trim();
    if (!trimmed) {
      return safeFallback;
    }
    if (/^data:image\/(svg\+xml|png|jpeg|jpg|webp|gif)[;,]/i.test(trimmed)) {
      return trimmed;
    }
    if (/^(javascript|vbscript|data):/i.test(trimmed)) {
      return safeFallback;
    }
    if (/^(https?:\/\/|\/|\.\/|\.\.\/|[a-z0-9][a-z0-9._/-]*\.(?:html|svg|png|jpe?g|webp|gif|avif)(?:[?#].*)?$)/i.test(trimmed)) {
      return trimmed;
    }
    return safeFallback;
  }

  function getTypeLabel(type) {
    var seed = global.FT_SEED_DATA || {};
    var map = seed.typeLabels || {};
    return map[type] || type || '';
  }

  function getCategoryName(categoryId) {
    var categories = global.FTStorage ? global.FTStorage.getCategories() : [];
    for (var i = 0; i < categories.length; i += 1) {
      if (categories[i].id === categoryId) {
        return categories[i].name;
      }
    }
    return categoryId || '';
  }

  function formatSpecValue(specDef, rawVal) {
    if (rawVal === null || rawVal === undefined) {
      return null;
    }
    var str = String(rawVal).trim();
    if (str === '') {
      return null;
    }
    return specDef && specDef.unit ? str + ' ' + specDef.unit : str;
  }

  function getCartQtyForProduct(productId) {
    if (!global.FTStorage) return 0;
    var cart = global.FTStorage.getCart();
    for (var i = 0; i < cart.length; i += 1) {
      if (cart[i].productId === productId) {
        return cart[i].qty;
      }
    }
    return 0;
  }

  function getProductHighlightChips(product) {
    var specs = product && product.specs ? product.specs : {};
    var chips = [];

    if (product.partType === 'cpu' && specs.socket) {
      chips.push('Сокет: ' + specs.socket);
      if (specs.coresThreads) chips.push(specs.coresThreads);
    } else if (product.partType === 'motherboard') {
      if (specs.socket) chips.push('Сокет: ' + specs.socket);
      if (specs.ramType) chips.push('RAM: ' + specs.ramType);
    } else if (product.partType === 'ram') {
      if (specs.ramType) chips.push(specs.ramType);
      if (specs.capacityGb) chips.push(specs.capacityGb + ' GB');
      if (specs.speedMhz) chips.push(specs.speedMhz + ' MHz');
    } else if (product.partType === 'gpu') {
      if (specs.vramGb) chips.push(specs.vramGb + ' GB VRAM');
      if (specs.recommendedPsuWatt) chips.push('PSU: ' + specs.recommendedPsuWatt + 'W');
    } else if (product.type === 'desktop-pc') {
      if (specs.cpu) chips.push(specs.cpu);
      if (specs.ramGb) chips.push(specs.ramGb + ' GB ' + (specs.ramType || ''));
      if (specs.gpu) chips.push(specs.gpu);
    } else if (product.type === 'laptop') {
      if (specs.cpu) chips.push(specs.cpu);
      if (specs.ramGb) chips.push(specs.ramGb + ' GB RAM');
      if (specs.displayInch) chips.push(specs.displayInch + ' инч');
    } else if (product.type === 'monitor') {
      if (specs.displayInch) chips.push(specs.displayInch + ' инч');
      if (specs.refreshRateHz) chips.push(specs.refreshRateHz + ' Hz');
      if (specs.panelType) chips.push(specs.panelType);
    } else if (product.type === 'keyboard') {
      if (specs.layout) chips.push(specs.layout);
      if (specs.connection) chips.push(specs.connection);
    } else if (product.type === 'mouse') {
      if (specs.weightG) chips.push(specs.weightG + ' г');
      if (specs.maxDpi) chips.push(specs.maxDpi + ' DPI');
    } else if (product.type === 'router') {
      if (specs.wifiStandard) chips.push(specs.wifiStandard);
      if (specs.maxSpeedMbps) chips.push(specs.maxSpeedMbps + ' Mbps');
    } else if (product.type === 'ups') {
      if (specs.capacityVa) chips.push(specs.capacityVa + ' VA');
      if (specs.capacityWatt) chips.push(specs.capacityWatt + ' W');
    }

    return chips.slice(0, 3);
  }

  function renderProductCard(product) {
    var storage = global.FTStorage;
    var discount = storage.getDiscountPercent(product);
    var stock = Math.max(0, Math.floor(Number(product.stock) || 0));
    var inStock = stock > 0 && product.active !== false;
    var inCart = getCartQtyForProduct(product.id);
    var isMaxedInCart = inStock && inCart >= stock;
    var chips = getProductHighlightChips(product);
    var rawDetailUrl = product.detailUrl || 'product-' + product.category + '.html?id=' + encodeURIComponent(product.id);
    var detailUrl = sanitizeUrl(rawDetailUrl, 'categories.html');
    var compareUrl = 'compare.html?tab=compare&cat=' + encodeURIComponent(product.category) + '&p1=' + encodeURIComponent(product.id);
    var imgUrl = sanitizeUrl(product.image, '');
    var ratingText = product.rating ? String(product.rating) : (product.featured ? '4.9' : '4.8');

    var chipsHtml = chips
      .map(function (chip) {
        return '<span class="ft-spec-chip">' + escapeHtml(chip) + '</span>';
      })
      .join('');

    var savings =
      product.oldPrice && Number(product.oldPrice) > Number(product.price)
        ? Number(product.oldPrice) - Number(product.price)
        : 0;
    var oldPriceHtml =
      savings > 0
        ? '<span class="ft-price-old">' + escapeHtml(storage.formatPrice(product.oldPrice)) + '</span>'
        : '';

    var eyebrowHtml =
      savings > 0
        ? '<div class="ft-eyebrow">Хямдрал · -' + escapeHtml(storage.formatPrice(savings)) + '</div>'
        : product.featured
          ? '<div class="ft-eyebrow">Онцлох загвар</div>'
          : '';

    var discountHtml = discount > 0 ? '<span class="ft-badge-discount">-' + discount + '%</span>' : '';
    var isLowStock = inStock && stock <= 4;
    var stockHtml = !inStock
      ? '<span class="ft-badge-stock out-stock">Дууссан</span>'
      : isLowStock
        ? '<span class="ft-badge-stock low-stock">Зөвхөн ' + stock + ' ш үлдлээ</span>'
        : '<span class="ft-badge-stock in-stock">Бэлэн: ' + stock + ' ш</span>';

    var btnLabel = !inStock
      ? 'Үлдэгдэлгүй'
      : isMaxedInCart
        ? 'Дээд хязгаарт (' + inCart + ' ш)'
        : 'Сагсанд нэмэх';

    return (
      '<article class="ft-product-card">' +
      '  <div class="ft-product-media">' +
      discountHtml +
      stockHtml +
      '    <a href="' + escapeHtml(detailUrl) + '" class="d-block w-100 h-100" aria-label="' + escapeHtml(product.name) + ' — дэлгэрэнгүй үзэх">' +
      '      <img src="' + escapeHtml(imgUrl) + '" alt="' + escapeHtml(product.name) + '" loading="lazy">' +
      '    </a>' +
      '  </div>' +
      '  <div class="ft-product-body">' +
      eyebrowHtml +
      '    <div class="ft-card-status-row">' +
      '      <span class="ft-rating-pill" aria-label="Үнэлгээ: ' + escapeHtml(ratingText) + ' / 5">' +
      '        <svg width="13" height="13" viewBox="0 0 24 24" fill="#F59E0B" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' +
      '        <span>' + escapeHtml(ratingText) + '</span>' +
      '      </span>' +
      '      <span class="small text-muted fw-semibold">' + escapeHtml(product.brand) + ' · ' + escapeHtml(product.subCategory || getTypeLabel(product.type)) + '</span>' +
      '    </div>' +
      '    <h3 class="ft-product-title">' +
      '      <a href="' + escapeHtml(detailUrl) + '">' + escapeHtml(product.name) + '</a>' +
      '    </h3>' +
      '    <div class="ft-spec-chips">' + chipsHtml + '</div>' +
      '    <div class="ft-price-box">' +
      '      <span class="ft-price-current">' + escapeHtml(storage.formatPrice(product.price)) + '</span>' +
      oldPriceHtml +
      '    </div>' +
      '    <span class="ft-delivery-pill">Өнөөдөр хүргэнэ · 0 ₮</span>' +
      '    <div class="ft-product-actions">' +
      '      <button type="button" class="btn btn-ft-primary ft-product-actions-full" data-add-to-cart="' + escapeHtml(product.id) + '" data-base-label="Сагсанд нэмэх"' + (!inStock || isMaxedInCart ? ' disabled' : '') + '>' +
      escapeHtml(btnLabel) +
      '</button>' +
      '      <button type="button" class="btn btn-ft-outline btn-sm" data-quick-view="' + escapeHtml(product.id) + '">Товч мэдээлэл</button>' +
      '      <a href="' + escapeHtml(compareUrl) + '" class="btn btn-ft-outline btn-sm">Харьцуулах</a>' +
      '    </div>' +
      '  </div>' +
      '</article>'
    );
  }

  function syncCardButtonsWithCart() {
    if (!global.FTStorage) return;
    var buttons = document.querySelectorAll('.ft-product-card [data-add-to-cart], .ft-compare-table [data-add-to-cart]');
    for (var i = 0; i < buttons.length; i += 1) {
      var btn = buttons[i];
      if (btn.classList.contains('is-added')) continue;
      var productId = btn.getAttribute('data-add-to-cart');
      var product = global.FTStorage.getProductById(productId, { activeOnly: true });
      if (!product) {
        btn.disabled = true;
        btn.textContent = 'Үлдэгдэлгүй';
        continue;
      }
      var stock = Math.max(0, Math.floor(Number(product.stock) || 0));
      var inCart = getCartQtyForProduct(productId);
      if (stock <= 0) {
        btn.disabled = true;
        btn.textContent = 'Үлдэгдэлгүй';
      } else if (inCart >= stock) {
        btn.disabled = true;
        btn.textContent = 'Дээд хязгаарт (' + inCart + ' ш)';
      } else {
        btn.disabled = false;
        btn.textContent = btn.getAttribute('data-base-label') || 'Сагсанд нэмэх';
      }
    }
  }

  function syncQuickViewIfOpen() {
    var modalEl = document.getElementById('ftQuickViewModal');
    if (!modalEl) return;
    var activeId = modalEl.getAttribute('data-active-product-id');
    if (!activeId) return;
    if (!modalEl.classList.contains('show')) return;
    var product = global.FTStorage.getProductById(activeId, { activeOnly: true });
    if (product) {
      updateQuickViewStockAndButton(modalEl, product);
    }
  }

  function syncCartCounter() {
    if (!global.FTStorage) return;
    var count = global.FTStorage.getCartCount();
    var badges = document.querySelectorAll('[data-cart-count]');
    for (var i = 0; i < badges.length; i += 1) {
      badges[i].textContent = String(count);
    }
    syncCardButtonsWithCart();
    syncQuickViewIfOpen();
  }

  function ensureToastContainer() {
    var container = document.getElementById('ftToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'ftToastContainer';
      container.className = 'ft-toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(message, isWarning) {
    var container = ensureToastContainer();
    while (container.children.length >= MAX_VISIBLE_TOASTS) {
      container.removeChild(container.firstElementChild);
    }

    var toast = document.createElement('div');
    toast.className = 'ft-toast' + (isWarning ? ' is-warning' : '');
    toast.setAttribute('role', isWarning ? 'alert' : 'status');
    toast.setAttribute('aria-live', isWarning ? 'assertive' : 'polite');

    var prefix = isWarning ? 'Анхаар: ' : '';
    toast.innerHTML =
      '<span class="flex-grow-1">' + escapeHtml(prefix + message) + '</span>' +
      '<div class="d-flex align-items-center gap-1 flex-shrink-0">' +
      '  <a href="cart.html" class="btn btn-sm btn-ft-primary">Сагс</a>' +
      '  <button type="button" class="btn-close btn-close-white btn-sm" aria-label="Мэдэгдэл хаах"></button>' +
      '</div>';

    container.appendChild(toast);

    var timerId = null;
    function dismiss() {
      if (timerId) {
        global.clearTimeout(timerId);
        timerId = null;
      }
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }

    function scheduleDismiss() {
      if (timerId) global.clearTimeout(timerId);
      timerId = global.setTimeout(dismiss, 4200);
    }

    var closeBtn = toast.querySelector('.btn-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', dismiss);
    }

    toast.addEventListener('mouseenter', function () {
      if (timerId) global.clearTimeout(timerId);
    });
    toast.addEventListener('focusin', function () {
      if (timerId) global.clearTimeout(timerId);
    });
    toast.addEventListener('mouseleave', scheduleDismiss);
    toast.addEventListener('focusout', scheduleDismiss);

    scheduleDismiss();
  }

  function ensureCategoryMegaDrawer() {
    var existing = document.getElementById('ftCategoryMegaDrawer');
    if (existing) return existing;

    var categories = global.FTStorage ? global.FTStorage.getCategories() : [];
    var products = global.FTStorage ? global.FTStorage.getProducts() : [];
    var counts = {};
    products.forEach(function (p) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    var blocksHtml = categories
      .map(function (cat) {
        var safeCatUrl = sanitizeUrl(cat.url, 'categories.html');
        var subs = (cat.subCategories || [])
          .map(function (sub) {
            return (
              '<a class="ft-mega-sublink" href="search.html?q=' +
              encodeURIComponent(sub) +
              '">' +
              escapeHtml(sub) +
              '</a>'
            );
          })
          .join('');
        return (
          '<div class="ft-mega-cat-block">' +
          '  <div class="d-flex justify-content-between align-items-center mb-2">' +
          '    <a href="' + escapeHtml(safeCatUrl) + '" class="fw-bold text-ft-primary">' + escapeHtml(cat.name) + '</a>' +
          '    <span class="ft-category-count">' + (counts[cat.id] || 0) + ' бараа</span>' +
          '  </div>' +
          '  <div class="d-flex flex-wrap gap-1">' + subs + '</div>' +
          '</div>'
        );
      })
      .join('');

    var drawer = document.createElement('div');
    drawer.className = 'offcanvas offcanvas-start';
    drawer.tabIndex = -1;
    drawer.id = 'ftCategoryMegaDrawer';
    drawer.setAttribute('aria-labelledby', 'ftCategoryMegaDrawerTitle');
    drawer.innerHTML =
      '<div class="offcanvas-header border-bottom" style="background-color: var(--ft-bg); color: var(--ft-primary);">' +
      '  <div>' +
      '    <h2 class="offcanvas-title h6 fw-bold mb-0" id="ftCategoryMegaDrawerTitle">Future-Tech Ангиллын цэс</h2>' +
      '    <div class="small text-muted">Бүх төрөл ба дэд ангилал</div>' +
      '  </div>' +
      '  <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Хаах"></button>' +
      '</div>' +
      '<div class="offcanvas-body d-grid gap-2 align-content-start">' +
      blocksHtml +
      '  <div class="pt-2 mt-1 border-top d-grid gap-2">' +
      '    <a href="compare.html" class="btn btn-ft-primary btn-sm">Компьютер угсрах (Нийцэл шалгах)</a>' +
      '    <a href="compare.html?tab=compare" class="btn btn-ft-outline btn-sm">Бараа харьцуулах</a>' +
      '    <a href="categories.html" class="btn btn-ft-outline btn-sm">Бүх ангиллын тойм</a>' +
      '  </div>' +
      '</div>';

    document.body.appendChild(drawer);
    return drawer;
  }

  function openOffcanvasFallback(ocEl, triggerEl) {
    if (!ocEl) return;
    lastFallbackFocusEl = triggerEl || document.activeElement;
    ocEl.classList.add('show');
    ocEl.style.visibility = 'visible';
    ocEl.setAttribute('role', 'dialog');
    ocEl.setAttribute('aria-modal', 'true');
    if (triggerEl) {
      triggerEl.setAttribute('aria-expanded', 'true');
    }
    var closeTarget = ocEl.querySelector('.btn-close, a, button');
    if (closeTarget && typeof closeTarget.focus === 'function') {
      closeTarget.focus();
    }
  }

  function closeOffcanvasFallback(ocEl) {
    if (!ocEl) return;
    ocEl.classList.remove('show');
    ocEl.style.visibility = '';
    ocEl.removeAttribute('aria-modal');
    if (lastFallbackFocusEl && typeof lastFallbackFocusEl.focus === 'function') {
      lastFallbackFocusEl.setAttribute('aria-expanded', 'false');
      lastFallbackFocusEl.focus();
      lastFallbackFocusEl = null;
    }
  }

  function openCategoryMegaDrawer(triggerEl) {
    var drawerEl = ensureCategoryMegaDrawer();
    if (global.bootstrap && global.bootstrap.Offcanvas) {
      global.bootstrap.Offcanvas.getOrCreateInstance(drawerEl).show();
    } else {
      openOffcanvasFallback(drawerEl, triggerEl);
    }
  }

  function updateQuickViewStockAndButton(modalEl, product) {
    if (!modalEl || !product) return;
    var active = product.active !== false;
    var stock = Math.max(0, Math.floor(Number(product.stock) || 0));
    var inCart = getCartQtyForProduct(product.id);
    var stockEl = modalEl.querySelector('[data-qv-stock]');
    var addBtnEl = modalEl.querySelector('[data-qv-add-btn]');
    var cartLinkEl = modalEl.querySelector('[data-qv-cart-link]');

    if (stockEl) {
      if (!active || stock <= 0) {
        stockEl.textContent = !active ? 'Захиалга хаалттай' : 'Үлдэгдэл дууссан';
        stockEl.className = 'ft-badge-stock out-stock ms-auto';
      } else if (stock <= 4) {
        stockEl.textContent = 'Зөвхөн ' + stock + ' ш үлдлээ' + (inCart > 0 ? ' (Сагсанд: ' + inCart + ')' : '');
        stockEl.className = 'ft-badge-stock low-stock ms-auto';
      } else {
        stockEl.textContent = 'Бэлэн: ' + stock + ' ш' + (inCart > 0 ? ' (Сагсанд: ' + inCart + ')' : '');
        stockEl.className = 'ft-badge-stock in-stock ms-auto';
      }
    }

    if (addBtnEl && !addBtnEl.classList.contains('is-added')) {
      addBtnEl.setAttribute('data-add-to-cart', product.id);
      if (!active || stock <= 0) {
        addBtnEl.disabled = true;
        addBtnEl.textContent = !active ? 'Боломжгүй' : 'Үлдэгдэлгүй';
      } else if (inCart >= stock) {
        addBtnEl.disabled = true;
        addBtnEl.textContent = 'Дээд хязгаарт хүрсэн (' + inCart + ' ш)';
      } else {
        addBtnEl.disabled = false;
        addBtnEl.textContent = 'Сагсанд нэмэх';
      }
    }

    if (cartLinkEl) {
      cartLinkEl.classList.toggle('d-none', inCart <= 0);
    }
  }

  function openQuickViewModal(productId, triggerEl) {
    var product = global.FTStorage.getProductById(productId, { activeOnly: true });
    if (!product) {
      showToast('Энэ бараа одоогоор идэвхгүй эсвэл олдсонгүй.', true);
      return;
    }

    var modalEl = document.getElementById('ftQuickViewModal');
    if (!modalEl) return;

    modalEl.setAttribute('data-active-product-id', product.id);

    var addBtnEl = modalEl.querySelector('[data-qv-add-btn]');
    if (addBtnEl) {
      if (addBtnEl._ftTimer) {
        global.clearTimeout(addBtnEl._ftTimer);
        addBtnEl._ftTimer = null;
      }
      addBtnEl.classList.remove('is-added');
    }

    var seed = global.FT_SEED_DATA || {};
    var schemas = seed.specSchemas || {};
    var schema = schemas[product.type] || [];
    var specs = product.specs || {};
    var rawDetailUrl = product.detailUrl || 'product-' + product.category + '.html?id=' + encodeURIComponent(product.id);
    var detailUrl = sanitizeUrl(rawDetailUrl, 'categories.html');
    var compareUrl = 'compare.html?tab=compare&cat=' + encodeURIComponent(product.category) + '&p1=' + encodeURIComponent(product.id);
    var imgUrl = sanitizeUrl(product.image, '');

    var titleEl = modalEl.querySelector('[data-qv-title]');
    var brandEl = modalEl.querySelector('[data-qv-brand]');
    var imgEl = modalEl.querySelector('[data-qv-img]');
    var priceEl = modalEl.querySelector('[data-qv-price]');
    var oldPriceEl = modalEl.querySelector('[data-qv-old-price]');
    var descEl = modalEl.querySelector('[data-qv-desc]');
    var specsBodyEl = modalEl.querySelector('[data-qv-specs]');
    var detailLinkEl = modalEl.querySelector('[data-qv-detail-link]');
    var compareLinkEl = modalEl.querySelector('[data-qv-compare-link]');

    if (titleEl) titleEl.textContent = product.name;
    if (brandEl) brandEl.textContent = product.brand + ' · ' + getCategoryName(product.category);
    if (imgEl) {
      imgEl.src = imgUrl;
      imgEl.alt = product.name;
    }
    if (priceEl) priceEl.textContent = global.FTStorage.formatPrice(product.price);
    if (oldPriceEl) {
      if (product.oldPrice && Number(product.oldPrice) > Number(product.price)) {
        oldPriceEl.textContent = global.FTStorage.formatPrice(product.oldPrice);
        oldPriceEl.classList.remove('d-none');
      } else {
        oldPriceEl.textContent = '';
        oldPriceEl.classList.add('d-none');
      }
    }
    if (descEl) descEl.textContent = product.shortDesc || '';
    if (detailLinkEl) detailLinkEl.href = detailUrl;
    if (compareLinkEl) compareLinkEl.href = compareUrl;

    updateQuickViewStockAndButton(modalEl, product);

    if (specsBodyEl) {
      var rowsHtml = '';
      if (schema.length > 0) {
        rowsHtml = schema
          .map(function (field) {
            var formatted = formatSpecValue(field, specs[field.key]);
            var cell = formatted
              ? escapeHtml(formatted)
              : '<span class="ft-missing-spec">Мэдээлэл ороогүй</span>';
            return '<tr><th scope="row" class="text-muted fw-semibold">' + escapeHtml(field.label) + '</th><td>' + cell + '</td></tr>';
          })
          .join('');
      } else {
        var keys = Object.keys(specs);
        rowsHtml = keys
          .map(function (k) {
            var formattedVal = formatSpecValue(null, specs[k]);
            var cell = formattedVal
              ? escapeHtml(formattedVal)
              : '<span class="ft-missing-spec">Мэдээлэл ороогүй</span>';
            return '<tr><th scope="row">' + escapeHtml(k) + '</th><td>' + cell + '</td></tr>';
          })
          .join('');
      }
      specsBodyEl.innerHTML = rowsHtml;
    }

    if (global.bootstrap && global.bootstrap.Modal) {
      global.bootstrap.Modal.getOrCreateInstance(modalEl).show();
    } else {
      lastFallbackFocusEl = triggerEl || document.activeElement;
      modalEl.classList.add('show');
      modalEl.style.display = 'block';
      modalEl.setAttribute('aria-modal', 'true');
      modalEl.removeAttribute('aria-hidden');
      var closeModalBtn = modalEl.querySelector('.btn-close');
      if (closeModalBtn && typeof closeModalBtn.focus === 'function') {
        closeModalBtn.focus();
      }
    }
  }

  function closeModalFallback(modalEl) {
    if (!modalEl) return;
    if (global.bootstrap && global.bootstrap.Modal) {
      var instance = global.bootstrap.Modal.getInstance(modalEl);
      if (instance) instance.hide();
    } else {
      modalEl.classList.remove('show');
      modalEl.style.display = 'none';
      modalEl.removeAttribute('aria-modal');
      modalEl.setAttribute('aria-hidden', 'true');
      if (lastFallbackFocusEl && typeof lastFallbackFocusEl.focus === 'function') {
        lastFallbackFocusEl.focus();
        lastFallbackFocusEl = null;
      }
    }
  }

  function initScrollToTopButton() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ft-scroll-top';
    btn.setAttribute('aria-label', 'Дээш гүйлгэх');
    btn.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">' +
      '  <path d="M18 15l-6-6-6 6"></path>' +
      '</svg>';
    document.body.appendChild(btn);

    function toggleVisibility() {
      btn.classList.toggle('is-visible', global.scrollY > 300);
    }

    btn.addEventListener('click', function () {
      global.scrollTo({ top: 0, behavior: 'smooth' });
    });

    global.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
  }

  function bindGlobalEvents() {
    document.addEventListener('click', function (event) {
      var megaBtn = event.target.closest('[data-ft-open-categories]');
      if (megaBtn) {
        openCategoryMegaDrawer(megaBtn);
        return;
      }

      var addBtn = event.target.closest('[data-add-to-cart]');
      if (addBtn) {
        var productId = addBtn.getAttribute('data-add-to-cart');
        var res = global.FTStorage.addToCart(productId, 1);

        if (addBtn._ftTimer) {
          global.clearTimeout(addBtn._ftTimer);
          addBtn._ftTimer = null;
        }

        var modalEl = addBtn.closest('#ftQuickViewModal');
        if (modalEl && res.product) {
          if (res.ok && !res.capped) {
            addBtn.textContent = '✓ Сагсанд нэмэгдлээ';
            addBtn.classList.add('is-added');
            updateQuickViewStockAndButton(modalEl, res.product);
            addBtn._ftTimer = global.setTimeout(function () {
              addBtn.classList.remove('is-added');
              addBtn._ftTimer = null;
              if (modalEl.getAttribute('data-active-product-id') === productId) {
                var currentProd = global.FTStorage.getProductById(productId, { activeOnly: true });
                if (currentProd) {
                  updateQuickViewStockAndButton(modalEl, currentProd);
                }
              }
            }, 1400);
          } else {
            addBtn.classList.remove('is-added');
            updateQuickViewStockAndButton(modalEl, res.product);
          }
        } else if (res.ok && !res.capped) {
          if (!addBtn.getAttribute('data-base-label')) {
            addBtn.setAttribute('data-base-label', addBtn.textContent);
          }
          addBtn.textContent = '✓ Сагсанд нэмэгдлээ';
          addBtn.classList.add('is-added');
          addBtn._ftTimer = global.setTimeout(function () {
            addBtn.classList.remove('is-added');
            addBtn._ftTimer = null;
            syncCardButtonsWithCart();
          }, 1200);
        }

        syncCartCounter();
        showToast(res.message, !res.ok || res.capped);
        return;
      }

      var qvBtn = event.target.closest('[data-quick-view]');
      if (qvBtn) {
        openQuickViewModal(qvBtn.getAttribute('data-quick-view'), qvBtn);
        return;
      }

      if (!global.bootstrap) {
        var dismissModal = event.target.closest('[data-bs-dismiss="modal"]');
        if (dismissModal) {
          closeModalFallback(dismissModal.closest('.modal'));
          return;
        }

        var toggler = event.target.closest('[data-bs-toggle="collapse"]');
        if (toggler) {
          var targetSel = toggler.getAttribute('data-bs-target');
          var collapseEl = targetSel ? document.querySelector(targetSel) : null;
          if (collapseEl) {
            collapseEl.classList.toggle('show');
            toggler.setAttribute('aria-expanded', collapseEl.classList.contains('show') ? 'true' : 'false');
          }
          return;
        }

        var offcanvasToggle = event.target.closest('[data-bs-toggle="offcanvas"]');
        if (offcanvasToggle) {
          var ocSel = offcanvasToggle.getAttribute('data-bs-target');
          var ocEl = ocSel ? document.querySelector(ocSel) : null;
          if (ocEl) {
            openOffcanvasFallback(ocEl, offcanvasToggle);
          }
          return;
        }

        var offcanvasDismiss = event.target.closest('[data-bs-dismiss="offcanvas"]');
        if (offcanvasDismiss) {
          closeOffcanvasFallback(offcanvasDismiss.closest('.offcanvas-lg, .offcanvas'));
        }
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !global.bootstrap) {
        var openModal = document.querySelector('.modal.show');
        if (openModal) {
          closeModalFallback(openModal);
        }
        var openOc = document.querySelector('.offcanvas-lg.show, .offcanvas.show');
        if (openOc) {
          closeOffcanvasFallback(openOc);
        }
      }
    });

    var headerForms = document.querySelectorAll('form[data-ft-search-form]');
    for (var i = 0; i < headerForms.length; i += 1) {
      headerForms[i].addEventListener('submit', function (event) {
        var input = this.querySelector('input[name="q"]');
        var query = input ? input.value.trim() : '';
        var pageMain = document.querySelector('main[data-page="search"]');
        if (pageMain && global.FTCatalog && typeof global.FTCatalog.applySearchQuery === 'function') {
          event.preventDefault();
          global.FTCatalog.applySearchQuery(query);
          return;
        }
        event.preventDefault();
        var target = 'search.html' + (query ? '?q=' + encodeURIComponent(query) : '');
        global.location.href = target;
      });
    }

    global.addEventListener('ft:cart-updated', syncCartCounter);
    global.addEventListener('storage', function (event) {
      if (
        !event.key ||
        event.key === global.FTStorage.KEYS.CART ||
        event.key === global.FTStorage.KEYS.PRODUCTS
      ) {
        syncCartCounter();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (global.FTStorage) {
      global.FTStorage.ensureSeeded();
      syncCartCounter();
    }
    initScrollToTopButton();
    bindGlobalEvents();
  });

  global.FTCommon = {
    escapeHtml: escapeHtml,
    sanitizeUrl: sanitizeUrl,
    getTypeLabel: getTypeLabel,
    getCategoryName: getCategoryName,
    formatSpecValue: formatSpecValue,
    renderProductCard: renderProductCard,
    syncCartCounter: syncCartCounter,
    showToast: showToast,
    openQuickViewModal: openQuickViewModal,
    openCategoryMegaDrawer: openCategoryMegaDrawer
  };
})(window);
