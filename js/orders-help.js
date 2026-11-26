(function () {
  'use strict';

  function getOrders() {
    if (window.FTStorage && typeof FTStorage.getOrders === 'function') {
      return FTStorage.getOrders();
    }
    try {
      var raw = localStorage.getItem('ft_orders');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function getContentItems() {
    if (window.FTStorage && typeof FTStorage.getContent === 'function') {
      return FTStorage.getContent();
    }
    try {
      var raw = localStorage.getItem('ft_content');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function formatMoney(amount) {
    if (window.FTStorage && typeof FTStorage.formatPrice === 'function') {
      return FTStorage.formatPrice(Number(amount) || 0);
    }
    return (Number(amount) || 0).toLocaleString('en-US') + ' \u20AE';
  }

  function initOrdersPage() {
    var container = document.getElementById('ordersContainer');
    var userBadge = document.getElementById('activeUserDisplay');
    if (!container) return;

    var activeUserId = sessionStorage.getItem('activeUserId');
    var esc = window.FTCommon && FTCommon.escapeHtml ? FTCommon.escapeHtml : function (v) { return String(v == null ? '' : v); };

    if (userBadge) {
      userBadge.textContent = activeUserId ? 'Хэрэглэгчийн ID: ' + activeUserId : 'Нэвтрээгүй (ID тодорхойгүй)';
    }

    if (!activeUserId) {
      container.innerHTML =
        '<div class="bg-white rounded-4 shadow-sm p-4 p-md-5 text-center">' +
          '<h2 class="h5 mb-2">Идэвхтэй хэрэглэгч олдсонгүй</h2>' +
          '<p class="text-secondary mb-4">Захиалгын түүхийг харахын тулд эхлээд нэвтэрнэ үү.</p>' +
          '<a href="auth.html" class="btn btn-ft-primary">Нэвтрэх хуудас руу очих</a>' +
        '</div>';
      return;
    }

    var allOrders = getOrders();
    var userOrders = allOrders.filter(function (ord) {
      return String(ord.userId) === String(activeUserId);
    });

    if (!userOrders.length) {
      container.innerHTML =
        '<div class="bg-white rounded-4 shadow-sm p-4 p-md-5 text-center">' +
          '<h2 class="h5 mb-2">Танд одоогоор захиалга байхгүй байна</h2>' +
          '<p class="text-secondary mb-4">Шинэ бүтээгдэхүүн сонгон захиалга үүсгээрэй.</p>' +
          '<a href="categories.html" class="btn btn-ft-primary">Бүх ангилал харах</a>' +
        '</div>';
      return;
    }

    var rowsHtml = userOrders.map(function (ord) {
      var itemsSummary = Array.isArray(ord.items)
        ? ord.items.map(function (it) {
            return esc(it.name || it.productId || 'Бараа') + ' &times; ' + esc(it.qty || 1);
          }).join('<br>')
        : '-';

      return (
        '<tr>' +
          '<td class="fw-semibold">' + esc(ord.orderId || '-') + '</td>' +
          '<td>' + esc(ord.createdAt || '-') + '</td>' +
          '<td>' + itemsSummary + '</td>' +
          '<td>' + esc(ord.paymentMethod || '-') + '</td>' +
          '<td><span class="badge text-bg-light border">' + esc(ord.paymentStatus || 'Хүлээгдэж буй') + '</span></td>' +
          '<td><span class="badge text-bg-secondary">' + esc(ord.orderStatus || 'Шинэ') + '</span></td>' +
          '<td class="text-end fw-semibold">' + esc(formatMoney(ord.total)) + '</td>' +
        '</tr>'
      );
    }).join('');

    container.innerHTML =
      '<div class="bg-white rounded-4 shadow-sm p-3 p-md-4">' +
        '<div class="table-responsive">' +
          '<table class="table align-middle mb-0">' +
            '<thead>' +
              '<tr>' +
                '<th>Захиалгын дугаар</th>' +
                '<th>Огноо</th>' +
                '<th>Бараа</th>' +
                '<th>Төлбөрийн хэлбэр</th>' +
                '<th>Төлбөрийн төлөв</th>' +
                '<th>Захиалгын төлөв</th>' +
                '<th class="text-end">Нийт дүн</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' + rowsHtml + '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';
  }

  function initHelpPage() {
    var guidesEl = document.getElementById('helpGuidesList');
    var faqEl = document.getElementById('helpFaqList');
    var newsEl = document.getElementById('helpNewsList');
    var formEl = document.getElementById('branchContactForm');
    var esc = window.FTCommon && FTCommon.escapeHtml ? FTCommon.escapeHtml : function (v) { return String(v == null ? '' : v); };
    var sanUrl = window.FTCommon && FTCommon.sanitizeUrl ? FTCommon.sanitizeUrl : function (u) { return u || '#'; };

    var published = getContentItems().filter(function (item) {
      return item && item.published === true;
    });

    function renderCards(target, items, emptyText) {
      if (!target) return;
      if (!items.length) {
        target.innerHTML = '<div class="bg-white rounded-4 shadow-sm p-4 text-secondary">' + esc(emptyText) + '</div>';
        return;
      }
      target.innerHTML = items.map(function (item) {
        var imgHtml = item.image
          ? '<img src="' + esc(sanUrl(item.image, 'help.html')) + '" alt="' + esc(item.title || 'Мэдээлэл') + '" class="img-fluid rounded-3 mb-3">'
          : '';
        return (
          '<article class="bg-white rounded-4 shadow-sm p-4 h-100">' +
            imgHtml +
            '<h3 class="h6 fw-semibold mb-2">' + esc(item.title || 'Гарчиггүй') + '</h3>' +
            '<p class="text-secondary small mb-0">' + esc(item.body || item.summary || '') + '</p>' +
          '</article>'
        );
      }).join('');
    }

    var guides = published.filter(function (i) { return i.type === 'guide' || i.category === 'guide'; });
    var faqs = published.filter(function (i) { return i.type === 'faq' || i.category === 'faq'; });
    var news = published.filter(function (i) { return i.type === 'news' || i.category === 'news'; });

    renderCards(guidesEl, guides.length ? guides : published, 'Нийтлэгдсэн заавар одоогоор алга.');
    renderCards(faqEl, faqs, 'Нийтлэгдсэн түгээмэл асуулт одоогоор алга.');
    renderCards(newsEl, news, 'Нийтлэгдсэн мэдээ одоогоор алга.');

    if (formEl) {
      formEl.addEventListener('submit', function (e) {
        e.preventDefault();
        var nameInput = document.getElementById('contactName');
        var branchInput = document.getElementById('contactBranch');
        var msgInput = document.getElementById('contactMessage');
        var statusEl = document.getElementById('contactStatus');

        if (!nameInput || !msgInput) return;
        var sender = nameInput.value.trim();
        var branch = branchInput ? branchInput.value : 'Төв салбар';
        var msg = msgInput.value.trim();

        if (!sender || !msg) {
          if (window.FTCommon && FTCommon.showToast) {
            FTCommon.showToast('Нэр болон мессежээ бүрэн бичнэ үү.', true);
          }
          return;
        }

        if (statusEl) {
          statusEl.innerHTML =
            '<div class="alert alert-success rounded-3 mt-3 mb-0">' +
              'Баярлалаа, <strong>' + esc(sender) + '</strong>! Таны хүсэлт <strong>' + esc(branch) + '</strong> салбарт бүртгэгдлээ.' +
            '</div>';
        }
        if (window.FTCommon && FTCommon.showToast) {
          FTCommon.showToast('Холбоо барих хүсэлт илгээгдлээ.', false);
        }
        formEl.reset();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (window.FTCommon && typeof FTCommon.syncCartCounter === 'function') {
      FTCommon.syncCartCounter();
    }
    initOrdersPage();
    initHelpPage();
  });
})();