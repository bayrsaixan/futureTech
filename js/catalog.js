(function (global) {
  'use strict';

  var currentSearchQuery = '';
  var activeHomeCategory = 'all';
  var catalogState = {
    mode: '',
    category: '',
    allCandidates: [],
    maxAvailablePrice: 8000000
  };

  function parseNonNegativePrice(inputEl) {
    if (!inputEl) return null;
    var raw = String(inputEl.value || '').trim();
    if (raw === '') return null;
    var num = Number(raw);
    if (!isFinite(num) || num < 0) return null;
    return num;
  }

  function renderHomeFeaturedGrid(categoryFilter) {
    var storage = global.FTStorage;
    var common = global.FTCommon;
    var featuredGrid = document.getElementById('featuredProductsGrid');
    if (!featuredGrid) return;

    var products = storage.getProducts();
    var list;
    if (!categoryFilter || categoryFilter === 'all') {
      list = products.filter(function (p) {
        return p.featured;
      });
      if (list.length === 0) list = products.slice(0, 8);
    } else {
      list = products.filter(function (p) {
        return p.category === categoryFilter;
      });
    }

    if (list.length === 0) {
      featuredGrid.innerHTML =
        '<div class="col-12"><div class="ft-empty-state"><p class="mb-0">Энэ ангилалд одоогоор бараа алга байна.</p></div></div>';
      return;
    }

    featuredGrid.innerHTML = list
      .slice(0, 8)
      .map(function (p) {
        return '<div class="col">' + common.renderProductCard(p) + '</div>';
      })
      .join('');
    common.syncCartCounter();
  }

  function renderHomePage() {
    var storage = global.FTStorage;
    var common = global.FTCommon;
    var products = storage.getProducts();
    var categories = storage.getCategories();

    var catCounts = {};
    products.forEach(function (p) {
      catCounts[p.category] = (catCounts[p.category] || 0) + 1;
    });

    var countEls = document.querySelectorAll('[data-category-count]');
    for (var i = 0; i < countEls.length; i += 1) {
      var catId = countEls[i].getAttribute('data-category-count');
      countEls[i].textContent = String(catCounts[catId] || 0) + ' бараа';
    }

    var heroTotalEl = document.getElementById('heroProductTotal');
    if (heroTotalEl) {
      heroTotalEl.textContent = String(products.length) + '+';
    }

    var heroCatEl = document.getElementById('heroCategoryTotal');
    if (heroCatEl) {
      heroCatEl.textContent = String(categories.length);
    }

    var promoTilesEl = document.getElementById('homePromoTilesGrid');
    if (promoTilesEl) {
      var benchmarkIds = ['desk-01', 'lap-01', 'part-01', 'per-01', 'net-01'];
      var tileProducts = benchmarkIds
        .map(function (id) {
          return storage.getProductById(id, { activeOnly: true });
        })
        .filter(Boolean);

      if (tileProducts.length === 0) {
        tileProducts = products.slice(0, 5);
      }

      promoTilesEl.innerHTML = tileProducts
        .map(function (p) {
          var rawUrl = p.detailUrl || 'product-' + p.category + '.html?id=' + encodeURIComponent(p.id);
          var detailUrl = common.sanitizeUrl(rawUrl, 'categories.html');
          var imgUrl = common.sanitizeUrl(p.image, '');
          return (
            '<div class="col">' +
            '  <a href="' + common.escapeHtml(detailUrl) + '" class="ft-promo-tile text-decoration-none">' +
            '    <div class="ft-promo-tile-img">' +
            '      <img src="' + common.escapeHtml(imgUrl) + '" alt="' + common.escapeHtml(p.name) + '" loading="lazy">' +
            '    </div>' +
            '    <span class="ft-promo-tile-tag">' + common.escapeHtml(p.subCategory || p.brand) + '</span>' +
            '    <h3 class="ft-promo-tile-title">' + common.escapeHtml(p.name) + '</h3>' +
            '    <div class="small fw-bold text-ft-primary mt-auto">' + common.escapeHtml(storage.formatPrice(p.price)) + '</div>' +
            '  </a>' +
            '</div>'
          );
        })
        .join('');
    }

    var spotlightContainer = document.getElementById('homeSpotlightCard');
    if (spotlightContainer) {
      var spotlightProd = storage.getProductById('desk-01', { activeOnly: true }) || products[0];
      if (spotlightProd) {
        spotlightContainer.innerHTML = common.renderProductCard(spotlightProd);
      } else {
        spotlightContainer.innerHTML = '<div class="ft-empty-state"><p class="mb-0">Одоогоор онцлох загвар алга байна.</p></div>';
      }
    }

    renderHomeFeaturedGrid(activeHomeCategory);

    var tabButtons = document.querySelectorAll('[data-home-cat-tab]');
    for (var t = 0; t < tabButtons.length; t += 1) {
      if (tabButtons[t].getAttribute('data-bound') === '1') continue;
      tabButtons[t].setAttribute('data-bound', '1');
      tabButtons[t].addEventListener('click', function () {
        activeHomeCategory = this.getAttribute('data-home-cat-tab') || 'all';
        for (var j = 0; j < tabButtons.length; j += 1) {
          var isMatch = tabButtons[j] === this;
          tabButtons[j].classList.toggle('active', isMatch);
          tabButtons[j].setAttribute('aria-pressed', isMatch ? 'true' : 'false');
        }
        renderHomeFeaturedGrid(activeHomeCategory);
      });
    }

    var discountGrid = document.getElementById('discountedProductsGrid');
    if (discountGrid) {
      var discounted = products.filter(function (p) {
        return p.oldPrice && Number(p.oldPrice) > Number(p.price);
      });
      if (discounted.length === 0) {
        discountGrid.innerHTML =
          '<div class="col-12"><div class="ft-empty-state"><p class="mb-0">Одоогоор хямдралтай бараа алга байна.</p></div></div>';
      } else {
        discountGrid.innerHTML = discounted
          .slice(0, 8)
          .map(function (p) {
            return '<div class="col">' + common.renderProductCard(p) + '</div>';
          })
          .join('');
      }
    }
    common.syncCartCounter();
  }

  function renderCategoriesOverview() {
    var storage = global.FTStorage;
    var common = global.FTCommon;
    var products = storage.getProducts();
    var categories = storage.getCategories();
    var container = document.getElementById('categoriesOverviewGrid');
    if (!container) return;

    var totalEl = document.getElementById('overviewTotalProducts');
    if (totalEl) {
      totalEl.textContent = String(products.length);
    }

    container.innerHTML = categories
      .map(function (cat) {
        var catProducts = products.filter(function (p) {
          return p.category === cat.id;
        });
        var minPrice = catProducts.reduce(function (min, p) {
          var val = Number(p.price);
          return isFinite(val) && val < min ? val : min;
        }, Infinity);
        var minPriceText = isFinite(minPrice) ? storage.formatPrice(minPrice) + '-аас' : 'Мэдээлэлгүй';
        var subBadges = (cat.subCategories || [])
          .map(function (sub) {
            return '<span class="ft-spec-chip">' + common.escapeHtml(sub) + '</span>';
          })
          .join('');
        var sampleImg = catProducts.length > 0 ? common.sanitizeUrl(catProducts[0].image, '') : '';
        var safeCatUrl = common.sanitizeUrl(cat.url, 'categories.html');
        var compareHref = 'compare.html?tab=compare&cat=' + encodeURIComponent(cat.id);

        return (
          '<div class="col">' +
          '  <article class="ft-category-card">' +
          '    <div class="d-flex justify-content-between align-items-start gap-2">' +
          '      <div>' +
          '        <span class="ft-category-count mb-2">' + catProducts.length + ' бараа</span>' +
          '        <h2 class="h5 fw-bold mb-1 text-ft-primary">' + common.escapeHtml(cat.name) + '</h2>' +
          '      </div>' +
          '      <span class="small fw-bold text-ft-accent text-nowrap">' + common.escapeHtml(minPriceText) + '</span>' +
          '    </div>' +
          (sampleImg
            ? '<div class="ft-product-media rounded-3"><img src="' +
              common.escapeHtml(sampleImg) +
              '" alt="' +
              common.escapeHtml(cat.name) +
              '"></div>'
            : '') +
          '    <p class="small text-secondary mb-1">' + common.escapeHtml(cat.description) + '</p>' +
          '    <div class="ft-spec-chips mb-2">' + subBadges + '</div>' +
          '    <div class="mt-auto d-flex gap-2">' +
          '      <a href="' + common.escapeHtml(safeCatUrl) + '" class="btn btn-ft-primary btn-sm flex-grow-1">Ангилал үзэх</a>' +
          '      <a href="' + common.escapeHtml(compareHref) + '" class="btn btn-ft-outline btn-sm">Харьцуулах</a>' +
          '    </div>' +
          '  </article>' +
          '</div>'
        );
      })
      .join('');
  }

  function matchesKeyword(product, query) {
    if (!query) return true;
    var tokens = String(query)
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    if (tokens.length === 0) return true;

    var common = global.FTCommon;
    var parts = [
      product.name,
      product.brand,
      product.category,
      common.getCategoryName(product.category),
      product.subCategory,
      product.type,
      common.getTypeLabel(product.type),
      product.socket,
      product.ramType,
      product.shortDesc
    ];

    if (product.specs && typeof product.specs === 'object') {
      Object.keys(product.specs).forEach(function (k) {
        parts.push(product.specs[k]);
      });
    }

    var haystack = parts.join(' ').toLowerCase();
    return tokens.every(function (tok) {
      return haystack.indexOf(tok) !== -1;
    });
  }

  function updateRangeDisplay(val) {
    var rangeLabel = document.getElementById('filterPriceRangeValue');
    var rangeEl = document.getElementById('filterPriceRange');
    var safeVal = isFinite(Number(val)) && Number(val) >= 0 ? Number(val) : catalogState.maxAvailablePrice;
    var formatted = global.FTStorage.formatPrice(safeVal);
    if (rangeLabel) {
      rangeLabel.textContent = formatted;
    }
    if (rangeEl) {
      rangeEl.setAttribute('aria-valuetext', formatted);
    }
  }

  function populateFilterControls(productsForOptions) {
    var common = global.FTCommon;
    var storage = global.FTStorage;

    var brandCounts = {};
    var typeCounts = {};
    var catCounts = {};
    var maxPrice = 0;

    productsForOptions.forEach(function (p) {
      brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
      typeCounts[p.type] = (typeCounts[p.type] || 0) + 1;
      catCounts[p.category] = (catCounts[p.category] || 0) + 1;
      if (Number(p.price) > maxPrice) maxPrice = Number(p.price);
    });

    catalogState.maxAvailablePrice = maxPrice > 0 ? Math.ceil(maxPrice / 50000) * 50000 : 8000000;

    var brandListEl = document.getElementById('filterBrandList');
    if (brandListEl) {
      var brands = Object.keys(brandCounts).sort();
      if (brands.length === 0) {
        brandListEl.innerHTML = '<p class="small text-muted mb-0">Тохирох брэнд алга</p>';
      } else {
        brandListEl.innerHTML = brands
          .map(function (brand, idx) {
            var id = 'brandFilter_' + idx;
            return (
              '<div class="form-check mb-1">' +
              '  <input class="form-check-input" type="checkbox" name="brandFilter" value="' + common.escapeHtml(brand) + '" id="' + id + '">' +
              '  <label class="form-check-label d-flex justify-content-between w-100 small" for="' + id + '">' +
              '    <span>' + common.escapeHtml(brand) + '</span>' +
              '    <span class="text-muted">(' + brandCounts[brand] + ')</span>' +
              '  </label>' +
              '</div>'
            );
          })
          .join('');
      }
    }

    var typeWrap = document.getElementById('filterTypeGroup');
    var typeListEl = document.getElementById('filterTypeList');
    if (typeWrap && typeListEl) {
      var types = Object.keys(typeCounts);
      if (types.length <= 1) {
        typeWrap.classList.add('d-none');
        typeListEl.innerHTML = '';
      } else {
        typeWrap.classList.remove('d-none');
        typeListEl.innerHTML = types
          .map(function (t, idx) {
            var id = 'typeFilter_' + idx;
            return (
              '<div class="form-check mb-1">' +
              '  <input class="form-check-input" type="checkbox" name="typeFilter" value="' + common.escapeHtml(t) + '" id="' + id + '">' +
              '  <label class="form-check-label d-flex justify-content-between w-100 small" for="' + id + '">' +
              '    <span>' + common.escapeHtml(common.getTypeLabel(t)) + '</span>' +
              '    <span class="text-muted">(' + typeCounts[t] + ')</span>' +
              '  </label>' +
              '</div>'
            );
          })
          .join('');
      }
    }

    var catWrap = document.getElementById('filterCategoryGroup');
    var catListEl = document.getElementById('filterCategoryList');
    if (catWrap && catListEl) {
      if (productsForOptions.length === 0) {
        catWrap.classList.add('d-none');
        catListEl.innerHTML = '';
      } else {
        catWrap.classList.remove('d-none');
        var cats = storage.getCategories();
        catListEl.innerHTML = cats
          .map(function (cat, idx) {
            var id = 'catFilter_' + idx;
            var cnt = catCounts[cat.id] || 0;
            return (
              '<div class="form-check mb-1">' +
              '  <input class="form-check-input" type="checkbox" name="catFilter" value="' + common.escapeHtml(cat.id) + '" id="' + id + '"' + (cnt === 0 ? ' disabled' : '') + '>' +
              '  <label class="form-check-label d-flex justify-content-between w-100 small" for="' + id + '">' +
              '    <span>' + common.escapeHtml(cat.name) + '</span>' +
              '    <span class="text-muted">(' + cnt + ')</span>' +
              '  </label>' +
              '</div>'
            );
          })
          .join('');
      }
    }

    var rangeEl = document.getElementById('filterPriceRange');
    var maxInput = document.getElementById('filterPriceMax');
    var minInput = document.getElementById('filterPriceMin');
    var allTier = document.querySelector('input[name="priceTierFilter"][value="all"]');

    if (rangeEl) {
      rangeEl.max = String(catalogState.maxAvailablePrice);
      rangeEl.value = String(catalogState.maxAvailablePrice);
    }
    if (maxInput) {
      maxInput.placeholder = String(catalogState.maxAvailablePrice);
      maxInput.value = '';
    }
    if (minInput) {
      minInput.value = '';
    }
    if (allTier) {
      allTier.checked = true;
    }
    updateRangeDisplay(catalogState.maxAvailablePrice);
  }

  function getCheckedValues(name) {
    var boxes = document.querySelectorAll('input[name="' + name + '"]:checked');
    var vals = [];
    for (var i = 0; i < boxes.length; i += 1) {
      vals.push(boxes[i].value);
    }
    return vals;
  }

  function renderActiveFilterChips(selectedBrands, selectedTypes, selectedCategories, minPrice, maxPrice) {
    var chipsContainer = document.getElementById('activeFilterChips');
    if (!chipsContainer) return;

    var common = global.FTCommon;
    var storage = global.FTStorage;
    var chips = [];

    if (catalogState.mode === 'search' && currentSearchQuery) {
      chips.push({ kind: 'query', value: '', label: 'Хайлт: «' + currentSearchQuery + '»' });
    }
    selectedCategories.forEach(function (catId) {
      chips.push({ kind: 'cat', value: catId, label: 'Ангилал: ' + common.getCategoryName(catId) });
    });
    selectedTypes.forEach(function (typeId) {
      chips.push({ kind: 'type', value: typeId, label: 'Төрөл: ' + common.getTypeLabel(typeId) });
    });
    selectedBrands.forEach(function (brand) {
      chips.push({ kind: 'brand', value: brand, label: 'Брэнд: ' + brand });
    });
    if (minPrice !== null && isFinite(minPrice)) {
      chips.push({ kind: 'minPrice', value: '', label: 'Доод үнэ: ' + storage.formatPrice(minPrice) });
    }
    if (maxPrice !== null && isFinite(maxPrice)) {
      chips.push({ kind: 'maxPrice', value: '', label: 'Дээд үнэ: ' + storage.formatPrice(maxPrice) });
    }

    if (chips.length === 0) {
      chipsContainer.classList.add('d-none');
      chipsContainer.innerHTML = '';
      return;
    }

    chipsContainer.classList.remove('d-none');
    chipsContainer.innerHTML = chips
      .map(function (chip) {
        return (
          '<button type="button" class="ft-filter-chip" data-remove-filter="' +
          common.escapeHtml(chip.kind) +
          '" data-remove-value="' +
          common.escapeHtml(chip.value) +
          '">' +
          '  <span>' + common.escapeHtml(chip.label) + '</span>' +
          '  <span aria-hidden="true">&times;</span>' +
          '</button>'
        );
      })
      .join('');
  }

  function applyFiltersAndRender() {
    var storage = global.FTStorage;
    var common = global.FTCommon;
    var grid = document.getElementById('catalogProductsGrid');
    if (!grid) return;

    var selectedBrands = getCheckedValues('brandFilter');
    var selectedTypes = getCheckedValues('typeFilter');
    var selectedCategories = getCheckedValues('catFilter');

    var minInput = document.getElementById('filterPriceMin');
    var maxInput = document.getElementById('filterPriceMax');
    var sortSelect = document.getElementById('catalogSort');
    var priceWarningEl = document.getElementById('priceRangeWarning');

    var minPrice = parseNonNegativePrice(minInput);
    var maxPrice = parseNonNegativePrice(maxInput);

    var hasNegativeMin = Boolean(minInput && minInput.value.trim() !== '' && Number(minInput.value) < 0);
    var hasNegativeMax = Boolean(maxInput && maxInput.value.trim() !== '' && Number(maxInput.value) < 0);
    var hasInvertedPrice = minPrice !== null && maxPrice !== null && minPrice > maxPrice;

    if (priceWarningEl) {
      if (hasNegativeMin || hasNegativeMax) {
        priceWarningEl.textContent = 'Үнийн хязгаар нь 0 буюу эерэг тоо байх ёстой.';
        priceWarningEl.classList.remove('d-none');
      } else if (hasInvertedPrice) {
        priceWarningEl.textContent = 'Доод үнэ нь дээд үнээс их байна — хязгаараа шалгана уу.';
        priceWarningEl.classList.remove('d-none');
      } else {
        priceWarningEl.classList.add('d-none');
      }
    }

    var baseList = catalogState.allCandidates;
    if (catalogState.mode === 'search') {
      baseList = storage.getProducts().filter(function (p) {
        return matchesKeyword(p, currentSearchQuery);
      });
    } else if (catalogState.mode === 'category' && catalogState.category) {
      baseList = storage.getProductsByCategory(catalogState.category);
      catalogState.allCandidates = baseList;
    }

    var filtered = baseList.filter(function (p) {
      if (selectedBrands.length > 0 && selectedBrands.indexOf(p.brand) === -1) {
        return false;
      }
      if (selectedTypes.length > 0 && selectedTypes.indexOf(p.type) === -1) {
        return false;
      }
      if (selectedCategories.length > 0 && selectedCategories.indexOf(p.category) === -1) {
        return false;
      }
      if (minPrice !== null && Number(p.price) < minPrice) {
        return false;
      }
      if (maxPrice !== null && Number(p.price) > maxPrice) {
        return false;
      }
      return true;
    });

    var sortMode = sortSelect ? sortSelect.value : 'default';
    if (sortMode === 'price-asc') {
      filtered = filtered.slice().sort(function (a, b) {
        return (Number(a.price) || 0) - (Number(b.price) || 0);
      });
    } else if (sortMode === 'price-desc') {
      filtered = filtered.slice().sort(function (a, b) {
        return (Number(b.price) || 0) - (Number(a.price) || 0);
      });
    } else if (sortMode === 'name-asc') {
      filtered = filtered.slice().sort(function (a, b) {
        return String(a.name || '').localeCompare(String(b.name || ''), 'mn');
      });
    }

    var sidebarActiveCount =
      selectedBrands.length +
      selectedTypes.length +
      selectedCategories.length +
      (minPrice !== null ? 1 : 0) +
      (maxPrice !== null ? 1 : 0);

    var mobileBadge = document.getElementById('mobileFilterCountBadge');
    if (mobileBadge) {
      mobileBadge.textContent = String(sidebarActiveCount);
      mobileBadge.classList.toggle('d-none', sidebarActiveCount === 0);
    }

    var mobileApplyCount = document.getElementById('mobileApplyFilterCount');
    if (mobileApplyCount) {
      mobileApplyCount.textContent = String(filtered.length);
    }

    renderActiveFilterChips(selectedBrands, selectedTypes, selectedCategories, minPrice, maxPrice);

    var countTextEl = document.getElementById('resultsCountText');
    if (countTextEl) {
      if (catalogState.mode === 'search') {
        if (currentSearchQuery) {
          countTextEl.textContent = '«' + currentSearchQuery + '» хайлтаар ' + filtered.length + ' бараа олдлоо';
        } else {
          countTextEl.textContent = 'Бүх идэвхтэй бараа: ' + filtered.length + ' илэрц';
        }
      } else {
        countTextEl.textContent = 'Нийт ' + baseList.length + ' бараанаас ' + filtered.length + ' илэрц харуулж байна';
      }
    }

    var bannerCountEl = document.getElementById('categoryTotalBadge');
    if (bannerCountEl) {
      bannerCountEl.textContent = String(baseList.length) + ' бараа';
    }

    if (filtered.length === 0) {
      grid.className = 'row g-3';
      var showSeparateButtons = catalogState.mode === 'search' && currentSearchQuery && sidebarActiveCount > 0;
      var actionsHtml = showSeparateButtons
        ? '<div class="d-flex flex-wrap justify-content-center gap-2">' +
          '  <button type="button" class="btn btn-ft-primary" data-clear-sidebar-only>Шүүлтүүрийг цэвэрлэх</button>' +
          '  <button type="button" class="btn btn-ft-outline" data-clear-filters>Хайлтыг цэвэрлэх</button>' +
          '</div>'
        : '<button type="button" class="btn btn-ft-primary" data-clear-filters>Сонголтоо цэвэрлэх</button>';

      grid.innerHTML =
        '<div class="col-12">' +
        '  <div class="ft-empty-state" role="status">' +
        '    <h3 class="h5 fw-bold text-dark mb-2">Илэрц олдсонгүй</h3>' +
        '    <p class="text-muted small mb-3">' +
        (hasInvertedPrice
          ? 'Доод үнийн хязгаар нь дээд үнээс их байна. Үнийн хязгаараа засах эсвэл сонголтоо цэвэрлэнэ үү.'
          : 'Таны сонгосон брэнд, үнийн хязгаар эсвэл хайлтын үгэнд тохирох бараа олдсонгүй.') +
        '</p>' +
        actionsHtml +
        '  </div>' +
        '</div>';
    } else {
      grid.className = 'row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3';
      grid.innerHTML = filtered
        .map(function (p) {
          return '<div class="col">' + common.renderProductCard(p) + '</div>';
        })
        .join('');
    }

    common.syncCartCounter();
  }

  function clearSidebarInputsOnly() {
    var inputs = document.querySelectorAll(
      'input[name="brandFilter"], input[name="typeFilter"], input[name="catFilter"]'
    );
    var hadSidebarFilter = false;
    for (var i = 0; i < inputs.length; i += 1) {
      if (inputs[i].checked) hadSidebarFilter = true;
      inputs[i].checked = false;
    }

    var allTier = document.querySelector('input[name="priceTierFilter"][value="all"]');
    if (allTier) allTier.checked = true;

    var minInput = document.getElementById('filterPriceMin');
    var maxInput = document.getElementById('filterPriceMax');
    var rangeEl = document.getElementById('filterPriceRange');
    var sortSelect = document.getElementById('catalogSort');

    if (minInput && minInput.value !== '') {
      hadSidebarFilter = true;
      minInput.value = '';
    }
    if (maxInput && maxInput.value !== '') {
      hadSidebarFilter = true;
      maxInput.value = '';
    }
    if (rangeEl) {
      rangeEl.value = String(catalogState.maxAvailablePrice);
    }
    updateRangeDisplay(catalogState.maxAvailablePrice);
    if (sortSelect) {
      sortSelect.value = 'default';
    }
    return hadSidebarFilter;
  }

  function resetAllFilters(options) {
    var opts = options || {};
    var hadSidebarFilter = clearSidebarInputsOnly();

    if (catalogState.mode === 'search' && (!hadSidebarFilter || opts.forceClearQuery)) {
      applySearchQuery('');
      return;
    }

    applyFiltersAndRender();
  }

  function applySearchQuery(query) {
    currentSearchQuery = (query || '').trim();
    var pageInput = document.getElementById('searchPageInput');
    if (pageInput) pageInput.value = currentSearchQuery;

    var headerInputs = document.querySelectorAll('form[data-ft-search-form] input[name="q"]');
    for (var i = 0; i < headerInputs.length; i += 1) {
      headerInputs[i].value = currentSearchQuery;
    }

    var sortSelect = document.getElementById('catalogSort');
    if (sortSelect) {
      sortSelect.value = 'default';
    }

    if (global.history && typeof global.history.replaceState === 'function') {
      try {
        var nextUrl = 'search.html' + (currentSearchQuery ? '?q=' + encodeURIComponent(currentSearchQuery) : '');
        global.history.replaceState(null, '', nextUrl);
      } catch (err) {
        // Ignore SecurityError under restricted file:// origins
      }
    }

    var matchedBase = global.FTStorage.getProducts().filter(function (p) {
      return matchesKeyword(p, currentSearchQuery);
    });
    catalogState.allCandidates = matchedBase;
    populateFilterControls(matchedBase);
    applyFiltersAndRender();
  }

  function clearNonAllTierSelection() {
    var checkedTier = document.querySelector('input[name="priceTierFilter"]:checked');
    if (checkedTier && checkedTier.value !== 'all') {
      checkedTier.checked = false;
    }
  }

  function syncPriceAllRadioIfEmpty() {
    var minInput = document.getElementById('filterPriceMin');
    var maxInput = document.getElementById('filterPriceMax');
    var allTier = document.querySelector('input[name="priceTierFilter"][value="all"]');
    if (!minInput || !maxInput || !allTier) return;
    if (minInput.value.trim() === '' && maxInput.value.trim() === '') {
      allTier.checked = true;
    }
  }

  function removeSingleFilter(kind, value) {
    if (kind === 'query') {
      applySearchQuery('');
      return;
    }
    if (kind === 'minPrice') {
      var minInput = document.getElementById('filterPriceMin');
      if (minInput) minInput.value = '';
      clearNonAllTierSelection();
      syncPriceAllRadioIfEmpty();
    } else if (kind === 'maxPrice') {
      var maxInput = document.getElementById('filterPriceMax');
      var rangeEl = document.getElementById('filterPriceRange');
      if (maxInput) maxInput.value = '';
      if (rangeEl) rangeEl.value = String(catalogState.maxAvailablePrice);
      clearNonAllTierSelection();
      syncPriceAllRadioIfEmpty();
      updateRangeDisplay(catalogState.maxAvailablePrice);
    } else {
      var inputName = kind === 'brand' ? 'brandFilter' : kind === 'type' ? 'typeFilter' : 'catFilter';
      var boxes = document.querySelectorAll('input[name="' + inputName + '"]');
      for (var i = 0; i < boxes.length; i += 1) {
        if (boxes[i].value === value) {
          boxes[i].checked = false;
        }
      }
    }
    applyFiltersAndRender();
  }

  function applyPriceTier(tierValue) {
    var minInput = document.getElementById('filterPriceMin');
    var maxInput = document.getElementById('filterPriceMax');
    var rangeEl = document.getElementById('filterPriceRange');
    if (!minInput || !maxInput) return;

    if (tierValue === 'all') {
      minInput.value = '';
      maxInput.value = '';
      if (rangeEl) rangeEl.value = String(catalogState.maxAvailablePrice);
      updateRangeDisplay(catalogState.maxAvailablePrice);
    } else {
      var parts = tierValue.split('-');
      minInput.value = parts[0] && parts[0] !== '0' ? parts[0] : '';
      maxInput.value = parts[1] || '';
      var sliderTarget = parts[1] ? Number(parts[1]) : catalogState.maxAvailablePrice;
      var clampedSlider = Math.min(catalogState.maxAvailablePrice, Math.max(0, sliderTarget));
      if (rangeEl) rangeEl.value = String(clampedSlider);
      updateRangeDisplay(clampedSlider);
    }
  }

  function handleRangeInputChange(rawSliderValue) {
    clearNonAllTierSelection();
    var maxInput = document.getElementById('filterPriceMax');
    var val = Number(rawSliderValue);
    var safeVal = isFinite(val) && val >= 0 ? val : catalogState.maxAvailablePrice;
    if (maxInput) {
      maxInput.value = safeVal >= catalogState.maxAvailablePrice ? '' : String(safeVal);
    }
    syncPriceAllRadioIfEmpty();
    updateRangeDisplay(safeVal);
    applyFiltersAndRender();
  }

  function bindFilterEvents() {
    var filterForm = document.getElementById('catalogFilterForm');
    if (filterForm) {
      filterForm.addEventListener('change', function (event) {
        if (event.target.name === 'priceTierFilter') {
          applyPriceTier(event.target.value);
          applyFiltersAndRender();
        } else if (event.target.id === 'filterPriceRange') {
          handleRangeInputChange(event.target.value);
        } else {
          applyFiltersAndRender();
        }
      });

      filterForm.addEventListener('input', function (event) {
        if (event.target.id === 'filterPriceRange') {
          handleRangeInputChange(event.target.value);
          return;
        }
        if (event.target.id === 'filterPriceMin' || event.target.id === 'filterPriceMax') {
          clearNonAllTierSelection();
          syncPriceAllRadioIfEmpty();
          if (event.target.id === 'filterPriceMax') {
            var rangeEl = document.getElementById('filterPriceRange');
            var parsedMax = parseNonNegativePrice(event.target);
            var numVal = parsedMax !== null ? parsedMax : catalogState.maxAvailablePrice;
            var clamped = Math.min(catalogState.maxAvailablePrice, Math.max(0, numVal));
            if (rangeEl) rangeEl.value = String(clamped);
            updateRangeDisplay(clamped);
          }
          applyFiltersAndRender();
        }
      });

      filterForm.addEventListener('submit', function (event) {
        event.preventDefault();
        applyFiltersAndRender();
      });
    }

    var sortSelect = document.getElementById('catalogSort');
    if (sortSelect) {
      sortSelect.addEventListener('change', applyFiltersAndRender);
    }

    document.addEventListener('click', function (event) {
      var clearSidebarBtn = event.target.closest('[data-clear-sidebar-only]');
      if (clearSidebarBtn) {
        clearSidebarInputsOnly();
        applyFiltersAndRender();
        return;
      }

      var clearBtn = event.target.closest('[data-clear-filters]');
      if (clearBtn) {
        resetAllFilters({ forceClearQuery: true });
        return;
      }

      var removeChipBtn = event.target.closest('[data-remove-filter]');
      if (removeChipBtn) {
        removeSingleFilter(
          removeChipBtn.getAttribute('data-remove-filter'),
          removeChipBtn.getAttribute('data-remove-value')
        );
      }
    });

    var searchPageForm = document.getElementById('searchPageForm');
    if (searchPageForm) {
      searchPageForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = document.getElementById('searchPageInput');
        applySearchQuery(input ? input.value : '');
      });
    }
  }

  function initPage() {
    var mainEl = document.querySelector('main[data-page]');
    if (!mainEl) return;

    var pageType = mainEl.getAttribute('data-page');
    catalogState.mode = pageType;

    if (pageType === 'home') {
      renderHomePage();
    } else if (pageType === 'categories') {
      renderCategoriesOverview();
    } else if (pageType === 'category') {
      var categoryId = mainEl.getAttribute('data-category');
      catalogState.category = categoryId;
      catalogState.allCandidates = global.FTStorage.getProductsByCategory(categoryId);
      populateFilterControls(catalogState.allCandidates);
      bindFilterEvents();
      applyFiltersAndRender();
    } else if (pageType === 'search') {
      var params = new URLSearchParams(global.location.search);
      var q = params.get('q') || '';
      bindFilterEvents();
      applySearchQuery(q);
    }

    global.addEventListener('storage', function (event) {
      if (!event.key || event.key === global.FTStorage.KEYS.PRODUCTS) {
        if (pageType === 'home') {
          renderHomePage();
        } else if (pageType === 'categories') {
          renderCategoriesOverview();
        } else if (pageType === 'category') {
          catalogState.allCandidates = global.FTStorage.getProductsByCategory(catalogState.category);
          populateFilterControls(catalogState.allCandidates);
          applyFiltersAndRender();
        } else if (pageType === 'search') {
          applySearchQuery(currentSearchQuery);
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initPage);

  global.FTCatalog = {
    applySearchQuery: applySearchQuery,
    resetAllFilters: resetAllFilters,
    applyFiltersAndRender: applyFiltersAndRender
  };
})(window);
