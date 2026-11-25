(function (global) {
  'use strict';

  function escXml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function makeProductSvg(kind, brand, label, accent) {
    var safeBrand = escXml(brand);
    var safeLabel = escXml(label);
    var color = accent || '#0071E3';
    var shape = '';

    switch (kind) {
      case 'desktop-pc':
        shape =
          '<rect x="75" y="34" width="100" height="132" rx="10" fill="#1D1D1F" stroke="' + color + '" stroke-width="3"/>' +
          '<rect x="86" y="46" width="56" height="92" rx="6" fill="#2C2C2E"/>' +
          '<circle cx="114" cy="72" r="14" fill="none" stroke="' + color + '" stroke-width="3"/>' +
          '<circle cx="114" cy="112" r="14" fill="none" stroke="#38BDF8" stroke-width="3"/>' +
          '<rect x="190" y="54" width="132" height="84" rx="8" fill="#1D1D1F" stroke="#AEAEB2" stroke-width="3"/>' +
          '<rect x="198" y="62" width="116" height="66" rx="4" fill="#2C2C2E"/>' +
          '<path d="M208 112 L238 82 L262 100 L294 74" fill="none" stroke="' + color + '" stroke-width="4" stroke-linecap="round"/>' +
          '<rect x="242" y="138" width="28" height="18" fill="#636366"/>' +
          '<rect x="224" y="156" width="64" height="8" rx="4" fill="#48484A"/>';
        break;
      case 'laptop':
        shape =
          '<rect x="88" y="40" width="224" height="110" rx="10" fill="#1D1D1F" stroke="' + color + '" stroke-width="3"/>' +
          '<rect x="98" y="50" width="204" height="90" rx="5" fill="#2C2C2E"/>' +
          '<circle cx="200" cy="95" r="26" fill="none" stroke="' + color + '" stroke-width="3"/>' +
          '<path d="M188 95 L197 104 L214 86" fill="none" stroke="#38BDF8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<polygon points="62,154 338,154 356,170 44,170" fill="#48484A" stroke="#252529" stroke-width="2"/>' +
          '<rect x="166" y="159" width="68" height="5" rx="2.5" fill="#AEAEB2"/>';
        break;
      case 'cpu':
        shape =
          '<rect x="132" y="42" width="136" height="118" rx="12" fill="#1D1D1F" stroke="' + color + '" stroke-width="3"/>' +
          '<rect x="150" y="60" width="100" height="82" rx="8" fill="#252529" stroke="#AEAEB2" stroke-width="2"/>' +
          '<rect x="168" y="76" width="64" height="50" rx="6" fill="' + color + '" fill-opacity="0.24" stroke="' + color + '" stroke-width="2.5"/>' +
          '<line x1="120" y1="64" x2="132" y2="64" stroke="#F59E0B" stroke-width="4"/>' +
          '<line x1="120" y1="84" x2="132" y2="84" stroke="#F59E0B" stroke-width="4"/>' +
          '<line x1="120" y1="104" x2="132" y2="104" stroke="#F59E0B" stroke-width="4"/>' +
          '<line x1="120" y1="124" x2="132" y2="124" stroke="#F59E0B" stroke-width="4"/>' +
          '<line x1="268" y1="64" x2="280" y2="64" stroke="#F59E0B" stroke-width="4"/>' +
          '<line x1="268" y1="84" x2="280" y2="84" stroke="#F59E0B" stroke-width="4"/>' +
          '<line x1="268" y1="104" x2="280" y2="104" stroke="#F59E0B" stroke-width="4"/>' +
          '<line x1="268" y1="124" x2="280" y2="124" stroke="#F59E0B" stroke-width="4"/>';
        break;
      case 'motherboard':
        shape =
          '<rect x="108" y="34" width="184" height="134" rx="10" fill="#1D1D1F" stroke="' + color + '" stroke-width="3"/>' +
          '<rect x="128" y="54" width="64" height="56" rx="6" fill="#2C2C2E" stroke="#D2D2D7" stroke-width="2"/>' +
          '<rect x="142" y="68" width="36" height="28" rx="4" fill="' + color + '" fill-opacity="0.35"/>' +
          '<rect x="212" y="48" width="10" height="72" rx="2" fill="#38BDF8"/>' +
          '<rect x="228" y="48" width="10" height="72" rx="2" fill="' + color + '"/>' +
          '<rect x="244" y="48" width="10" height="72" rx="2" fill="#38BDF8"/>' +
          '<rect x="260" y="48" width="10" height="72" rx="2" fill="' + color + '"/>' +
          '<rect x="128" y="128" width="120" height="10" rx="3" fill="#AEAEB2"/>' +
          '<rect x="128" y="144" width="90" height="10" rx="3" fill="#636366"/>';
        break;
      case 'ram':
        shape =
          '<rect x="82" y="52" width="236" height="40" rx="6" fill="#1D1D1F" stroke="' + color + '" stroke-width="3"/>' +
          '<rect x="92" y="57" width="216" height="7" rx="3" fill="' + color + '"/>' +
          '<rect x="82" y="106" width="236" height="40" rx="6" fill="#2C2C2E" stroke="#38BDF8" stroke-width="3"/>' +
          '<rect x="92" y="111" width="216" height="7" rx="3" fill="#38BDF8"/>' +
          '<rect x="98" y="92" width="204" height="6" fill="#F59E0B"/>' +
          '<rect x="98" y="146" width="204" height="6" fill="#F59E0B"/>';
        break;
      case 'gpu':
        shape =
          '<rect x="66" y="48" width="268" height="104" rx="12" fill="#1D1D1F" stroke="' + color + '" stroke-width="3"/>' +
          '<circle cx="132" cy="100" r="32" fill="#2C2C2E" stroke="' + color + '" stroke-width="3"/>' +
          '<circle cx="200" cy="100" r="32" fill="#2C2C2E" stroke="#38BDF8" stroke-width="3"/>' +
          '<circle cx="268" cy="100" r="32" fill="#2C2C2E" stroke="' + color + '" stroke-width="3"/>' +
          '<circle cx="132" cy="100" r="8" fill="' + color + '"/>' +
          '<circle cx="200" cy="100" r="8" fill="#38BDF8"/>' +
          '<circle cx="268" cy="100" r="8" fill="' + color + '"/>' +
          '<rect x="96" y="152" width="120" height="8" rx="2" fill="#F59E0B"/>';
        break;
      case 'keyboard':
        shape =
          '<rect x="56" y="54" width="288" height="96" rx="10" fill="#1D1D1F" stroke="' + color + '" stroke-width="3"/>' +
          '<rect x="70" y="68" width="22" height="18" rx="3" fill="' + color + '"/>' +
          '<rect x="98" y="68" width="22" height="18" rx="3" fill="#48484A"/>' +
          '<rect x="126" y="68" width="22" height="18" rx="3" fill="#48484A"/>' +
          '<rect x="154" y="68" width="22" height="18" rx="3" fill="#48484A"/>' +
          '<rect x="182" y="68" width="22" height="18" rx="3" fill="#48484A"/>' +
          '<rect x="210" y="68" width="22" height="18" rx="3" fill="#48484A"/>' +
          '<rect x="238" y="68" width="22" height="18" rx="3" fill="#48484A"/>' +
          '<rect x="266" y="68" width="22" height="18" rx="3" fill="#48484A"/>' +
          '<rect x="294" y="68" width="36" height="18" rx="3" fill="#636366"/>' +
          '<rect x="70" y="92" width="260" height="18" rx="3" fill="#2C2C2E"/>' +
          '<rect x="122" y="116" width="144" height="18" rx="4" fill="' + color + '" fill-opacity="0.7"/>';
        break;
      case 'monitor':
        shape =
          '<rect x="78" y="34" width="244" height="114" rx="10" fill="#1D1D1F" stroke="' + color + '" stroke-width="3"/>' +
          '<rect x="88" y="44" width="224" height="94" rx="5" fill="#2C2C2E"/>' +
          '<path d="M110 120 Q165 56 218 96 T292 66" fill="none" stroke="' + color + '" stroke-width="4" stroke-linecap="round"/>' +
          '<rect x="184" y="148" width="32" height="18" fill="#636366"/>' +
          '<rect x="150" y="164" width="100" height="8" rx="4" fill="#48484A"/>';
        break;
      case 'mouse':
        shape =
          '<rect x="152" y="36" width="96" height="132" rx="46" fill="#1D1D1F" stroke="' + color + '" stroke-width="3"/>' +
          '<line x1="200" y1="36" x2="200" y2="90" stroke="#636366" stroke-width="2"/>' +
          '<line x1="154" y1="90" x2="246" y2="90" stroke="#636366" stroke-width="2"/>' +
          '<rect x="193" y="54" width="14" height="26" rx="7" fill="' + color + '"/>';
        break;
      case 'router':
        shape =
          '<line x1="115" y1="44" x2="128" y2="108" stroke="#48484A" stroke-width="7" stroke-linecap="round"/>' +
          '<line x1="172" y1="36" x2="176" y2="108" stroke="#48484A" stroke-width="7" stroke-linecap="round"/>' +
          '<line x1="228" y1="36" x2="224" y2="108" stroke="#48484A" stroke-width="7" stroke-linecap="round"/>' +
          '<line x1="285" y1="44" x2="272" y2="108" stroke="#48484A" stroke-width="7" stroke-linecap="round"/>' +
          '<rect x="86" y="106" width="228" height="44" rx="10" fill="#1D1D1F" stroke="' + color + '" stroke-width="3"/>' +
          '<circle cx="122" cy="128" r="5" fill="#10B981"/>' +
          '<circle cx="144" cy="128" r="5" fill="' + color + '"/>' +
          '<circle cx="166" cy="128" r="5" fill="#38BDF8"/>' +
          '<rect x="242" y="122" width="46" height="12" rx="4" fill="#2C2C2E"/>';
        break;
      case 'ups':
      default:
        shape =
          '<rect x="136" y="34" width="128" height="134" rx="12" fill="#1D1D1F" stroke="' + color + '" stroke-width="3"/>' +
          '<rect x="160" y="52" width="80" height="40" rx="6" fill="#2C2C2E" stroke="' + color + '" stroke-width="2"/>' +
          '<path d="M204 58 L192 74 L202 74 L196 86 L210 70 L200 70 Z" fill="#38BDF8"/>' +
          '<rect x="166" y="108" width="26" height="18" rx="3" fill="#48484A"/>' +
          '<rect x="208" y="108" width="26" height="18" rx="3" fill="#48484A"/>' +
          '<circle cx="200" cy="146" r="6" fill="#10B981"/>';
        break;
    }

    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="400" height="240">' +
      '<defs>' +
      '<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">' +
      '<stop offset="0%" stop-color="#FAFAFC"/>' +
      '<stop offset="100%" stop-color="#EFEFF4"/>' +
      '</linearGradient>' +
      '</defs>' +
      '<rect width="400" height="240" fill="url(#bg)"/>' +
      '<circle cx="348" cy="40" r="64" fill="' + color + '" fill-opacity="0.08"/>' +
      '<circle cx="48" cy="200" r="54" fill="#1D1D1F" fill-opacity="0.04"/>' +
      shape +
      '<rect x="16" y="188" width="368" height="36" rx="10" fill="#FFFFFF" fill-opacity="0.94" stroke="#E5E5EA"/>' +
      '<text x="28" y="211" font-family="Rubik, Segoe UI, Arial, sans-serif" font-size="13" font-weight="700" fill="#1D1D1F">' + safeBrand + '</text>' +
      '<text x="372" y="211" text-anchor="end" font-family="Rubik, Segoe UI, Arial, sans-serif" font-size="12" font-weight="600" fill="#0071E3">' + safeLabel + '</text>' +
      '</svg>';

    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  var categories = [
    {
      id: 'desktop',
      name: 'Суурин компьютер',
      shortName: 'Суурин ПК',
      url: 'category-desktop.html',
      description: 'Тоглоом, 3D дизайн, видео эвлүүлэг болон албан хэрэглээнд зориулсан бэлэн угсарсан системүүд.',
      subCategories: ['Тоглоомын ПК', 'Ажлын станц', 'Оффис ПК'],
      iconKind: 'desktop-pc'
    },
    {
      id: 'laptop',
      name: 'Зөөврийн компьютер',
      shortName: 'Зөөврийн ПК',
      url: 'category-laptop.html',
      description: 'Бизнес ангилал, хөнгөн ультрабук болон өндөр хүчин чадалтай тоглоомын зөөврийн компьютерууд.',
      subCategories: ['Бизнес ангилал', 'Ультрабук', 'Тоглоомын зөөврийн'],
      iconKind: 'laptop'
    },
    {
      id: 'parts',
      name: 'Компьютерын эд анги',
      shortName: 'Эд анги',
      url: 'category-parts.html',
      description: 'Процессор, эх хавтан, DDR4/DDR5 санах ой болон сүүлийн үеийн график картууд.',
      subCategories: ['Процессор (CPU)', 'Эх хавтан', 'Санах ой (RAM)', 'График карт (GPU)'],
      iconKind: 'gpu'
    },
    {
      id: 'peripherals',
      name: 'Дагалдах хэрэгсэл ба монитор',
      shortName: 'Дагалдах & Монитор',
      url: 'category-peripherals.html',
      description: 'Өндөр сэргээх давтамжтай монитор, механик гар болон нарийвчлалтай утасгүй хулганууд.',
      subCategories: ['Механик гар', 'Монитор', 'Хулгана'],
      iconKind: 'keyboard'
    },
    {
      id: 'network',
      name: 'Сүлжээ ба бусад төхөөрөмж',
      shortName: 'Сүлжээ & UPS',
      url: 'category-network.html',
      description: 'Гэр болон албан байгууллагын өндөр хурдны Wi-Fi чиглүүлэгч, тог баригч (UPS) төхөөрөмжүүд.',
      subCategories: ['Wi-Fi чиглүүлэгч', 'Тог баригч (UPS)'],
      iconKind: 'router'
    }
  ];

  var typeLabels = {
    'desktop-pc': 'Суурин компьютер',
    laptop: 'Зөөврийн компьютер',
    cpu: 'Процессор (CPU)',
    motherboard: 'Эх хавтан',
    ram: 'Санах ой (RAM)',
    gpu: 'График карт (GPU)',
    keyboard: 'Механик гар',
    monitor: 'Монитор',
    mouse: 'Хулгана',
    router: 'Wi-Fi чиглүүлэгч',
    ups: 'Тог баригч (UPS)'
  };

  var specSchemas = {
    'desktop-pc': [
      { key: 'cpu', label: 'Процессор (CPU)', unit: '' },
      { key: 'ramGb', label: 'Санах ой (RAM)', unit: 'GB' },
      { key: 'ramType', label: 'RAM төрөл', unit: '' },
      { key: 'storage', label: 'Хадгалах багтаамж', unit: '' },
      { key: 'gpu', label: 'График карт (GPU)', unit: '' },
      { key: 'psuWatt', label: 'Тэжээлийн блок', unit: 'W' },
      { key: 'os', label: 'Үйлдлийн систем', unit: '' },
      { key: 'warrantyMonths', label: 'Баталгаат хугацаа', unit: 'сар' }
    ],
    laptop: [
      { key: 'cpu', label: 'Процессор (CPU)', unit: '' },
      { key: 'ramGb', label: 'Санах ой (RAM)', unit: 'GB' },
      { key: 'storage', label: 'Хадгалах багтаамж', unit: '' },
      { key: 'displayInch', label: 'Дэлгэцийн хэмжээ', unit: 'инч' },
      { key: 'refreshRateHz', label: 'Сэргээх давтамж', unit: 'Hz' },
      { key: 'gpu', label: 'График карт', unit: '' },
      { key: 'weightKg', label: 'Жин', unit: 'кг' },
      { key: 'batteryWh', label: 'Батерей', unit: 'Wh' }
    ],
    cpu: [
      { key: 'socket', label: 'Сокет (Socket)', unit: '' },
      { key: 'coresThreads', label: 'Цөм / Утас', unit: '' },
      { key: 'baseClockGhz', label: 'Суурь давтамж', unit: 'GHz' },
      { key: 'boostClockGhz', label: 'Дээд давтамж', unit: 'GHz' },
      { key: 'cacheMb', label: 'Кэш санах ой', unit: 'MB' },
      { key: 'tdpWatt', label: 'Цахилгаан зарцуулалт (TDP)', unit: 'W' }
    ],
    motherboard: [
      { key: 'socket', label: 'Сокет (Socket)', unit: '' },
      { key: 'chipset', label: 'Чипсет', unit: '' },
      { key: 'ramType', label: 'Дэмжих RAM төрөл', unit: '' },
      { key: 'maxRamGb', label: 'Дээд RAM багтаамж', unit: 'GB' },
      { key: 'formFactor', label: 'Форм фактор', unit: '' },
      { key: 'm2Slots', label: 'M.2 оролтын тоо', unit: 'ш' },
      { key: 'wifi', label: 'Утасгүй сүлжээ (Wi-Fi)', unit: '' }
    ],
    ram: [
      { key: 'ramType', label: 'Санах ойн төрөл', unit: '' },
      { key: 'capacityGb', label: 'Багтаамж', unit: 'GB' },
      { key: 'speedMhz', label: 'Давтамж', unit: 'MHz' },
      { key: 'modules', label: 'Модулийн тоо', unit: '' },
      { key: 'casLatency', label: 'CL хоцролт', unit: '' },
      { key: 'rgb', label: 'RGB гэрэлтүүлэг', unit: '' }
    ],
    gpu: [
      { key: 'vramGb', label: 'Видео санах ой (VRAM)', unit: 'GB' },
      { key: 'memoryBus', label: 'Санах ойн төрөл', unit: '' },
      { key: 'boostClockMhz', label: 'Boost давтамж', unit: 'MHz' },
      { key: 'recommendedPsuWatt', label: 'Санал болгох PSU', unit: 'W' },
      { key: 'lengthMm', label: 'Картын урт', unit: 'мм' },
      { key: 'outputs', label: 'Дэлгэцийн гаралт', unit: '' }
    ],
    keyboard: [
      { key: 'layout', label: 'Хэмжээ / Байрлал', unit: '' },
      { key: 'switchType', label: 'Switch төрөл', unit: '' },
      { key: 'connection', label: 'Холболт', unit: '' },
      { key: 'pollingRateHz', label: 'Polling Rate', unit: 'Hz' },
      { key: 'rgb', label: 'Гэрэлтүүлэг', unit: '' },
      { key: 'wristRest', label: 'Бугуйн тулгуур', unit: '' }
    ],
    monitor: [
      { key: 'displayInch', label: 'Дэлгэцийн хэмжээ', unit: 'инч' },
      { key: 'resolution', label: 'Нягтаршил', unit: '' },
      { key: 'panelType', label: 'Панелийн төрөл', unit: '' },
      { key: 'refreshRateHz', label: 'Сэргээх давтамж', unit: 'Hz' },
      { key: 'responseTimeMs', label: 'Хариу өгөх хугацаа', unit: 'ms' },
      { key: 'usbHub', label: 'USB Hub', unit: '' }
    ],
    mouse: [
      { key: 'sensor', label: 'Мэдрэгч (Sensor)', unit: '' },
      { key: 'maxDpi', label: 'Дээд DPI', unit: '' },
      { key: 'weightG', label: 'Жин', unit: 'г' },
      { key: 'connection', label: 'Холболт', unit: '' },
      { key: 'batteryHours', label: 'Батерей ажиллах хугацаа', unit: 'цаг' }
    ],
    router: [
      { key: 'wifiStandard', label: 'Wi-Fi стандарт', unit: '' },
      { key: 'bands', label: 'Давтамжийн зурвас', unit: '' },
      { key: 'maxSpeedMbps', label: 'Дээд хурд', unit: 'Mbps' },
      { key: 'ports', label: 'Портын тоо', unit: '' },
      { key: 'antennas', label: 'Антены тоо', unit: 'ш' },
      { key: 'meshSupport', label: 'Mesh дэмжлэг', unit: '' }
    ],
    ups: [
      { key: 'capacityVa', label: 'Чадал (VA)', unit: 'VA' },
      { key: 'capacityWatt', label: 'Бодит чадал', unit: 'W' },
      { key: 'outlets', label: 'Гаралтын залгуур', unit: 'ш' },
      { key: 'avr', label: 'Хүчдэл тогтворжуулагч (AVR)', unit: '' },
      { key: 'usbMonitoring', label: 'USB хяналтын порт', unit: '' }
    ]
  };

  var products = [
    /* ================= 1. DESKTOP (Суурин компьютер) ================= */
    {
      id: 'desk-01',
      name: 'Ryzen 7 9850X3D / RTX 5070',
      category: 'desktop',
      type: 'desktop-pc',
      subCategory: 'Тоглоомын ПК',
      brand: 'Future-Tech',
      price: 6890000,
      oldPrice: 7390000,
      stock: 5,
      active: true,
      featured: true,
      image: makeProductSvg('desktop-pc', 'Future-Tech', '9850X3D / RTX 5070', '#0EA5A4'),
      detailUrl: 'product-desktop.html',
      shortDesc: '2K/4K тоглоом болон өндөр ачааллын рендерт зориулсан шилдэг угсралт.',
      specs: {
        cpu: 'AMD Ryzen 7 9850X3D',
        ramGb: 32,
        ramType: 'DDR5',
        storage: '1TB PCIe 4.0 NVMe SSD',
        gpu: 'GeForce RTX 5070 12GB',
        psuWatt: 750,
        os: 'Windows 11 Pro',
        warrantyMonths: 24
      }
    },
    {
      id: 'desk-02',
      name: 'Future-Tech Creator i7 / RTX 4070 Ti',
      category: 'desktop',
      type: 'desktop-pc',
      subCategory: 'Ажлын станц',
      brand: 'Future-Tech',
      price: 5950000,
      oldPrice: null,
      stock: 4,
      active: true,
      featured: true,
      image: makeProductSvg('desktop-pc', 'Future-Tech', 'Creator i7 / 4070 Ti', '#0284C7'),
      detailUrl: 'product-desktop.html?id=desk-02',
      shortDesc: 'Видео эвлүүлэг, CAD инженерчлэл болон AI тооцооллын ажлын станц.',
      specs: {
        cpu: 'Intel Core i7-14700K',
        ramGb: 64,
        ramType: 'DDR5',
        storage: '2TB PCIe 4.0 NVMe SSD',
        gpu: 'GeForce RTX 4070 Ti SUPER 16GB',
        psuWatt: 850,
        os: 'Windows 11 Pro',
        warrantyMonths: 24
      }
    },
    {
      id: 'desk-03',
      name: 'ASUS ROG Strix G16CH',
      category: 'desktop',
      type: 'desktop-pc',
      subCategory: 'Тоглоомын ПК',
      brand: 'ASUS',
      price: 5290000,
      oldPrice: 5690000,
      stock: 3,
      active: true,
      featured: false,
      image: makeProductSvg('desktop-pc', 'ASUS ROG', 'Strix G16CH', '#DC2626'),
      detailUrl: 'product-desktop.html?id=desk-03',
      shortDesc: 'Үйлдвэрийн баталгаат тоглоомын суурин систем, RGB хөргөлттэй.',
      specs: {
        cpu: 'Intel Core i7-13700F',
        ramGb: 32,
        ramType: 'DDR4',
        storage: '1TB NVMe SSD',
        gpu: 'GeForce RTX 4070 12GB',
        psuWatt: 700,
        os: 'Windows 11 Home',
        warrantyMonths: 12
      }
    },
    {
      id: 'desk-04',
      name: 'Lenovo ThinkCentre M70t Gen 4',
      category: 'desktop',
      type: 'desktop-pc',
      subCategory: 'Оффис ПК',
      brand: 'Lenovo',
      price: 2450000,
      oldPrice: null,
      stock: 7,
      active: true,
      featured: false,
      image: makeProductSvg('desktop-pc', 'Lenovo', 'ThinkCentre M70t', '#0F766E'),
      detailUrl: 'product-desktop.html?id=desk-04',
      shortDesc: 'Албан байгууллага болон санхүү, програм хангамжийн найдвартай суурин компьютер.',
      specs: {
        cpu: 'Intel Core i5-13400',
        ramGb: 16,
        ramType: 'DDR4',
        storage: '512GB NVMe SSD',
        gpu: 'Intel UHD Graphics 730',
        os: 'Windows 11 Pro',
        warrantyMonths: 36
      }
    },
    {
      id: 'desk-05',
      name: 'MSI MAG Infinite S3 14NUD',
      category: 'desktop',
      type: 'desktop-pc',
      subCategory: 'Тоглоомын ПК',
      brand: 'MSI',
      price: 4490000,
      oldPrice: 4850000,
      stock: 4,
      active: true,
      featured: false,
      image: makeProductSvg('desktop-pc', 'MSI', 'MAG Infinite S3', '#E11D48'),
      detailUrl: 'product-desktop.html?id=desk-05',
      shortDesc: 'Чимээгүй ажиллагаатай, сайжруулалт хийхэд хялбар тоглоомын кейс.',
      specs: {
        cpu: 'Intel Core i5-14400F',
        ramGb: 16,
        ramType: 'DDR5',
        storage: '1TB NVMe SSD',
        gpu: 'GeForce RTX 4060 Ti 8GB',
        psuWatt: 500,
        os: 'Windows 11 Home',
        warrantyMonths: 12
      }
    },

    /* ================= 2. LAPTOP (Зөөврийн компьютер) ================= */
    {
      id: 'lap-01',
      name: 'Dell Latitude 5550',
      category: 'laptop',
      type: 'laptop',
      subCategory: 'Бизнес ангилал',
      brand: 'Dell',
      price: 3950000,
      oldPrice: 4290000,
      stock: 6,
      active: true,
      featured: true,
      image: makeProductSvg('laptop', 'Dell', 'Latitude 5550', '#0284C7'),
      detailUrl: 'product-laptop.html',
      shortDesc: 'Оффис, инженер болон бизнесийн өндөр найдвартай 15.6 инчийн зөөврийн компьютер.',
      specs: {
        cpu: 'Intel Core Ultra 7 155U',
        ramGb: 16,
        storage: '512GB NVMe SSD',
        displayInch: 15.6,
        refreshRateHz: 60,
        gpu: 'Intel Graphics',
        weightKg: 1.62,
        batteryWh: 54
      }
    },
    {
      id: 'lap-02',
      name: 'ASUS Vivobook Pro 15 OLED',
      category: 'laptop',
      type: 'laptop',
      subCategory: 'Ультрабук',
      brand: 'ASUS',
      price: 4450000,
      oldPrice: 4790000,
      stock: 5,
      active: true,
      featured: true,
      image: makeProductSvg('laptop', 'ASUS', 'Vivobook Pro 15', '#0EA5A4'),
      detailUrl: 'product-laptop.html?id=lap-02',
      shortDesc: 'Өнгөний нарийвчлал өндөртэй OLED дэлгэц, RTX график карттай бүтээлч ажилд зориулсан загвар.',
      specs: {
        cpu: 'Intel Core Ultra 7 155H',
        ramGb: 16,
        storage: '1TB NVMe SSD',
        displayInch: 15.6,
        refreshRateHz: 120,
        gpu: 'GeForce RTX 4050 6GB',
        weightKg: 1.8,
        batteryWh: 75
      }
    },
    {
      id: 'lap-03',
      name: 'Lenovo ThinkPad E16 Gen 2',
      category: 'laptop',
      type: 'laptop',
      subCategory: 'Бизнес ангилал',
      brand: 'Lenovo',
      price: 3250000,
      oldPrice: null,
      stock: 8,
      active: true,
      featured: false,
      image: makeProductSvg('laptop', 'Lenovo', 'ThinkPad E16 Gen 2', '#DC2626'),
      detailUrl: 'product-laptop.html?id=lap-03',
      shortDesc: 'Тав тухтай гар, бат бөх хөнгөн цагаан их биетэй бизнес зөөврийн компьютер.',
      specs: {
        cpu: 'AMD Ryzen 7 7735U',
        ramGb: 16,
        storage: '512GB NVMe SSD',
        displayInch: 16.0,
        gpu: 'AMD Radeon 680M',
        weightKg: 1.81
      }
    },
    {
      id: 'lap-04',
      name: 'Apple MacBook Air 13 M3',
      category: 'laptop',
      type: 'laptop',
      subCategory: 'Ультрабук',
      brand: 'Apple',
      price: 4190000,
      oldPrice: null,
      stock: 4,
      active: true,
      featured: false,
      image: makeProductSvg('laptop', 'Apple', 'MacBook Air M3', '#0F172A'),
      detailUrl: 'product-laptop.html?id=lap-04',
      shortDesc: 'Хөнгөн, дуу чимээгүй, батерей удаан барьдаг M3 чиптэй зөөврийн компьютер.',
      specs: {
        cpu: 'Apple M3 (8-Core)',
        ramGb: 16,
        storage: '512GB SSD',
        displayInch: 13.6,
        refreshRateHz: 60,
        gpu: 'Apple 10-Core GPU',
        weightKg: 1.24,
        batteryWh: 52.6
      }
    },
    {
      id: 'lap-05',
      name: 'MSI Katana 15 B13V',
      category: 'laptop',
      type: 'laptop',
      subCategory: 'Тоглоомын зөөврийн',
      brand: 'MSI',
      price: 4590000,
      oldPrice: 4990000,
      stock: 3,
      active: true,
      featured: false,
      image: makeProductSvg('laptop', 'MSI', 'Katana 15 B13V', '#E11D48'),
      detailUrl: 'product-laptop.html?id=lap-05',
      shortDesc: '144Hz дэлгэц болон RTX 4060 график карттай тоглоомын зөөврийн компьютер.',
      specs: {
        cpu: 'Intel Core i7-13620H',
        ramGb: 16,
        storage: '1TB NVMe SSD',
        displayInch: 15.6,
        refreshRateHz: 144,
        gpu: 'GeForce RTX 4060 8GB',
        weightKg: 2.25,
        batteryWh: 53.5
      }
    },

    /* ================= 3. PARTS (Компьютерын эд анги) ================= */
    {
      id: 'part-01',
      name: 'ASUS PRIME GeForce RTX 5080',
      category: 'parts',
      type: 'gpu',
      partType: 'gpu',
      subCategory: 'График карт (GPU)',
      brand: 'ASUS',
      price: 4950000,
      oldPrice: 5290000,
      stock: 4,
      active: true,
      featured: true,
      image: makeProductSvg('gpu', 'ASUS', 'PRIME RTX 5080', '#0EA5A4'),
      detailUrl: 'product-parts.html',
      shortDesc: '16GB GDDR7 санах ойтой, гурван сэнстэй шинэ үеийн хүчирхэг график карт.',
      specs: {
        vramGb: 16,
        memoryBus: 'GDDR7 256-bit',
        boostClockMhz: 2640,
        recommendedPsuWatt: 850,
        lengthMm: 304,
        outputs: '3x DisplayPort 2.1, 1x HDMI 2.1b'
      }
    },
    {
      id: 'part-02',
      name: 'MSI GeForce RTX 4070 SUPER GAMING X',
      category: 'parts',
      type: 'gpu',
      partType: 'gpu',
      subCategory: 'График карт (GPU)',
      brand: 'MSI',
      price: 2790000,
      oldPrice: 2990000,
      stock: 6,
      active: true,
      featured: false,
      image: makeProductSvg('gpu', 'MSI', 'RTX 4070 SUPER', '#E11D48'),
      detailUrl: 'product-parts.html?id=part-02',
      shortDesc: '2K өндөр FPS тоглоом болон контент бүтээлтийн тэнцвэртэй график карт.',
      specs: {
        vramGb: 12,
        memoryBus: 'GDDR6X 192-bit',
        boostClockMhz: 2640,
        recommendedPsuWatt: 650,
        outputs: '3x DisplayPort 1.4a, 1x HDMI 2.1a'
      }
    },
    {
      id: 'part-03',
      name: 'AMD Ryzen 7 9800X3D',
      category: 'parts',
      type: 'cpu',
      partType: 'cpu',
      socket: 'AM5',
      subCategory: 'Процессор (CPU)',
      brand: 'AMD',
      price: 1980000,
      oldPrice: null,
      stock: 7,
      active: true,
      featured: false,
      image: makeProductSvg('cpu', 'AMD', 'Ryzen 7 9800X3D', '#EA580C'),
      detailUrl: 'product-parts.html?id=part-03',
      shortDesc: '3D V-Cache технологитой, тоглоомын гүйцэтгэлээр тэргүүлэгч AM5 процессор.',
      specs: {
        socket: 'AM5',
        coresThreads: '8 цөм / 16 утас',
        baseClockGhz: 4.7,
        boostClockGhz: 5.2,
        cacheMb: 96,
        tdpWatt: 120
      }
    },
    {
      id: 'part-04',
      name: 'AMD Ryzen 5 7600X',
      category: 'parts',
      type: 'cpu',
      partType: 'cpu',
      socket: 'AM5',
      subCategory: 'Процессор (CPU)',
      brand: 'AMD',
      price: 890000,
      oldPrice: 960000,
      stock: 10,
      active: true,
      featured: false,
      image: makeProductSvg('cpu', 'AMD', 'Ryzen 5 7600X', '#EA580C'),
      detailUrl: 'product-parts.html?id=part-04',
      shortDesc: 'AM5 платформд суурилсан үнэ ба гүйцэтгэлийн шилдэг тэнцвэртэй процессор.',
      specs: {
        socket: 'AM5',
        coresThreads: '6 цөм / 12 утас',
        baseClockGhz: 4.7,
        boostClockGhz: 5.3,
        cacheMb: 32,
        tdpWatt: 105
      }
    },
    {
      id: 'part-05',
      name: 'Intel Core i7-14700K',
      category: 'parts',
      type: 'cpu',
      partType: 'cpu',
      socket: 'LGA1700',
      subCategory: 'Процессор (CPU)',
      brand: 'Intel',
      price: 1650000,
      oldPrice: null,
      stock: 6,
      active: true,
      featured: false,
      image: makeProductSvg('cpu', 'Intel', 'Core i7-14700K', '#0284C7'),
      detailUrl: 'product-parts.html?id=part-05',
      shortDesc: '20 цөмт LGA1700 процессор — олон урсгалын ачаалал ба рендерт өндөр бүтээмжтэй.',
      specs: {
        socket: 'LGA1700',
        coresThreads: '20 цөм / 28 утас',
        baseClockGhz: 3.4,
        boostClockGhz: 5.6,
        cacheMb: 33,
        tdpWatt: 125
      }
    },
    {
      id: 'part-06',
      name: 'ASUS TUF GAMING B650-PLUS WIFI',
      category: 'parts',
      type: 'motherboard',
      partType: 'motherboard',
      socket: 'AM5',
      ramType: 'DDR5',
      memoryType: 'DDR5',
      subCategory: 'Эх хавтан',
      brand: 'ASUS',
      price: 840000,
      oldPrice: null,
      stock: 6,
      active: true,
      featured: false,
      image: makeProductSvg('motherboard', 'ASUS TUF', 'B650-PLUS WIFI', '#0EA5A4'),
      detailUrl: 'product-parts.html?id=part-06',
      shortDesc: 'AM5 сокет, зөвхөн DDR5 санах ой болон PCIe 5.0 M.2 дэмждэг найдвартай эх хавтан.',
      specs: {
        socket: 'AM5',
        chipset: 'AMD B650',
        ramType: 'DDR5',
        maxRamGb: 192,
        formFactor: 'ATX',
        m2Slots: 3,
        wifi: 'Wi-Fi 6'
      }
    },
    {
      id: 'part-07',
      name: 'MSI PRO B760M-P DDR4',
      category: 'parts',
      type: 'motherboard',
      partType: 'motherboard',
      socket: 'LGA1700',
      ramType: 'DDR4',
      memoryType: 'DDR4',
      subCategory: 'Эх хавтан',
      brand: 'MSI',
      price: 490000,
      oldPrice: 540000,
      stock: 9,
      active: true,
      featured: false,
      image: makeProductSvg('motherboard', 'MSI PRO', 'B760M-P DDR4', '#6366F1'),
      detailUrl: 'product-parts.html?id=part-07',
      shortDesc: 'LGA1700 сокет болон хэмнэлттэй DDR4 санах ой дэмждэг mATX эх хавтан.',
      specs: {
        socket: 'LGA1700',
        chipset: 'Intel B760',
        ramType: 'DDR4',
        maxRamGb: 128,
        formFactor: 'Micro-ATX',
        m2Slots: 2,
        wifi: 'Байхгүй (LAN 1Gb)'
      }
    },
    {
      id: 'part-08',
      name: 'Gigabyte Z790 AORUS ELITE AX',
      category: 'parts',
      type: 'motherboard',
      partType: 'motherboard',
      socket: 'LGA1700',
      ramType: 'DDR5',
      memoryType: 'DDR5',
      subCategory: 'Эх хавтан',
      brand: 'Gigabyte',
      price: 1090000,
      oldPrice: null,
      stock: 5,
      active: true,
      featured: false,
      image: makeProductSvg('motherboard', 'Gigabyte', 'Z790 AORUS ELITE', '#EA580C'),
      detailUrl: 'product-parts.html?id=part-08',
      shortDesc: 'LGA1700 сокет ба өндөр хурдны DDR5 санах ойд зориулсан дээд зэрэглэлийн эх хавтан.',
      specs: {
        socket: 'LGA1700',
        chipset: 'Intel Z790',
        ramType: 'DDR5',
        maxRamGb: 192,
        formFactor: 'ATX',
        m2Slots: 4,
        wifi: 'Wi-Fi 6E'
      }
    },
    {
      id: 'part-09',
      name: 'Kingston FURY Beast 32GB (2x16GB) DDR5 6000MHz',
      category: 'parts',
      type: 'ram',
      partType: 'ram',
      ramType: 'DDR5',
      memoryType: 'DDR5',
      subCategory: 'Санах ой (RAM)',
      brand: 'Kingston',
      price: 465000,
      oldPrice: null,
      stock: 12,
      active: true,
      featured: false,
      image: makeProductSvg('ram', 'Kingston', 'FURY Beast DDR5', '#0EA5A4'),
      detailUrl: 'product-parts.html?id=part-09',
      shortDesc: 'AMD EXPO болон Intel XMP 3.0 дэмжлэгтэй 32GB DDR5 шуурхай санах ой.',
      specs: {
        ramType: 'DDR5',
        capacityGb: 32,
        speedMhz: 6000,
        modules: '2 x 16GB',
        casLatency: 'CL30',
        rgb: 'Байхгүй'
      }
    },
    {
      id: 'part-10',
      name: 'Corsair Vengeance LPX 32GB (2x16GB) DDR4 3200MHz',
      category: 'parts',
      type: 'ram',
      partType: 'ram',
      ramType: 'DDR4',
      memoryType: 'DDR4',
      subCategory: 'Санах ой (RAM)',
      brand: 'Corsair',
      price: 295000,
      oldPrice: 335000,
      stock: 11,
      active: true,
      featured: false,
      image: makeProductSvg('ram', 'Corsair', 'Vengeance DDR4', '#F59E0B'),
      detailUrl: 'product-parts.html?id=part-10',
      shortDesc: 'Нам профиль дулаан сарниулагчтай 32GB DDR4 хос сувгийн санах ой.',
      specs: {
        ramType: 'DDR4',
        capacityGb: 32,
        speedMhz: 3200,
        modules: '2 x 16GB',
        casLatency: 'CL16'
      }
    },

    /* ================= 4. PERIPHERALS (Дагалдах хэрэгсэл ба монитор) ================= */
    {
      id: 'per-01',
      name: 'Razer BlackWidow V4 Pro 75%',
      category: 'peripherals',
      type: 'keyboard',
      subCategory: 'Механик гар',
      brand: 'Razer',
      price: 780000,
      oldPrice: 860000,
      stock: 7,
      active: true,
      featured: true,
      image: makeProductSvg('keyboard', 'Razer', 'BlackWidow V4 Pro 75%', '#16A34A'),
      detailUrl: 'product-peripherals.html',
      shortDesc: 'OLED дэлгэц, hot-swappable switch болон утасгүй холболттой дээд зэрэглэлийн механик гар.',
      specs: {
        layout: '75% компакт',
        switchType: 'Razer Tactile Orange Gen-3',
        connection: '2.4GHz / Bluetooth / USB-C',
        pollingRateHz: 4000,
        rgb: 'Razer Chroma RGB',
        wristRest: 'Соронзон зөөлөвчтэй'
      }
    },
    {
      id: 'per-02',
      name: 'Keychron Q1 Pro Wireless Mechanical',
      category: 'peripherals',
      type: 'keyboard',
      subCategory: 'Механик гар',
      brand: 'Keychron',
      price: 690000,
      oldPrice: null,
      stock: 5,
      active: true,
      featured: false,
      image: makeProductSvg('keyboard', 'Keychron', 'Q1 Pro Wireless', '#0EA5A4'),
      detailUrl: 'product-peripherals.html?id=per-02',
      shortDesc: 'CNC хөнгөн цагаан их биетэй, macOS болон Windows-д тохируулж болох QMK/VIA гар.',
      specs: {
        layout: '75% компакт',
        switchType: 'Keychron K Pro Red',
        connection: 'Bluetooth 5.1 / USB-C',
        pollingRateHz: 1000,
        rgb: 'South-facing RGB'
      }
    },
    {
      id: 'per-03',
      name: 'LG UltraGear 27GS75Q 27" QHD 180Hz',
      category: 'peripherals',
      type: 'monitor',
      subCategory: 'Монитор',
      brand: 'LG',
      price: 1120000,
      oldPrice: 1240000,
      stock: 6,
      active: true,
      featured: true,
      image: makeProductSvg('monitor', 'LG', 'UltraGear 27GS75Q', '#E11D48'),
      detailUrl: 'product-peripherals.html?id=per-03',
      shortDesc: '2560x1440 IPS 180Hz 1ms тоглоомын болон дизайны өргөн өнгөний хүрээтэй монитор.',
      specs: {
        displayInch: 27,
        resolution: '2560 x 1440 (QHD)',
        panelType: 'IPS',
        refreshRateHz: 180,
        responseTimeMs: 1,
        usbHub: 'Байхгүй'
      }
    },
    {
      id: 'per-04',
      name: 'ASUS TUF Gaming VG27AQ3A 27"',
      category: 'peripherals',
      type: 'monitor',
      subCategory: 'Монитор',
      brand: 'ASUS',
      price: 980000,
      oldPrice: null,
      stock: 8,
      active: true,
      featured: false,
      image: makeProductSvg('monitor', 'ASUS TUF', 'VG27AQ3A 27"', '#0284C7'),
      detailUrl: 'product-peripherals.html?id=per-04',
      shortDesc: 'Fast IPS 180Hz дэлгэц, ELMB Sync болон FreeSync Premium дэмжлэгтэй монитор.',
      specs: {
        displayInch: 27,
        resolution: '2560 x 1440 (QHD)',
        panelType: 'Fast IPS',
        refreshRateHz: 180,
        responseTimeMs: 1
      }
    },
    {
      id: 'per-05',
      name: 'Logitech G Pro X Superlight 2',
      category: 'peripherals',
      type: 'mouse',
      subCategory: 'Хулгана',
      brand: 'Logitech',
      price: 540000,
      oldPrice: 590000,
      stock: 9,
      active: true,
      featured: false,
      image: makeProductSvg('mouse', 'Logitech', 'Superlight 2', '#0EA5A4'),
      detailUrl: 'product-peripherals.html?id=per-05',
      shortDesc: '60 грамм жинтэй, HERO 2 мэдрэгчтэй кибер спортын утасгүй хулгана.',
      specs: {
        sensor: 'HERO 2 Optical',
        maxDpi: 32000,
        weightG: 60,
        connection: 'LIGHTSPEED 2.4GHz / USB-C',
        batteryHours: 95
      }
    },
    {
      id: 'per-06',
      name: 'Razer DeathAdder V3 Pro',
      category: 'peripherals',
      type: 'mouse',
      subCategory: 'Хулгана',
      brand: 'Razer',
      price: 495000,
      oldPrice: null,
      stock: 5,
      active: true,
      featured: false,
      image: makeProductSvg('mouse', 'Razer', 'DeathAdder V3 Pro', '#16A34A'),
      detailUrl: 'product-peripherals.html?id=per-06',
      shortDesc: 'Эргономик барьцтай, Focus Pro 30K оптик мэдрэгчтэй хэт хөнгөн хулгана.',
      specs: {
        sensor: 'Focus Pro 30K',
        maxDpi: 30000,
        weightG: 63,
        connection: 'HyperSpeed 2.4GHz / USB-C'
      }
    },

    /* ================= 5. NETWORK (Сүлжээ ба бусад төхөөрөмж) ================= */
    {
      id: 'net-01',
      name: 'TP-Link Archer C24',
      category: 'network',
      type: 'router',
      subCategory: 'Wi-Fi чиглүүлэгч',
      brand: 'TP-Link',
      price: 115000,
      oldPrice: 135000,
      stock: 15,
      active: true,
      featured: true,
      image: makeProductSvg('router', 'TP-Link', 'Archer C24 AC750', '#0EA5A4'),
      detailUrl: 'product-network.html',
      shortDesc: '2.4GHz ба 5GHz хос зурваст ажилладаг авсаархан, найдвартай гэрийн Wi-Fi чиглүүлэгч.',
      specs: {
        wifiStandard: 'Wi-Fi 5 (802.11ac)',
        bands: 'Dual-Band (2.4GHz + 5GHz)',
        maxSpeedMbps: 750,
        ports: '4x LAN, 1x WAN (100Mbps)',
        antennas: 4,
        meshSupport: 'Дэмжихгүй'
      }
    },
    {
      id: 'net-02',
      name: 'TP-Link Archer AX55 Wi-Fi 6',
      category: 'network',
      type: 'router',
      subCategory: 'Wi-Fi чиглүүлэгч',
      brand: 'TP-Link',
      price: 345000,
      oldPrice: null,
      stock: 8,
      active: true,
      featured: false,
      image: makeProductSvg('router', 'TP-Link', 'Archer AX55 AX3000', '#0284C7'),
      detailUrl: 'product-network.html?id=net-02',
      shortDesc: 'Гигабит порт, OFDMA технологи бүхий өндөр хурдны Wi-Fi 6 чиглүүлэгч.',
      specs: {
        wifiStandard: 'Wi-Fi 6 (802.11ax)',
        bands: 'Dual-Band (2.4GHz + 5GHz)',
        maxSpeedMbps: 3000,
        ports: '4x Gigabit LAN, 1x Gigabit WAN, USB 3.0',
        antennas: 4
      }
    },
    {
      id: 'net-03',
      name: 'ASUS RT-AX57 Go Wi-Fi 6',
      category: 'network',
      type: 'router',
      subCategory: 'Wi-Fi чиглүүлэгч',
      brand: 'ASUS',
      price: 385000,
      oldPrice: 420000,
      stock: 5,
      active: true,
      featured: false,
      image: makeProductSvg('router', 'ASUS', 'RT-AX57 Go AX3000', '#0F766E'),
      detailUrl: 'product-network.html?id=net-03',
      shortDesc: 'AiMesh болон суурилуулсан VPN хамгаалалттай оффис, аяллын Wi-Fi 6 чиглүүлэгч.',
      specs: {
        wifiStandard: 'Wi-Fi 6 (802.11ax)',
        bands: 'Dual-Band (2.4GHz + 5GHz)',
        maxSpeedMbps: 3000,
        ports: '1x Gigabit WAN, 1x Gigabit LAN, USB-C',
        antennas: 3,
        meshSupport: 'ASUS AiMesh дэмжинэ'
      }
    },
    {
      id: 'net-04',
      name: 'APC Back-UPS 1100VA (BX1100LI)',
      category: 'network',
      type: 'ups',
      subCategory: 'Тог баригч (UPS)',
      brand: 'APC',
      price: 430000,
      oldPrice: 475000,
      stock: 6,
      active: true,
      featured: false,
      image: makeProductSvg('ups', 'APC', 'Back-UPS 1100VA', '#DC2626'),
      detailUrl: 'product-network.html?id=net-04',
      shortDesc: 'Цахилгааны хэлбэлзэл болон тасралтаас компьютер, сүлжээний төхөөрөмжийг хамгаална.',
      specs: {
        capacityVa: 1100,
        capacityWatt: 550,
        outlets: 4,
        avr: 'Тийм (Автомат тогтворжуулагчтай)',
        usbMonitoring: 'Байгаа'
      }
    },
    {
      id: 'net-05',
      name: 'CyberPower UT1050EG 1050VA',
      category: 'network',
      type: 'ups',
      subCategory: 'Тог баригч (UPS)',
      brand: 'CyberPower',
      price: 360000,
      oldPrice: null,
      stock: 7,
      active: true,
      featured: false,
      image: makeProductSvg('ups', 'CyberPower', 'UT1050EG 1050VA', '#0EA5A4'),
      detailUrl: 'product-network.html?id=net-05',
      shortDesc: 'Батерей хэмнэх GreenPower горимтой, гэрийн болон жижиг оффисын UPS.',
      specs: {
        capacityVa: 1050,
        capacityWatt: 630,
        outlets: 3,
        avr: 'Тийм (Автомат тогтворжуулагчтай)'
      }
    }
  ];

  var seedUsers = [
    {
      id: 'usr-01',
      name: 'Ж.Баярсайхан',
      email: 'bayarsaikhan@futuretech.mn',
      phone: '9911-0009',
      address: 'Улаанбаатар хот, Сүхбаатар дүүрэг, 8-р хороо',
      role: 'customer'
    },
    {
      id: 'usr-02',
      name: 'А.Атилла',
      email: 'atilla@futuretech.mn',
      phone: '9922-0224',
      address: 'Улаанбаатар хот, Баянзүрх дүүрэг, 14-р хороо',
      role: 'customer'
    },
    {
      id: 'adm-01',
      name: 'Э.Билиг-Очир (Админ)',
      email: 'admin@futuretech.mn',
      phone: '9933-0021',
      address: 'Future-Tech Төв салбар',
      role: 'admin'
    }
  ];

  var seedOrders = [
    {
      orderId: 'FT-2026-1001',
      userId: 'usr-01',
      createdAt: '2026-11-20T14:15:00+08:00',
      items: [
        {
          productId: 'net-01',
          name: 'TP-Link Archer C24',
          price: 115000,
          qty: 1
        }
      ],
      total: 115000,
      address: 'Улаанбаатар хот, Сүхбаатар дүүрэг, 8-р хороо',
      phone: '9911-0009',
      paymentMethod: 'QPay',
      paymentStatus: 'Хүлээгдэж буй',
      orderStatus: 'Шинэ'
    }
  ];

  var seedContent = [
    {
      id: 'cnt-01',
      type: 'guide',
      title: 'Компьютер угсрах үед анхаарах үндсэн 2 нийцэл',
      summary: 'Процессорын сокет (AM5/LGA1700) болон санах ойн төрөл (DDR4/DDR5)-ийг эх хавтантай хэрхэн тааруулах тухай.',
      published: true
    },
    {
      id: 'cnt-02',
      type: 'faq',
      title: 'Хүргэлт хэдэн цагийн дотор хийгддэг вэ?',
      summary: 'Сургалтын жишээ систем дээр хүргэлтийн төлбөр 0 ₮ бөгөөд захиалга баталгаажуулсны дараа захиалгын түүхээс төлөвийг хянана.',
      published: true
    }
  ];

  global.FT_SEED_DATA = {
    categories: categories,
    typeLabels: typeLabels,
    specSchemas: specSchemas,
    products: products,
    users: seedUsers,
    orders: seedOrders,
    content: seedContent
  };
})(window);
