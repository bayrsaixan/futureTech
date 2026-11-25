(function (global) {
  'use strict';

  var STORAGE_KEYS = {
    PRODUCTS: 'ft_products',
    CART: 'ft_cart',
    CATEGORIES: 'ft_categories',
    ORDERS: 'ft_orders',
    USERS: 'ft_users',
    CONTENT: 'ft_content'
  };

  var memoryStore = {};

  function getSeed() {
    return global.FT_SEED_DATA || {
      categories: [],
      products: [],
      users: [],
      orders: [],
      content: [],
      typeLabels: {},
      specSchemas: {}
    };
  }

  function cloneValue(val) {
    try {
      return JSON.parse(JSON.stringify(val));
    } catch (err) {
      return val;
    }
  }

  function readJSON(key, fallback) {
    try {
      var raw = global.localStorage.getItem(key);
      if (raw !== null && raw !== '') {
        var parsed = JSON.parse(raw);
        memoryStore[key] = parsed;
        return parsed;
      }
    } catch (err) {
      if (Object.prototype.hasOwnProperty.call(memoryStore, key)) {
        return cloneValue(memoryStore[key]);
      }
      return fallback;
    }
    if (Object.prototype.hasOwnProperty.call(memoryStore, key)) {
      return cloneValue(memoryStore[key]);
    }
    return fallback;
  }

  function writeJSON(key, value) {
    memoryStore[key] = cloneValue(value);
    try {
      global.localStorage.setItem(key, JSON.stringify(value));
      return { ok: true, error: null };
    } catch (err) {
      return { ok: false, error: err && err.message ? err.message : 'Хадгалах үед алдаа гарлаа' };
    }
  }

  function isValidProduct(item) {
    return Boolean(item && typeof item === 'object' && typeof item.id === 'string' && item.id !== '');
  }

  function normalizeCartItems(rawList) {
    var map = {};
    var order = [];
    (Array.isArray(rawList) ? rawList : []).forEach(function (item) {
      if (!item || typeof item !== 'object' || typeof item.productId !== 'string' || !item.productId) {
        return;
      }
      var q = Math.floor(Number(item.qty));
      if (!isFinite(q) || q <= 0) {
        return;
      }
      if (!Object.prototype.hasOwnProperty.call(map, item.productId)) {
        map[item.productId] = 0;
        order.push(item.productId);
      }
      map[item.productId] += q;
    });
    return order.map(function (id) {
      return { productId: id, qty: map[id] };
    });
  }

  function ensureSeeded() {
    var seed = getSeed();

    var existingProducts = readJSON(STORAGE_KEYS.PRODUCTS, null);
    var validProducts = Array.isArray(existingProducts) ? existingProducts.filter(isValidProduct) : [];
    if (validProducts.length === 0) {
      writeJSON(STORAGE_KEYS.PRODUCTS, seed.products);
    }

    var existingCategories = readJSON(STORAGE_KEYS.CATEGORIES, null);
    if (!Array.isArray(existingCategories) || existingCategories.length === 0) {
      writeJSON(STORAGE_KEYS.CATEGORIES, seed.categories);
    }

    var existingCart = readJSON(STORAGE_KEYS.CART, null);
    if (!Array.isArray(existingCart)) {
      writeJSON(STORAGE_KEYS.CART, []);
    }

    var existingUsers = readJSON(STORAGE_KEYS.USERS, null);
    if (!Array.isArray(existingUsers) || existingUsers.length === 0) {
      writeJSON(STORAGE_KEYS.USERS, seed.users);
    }

    var existingOrders = readJSON(STORAGE_KEYS.ORDERS, null);
    if (!Array.isArray(existingOrders)) {
      writeJSON(STORAGE_KEYS.ORDERS, seed.orders);
    }

    var existingContent = readJSON(STORAGE_KEYS.CONTENT, null);
    if (!Array.isArray(existingContent) || existingContent.length === 0) {
      writeJSON(STORAGE_KEYS.CONTENT, seed.content);
    }
  }

  function resetToSeed() {
    var seed = getSeed();
    writeJSON(STORAGE_KEYS.PRODUCTS, seed.products);
    writeJSON(STORAGE_KEYS.CATEGORIES, seed.categories);
    writeJSON(STORAGE_KEYS.CART, []);
    writeJSON(STORAGE_KEYS.USERS, seed.users);
    writeJSON(STORAGE_KEYS.ORDERS, seed.orders);
    writeJSON(STORAGE_KEYS.CONTENT, seed.content);
    emitCartUpdated([]);
  }

  function getProducts(options) {
    ensureSeeded();
    var opts = options || {};
    var list = readJSON(STORAGE_KEYS.PRODUCTS, []);
    var validList = Array.isArray(list) ? list.filter(isValidProduct) : [];
    if (validList.length === 0 && Array.isArray(getSeed().products) && getSeed().products.length > 0) {
      validList = getSeed().products.filter(isValidProduct);
    }
    if (opts.includeInactive) {
      return validList;
    }
    return validList.filter(function (item) {
      return item.active !== false;
    });
  }

  function saveProducts(productsList) {
    var safeList = Array.isArray(productsList) ? productsList.filter(isValidProduct) : [];
    return writeJSON(STORAGE_KEYS.PRODUCTS, safeList);
  }

  function getProductById(productId, options) {
    if (typeof productId !== 'string' || !productId) {
      return null;
    }
    var includeInactive = !(options && options.activeOnly);
    var list = getProducts({ includeInactive: includeInactive });
    for (var i = 0; i < list.length; i += 1) {
      if (list[i].id === productId) {
        return list[i];
      }
    }
    return null;
  }

  function getProductsByCategory(categoryId) {
    return getProducts({ includeInactive: false }).filter(function (p) {
      return p.category === categoryId;
    });
  }

  function getCategories() {
    ensureSeeded();
    var list = readJSON(STORAGE_KEYS.CATEGORIES, []);
    var valid = Array.isArray(list) ? list.filter(function (c) { return c && typeof c.id === 'string'; }) : [];
    return valid.length > 0 ? valid : getSeed().categories;
  }

  function getCart() {
    ensureSeeded();
    var raw = readJSON(STORAGE_KEYS.CART, []);
    return normalizeCartItems(raw);
  }

  function getCartCount(cartList) {
    var cart = Array.isArray(cartList) ? normalizeCartItems(cartList) : getCart();
    return cart.reduce(function (sum, item) {
      return sum + item.qty;
    }, 0);
  }

  function emitCartUpdated(cart) {
    var count = getCartCount(cart);
    try {
      global.dispatchEvent(
        new CustomEvent('ft:cart-updated', {
          detail: { cart: cart, count: count }
        })
      );
    } catch (err) {
      // CustomEvent fallback шаардлагагүй
    }
  }

  function saveCart(cart) {
    var normalized = normalizeCartItems(cart);
    var result = writeJSON(STORAGE_KEYS.CART, normalized);
    if (result.ok || Object.prototype.hasOwnProperty.call(memoryStore, STORAGE_KEYS.CART)) {
      emitCartUpdated(normalized);
    }
    return result;
  }

  function addToCart(productId, qty) {
    var rawNum = qty === undefined ? 1 : Number(qty);
    var addQty = Math.floor(rawNum);
    if (!isFinite(rawNum) || addQty <= 0) {
      return {
        ok: false,
        message: 'Барааны тоо ширхэг 1 буюу түүнээс их байх ёстой.'
      };
    }

    var product = getProductById(productId, { activeOnly: true });
    if (!product) {
      return {
        ok: false,
        message: 'Уучлаарай, энэ бараа одоогоор боломжгүй байна.'
      };
    }

    var stock = Math.max(0, Math.floor(Number(product.stock) || 0));
    if (stock <= 0) {
      return {
        ok: false,
        product: product,
        message: product.name + ' барааны үлдэгдэл дууссан байна.'
      };
    }

    var cart = getCart();
    var existing = null;
    for (var i = 0; i < cart.length; i += 1) {
      if (cart[i].productId === productId) {
        existing = cart[i];
        break;
      }
    }

    var currentQty = existing ? existing.qty : 0;
    if (currentQty >= stock) {
      return {
        ok: false,
        capped: true,
        product: product,
        qtyInCart: currentQty,
        message: product.name + ' бараанаас сагсанд хамгийн ихдээ ' + stock + ' ширхгийг нэмэх боломжтой.'
      };
    }

    var nextQty = Math.min(stock, currentQty + addQty);
    var capped = nextQty < currentQty + addQty;

    if (existing) {
      existing.qty = nextQty;
    } else {
      cart.push({ productId: productId, qty: nextQty });
    }

    var saveResult = saveCart(cart);
    var inMemoryFallback = !saveResult.ok && Object.prototype.hasOwnProperty.call(memoryStore, STORAGE_KEYS.CART);
    if (!saveResult.ok && !inMemoryFallback) {
      return {
        ok: false,
        message: 'Сагсны мэдээллийг хадгалж чадсангүй.'
      };
    }

    return {
      ok: true,
      capped: capped,
      product: product,
      qtyInCart: nextQty,
      addedQty: nextQty - currentQty,
      count: getCartCount(cart),
      message: capped
        ? product.name + ' бараа үлдэгдлийн хязгаараар (' + nextQty + ' ш) шинэчлэгдлээ.'
        : '«' + product.name + '» сагсанд нэмэгдлээ.'
    };
  }

  function addManyToCart(items) {
    if (!Array.isArray(items) || items.length === 0) {
      return { ok: false, message: 'Нэмэх бараа сонгогдоогүй байна.' };
    }

    var cart = getCart();
    var nextCart = cart.map(function (c) {
      return { productId: c.productId, qty: c.qty };
    });

    for (var i = 0; i < items.length; i += 1) {
      var entry = items[i];
      if (!entry || typeof entry !== 'object' || typeof entry.productId !== 'string' || !entry.productId) {
        return { ok: false, message: 'Барааны мэдээлэл дутуу эсвэл буруу байна.' };
      }

      var rawReq = entry.qty === undefined ? 1 : Number(entry.qty);
      var reqQty = Math.floor(rawReq);
      if (!isFinite(rawReq) || reqQty <= 0) {
        return { ok: false, message: 'Барааны тоо ширхэг буруу байна.' };
      }

      var product = getProductById(entry.productId, { activeOnly: true });
      if (!product) {
        return { ok: false, message: 'Сонгосон барааны нэг нь идэвхгүй байна.' };
      }

      var stock = Math.max(0, Math.floor(Number(product.stock) || 0));
      var found = null;
      for (var j = 0; j < nextCart.length; j += 1) {
        if (nextCart[j].productId === product.id) {
          found = nextCart[j];
          break;
        }
      }
      var curQty = found ? found.qty : 0;
      if (curQty + reqQty > stock) {
        return {
          ok: false,
          message: '«' + product.name + '» барааны үлдэгдэл (' + stock + ' ш) хүрэлцэхгүй байна.'
        };
      }

      if (found) {
        found.qty = curQty + reqQty;
      } else {
        nextCart.push({ productId: product.id, qty: reqQty });
      }
    }

    var saveResult = saveCart(nextCart);
    var inMemoryFallback = !saveResult.ok && Object.prototype.hasOwnProperty.call(memoryStore, STORAGE_KEYS.CART);
    if (!saveResult.ok && !inMemoryFallback) {
      return { ok: false, message: 'Сагсанд хадгалах үед алдаа гарлаа.' };
    }

    return {
      ok: true,
      count: getCartCount(nextCart),
      message: 'Сонгосон ' + items.length + ' эд анги сагсанд амжилттай нэмэгдлээ.'
    };
  }

  function updateCartQty(productId, qty) {
    var nextQty = Math.floor(Number(qty) || 0);
    if (nextQty <= 0) {
      return removeFromCart(productId);
    }
    var product = getProductById(productId, { activeOnly: true });
    if (!product) {
      removeFromCart(productId);
      return { ok: false, message: 'Бараа одоогоор идэвхгүй эсвэл устгагдсан байна.' };
    }
    var stock = Math.max(0, Math.floor(Number(product.stock) || 0));
    if (stock <= 0) {
      removeFromCart(productId);
      return { ok: false, message: product.name + ' барааны үлдэгдэл дууссан байна.' };
    }
    var finalQty = Math.min(nextQty, stock);
    var cart = getCart().map(function (item) {
      return item.productId === productId ? { productId: productId, qty: finalQty } : item;
    });
    return saveCart(cart);
  }

  function removeFromCart(productId) {
    var cart = getCart().filter(function (item) {
      return item.productId !== productId;
    });
    return saveCart(cart);
  }

  function clearCart() {
    return saveCart([]);
  }

  function getOrders() {
    ensureSeeded();
    var orders = readJSON(STORAGE_KEYS.ORDERS, null);
    if (!Array.isArray(orders)) {
      return Array.isArray(getSeed().orders) ? getSeed().orders : [];
    }
    return orders.filter(function (o) {
      return o && typeof o === 'object';
    });
  }

  function saveOrders(orders) {
    return writeJSON(STORAGE_KEYS.ORDERS, Array.isArray(orders) ? orders : []);
  }

  function formatPrice(amount) {
    var num = Number(amount);
    if (!isFinite(num)) {
      return '0 ₮';
    }
    return Math.round(num).toLocaleString('en-US') + ' ₮';
  }

  function getDiscountPercent(product) {
    if (!product) return 0;
    var oldP = Number(product.oldPrice);
    var curP = Number(product.price);
    if (!isFinite(oldP) || !isFinite(curP) || oldP <= 0 || curP < 0 || oldP <= curP) {
      return 0;
    }
    return Math.round(((oldP - curP) / oldP) * 100);
  }

  global.FTStorage = {
    KEYS: STORAGE_KEYS,
    readJSON: readJSON,
    writeJSON: writeJSON,
    ensureSeeded: ensureSeeded,
    resetToSeed: resetToSeed,
    getProducts: getProducts,
    saveProducts: saveProducts,
    getProductById: getProductById,
    getProductsByCategory: getProductsByCategory,
    getCategories: getCategories,
    getCart: getCart,
    saveCart: saveCart,
    getCartCount: getCartCount,
    addToCart: addToCart,
    addManyToCart: addManyToCart,
    updateCartQty: updateCartQty,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    getOrders: getOrders,
    saveOrders: saveOrders,
    formatPrice: formatPrice,
    getDiscountPercent: getDiscountPercent
  };
})(window);
