(function (global) {
  'use strict';

  var currentTabName = 'builder';

  function syncSubnavForTab(tabName) {
    var mainBuilderNav = document.querySelector('.ft-nav-list a[href="compare.html"]');
    var compareNav = document.getElementById('subnavCompareLink');

    if (mainBuilderNav) {
      var isBuilder = tabName === 'builder';
      mainBuilderNav.classList.toggle('active', isBuilder);
      if (isBuilder) {
        mainBuilderNav.setAttribute('aria-current', 'page');
      } else {
        mainBuilderNav.removeAttribute('aria-current');
      }
    }

    if (compareNav) {
      var isCompare = tabName === 'compare';
      compareNav.classList.toggle('active', isCompare);
      if (isCompare) {
        compareNav.setAttribute('aria-current', 'page');
      } else {
        compareNav.removeAttribute('aria-current');
      }
    }
  }

  function activateTab(tabName) {
    currentTabName = tabName === 'compare' ? 'compare' : 'builder';
    var targetPaneId = currentTabName === 'compare' ? 'compare-pane' : 'builder-pane';
    var buttons = document.querySelectorAll('[data-ft-tab]');
    var panes = document.querySelectorAll('.ft-tab-pane');

    for (var i = 0; i < buttons.length; i += 1) {
      var btn = buttons[i];
      var isMatch = btn.getAttribute('data-ft-tab') === currentTabName;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      btn.setAttribute('tabindex', isMatch ? '0' : '-1');
    }

    for (var j = 0; j < panes.length; j += 1) {
      var pane = panes[j];
      var active = pane.id === targetPaneId;
      pane.classList.toggle('show', active);
      pane.classList.toggle('active', active);
    }

    syncSubnavForTab(currentTabName);
  }

  function updateUrlParamsForCompare() {
    if (!global.history || typeof global.history.replaceState !== 'function') return;
    var params = new URLSearchParams();
    params.set('tab', currentTabName);
    if (currentTabName === 'compare') {
      var catSel = document.getElementById('compareCategorySelect');
      var sel1 = document.getElementById('compareProduct1');
      var sel2 = document.getElementById('compareProduct2');
      if (catSel && catSel.value) params.set('cat', catSel.value);
      if (sel1 && sel1.value) params.set('p1', sel1.value);
      if (sel2 && sel2.value) params.set('p2', sel2.value);
    }
    try {
      global.history.replaceState(null, '', 'compare.html?' + params.toString());
    } catch (err) {
      // Ignore SecurityError under restricted file:// origins
    }
  }

  function initTabsFromUrl() {
    var params = new URLSearchParams(global.location.search);
    var tabParam = params.get('tab');
    var hash = global.location.hash;

    if (tabParam !== 'builder' && (tabParam === 'compare' || hash === '#compare' || params.get('p1') || params.get('cat'))) {
      activateTab('compare');
    } else {
      activateTab('builder');
    }

    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-ft-tab]'));
    buttons.forEach(function (btn, idx) {
      btn.addEventListener('click', function () {
        activateTab(this.getAttribute('data-ft-tab'));
        updateUrlParamsForCompare();
      });

      btn.addEventListener('keydown', function (event) {
        var nextIdx = null;
        if (event.key === 'ArrowRight') nextIdx = (idx + 1) % buttons.length;
        else if (event.key === 'ArrowLeft') nextIdx = (idx - 1 + buttons.length) % buttons.length;
        else if (event.key === 'Home') nextIdx = 0;
        else if (event.key === 'End') nextIdx = buttons.length - 1;

        if (nextIdx !== null) {
          event.preventDefault();
          buttons[nextIdx].focus();
          activateTab(buttons[nextIdx].getAttribute('data-ft-tab'));
          updateUrlParamsForCompare();
        }
      });
    });
  }

  /* ==================== A. PC BUILDER (Нийцэл шалгах) ==================== */
  var BUILDER_SLOTS = [
    { partType: 'cpu', selectId: 'builderCpu', previewId: 'builderCpuPreview', slotId: 'slotCpu', badgeId: 'slotCpuBadge' },
    { partType: 'motherboard', selectId: 'builderMotherboard', previewId: 'builderMotherboardPreview', slotId: 'slotMotherboard', badgeId: 'slotMotherboardBadge' },
    { partType: 'ram', selectId: 'builderRam', previewId: 'builderRamPreview', slotId: 'slotRam', badgeId: 'slotRamBadge' },
    { partType: 'gpu', selectId: 'builderGpu', previewId: 'builderGpuPreview', slotId: 'slotGpu', badgeId: 'slotGpuBadge' }
  ];

  function getPartSocket(product) {
    if (!product) return '';
    var raw = product.socket || (product.specs && product.specs.socket) || '';
    return String(raw).trim();
  }

  function getPartRamType(product) {
    if (!product) return '';
    var raw = product.ramType || product.memoryType || (product.specs && (product.specs.ramType || product.specs.memoryType)) || '';
    return String(raw).trim();
  }

  function getCartQtyMap(cart) {
    var map = {};
    (Array.isArray(cart) ? cart : []).forEach(function (item) {
      if (!item || !item.productId) return;
      map[item.productId] = (map[item.productId] || 0) + (Math.max(0, Math.floor(Number(item.qty) || 0)));
    });
    return map;
  }

  function populateBuilderSelects(selectedState) {
    var storage = global.FTStorage;
    var common = global.FTCommon;
    var parts = storage.getProductsByCategory('parts');

    var curSelected = selectedState || {};
    var activeCpu = curSelected.cpu || null;
    var activeMobo = curSelected.motherboard || null;
    var activeRam = curSelected.ram || null;

    var activeCpuSocket = getPartSocket(activeCpu);
    var activeMoboSocket = getPartSocket(activeMobo);
    var activeMoboRam = getPartRamType(activeMobo);
    var activeRamType = getPartRamType(activeRam);

    BUILDER_SLOTS.forEach(function (slot) {
      var selectEl = document.getElementById(slot.selectId);
      if (!selectEl) return;
      var previousVal = selectEl.value;

      var matching = parts.filter(function (p) {
        return p.partType === slot.partType;
      });

      var optionsHtml = '<option value="">-- Сонголт хийнэ үү --</option>';
      optionsHtml += matching
        .map(function (p) {
          var sock = getPartSocket(p);
          var ramT = getPartRamType(p);
          var meta = [];
          if (sock) meta.push(sock);
          if (ramT) meta.push(ramT);
          if (p.specs && p.specs.vramGb) meta.push(p.specs.vramGb + 'GB');

          var compatHint = '';
          if (slot.partType === 'motherboard') {
            var mismatchReasons = [];
            if (activeCpu && (!sock || !activeCpuSocket || sock !== activeCpuSocket)) mismatchReasons.push('сокет зөрнө');
            if (activeRam && (!ramT || !activeRamType || ramT !== activeRamType)) mismatchReasons.push('RAM зөрнө');
            if (mismatchReasons.length > 0) compatHint = ' · ⚠ ' + mismatchReasons.join(', ');
          } else if (slot.partType === 'cpu' && activeMobo && (!sock || !activeMoboSocket || sock !== activeMoboSocket)) {
            compatHint = ' · ⚠ сокет зөрнө';
          } else if (slot.partType === 'ram' && activeMobo && (!ramT || !activeMoboRam || ramT !== activeMoboRam)) {
            compatHint = ' · ⚠ RAM зөрнө';
          }

          var suffix = meta.length > 0 ? ' [' + meta.join('/') + ']' : '';
          return (
            '<option value="' +
            common.escapeHtml(p.id) +
            '">' +
            common.escapeHtml(p.name + suffix + ' — ' + storage.formatPrice(p.price) + compatHint) +
            '</option>'
          );
        })
        .join('');

      selectEl.innerHTML = optionsHtml;
      if (previousVal && matching.some(function (p) { return p.id === previousVal; })) {
        selectEl.value = previousVal;
      } else {
        selectEl.value = '';
      }
    });
  }

  function renderSlotPreview(slot, product, hasConflict, hasStockIssue) {
    var previewEl = document.getElementById(slot.previewId);
    var slotEl = document.getElementById(slot.slotId);
    var badgeEl = document.getElementById(slot.badgeId);
    var hasIssue = Boolean(hasConflict || hasStockIssue);

    if (slotEl) {
      slotEl.classList.toggle('is-conflict', hasIssue);
      slotEl.classList.toggle('is-ok', Boolean(product && !hasIssue));
    }

    if (badgeEl) {
      if (!product) {
        badgeEl.className = 'd-none';
        badgeEl.textContent = '';
      } else if (hasConflict) {
        badgeEl.className = 'ft-slot-status-badge is-conflict';
        badgeEl.textContent = 'Зөрчилтэй !';
      } else if (hasStockIssue) {
        badgeEl.className = 'ft-slot-status-badge is-conflict';
        badgeEl.textContent = 'Үлдэгдэлгүй';
      } else {
        badgeEl.className = 'ft-slot-status-badge is-ok';
        badgeEl.textContent = 'Нийцтэй ✓';
      }
    }

    if (!previewEl) return;

    if (!product) {
      previewEl.innerHTML = '<p class="small text-muted mb-0">Эд анги сонгоогүй байна.</p>';
      return;
    }

    var common = global.FTCommon;
    var storage = global.FTStorage;
    var sock = getPartSocket(product);
    var ramT = getPartRamType(product);
    var tags = [];
    if (sock) tags.push('Сокет: ' + sock);
    if (ramT) tags.push('RAM: ' + ramT);
    tags.push('Бэлэн: ' + Math.max(0, Math.floor(Number(product.stock) || 0)) + ' ш');

    var safeImg = common.sanitizeUrl(product.image, '');

    previewEl.innerHTML =
      '<div class="ft-slot-preview-row mt-2 pt-2 border-top">' +
      '  <img src="' + common.escapeHtml(safeImg) + '" alt="' + common.escapeHtml(product.name) + '" width="64" height="40" class="rounded border bg-white flex-shrink-0">' +
      '  <div class="ft-slot-preview-info">' +
      '    <div class="ft-slot-preview-title">' + common.escapeHtml(product.name) + '</div>' +
      '    <div class="d-flex flex-wrap gap-1 mt-1">' +
      tags
        .map(function (t) {
          return '<span class="ft-spec-chip">' + common.escapeHtml(t) + '</span>';
        })
        .join('') +
      '    </div>' +
      '  </div>' +
      '  <div class="text-end ms-auto">' +
      '    <div class="ft-slot-preview-price">' + common.escapeHtml(storage.formatPrice(product.price)) + '</div>' +
      '    <button type="button" class="btn-ft-link small mt-1" data-clear-slot="' + common.escapeHtml(slot.partType) + '">Цэвэрлэх</button>' +
      '  </div>' +
      '</div>';
  }

  function findAutoFixSuggestions(cpu, mobo, ram, cartQtyMap) {
    var parts = global.FTStorage.getProductsByCategory('parts');
    var qMap = cartQtyMap || {};
    function hasAvailableStock(p) {
      var stock = Math.max(0, Math.floor(Number(p.stock) || 0));
      var inCart = qMap[p.id] || 0;
      return stock > 0 && inCart + 1 <= stock;
    }

    var mobos = parts.filter(function (p) {
      return p.partType === 'motherboard' && hasAvailableStock(p);
    });
    var rams = parts.filter(function (p) {
      return p.partType === 'ram' && hasAvailableStock(p);
    });

    var cpuSock = getPartSocket(cpu);
    var moboSock = getPartSocket(mobo);
    var moboRam = getPartRamType(mobo);
    var ramT = getPartRamType(ram);

    if (cpu && cpuSock && ram && ramT) {
      var matchingMobo = mobos.find(function (m) {
        return getPartSocket(m) === cpuSock && getPartRamType(m) === ramT;
      });
      if (matchingMobo) {
        return { motherboard: matchingMobo.id, label: '«' + matchingMobo.name + '» эх хавтангаар тааруулах' };
      }
    }

    if (cpu && mobo && cpuSock && moboSock && cpuSock === moboSock && ram && moboRam && ramT !== moboRam) {
      var matchingRam = rams.find(function (r) {
        return getPartRamType(r) === moboRam;
      });
      if (matchingRam) {
        return { ram: matchingRam.id, label: '«' + matchingRam.name + '» (' + moboRam + ') санах ойгоор солих' };
      }
    }

    return null;
  }

  function evaluateBuilder() {
    var storage = global.FTStorage;
    var common = global.FTCommon;

    var selected = {};
    var total = 0;
    var missingLabels = [];

    var labelMap = {
      cpu: 'Процессор (CPU)',
      motherboard: 'Эх хавтан',
      ram: 'Санах ой (RAM)',
      gpu: 'График карт (GPU)'
    };

    BUILDER_SLOTS.forEach(function (slot) {
      var selectEl = document.getElementById(slot.selectId);
      var id = selectEl ? selectEl.value : '';
      var prod = id ? storage.getProductById(id, { activeOnly: true }) : null;
      if (prod && prod.partType !== slot.partType) {
        prod = null;
      }
      selected[slot.partType] = prod;
      if (prod) {
        total += Number(prod.price) || 0;
      } else {
        missingLabels.push(labelMap[slot.partType]);
      }
    });

    populateBuilderSelects(selected);

    var totalEl = document.getElementById('builderTotalPrice');
    if (totalEl) {
      totalEl.textContent = storage.formatPrice(total);
    }

    var cpu = selected.cpu;
    var mobo = selected.motherboard;
    var ram = selected.ram;
    var gpu = selected.gpu;

    var cpuSocket = getPartSocket(cpu);
    var moboSocket = getPartSocket(mobo);
    var moboRamType = getPartRamType(mobo);
    var ramType = getPartRamType(ram);

    var conflicts = [];
    var conflictSlots = { cpu: false, motherboard: false, ram: false, gpu: false };

    if (cpu && mobo) {
      if (!cpuSocket || !moboSocket) {
        conflicts.push(
          'Сокетийн мэдээлэл дутуу байна: «' +
            cpu.name +
            '» эсвэл эх хавтан «' +
            mobo.name +
            '» дээр socket талбар бүртгэгдээгүй байна.'
        );
        conflictSlots.cpu = true;
        conflictSlots.motherboard = true;
      } else if (cpuSocket !== moboSocket) {
        conflicts.push(
          'Сокетийн зөрчил: Сонгосон процессор «' +
            cpu.name +
            '» (' +
            cpuSocket +
            ') болон эх хавтан «' +
            mobo.name +
            '» (' +
            moboSocket +
            ') хоорондоо тохирохгүй байна.'
        );
        conflictSlots.cpu = true;
        conflictSlots.motherboard = true;
      }
    }

    if (ram && mobo) {
      if (!ramType || !moboRamType) {
        conflicts.push(
          'Санах ойн төрлийн мэдээлэл дутуу байна: «' +
            ram.name +
            '» эсвэл эх хавтан «' +
            mobo.name +
            '» дээр ramType талбар бүртгэгдээгүй байна.'
        );
        conflictSlots.ram = true;
        conflictSlots.motherboard = true;
      } else if (ramType !== moboRamType) {
        conflicts.push(
          'Санах ойн төрлийн зөрчил: Сонгосон санах ой «' +
            ram.name +
            '» (' +
            ramType +
            ') болон эх хавтан «' +
            mobo.name +
            '» (' +
            moboRamType +
            ' дэмжинэ) хоорондоо тохирохгүй байна.'
        );
        conflictSlots.ram = true;
        conflictSlots.motherboard = true;
      }
    }

    var stockErrors = [];
    var stockErrorSlots = { cpu: false, motherboard: false, ram: false, gpu: false };
    var cart = storage.getCart();
    var cartQtyMap = getCartQtyMap(cart);

    ['cpu', 'motherboard', 'ram', 'gpu'].forEach(function (key) {
      var item = selected[key];
      if (!item) return;
      var stock = Math.max(0, Math.floor(Number(item.stock) || 0));
      var inCart = cartQtyMap[item.id] || 0;
      if (stock <= 0) {
        stockErrors.push('«' + item.name + '» барааны үлдэгдэл дууссан байна.');
        stockErrorSlots[key] = true;
      } else if (inCart + 1 > stock) {
        stockErrors.push('«' + item.name + '» сагсанд байгаа тоо (' + inCart + ' ш) нь үлдэгдэл (' + stock + ' ш)-ээс хэтрэх тул нэмэх боломжгүй.');
        stockErrorSlots[key] = true;
      }
    });

    var allChosen = Boolean(cpu && mobo && ram && gpu);
    var isFullyValid = allChosen && conflicts.length === 0 && stockErrors.length === 0;

    BUILDER_SLOTS.forEach(function (slot) {
      var p = selected[slot.partType];
      renderSlotPreview(slot, p, conflictSlots[slot.partType], stockErrorSlots[slot.partType]);
    });

    var mobilePriceEl = document.getElementById('builderMobilePrice');
    var mobileStatusEl = document.getElementById('builderMobileStatus');
    if (mobilePriceEl) {
      mobilePriceEl.textContent = storage.formatPrice(total);
    }
    if (mobileStatusEl) {
      if (conflicts.length > 0) {
        mobileStatusEl.className = 'badge text-bg-danger';
        mobileStatusEl.textContent = 'Нийцлийн зөрчилтэй';
      } else if (stockErrors.length > 0) {
        mobileStatusEl.className = 'badge text-bg-warning';
        mobileStatusEl.textContent = 'Үлдэгдэл хүрэлцэхгүй';
      } else if (!allChosen) {
        mobileStatusEl.className = 'badge bg-light text-dark';
        mobileStatusEl.textContent = 'Дутуу (' + (4 - missingLabels.length) + '/4)';
      } else {
        mobileStatusEl.className = 'badge text-bg-success';
        mobileStatusEl.textContent = 'Нийцтэй ✓';
      }
    }

    var alertBox = document.getElementById('builderCompatAlert');
    if (alertBox) {
      if (conflicts.length > 0) {
        var fix = findAutoFixSuggestions(cpu, mobo, ram, cartQtyMap);
        var fixBtnHtml = fix
          ? '<button type="button" class="btn btn-sm btn-outline-danger mt-2" id="builderAutoFixBtn" data-fix-mobo="' +
            common.escapeHtml(fix.motherboard || '') +
            '" data-fix-ram="' +
            common.escapeHtml(fix.ram || '') +
            '">Шууд засах: ' +
            common.escapeHtml(fix.label) +
            '</button>'
          : '';
        var combinedErrors = conflicts.concat(stockErrors);

        alertBox.setAttribute('role', 'alert');
        alertBox.className = 'alert alert-danger mb-3';
        alertBox.innerHTML =
          '<h2 class="h6 fw-bold mb-2">Нийцлийн зөрчил илэрлээ!</h2>' +
          '<ul class="mb-0 ps-3 small">' +
          combinedErrors
            .map(function (msg) {
              return '<li>' + common.escapeHtml(msg) + '</li>';
            })
            .join('') +
          '</ul>' +
          fixBtnHtml;
      } else if (stockErrors.length > 0) {
        alertBox.setAttribute('role', 'alert');
        alertBox.className = 'alert alert-warning mb-3';
        alertBox.innerHTML =
          '<h2 class="h6 fw-bold mb-1">Үлдэгдэл хүрэлцэхгүй</h2>' +
          '<ul class="mb-0 ps-3 small">' +
          stockErrors
            .map(function (msg) {
              return '<li>' + common.escapeHtml(msg) + '</li>';
            })
            .join('') +
          '</ul>' +
          (!allChosen
            ? '<div class="small mt-2 mb-0">Мөн дутуу эд анги: ' + common.escapeHtml(missingLabels.join(', ')) + '.</div>'
            : '');
      } else if (!allChosen) {
        alertBox.setAttribute('role', 'status');
        alertBox.className = 'alert alert-info mb-3';
        alertBox.innerHTML =
          '<h2 class="h6 fw-semibold mb-1">Сонголтоо гүйцээнэ үү</h2>' +
          '<div class="small mb-0">Одоогоор дутуу: ' +
          common.escapeHtml(missingLabels.join(', ')) +
          '.</div>';
      } else {
        alertBox.setAttribute('role', 'status');
        alertBox.className = 'alert alert-success mb-3';
        alertBox.innerHTML =
          '<h2 class="h6 fw-bold mb-1">Бүх эд анги бүрэн нийцтэй байна!</h2>' +
          '<div class="small mb-0">«' +
          common.escapeHtml(cpu.name) +
          '» ба «' +
          common.escapeHtml(mobo.name) +
          '» (' +
          common.escapeHtml(cpuSocket) +
          ' сокет), мөн «' +
          common.escapeHtml(ram.name) +
          '» (' +
          common.escapeHtml(ramType) +
          ') хоорондоо яг таарлаа.</div>';
      }
    }

    var addAllBtn = document.getElementById('builderAddAllBtn');
    var disabledHintEl = document.getElementById('builderAddHint');
    if (addAllBtn) {
      addAllBtn.disabled = !isFullyValid;
    }
    if (disabledHintEl) {
      if (isFullyValid) {
        disabledHintEl.textContent = '4 эд анги сагсанд 1, 1 ширхгээр нэмэгдэнэ.';
      } else if (conflicts.length > 0) {
        disabledHintEl.textContent = 'Зөрчилтэй эд ангийг зассаны дараа сагсанд нэмэх боломжтой.';
      } else if (stockErrors.length > 0) {
        disabledHintEl.textContent = 'Үлдэгдлийн хязгаарлалтаас шалтгаалан товч идэвхгүй байна.';
      } else {
        disabledHintEl.textContent = '4 төрлийн эд ангиа бүрэн сонгосны дараа идэвхжинэ.';
      }
    }

    var summaryList = document.getElementById('builderSummaryList');
    if (summaryList) {
      summaryList.innerHTML = BUILDER_SLOTS.map(function (slot) {
        var prod = selected[slot.partType];
        return (
          '<li class="d-flex justify-content-between gap-2 py-1 border-bottom border-white border-opacity-10 small">' +
          '  <span class="ft-text-on-dark-muted">' + common.escapeHtml(labelMap[slot.partType]) + '</span>' +
          '  <span class="fw-semibold text-end">' +
          (prod ? common.escapeHtml(storage.formatPrice(prod.price)) : '—') +
          '</span>' +
          '</li>'
        );
      }).join('');
    }
  }

  function applyPreset(compatible) {
    var parts = global.FTStorage.getProductsByCategory('parts');
    var cpus = parts.filter(function (p) { return p.partType === 'cpu' && Number(p.stock) > 0; });
    var mobos = parts.filter(function (p) { return p.partType === 'motherboard' && Number(p.stock) > 0; });
    var rams = parts.filter(function (p) { return p.partType === 'ram' && Number(p.stock) > 0; });
    var gpus = parts.filter(function (p) { return p.partType === 'gpu' && Number(p.stock) > 0; });

    var pickedCpu = null;
    var pickedMobo = null;
    var pickedRam = null;
    var pickedGpu = gpus[0] || null;

    if (compatible) {
      for (var i = 0; i < cpus.length; i += 1) {
        var cSock = getPartSocket(cpus[i]);
        if (!cSock) continue;
        for (var j = 0; j < mobos.length; j += 1) {
          var mSock = getPartSocket(mobos[j]);
          var mRam = getPartRamType(mobos[j]);
          if (cSock !== mSock || !mRam) continue;
          for (var k = 0; k < rams.length; k += 1) {
            if (getPartRamType(rams[k]) === mRam) {
              pickedCpu = cpus[i];
              pickedMobo = mobos[j];
              pickedRam = rams[k];
              break;
            }
          }
          if (pickedMobo) break;
        }
        if (pickedMobo) break;
      }
    } else {
      for (var ci = 0; ci < cpus.length; ci += 1) {
        var ciSock = getPartSocket(cpus[ci]);
        if (!ciSock) continue;
        for (var mi = 0; mi < mobos.length; mi += 1) {
          var miSock = getPartSocket(mobos[mi]);
          var miRam = getPartRamType(mobos[mi]);
          if (ciSock !== miSock || !miRam) continue;
          for (var ri = 0; ri < rams.length; ri += 1) {
            var rType = getPartRamType(rams[ri]);
            if (rType && rType !== miRam) {
              pickedCpu = cpus[ci];
              pickedMobo = mobos[mi];
              pickedRam = rams[ri];
              break;
            }
          }
          if (pickedMobo) break;
        }
        if (pickedMobo) break;
      }
    }

    document.getElementById('builderCpu').value = pickedCpu ? pickedCpu.id : '';
    document.getElementById('builderMotherboard').value = pickedMobo ? pickedMobo.id : '';
    document.getElementById('builderRam').value = pickedRam ? pickedRam.id : '';
    document.getElementById('builderGpu').value = pickedGpu ? pickedGpu.id : '';
    evaluateBuilder();
  }

  function initBuilder() {
    populateBuilderSelects({});

    BUILDER_SLOTS.forEach(function (slot) {
      var el = document.getElementById(slot.selectId);
      if (el) {
        el.addEventListener('change', evaluateBuilder);
      }
    });

    document.addEventListener('click', function (event) {
      var clearSlotBtn = event.target.closest('[data-clear-slot]');
      if (clearSlotBtn) {
        var partType = clearSlotBtn.getAttribute('data-clear-slot');
        BUILDER_SLOTS.forEach(function (slot) {
          if (slot.partType === partType) {
            var selectEl = document.getElementById(slot.selectId);
            if (selectEl) selectEl.value = '';
          }
        });
        evaluateBuilder();
        return;
      }

      var autoFixBtn = event.target.closest('#builderAutoFixBtn');
      if (autoFixBtn) {
        var fixMobo = autoFixBtn.getAttribute('data-fix-mobo');
        var fixRam = autoFixBtn.getAttribute('data-fix-ram');
        if (fixMobo) document.getElementById('builderMotherboard').value = fixMobo;
        if (fixRam) document.getElementById('builderRam').value = fixRam;
        evaluateBuilder();
      }
    });

    var addAllBtn = document.getElementById('builderAddAllBtn');
    if (addAllBtn) {
      addAllBtn.addEventListener('click', function () {
        var items = [];
        BUILDER_SLOTS.forEach(function (slot) {
          var el = document.getElementById(slot.selectId);
          if (el && el.value) {
            items.push({ productId: el.value, qty: 1 });
          }
        });
        var res = global.FTStorage.addManyToCart(items);
        global.FTCommon.syncCartCounter();
        global.FTCommon.showToast(res.message, !res.ok);
        evaluateBuilder();
      });
    }

    var compatibleBtn = document.getElementById('presetCompatibleBtn');
    if (compatibleBtn) {
      compatibleBtn.addEventListener('click', function () {
        applyPreset(true);
      });
    }

    var conflictBtn = document.getElementById('presetConflictBtn');
    if (conflictBtn) {
      conflictBtn.addEventListener('click', function () {
        applyPreset(false);
      });
    }

    var resetBtn = document.getElementById('builderResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        BUILDER_SLOTS.forEach(function (slot) {
          var el = document.getElementById(slot.selectId);
          if (el) el.value = '';
        });
        evaluateBuilder();
      });
    }

    global.addEventListener('ft:cart-updated', evaluateBuilder);
    global.addEventListener('storage', function (event) {
      if (
        !event.key ||
        event.key === global.FTStorage.KEYS.CART ||
        event.key === global.FTStorage.KEYS.PRODUCTS
      ) {
        evaluateBuilder();
      }
    });
    evaluateBuilder();
  }

  /* ==================== B. PRODUCT COMPARE (2 бараа харьцуулах) ==================== */
  function populateCompareCategorySelect() {
    var catSelect = document.getElementById('compareCategorySelect');
    if (!catSelect) return;

    var categories = global.FTStorage.getCategories();
    catSelect.innerHTML = categories
      .map(function (c) {
        return '<option value="' + global.FTCommon.escapeHtml(c.id) + '">' + global.FTCommon.escapeHtml(c.name) + '</option>';
      })
      .join('');
  }

  function populateCompareTypeSelect(categoryId, preferredType) {
    var typeSelect = document.getElementById('compareTypeSelect');
    if (!typeSelect) return;

    var products = global.FTStorage.getProductsByCategory(categoryId);
    var uniqueTypes = [];
    products.forEach(function (p) {
      if (uniqueTypes.indexOf(p.type) === -1) {
        uniqueTypes.push(p.type);
      }
    });

    typeSelect.innerHTML = uniqueTypes
      .map(function (t) {
        return '<option value="' + global.FTCommon.escapeHtml(t) + '">' + global.FTCommon.escapeHtml(global.FTCommon.getTypeLabel(t)) + '</option>';
      })
      .join('');

    if (preferredType && uniqueTypes.indexOf(preferredType) !== -1) {
      typeSelect.value = preferredType;
    }
  }

  function populateCompareModelSelects(categoryId, typeId, p1Id, p2Id) {
    var sel1 = document.getElementById('compareProduct1');
    var sel2 = document.getElementById('compareProduct2');
    if (!sel1 || !sel2) return;

    var products = global.FTStorage.getProductsByCategory(categoryId).filter(function (p) {
      return p.type === typeId;
    });

    var optionsHtml =
      '<option value="">-- Загвар сонгох --</option>' +
      products
        .map(function (p) {
          return (
            '<option value="' +
            global.FTCommon.escapeHtml(p.id) +
            '">' +
            global.FTCommon.escapeHtml(p.name + ' (' + global.FTStorage.formatPrice(p.price) + ')') +
            '</option>'
          );
        })
        .join('');

    sel1.innerHTML = optionsHtml;
    sel2.innerHTML = optionsHtml;
    sel1.setAttribute('data-available-count', String(products.length));

    if (p1Id && products.some(function (p) { return p.id === p1Id; })) {
      sel1.value = p1Id;
    } else if (products.length > 0) {
      sel1.value = products[0].id;
    }

    if (p2Id && p2Id !== sel1.value && products.some(function (p) { return p.id === p2Id; })) {
      sel2.value = p2Id;
    } else if (products.length > 1) {
      var second = products.find(function (p) {
        return p.id !== sel1.value;
      });
      if (second) sel2.value = second.id;
    }
  }

  function renderCompareTable() {
    var container = document.getElementById('compareTableContainer');
    var sel1 = document.getElementById('compareProduct1');
    var sel2 = document.getElementById('compareProduct2');
    var diffOnlyToggle = document.getElementById('compareDiffOnly');
    if (!container || !sel1 || !sel2) return;

    var availableCount = Number(sel1.getAttribute('data-available-count') || '0');
    if (availableCount < 2) {
      container.innerHTML =
        '<div class="ft-empty-state">' +
        '  <h3 class="h6 fw-bold mb-1">Харьцуулах боломжтой загвар хүрэлцэхгүй байна</h3>' +
        '  <p class="small text-muted mb-0">Энэ төрөлд одоогоор 2-оос цөөн идэвхтэй бараа бүртгэгдсэн байна. Өөр төрөл эсвэл ангилал сонгоно уу.</p>' +
        '</div>';
      return;
    }

    var id1 = sel1.value;
    var id2 = sel2.value;

    if (!id1 || !id2) {
      container.innerHTML =
        '<div class="ft-empty-state">' +
        '  <h3 class="h6 fw-bold mb-1">Харьцуулах 2 загвараа сонгоно уу</h3>' +
        '  <p class="small text-muted mb-0">Дээрх жагсаалтаас ижил төрлийн хоёр өөр бараа сонгосноор үзүүлэлтийн хүснэгт харагдана.</p>' +
        '</div>';
      return;
    }

    if (id1 === id2) {
      container.innerHTML =
        '<div class="alert alert-warning mb-0" role="status">' +
        '  Ижил барааг өөртэй нь харьцуулах боломжгүй. Хоёр өөр загвар сонгоно уу.' +
        '</div>';
      return;
    }

    var p1 = global.FTStorage.getProductById(id1, { activeOnly: true });
    var p2 = global.FTStorage.getProductById(id2, { activeOnly: true });
    if (!p1 || !p2) {
      container.innerHTML =
        '<div class="ft-empty-state">' +
        '  <h3 class="h6 fw-bold mb-1">Загварын мэдээлэл олдсонгүй</h3>' +
        '  <p class="small text-muted mb-0">Сонгосон барааны аль нэг нь идэвхгүй эсвэл устгагдсан байна. Шинэ загвар сонгоно уу.</p>' +
        '</div>';
      return;
    }

    if (p1.type !== p2.type) {
      container.innerHTML =
        '<div class="alert alert-danger mb-0" role="alert">' +
        '  Зөвхөн ижил төрлийн барааг хооронд нь харьцуулах боломжтой.' +
        '</div>';
      return;
    }

    var common = global.FTCommon;
    var storage = global.FTStorage;
    var seed = global.FT_SEED_DATA || {};
    var schema = (seed.specSchemas && seed.specSchemas[p1.type]) || [];

    var specs1 = p1.specs || {};
    var specs2 = p2.specs || {};

    var specRows = schema.slice();
    var seenKeys = {};
    specRows.forEach(function (s) {
      seenKeys[s.key] = true;
    });

    Object.keys(specs1).concat(Object.keys(specs2)).forEach(function (k) {
      if (!seenKeys[k]) {
        seenKeys[k] = true;
        specRows.push({ key: k, label: k, unit: '' });
      }
    });

    var cartQtyMap = getCartQtyMap(storage.getCart());

    function renderHeaderCell(p) {
      var rawUrl = p.detailUrl || 'product-' + p.category + '.html?id=' + encodeURIComponent(p.id);
      var detailUrl = common.sanitizeUrl(rawUrl, 'categories.html');
      var imgUrl = common.sanitizeUrl(p.image, '');
      var stock = Math.max(0, Math.floor(Number(p.stock) || 0));
      var inCart = cartQtyMap[p.id] || 0;
      var canAdd = stock > 0 && inCart < stock;
      var btnLabel = stock <= 0
        ? 'Үлдэгдэлгүй'
        : inCart >= stock
          ? 'Дээд хязгаарт (' + inCart + ' ш)'
          : 'Сагсанд нэмэх';
      var oldPriceHtml =
        p.oldPrice && Number(p.oldPrice) > Number(p.price)
          ? '<div class="ft-price-old">' + common.escapeHtml(storage.formatPrice(p.oldPrice)) + '</div>'
          : '';
      return (
        '<th scope="col" class="text-center p-3" style="min-width: 190px;">' +
        '  <img src="' + common.escapeHtml(imgUrl) + '" alt="' + common.escapeHtml(p.name) + '" width="160" height="96" class="rounded border bg-white mb-2">' +
        '  <div class="small text-muted">' + common.escapeHtml(p.brand) + '</div>' +
        '  <div class="fw-bold mb-1"><a href="' + common.escapeHtml(detailUrl) + '">' + common.escapeHtml(p.name) + '</a></div>' +
        oldPriceHtml +
        '  <div class="ft-price-current mb-2">' + common.escapeHtml(storage.formatPrice(p.price)) + '</div>' +
        '  <div class="d-flex flex-wrap justify-content-center gap-2">' +
        '    <a href="' + common.escapeHtml(detailUrl) + '" class="btn btn-ft-outline btn-sm">Дэлгэрэнгүй</a>' +
        '    <button type="button" class="btn btn-ft-primary btn-sm" data-add-to-cart="' + common.escapeHtml(p.id) + '" data-base-label="Сагсанд нэмэх"' + (canAdd ? '' : ' disabled') + '>' +
        common.escapeHtml(btnLabel) +
        '</button>' +
        '  </div>' +
        '</th>'
      );
    }

    var diffOnly = Boolean(diffOnlyToggle && diffOnlyToggle.checked);
    var s1 = Math.max(0, Math.floor(Number(p1.stock) || 0));
    var s2 = Math.max(0, Math.floor(Number(p2.stock) || 0));

    var bodyRows = [];
    if (!diffOnly || s1 !== s2) {
      bodyRows.push(
        '<tr class="' + (s1 !== s2 ? 'ft-compare-diff' : '') + '">' +
        '  <th scope="row">Бэлэн үлдэгдэл' + (s1 !== s2 ? ' <span class="ft-diff-pill">Ялгаатай</span>' : '') + '</th>' +
        '  <td class="text-center">' + s1 + ' ширхэг</td>' +
        '  <td class="text-center">' + s2 + ' ширхэг</td>' +
        '</tr>'
      );
    }

    specRows.forEach(function (field) {
      var v1 = common.formatSpecValue(field, specs1[field.key]);
      var v2 = common.formatSpecValue(field, specs2[field.key]);
      var isDiff = v1 !== v2;
      if (diffOnly && !isDiff) {
        return;
      }
      var c1 = v1 ? common.escapeHtml(v1) : '<span class="ft-missing-spec">Мэдээлэл ороогүй</span>';
      var c2 = v2 ? common.escapeHtml(v2) : '<span class="ft-missing-spec">Мэдээлэл ороогүй</span>';
      bodyRows.push(
        '<tr class="' + (isDiff ? 'ft-compare-diff' : '') + '">' +
        '  <th scope="row">' + common.escapeHtml(field.label) + (isDiff ? ' <span class="ft-diff-pill">Ялгаатай</span>' : '') + '</th>' +
        '  <td class="text-center">' + c1 + '</td>' +
        '  <td class="text-center">' + c2 + '</td>' +
        '</tr>'
      );
    });

    if (bodyRows.length === 0) {
      bodyRows.push(
        '<tr>' +
        '  <td colspan="3" class="text-center text-muted py-4 small">Сонгосон хоёр загварын бүх үзүүлэлт ижил байна.</td>' +
        '</tr>'
      );
    }

    container.innerHTML =
      '<div class="table-responsive">' +
      '  <table class="table table-bordered align-middle mb-0 ft-compare-table">' +
      '    <thead>' +
      '      <tr>' +
      '        <th scope="col" class="p-2 p-md-3 ft-compare-spec-col">Үзүүлэлт</th>' +
      renderHeaderCell(p1) +
      renderHeaderCell(p2) +
      '      </tr>' +
      '    </thead>' +
      '    <tbody>' +
      bodyRows.join('') +
      '    </tbody>' +
      '  </table>' +
      '</div>';
    common.syncCartCounter();
  }

  function initCompare() {
    var catSelect = document.getElementById('compareCategorySelect');
    var typeSelect = document.getElementById('compareTypeSelect');
    var sel1 = document.getElementById('compareProduct1');
    var sel2 = document.getElementById('compareProduct2');
    var diffOnlyToggle = document.getElementById('compareDiffOnly');
    if (!catSelect || !typeSelect || !sel1 || !sel2) return;

    populateCompareCategorySelect();

    var params = new URLSearchParams(global.location.search);
    var p1Param = params.get('p1');
    var p2Param = params.get('p2');
    var catParam = params.get('cat');
    var initialProd = p1Param ? global.FTStorage.getProductById(p1Param, { activeOnly: true }) : null;

    var startCategory = initialProd ? initialProd.category : (catParam || 'laptop');
    var validCats = global.FTStorage.getCategories().map(function (c) { return c.id; });
    if (validCats.indexOf(startCategory) === -1) {
      startCategory = validCats[0] || 'laptop';
    }

    var startType = initialProd ? initialProd.type : null;
    catSelect.value = startCategory;

    populateCompareTypeSelect(startCategory, startType);
    populateCompareModelSelects(catSelect.value, typeSelect.value, p1Param, p2Param);
    renderCompareTable();

    catSelect.addEventListener('change', function () {
      populateCompareTypeSelect(catSelect.value, null);
      populateCompareModelSelects(catSelect.value, typeSelect.value, null, null);
      renderCompareTable();
      updateUrlParamsForCompare();
    });

    typeSelect.addEventListener('change', function () {
      populateCompareModelSelects(catSelect.value, typeSelect.value, null, null);
      renderCompareTable();
      updateUrlParamsForCompare();
    });

    sel1.addEventListener('change', function () {
      renderCompareTable();
      updateUrlParamsForCompare();
    });

    sel2.addEventListener('change', function () {
      renderCompareTable();
      updateUrlParamsForCompare();
    });

    if (diffOnlyToggle) {
      diffOnlyToggle.addEventListener('change', renderCompareTable);
    }

    global.addEventListener('storage', function (event) {
      if (!event.key || event.key === global.FTStorage.KEYS.PRODUCTS) {
        populateCompareCategorySelect();
        populateCompareTypeSelect(catSelect.value, typeSelect.value);
        populateCompareModelSelects(catSelect.value, typeSelect.value, sel1.value, sel2.value);
        renderCompareTable();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var mainEl = document.querySelector('main[data-page="compare"]');
    if (!mainEl) return;
    initTabsFromUrl();
    initBuilder();
    initCompare();
  });

  global.FTBuilderCompare = {
    activateTab: activateTab,
    evaluateBuilder: evaluateBuilder,
    renderCompareTable: renderCompareTable
  };
})(window);
