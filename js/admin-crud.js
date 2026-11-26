(function () {
  'use strict';

  function esc(val) {
    if (window.FTCommon && typeof FTCommon.escapeHtml === 'function') {
      return FTCommon.escapeHtml(val);
    }
    return String(val == null ? '' : val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function sanUrl(url, fallback) {
    if (window.FTCommon && typeof FTCommon.sanitizeUrl === 'function') {
      return FTCommon.sanitizeUrl(url, fallback || '../index.html');
    }
    return url || fallback || '../index.html';
  }

  function fmtPrice(val) {
    if (window.FTStorage && typeof FTStorage.formatPrice === 'function') {
      return FTStorage.formatPrice(Number(val) || 0);
    }
    return (Number(val) || 0).toLocaleString('en-US') + ' \u20AE';
  }

  function notify(msg, isError) {
    if (window.FTCommon && typeof FTCommon.showToast === 'function') {
      FTCommon.showToast(msg, !!isError);
    } else {
      alert(msg);
    }
  }

  function isAdminAuthorized() {
    try {
      var params = new URLSearchParams(window.location.search);
      if (params.get('admin') === '1') {
        sessionStorage.setItem('ftAdminMode', 'true');
        localStorage.setItem('ft_admin_mode', 'true');
        return true;
      }
    } catch (e) {}

    var roleSession = '';
    var roleLocal = '';
    try {
      roleSession = sessionStorage.getItem('ftAdminMode') || sessionStorage.getItem('adminMode') || sessionStorage.getItem('userRole') || '';
    } catch (e) {}
    try {
      roleLocal = localStorage.getItem('ft_admin_mode') || localStorage.getItem('adminTestMode') || '';
    } catch (e) {}

    return roleSession === 'true' || roleSession === 'admin' || roleLocal === 'true' || roleLocal === 'admin';
  }

  function guardAdminPage() {
    var page = document.body.getAttribute('data-admin-page');
    if (!page) return true;
    if (!isAdminAuthorized()) {
      window.location.replace('../auth.html');
      return false;
    }
    return true;
  }

  function readJsonStorage(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJsonStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function getCategoriesList() {
    if (window.FTStorage && typeof FTStorage.getCategories === 'function') {
      return FTStorage.getCategories();
    }
    var fromStorage = readJsonStorage('ft_categories', null);
    if (Array.isArray(fromStorage) && fromStorage.length) return fromStorage;
    if (window.FT_SEED_DATA && Array.isArray(window.FT_SEED_DATA.categories)) {
      return window.FT_SEED_DATA.categories.slice();
    }
    return [
      { id: 'desktop', name: 'Суурин компьютер', description: '', url: '../category-desktop.html', subCategories: [] },
      { id: 'laptop', name: 'Зөөврийн компьютер', description: '', url: '../category-laptop.html', subCategories: [] },
      { id: 'parts', name: 'Компьютерын эд анги', description: '', url: '../category-parts.html', subCategories: [] },
      { id: 'peripherals', name: 'Дагалдах хэрэгсэл & монитор', description: '', url: '../category-peripherals.html', subCategories: [] },
      { id: 'network', name: 'Сүлжээ & бусад төхөөрөмж', description: '', url: '../category-network.html', subCategories: [] }
    ];
  }

  function saveCategoriesList(list) {
    if (window.FTStorage && typeof FTStorage.saveCategories === 'function') {
      FTStorage.saveCategories(list);
    } else {
      writeJsonStorage('ft_categories', list);
    }
  }

  function getAllProductsList() {
    if (window.FTStorage && typeof FTStorage.getProducts === 'function') {
      return FTStorage.getProducts({ includeInactive: true });
    }
    return readJsonStorage('ft_products', []);
  }

  function saveProductsList(list) {
    if (window.FTStorage && typeof FTStorage.saveProducts === 'function') {
      FTStorage.saveProducts(list);
    } else {
      writeJsonStorage('ft_products', list);
    }
  }

  function getOrdersList() {
    if (window.FTStorage && typeof FTStorage.getOrders === 'function') {
      return FTStorage.getOrders();
    }
    return readJsonStorage('ft_orders', []);
  }

  function saveOrdersList(list) {
    if (window.FTStorage && typeof FTStorage.saveOrders === 'function') {
      FTStorage.saveOrders(list);
    } else {
      writeJsonStorage('ft_orders', list);
    }
  }

  function getUsersList() {
    if (window.FTStorage && typeof FTStorage.getUsers === 'function') {
      return FTStorage.getUsers();
    }
    return readJsonStorage('ft_users', []);
  }

  function getContentList() {
    if (window.FTStorage && typeof FTStorage.getContent === 'function') {
      return FTStorage.getContent();
    }
    return readJsonStorage('ft_content', []);
  }

  function saveContentList(list) {
    if (window.FTStorage && typeof FTStorage.saveContent === 'function') {
      FTStorage.saveContent(list);
    } else {
      writeJsonStorage('ft_content', list);
    }
  }

  /* 21. admin/categories.html */
  function initCategoriesAdmin() {
    var listEl = document.getElementById('adminCategoriesList');
    if (!listEl) return;

    function render() {
      var cats = getCategoriesList();
      listEl.innerHTML = cats.map(function (cat, idx) {
        var subs = Array.isArray(cat.subCategories) ? cat.subCategories : [];
        var subBadges = subs.map(function (s, sIdx) {
          var label = typeof s === 'string' ? s : (s && s.name ? s.name : '');
          return (
            '<span class="badge text-bg-light border me-1 mb-1">' +
              esc(label) +
              ' <button type="button" class="btn-close btn-close-sm ms-1" data-del-sub="' + idx + ':' + sIdx + '" aria-label="Устгах"></button>' +
            '</span>'
          );
        }).join('');

        return (
          '<div class="ft-admin-card" data-cat-index="' + idx + '">' +
            '<div class="d-flex justify-content-between align-items-center mb-2">' +
              '<span class="badge text-bg-secondary">ID: ' + esc(cat.id) + '</span>' +
              '<span class="small text-muted">Зам: ' + esc(cat.url || '') + '</span>' +
            '</div>' +
            '<div class="row g-3 mb-3">' +
              '<div class="col-md-5">' +
                '<label for="catName_' + idx + '" class="form-label">Ангиллын нэр</label>' +
                '<input type="text" class="form-control" id="catName_' + idx + '" value="' + esc(cat.name || '') + '">' +
              '</div>' +
              '<div class="col-md-7">' +
                '<label for="catDesc_' + idx + '" class="form-label">Тайлбар</label>' +
                '<input type="text" class="form-control" id="catDesc_' + idx + '" value="' + esc(cat.description || '') + '">' +
              '</div>' +
            '</div>' +
            '<div class="mb-2"><strong class="small">Дэд ангиллууд:</strong><div class="mt-1">' + (subBadges || '<span class="text-muted small">Байхгүй</span>') + '</div></div>' +
            '<div class="input-group input-group-sm mb-3" style="max-width: 360px;">' +
              '<label for="newSub_' + idx + '" class="visually-hidden">Шинэ дэд ангилал</label>' +
              '<input type="text" class="form-control" id="newSub_' + idx + '" placeholder="Шинэ дэд ангиллын нэр">' +
              '<button type="button" class="btn btn-ft-outline" data-add-sub="' + idx + '">Дэд ангилал нэмэх</button>' +
            '</div>' +
            '<button type="button" class="btn btn-ft-primary btn-sm" data-save-cat="' + idx + '">Хадгалах</button>' +
          '</div>'
        );
      }).join('');
    }

    listEl.addEventListener('click', function (e) {
      var cats = getCategoriesList();
      var saveBtn = e.target.closest('[data-save-cat]');
      if (saveBtn) {
        var i = Number(saveBtn.getAttribute('data-save-cat'));
        var nameInput = document.getElementById('catName_' + i);
        var descInput = document.getElementById('catDesc_' + i);
        if (cats[i] && nameInput && descInput) {
          cats[i].name = nameInput.value.trim() || cats[i].name;
          cats[i].description = descInput.value.trim();
          saveCategoriesList(cats);
          notify('Ангиллын мэдээлэл хадгалагдлаа.', false);
          render();
        }
        return;
      }

      var addSubBtn = e.target.closest('[data-add-sub]');
      if (addSubBtn) {
        var ci = Number(addSubBtn.getAttribute('data-add-sub'));
        var subInput = document.getElementById('newSub_' + ci);
        var val = subInput ? subInput.value.trim() : '';
        if (!val) {
          notify('Дэд ангиллын нэр оруулна уу.', true);
          return;
        }
        if (cats[ci]) {
          if (!Array.isArray(cats[ci].subCategories)) cats[ci].subCategories = [];
          cats[ci].subCategories.push(val);
          saveCategoriesList(cats);
          notify('Дэд ангилал нэмэгдлээ.', false);
          render();
        }
        return;
      }

      var delSubBtn = e.target.closest('[data-del-sub]');
      if (delSubBtn) {
        var parts = delSubBtn.getAttribute('data-del-sub').split(':');
        var cIdx = Number(parts[0]);
        var sIdx = Number(parts[1]);
        if (cats[cIdx] && Array.isArray(cats[cIdx].subCategories)) {
          cats[cIdx].subCategories.splice(sIdx, 1);
          saveCategoriesList(cats);
          notify('Дэд ангилал хасагдлаа.', false);
          render();
        }
      }
    });

    render();
  }

  /* 22. admin/products.html */
  function initProductsAdmin() {
    var formEl = document.getElementById('productForm');
    var tableBody = document.getElementById('adminProductsBody');
    var resetBtn = document.getElementById('resetProductFormBtn');
    if (!formEl || !tableBody) return;

    function renderTable() {
      var products = getAllProductsList();
      if (!products.length) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-secondary py-4">Бараа олдсонгүй.</td></tr>';
        return;
      }

      tableBody.innerHTML = products.map(function (p) {
        var isActive = p.active !== false;
        return (
          '<tr>' +
            '<td><img src="' + esc(sanUrl(p.image, '../categories.html')) + '" alt="' + esc(p.name || 'Бараа') + '" class="ft-admin-thumb"></td>' +
            '<td><div class="fw-semibold">' + esc(p.name || '') + '</div><div class="small text-muted">' + esc(p.id || '') + ' &middot; ' + esc(p.brand || '') + '</div></td>' +
            '<td>' + esc(p.category || '') + '</td>' +
            '<td class="fw-semibold">' + esc(fmtPrice(p.price)) + '</td>' +
            '<td>' + esc(p.stock != null ? p.stock : 0) + '</td>' +
            '<td>' + (isActive ? '<span class="badge text-bg-success">Идэвхтэй</span>' : '<span class="badge text-bg-secondary">Идэвхгүй</span>') + '</td>' +
            '<td class="text-end text-nowrap">' +
              '<button type="button" class="btn btn-ft-outline btn-sm me-1" data-edit-prod="' + esc(p.id) + '">Засах</button>' +
              (isActive
                ? '<button type="button" class="btn btn-outline-danger btn-sm" data-deactivate-prod="' + esc(p.id) + '">Идэвхгүй болгох</button>'
                : '<button type="button" class="btn btn-ft-outline btn-sm" data-activate-prod="' + esc(p.id) + '">Идэвхжүүлэх</button>') +
            '</td>' +
          '</tr>'
        );
      }).join('');
    }

    function clearForm() {
      document.getElementById('prodEditId').value = '';
      document.getElementById('prodName').value = '';
      document.getElementById('prodCategory').value = 'desktop';
      document.getElementById('prodBrand').value = '';
      document.getElementById('prodPrice').value = '';
      document.getElementById('prodStock').value = '10';
      document.getElementById('prodImage').value = '';
      document.getElementById('prodDesc').value = '';
      document.getElementById('prodActive').checked = true;
    }

    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      var editId = document.getElementById('prodEditId').value.trim();
      var name = document.getElementById('prodName').value.trim();
      var category = document.getElementById('prodCategory').value;
      var brand = document.getElementById('prodBrand').value.trim();
      var price = Number(document.getElementById('prodPrice').value) || 0;
      var stock = Math.max(0, parseInt(document.getElementById('prodStock').value, 10) || 0);
      var image = document.getElementById('prodImage').value.trim();
      var shortDesc = document.getElementById('prodDesc').value.trim();
      var active = !!document.getElementById('prodActive').checked;

      if (!name) {
        notify('Барааны нэрийг оруулна уу.', true);
        return;
      }

      var products = getAllProductsList();
      if (editId) {
        var idx = products.findIndex(function (item) { return String(item.id) === editId; });
        if (idx !== -1) {
          products[idx].name = name;
          products[idx].category = category;
          products[idx].brand = brand;
          products[idx].price = price;
          products[idx].stock = stock;
          products[idx].image = image;
          products[idx].shortDesc = shortDesc;
          products[idx].active = active;
          saveProductsList(products);
          notify('Бараа шинэчлэгдлээ.', false);
        }
      } else {
        var newId = category.slice(0, 4) + '-' + Date.now();
        products.unshift({
          id: newId,
          name: name,
          category: category,
          type: category,
          brand: brand || 'FUTURE/TECH',
          price: price,
          oldPrice: null,
          stock: stock,
          active: active,
          featured: false,
          image: image,
          detailUrl: 'product-' + category + '.html?id=' + encodeURIComponent(newId),
          shortDesc: shortDesc,
          specs: {}
        });
        saveProductsList(products);
        notify('Шинэ бараа нэмэгдлээ.', false);
      }

      clearForm();
      renderTable();
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', clearForm);
    }

    tableBody.addEventListener('click', function (e) {
      var products = getAllProductsList();
      var editBtn = e.target.closest('[data-edit-prod]');
      if (editBtn) {
        var id = editBtn.getAttribute('data-edit-prod');
        var found = products.find(function (p) { return String(p.id) === id; });
        if (found) {
          document.getElementById('prodEditId').value = found.id;
          document.getElementById('prodName').value = found.name || '';
          document.getElementById('prodCategory').value = found.category || 'desktop';
          document.getElementById('prodBrand').value = found.brand || '';
          document.getElementById('prodPrice').value = found.price != null ? found.price : '';
          document.getElementById('prodStock').value = found.stock != null ? found.stock : 0;
          document.getElementById('prodImage').value = found.image || '';
          document.getElementById('prodDesc').value = found.shortDesc || '';
          document.getElementById('prodActive').checked = found.active !== false;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      var deactBtn = e.target.closest('[data-deactivate-prod]');
      if (deactBtn) {
        var dId = deactBtn.getAttribute('data-deactivate-prod');
        var updated = products.map(function (p) {
          if (String(p.id) === dId) {
            return Object.assign({}, p, { active: false });
          }
          return p;
        });
        saveProductsList(updated);
        notify('Бараа active: false болж каталогоос нуугдлаа.', false);
        renderTable();
        return;
      }

      var actBtn = e.target.closest('[data-activate-prod]');
      if (actBtn) {
        var aId = actBtn.getAttribute('data-activate-prod');
        var reAct = products.map(function (p) {
          if (String(p.id) === aId) {
            return Object.assign({}, p, { active: true });
          }
          return p;
        });
        saveProductsList(reAct);
        notify('Бараа идэвхжлээ.', false);
        renderTable();
      }
    });

    renderTable();
  }

  /* 23. admin/orders.html */
  function initOrdersAdmin() {
    var searchInput = document.getElementById('orderSearchInput');
    var bodyEl = document.getElementById('adminOrdersBody');
    if (!bodyEl) return;

    function nextOrderStatus(current) {
      if (current === 'Шинэ') return 'Бэлтгэж буй';
      if (current === 'Бэлтгэж буй') return 'Хүргэгдсэн';
      return null;
    }

    function render() {
      var q = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var orders = getOrdersList().filter(function (o) {
        if (!q) return true;
        return String(o.orderId || '').toLowerCase().indexOf(q) !== -1;
      });

      if (!orders.length) {
        bodyEl.innerHTML = '<tr><td colspan="6" class="text-center text-secondary py-4">Захиалга олдсонгүй.</td></tr>';
        return;
      }

      bodyEl.innerHTML = orders.map(function (o) {
        var status = o.orderStatus || 'Шинэ';
        var payStatus = o.paymentStatus || 'Хүлээгдэж буй';
        var nextSt = nextOrderStatus(status);
        var canAdvance = !!nextSt && !(status === 'Шинэ' && payStatus !== 'Төлөгдсөн');

        var actionHtml = '<span class="text-muted small">Дууссан</span>';
        if (nextSt) {
          if (status === 'Шинэ' && payStatus !== 'Төлөгдсөн') {
            actionHtml = '<span class="text-danger small">Төлбөр төлөгдөөгүй</span>';
          } else {
            actionHtml =
              '<button type="button" class="btn btn-ft-primary btn-sm" data-advance-order="' + esc(o.orderId) + '"' +
              (canAdvance ? '' : ' disabled') + '>' +
              esc(nextSt) + ' болгох</button>';
          }
        }

        return (
          '<tr>' +
            '<td class="fw-semibold">' + esc(o.orderId || '') + '</td>' +
            '<td>' + esc(o.userId || '-') + '</td>' +
            '<td><span class="badge text-bg-light border">' + esc(payStatus) + '</span></td>' +
            '<td><span class="badge text-bg-secondary">' + esc(status) + '</span></td>' +
            '<td class="fw-semibold">' + esc(fmtPrice(o.total)) + '</td>' +
            '<td class="text-end">' + actionHtml + '</td>' +
          '</tr>'
        );
      }).join('');
    }

    if (searchInput) {
      searchInput.addEventListener('input', render);
    }

    bodyEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-advance-order]');
      if (!btn) return;
      var orderId = btn.getAttribute('data-advance-order');
      var orders = getOrdersList();
      var idx = orders.findIndex(function (o) { return String(o.orderId) === orderId; });
      if (idx === -1) return;

      var cur = orders[idx].orderStatus || 'Шинэ';
      var pay = orders[idx].paymentStatus || 'Хүлээгдэж буй';
      var nxt = nextOrderStatus(cur);

      if (!nxt) return;
      if (cur === 'Шинэ' && pay !== 'Төлөгдсөн') {
        notify('Зөвхөн paymentStatus === "Төлөгдсөн" үед бэлтгэж эхэлнэ.', true);
        return;
      }

      orders[idx].orderStatus = nxt;
      saveOrdersList(orders);
      notify('Захиалгын төлөв "' + nxt + '" боллоо.', false);
      render();
    });

    render();
  }

  /* 24. admin/payments.html */
  function initPaymentsAdmin() {
    var bodyEl = document.getElementById('adminPaymentsBody');
    if (!bodyEl) return;

    function render() {
      var orders = getOrdersList();
      if (!orders.length) {
        bodyEl.innerHTML = '<tr><td colspan="6" class="text-center text-secondary py-4">Төлбөрийн бүртгэл олдсонгүй.</td></tr>';
        return;
      }

      bodyEl.innerHTML = orders.map(function (o) {
        var payStatus = o.paymentStatus || 'Хүлээгдэж буй';
        var isPaid = payStatus === 'Төлөгдсөн';
        return (
          '<tr>' +
            '<td class="fw-semibold">' + esc(o.orderId || '') + '</td>' +
            '<td>' + esc(o.paymentMethod || '-') + '</td>' +
            '<td class="fw-semibold">' + esc(fmtPrice(o.total)) + '</td>' +
            '<td>' + (isPaid ? '<span class="badge text-bg-success">Төлөгдсөн</span>' : '<span class="badge text-bg-warning">Хүлээгдэж буй</span>') + '</td>' +
            '<td>' + esc(o.orderStatus || 'Шинэ') + '</td>' +
            '<td class="text-end">' +
              (isPaid
                ? '<span class="text-muted small">Баталгаажсан</span>'
                : '<button type="button" class="btn btn-ft-primary btn-sm" data-confirm-pay="' + esc(o.orderId) + '">Туршилтын төлбөр баталгаажуулах</button>') +
            '</td>' +
          '</tr>'
        );
      }).join('');
    }

    bodyEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-confirm-pay]');
      if (!btn) return;
      var orderId = btn.getAttribute('data-confirm-pay');
      var orders = getOrdersList();
      var idx = orders.findIndex(function (o) { return String(o.orderId) === orderId; });
      if (idx === -1) return;

      orders[idx].paymentStatus = 'Төлөгдсөн';
      saveOrdersList(orders);
      notify('Захиалга ' + orderId + ' төлөв "Төлөгдсөн" боллоо.', false);
      render();
    });

    render();
  }

  /* 25. admin/customers.html */
  function initCustomersAdmin() {
    var bodyEl = document.getElementById('adminCustomersBody');
    if (!bodyEl) return;

    var users = getUsersList();
    if (!users.length) {
      bodyEl.innerHTML = '<tr><td colspan="4" class="text-center text-secondary py-4">Хэрэглэгч бүртгэгдээгүй байна.</td></tr>';
      return;
    }

    bodyEl.innerHTML = users.map(function (u) {
      var fullName = u.name || u.fullName || ((u.lastName || '') + ' ' + (u.firstName || '')).trim() || '-';
      return (
        '<tr>' +
          '<td class="fw-semibold">' + esc(u.id || u.userId || '-') + '</td>' +
          '<td>' + esc(fullName) + '</td>' +
          '<td>' + esc(u.email || '-') + '</td>' +
          '<td>' + esc(u.phone || '-') + '</td>' +
        '</tr>'
      );
    }).join('');
  }

  /* 26. admin/content.html */
  function initContentAdmin() {
    var formEl = document.getElementById('contentForm');
    var bodyEl = document.getElementById('adminContentBody');
    var clearBtn = document.getElementById('clearContentFormBtn');
    if (!formEl || !bodyEl) return;

    function render() {
      var items = getContentList();
      if (!items.length) {
        bodyEl.innerHTML = '<tr><td colspan="4" class="text-center text-secondary py-4">Контент олдсонгүй.</td></tr>';
        return;
      }

      bodyEl.innerHTML = items.map(function (item, idx) {
        var pub = item.published === true;
        return (
          '<tr>' +
            '<td><span class="badge text-bg-light border">' + esc(item.type || 'guide') + '</span></td>' +
            '<td><div class="fw-semibold">' + esc(item.title || '') + '</div><div class="small text-secondary">' + esc(item.body || '') + '</div></td>' +
            '<td>' + (pub ? '<span class="badge text-bg-success">published: true</span>' : '<span class="badge text-bg-secondary">published: false</span>') + '</td>' +
            '<td class="text-end text-nowrap">' +
              '<button type="button" class="btn btn-ft-outline btn-sm me-1" data-edit-content="' + idx + '">Засах</button>' +
              '<button type="button" class="btn btn-ft-primary btn-sm" data-toggle-pub="' + idx + '">' + (pub ? 'Нуух' : 'Нийтлэх') + '</button>' +
            '</td>' +
          '</tr>'
        );
      }).join('');
    }

    function clearForm() {
      document.getElementById('contentEditIndex').value = '';
      document.getElementById('contentType').value = 'guide';
      document.getElementById('contentTitle').value = '';
      document.getElementById('contentBody').value = '';
      document.getElementById('contentPublished').checked = true;
    }

    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      var editIdx = document.getElementById('contentEditIndex').value;
      var type = document.getElementById('contentType').value;
      var title = document.getElementById('contentTitle').value.trim();
      var body = document.getElementById('contentBody').value.trim();
      var published = !!document.getElementById('contentPublished').checked;

      if (!title || !body) {
        notify('Гарчиг болон агуулгыг бүрэн бичнэ үү.', true);
        return;
      }

      var items = getContentList();
      if (editIdx !== '' && items[Number(editIdx)]) {
        var i = Number(editIdx);
        items[i].type = type;
        items[i].title = title;
        items[i].body = body;
        items[i].published = published;
        notify('Контент шинэчлэгдлээ.', false);
      } else {
        items.push({
          id: 'cnt-' + Date.now(),
          type: type,
          title: title,
          body: body,
          published: published
        });
        notify('Шинэ контент нэмэгдлээ.', false);
      }

      saveContentList(items);
      clearForm();
      render();
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', clearForm);
    }

    bodyEl.addEventListener('click', function (e) {
      var items = getContentList();
      var editBtn = e.target.closest('[data-edit-content]');
      if (editBtn) {
        var idx = Number(editBtn.getAttribute('data-edit-content'));
        var target = items[idx];
        if (target) {
          document.getElementById('contentEditIndex').value = String(idx);
          document.getElementById('contentType').value = target.type || 'guide';
          document.getElementById('contentTitle').value = target.title || '';
          document.getElementById('contentBody').value = target.body || '';
          document.getElementById('contentPublished').checked = target.published === true;
        }
        return;
      }

      var pubBtn = e.target.closest('[data-toggle-pub]');
      if (pubBtn) {
        var pIdx = Number(pubBtn.getAttribute('data-toggle-pub'));
        if (items[pIdx]) {
          items[pIdx].published = !(items[pIdx].published === true);
          saveContentList(items);
          notify('Нийтлэх төлөв солигдлоо.', false);
          render();
        }
      }
    });

    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!guardAdminPage()) return;
    if (window.FTCommon && typeof FTCommon.syncCartCounter === 'function') {
      FTCommon.syncCartCounter();
    }
    initCategoriesAdmin();
    initProductsAdmin();
    initOrdersAdmin();
    initPaymentsAdmin();
    initCustomersAdmin();
    initContentAdmin();
  });
})();