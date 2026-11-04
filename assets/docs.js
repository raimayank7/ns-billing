/* NS documents: the editor, live A4 preview, saving and history for every document site.
   A site picks its document type with <section id="tool" data-doc="invoice">. */
(function () {
  'use strict';
  var $ = NS.$, $$ = NS.$$, esc = NS.esc, num = NS.num, r2 = NS.r2;

  var TYPES = {
    invoice: {
      name: 'Invoice', prefix: 'INV', kinds: [['tax', 'Tax invoice'], ['supply', 'Bill of supply'], ['plain', 'Invoice (not GST registered)']],
      due: true, ref: 'Order / PO number', copy: true
    }
  };

  /* words printed on the document, in three languages */
  var L = {
    en: { tax: 'TAX INVOICE', supply: 'BILL OF SUPPLY', plain: 'INVOICE', no: 'Invoice No.', date: 'Date', due: 'Due date', pos: 'Place of supply', rc: 'Reverse charge', ref: 'Order ref.', billto: 'Bill to', shipto: 'Ship to', gstin: 'GSTIN', ph: 'Phone', item: 'Item / service', hsn: 'HSN/SAC', qty: 'Qty', rate: 'Rate', disc: 'Disc.', taxable: 'Taxable value', gst: 'GST', amount: 'Amount', subtotal: 'Taxable value', cgst: 'CGST', sgst: 'SGST', igst: 'IGST', round: 'Round off', total: 'Total', words: 'Amount in words', summary: 'Tax summary', bank: 'Bank details', acc: 'A/c no.', ifsc: 'IFSC', branch: 'Branch', upi: 'Scan to pay by UPI', notes: 'Notes', terms: 'Terms and conditions', for: 'For', sign: 'Authorised signatory', yes: 'Yes', no2: 'No', supplynote: 'Composition taxable person, not eligible to collect tax on supplies.', paid: 'PAID', orig: 'Original for recipient', dup: 'Duplicate for transporter', trip: 'Triplicate for supplier' },
    hi: { tax: 'कर बीजक (TAX INVOICE)', supply: 'आपूर्ति का बिल (BILL OF SUPPLY)', plain: 'बीजक (INVOICE)', no: 'बीजक सं.', date: 'दिनांक', due: 'भुगतान तिथि', pos: 'आपूर्ति का स्थान', rc: 'रिवर्स चार्ज', ref: 'ऑर्डर सं.', billto: 'खरीदार', shipto: 'भेजने का पता', gstin: 'GSTIN', ph: 'फ़ोन', item: 'विवरण', hsn: 'HSN/SAC', qty: 'मात्रा', rate: 'दर', disc: 'छूट', taxable: 'करयोग्य मूल्य', gst: 'GST', amount: 'राशि', subtotal: 'करयोग्य मूल्य', cgst: 'CGST', sgst: 'SGST', igst: 'IGST', round: 'पूर्णांकन', total: 'कुल', words: 'राशि शब्दों में', summary: 'कर सारांश', bank: 'बैंक विवरण', acc: 'खाता सं.', ifsc: 'IFSC', branch: 'शाखा', upi: 'UPI से भुगतान के लिए स्कैन करें', notes: 'टिप्पणी', terms: 'नियम और शर्तें', for: 'कृते', sign: 'अधिकृत हस्ताक्षरकर्ता', yes: 'हाँ', no2: 'नहीं', supplynote: 'कंपोजिशन करदाता, आपूर्ति पर कर लेने का पात्र नहीं।', paid: 'भुगतान हो गया', orig: 'प्राप्तकर्ता के लिए मूल', dup: 'ट्रांसपोर्टर के लिए द्वितीय प्रति', trip: 'आपूर्तिकर्ता के लिए तृतीय प्रति' },
    pa: { tax: 'ਟੈਕਸ ਇਨਵਾਇਸ (TAX INVOICE)', supply: 'ਸਪਲਾਈ ਦਾ ਬਿੱਲ (BILL OF SUPPLY)', plain: 'ਇਨਵਾਇਸ (INVOICE)', no: 'ਇਨਵਾਇਸ ਨੰ.', date: 'ਤਾਰੀਖ', due: 'ਭੁਗਤਾਨ ਤਾਰੀਖ', pos: 'ਸਪਲਾਈ ਦੀ ਥਾਂ', rc: 'ਰਿਵਰਸ ਚਾਰਜ', ref: 'ਆਰਡਰ ਨੰ.', billto: 'ਖਰੀਦਦਾਰ', shipto: 'ਭੇਜਣ ਦਾ ਪਤਾ', gstin: 'GSTIN', ph: 'ਫ਼ੋਨ', item: 'ਵੇਰਵਾ', hsn: 'HSN/SAC', qty: 'ਮਿਕਦਾਰ', rate: 'ਰੇਟ', disc: 'ਛੋਟ', taxable: 'ਟੈਕਸ ਯੋਗ ਮੁੱਲ', gst: 'GST', amount: 'ਰਕਮ', subtotal: 'ਟੈਕਸ ਯੋਗ ਮੁੱਲ', cgst: 'CGST', sgst: 'SGST', igst: 'IGST', round: 'ਪੂਰਨਾਂਕਣ', total: 'ਕੁੱਲ', words: 'ਰਕਮ ਸ਼ਬਦਾਂ ਵਿੱਚ', summary: 'ਟੈਕਸ ਸੰਖੇਪ', bank: 'ਬੈਂਕ ਵੇਰਵੇ', acc: 'ਖਾਤਾ ਨੰ.', ifsc: 'IFSC', branch: 'ਸ਼ਾਖਾ', upi: 'UPI ਨਾਲ ਭੁਗਤਾਨ ਲਈ ਸਕੈਨ ਕਰੋ', notes: 'ਨੋਟ', terms: 'ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ', for: 'ਵੱਲੋਂ', sign: 'ਅਧਿਕਾਰਤ ਦਸਤਖਤਕਾਰ', yes: 'ਹਾਂ', no2: 'ਨਹੀਂ', supplynote: 'ਕੰਪੋਜ਼ੀਸ਼ਨ ਟੈਕਸਦਾਤਾ, ਸਪਲਾਈ ਤੇ ਟੈਕਸ ਲੈਣ ਦਾ ਹੱਕਦਾਰ ਨਹੀਂ।', paid: 'ਭੁਗਤਾਨ ਹੋ ਗਿਆ', orig: 'ਪ੍ਰਾਪਤਕਰਤਾ ਲਈ ਅਸਲ', dup: 'ਟਰਾਂਸਪੋਰਟਰ ਲਈ ਦੂਜੀ ਕਾਪੀ', trip: 'ਸਪਲਾਇਰ ਲਈ ਤੀਜੀ ਕਾਪੀ' }
  };
  var UNITS = ['Nos', 'Pcs', 'Kg', 'Gm', 'Ltr', 'Ml', 'Mtr', 'Sq ft', 'Box', 'Pack', 'Set', 'Pair', 'Dozen', 'Bag', 'Ton', 'Hrs', 'Days', 'Month', 'Job'];
  var RATES = [0, 0.25, 3, 5, 12, 18, 28, 40];
  var ACCENTS = ['#0B3B5B', '#1D4ED8', '#047857', '#B45309', '#9D174D', '#334155'];

  var root, T, doc, editingId = null, sheet;

  function blank() {
    return {
      type: root.getAttribute('data-doc'), kind: 'tax', no: '', date: NS.today(), due: '', pos: '', rc: false, ref: '',
      seller: { name: '', addr: '', state: '', gstin: '', phone: '', email: '', logo: '', sign: '', bankName: '', bankAcc: '', bankIfsc: '', bankBranch: '', upi: '' },
      buyer: { name: '', addr: '', state: '', gstin: '', phone: '' }, ship: null,
      items: [{ desc: '', hsn: '', qty: 1, unit: 'Nos', rate: '', disc: '', gst: 18 }],
      round: true, comp: true, notes: '', terms: '', lang: 'en', accent: ACCENTS[0], status: 'unpaid', copyLabel: 'orig'
    };
  }

  /* ---------- totals ---------- */
  function totals(d) {
    var noTax = d.kind !== 'tax';
    var origin = d.seller.state, dest = d.pos || d.buyer.state || origin;
    var intra = !origin || !dest || origin === dest;
    var t = { rows: [], taxable: 0, cgst: 0, sgst: 0, igst: 0, intra: intra, noTax: noTax, sum: {} };
    d.items.forEach(function (it) {
      var q = num(it.qty), rate = num(it.rate);
      if (!it.desc && !rate) return;
      var gross = q * rate, disc = gross * num(it.disc) / 100, taxable = r2(gross - disc);
      var g = noTax ? 0 : num(it.gst), tax = r2(taxable * g / 100);
      var row = { it: it, gross: gross, taxable: taxable, g: g, tax: tax, amount: r2(taxable + tax) };
      t.rows.push(row);
      t.taxable += taxable;
      if (!noTax) {
        if (intra) { t.cgst += tax / 2; t.sgst += tax / 2; } else t.igst += tax;
        var k = (it.hsn || '—') + '|' + g;
        var s = t.sum[k] || (t.sum[k] = { hsn: it.hsn || '—', g: g, taxable: 0, tax: 0 });
        s.taxable += taxable; s.tax += tax;
      }
    });
    t.taxable = r2(t.taxable); t.cgst = r2(t.cgst); t.sgst = r2(t.sgst); t.igst = r2(t.igst);
    var total = r2(t.taxable + t.cgst + t.sgst + t.igst);
    t.roundOff = d.round ? r2(Math.round(total) - total) : 0;
    t.grand = r2(total + t.roundOff);
    return t;
  }

  /* ---------- editor ---------- */
  function stateOptions(sel) {
    return '<option value="">Choose state</option>' + NS.STATES.map(function (s) { return '<option value="' + s[0] + '"' + (s[0] === sel ? ' selected' : '') + '>' + s[1] + ' (' + s[0] + ')</option>'; }).join('');
  }
  function field(id, label, opts) {
    opts = opts || {};
    var type = opts.type || 'text', hint = opts.hint ? '<small class="hint">' + opts.hint + '</small>' : '';
    var input = type === 'textarea' ? '<textarea id="' + id + '" rows="' + (opts.rows || 2) + '" placeholder="' + esc(opts.ph || '') + '"></textarea>'
      : type === 'state' ? '<select id="' + id + '"></select>'
      : '<input id="' + id + '" type="' + type + '"' + (opts.mode ? ' inputmode="' + opts.mode + '"' : '') + ' placeholder="' + esc(opts.ph || '') + '"' + (opts.max ? ' maxlength="' + opts.max + '"' : '') + '>';
    return '<div class="f' + (opts.wide ? ' wide' : '') + '"><label for="' + id + '">' + label + '</label>' + input + hint + '<small class="err" id="' + id + '-err" hidden></small></div>';
  }
  function buildEditor() {
    var ed = $('#ed', root);
    ed.innerHTML =
      '<fieldset class="card"><legend>Your business</legend><div class="fg">' +
        field('s-name', 'Business name', { ph: 'Type your business name', wide: true, hint: 'Saved businesses appear as you type.' }) +
        field('s-addr', 'Address', { type: 'textarea', wide: true, ph: 'Shop no., street, city, PIN' }) +
        field('s-state', 'State', { type: 'state' }) +
        field('s-gstin', 'GSTIN', { ph: '15 characters', max: 15 }) +
        field('s-phone', 'Phone', { type: 'tel', mode: 'tel' }) +
        field('s-email', 'Email', { type: 'email' }) +
      '</div><details class="more"><summary>Logo, signature and bank details</summary><div class="fg">' +
        '<div class="f"><label for="s-logo">Logo</label><input id="s-logo" type="file" accept="image/*"><button type="button" class="link" data-clear="logo" hidden>Remove logo</button></div>' +
        '<div class="f"><label for="s-sign">Signature or stamp</label><input id="s-sign" type="file" accept="image/*"><button type="button" class="link" data-clear="sign" hidden>Remove signature</button></div>' +
        field('s-bankName', 'Bank name') + field('s-bankAcc', 'Account number', { mode: 'numeric' }) +
        field('s-bankIfsc', 'IFSC', { max: 11 }) + field('s-bankBranch', 'Branch') +
        field('s-upi', 'UPI ID (for the pay-by-QR code)', { ph: 'name@bank', wide: true }) +
      '</div></details></fieldset>' +

      '<fieldset class="card"><legend>' + T.name + ' details</legend><div class="fg">' +
        '<div class="f wide"><label for="d-kind">Type</label><select id="d-kind">' + T.kinds.map(function (k) { return '<option value="' + k[0] + '">' + k[1] + '</option>'; }).join('') + '</select><small class="hint" id="kind-hint"></small></div>' +
        '<div class="f wide" id="comp-box" hidden><label class="chk"><input id="d-comp" type="checkbox"> I am in the composition scheme (prints the note the rules require)</label></div>' +
        field('d-no', T.name + ' number', { max: 16, hint: 'Up to 16 letters, numbers, / or -. A new number is suggested for each bill.' }) +
        field('d-date', 'Date', { type: 'date' }) +
        (T.due ? field('d-due', 'Due date', { type: 'date' }) : '') +
        field('d-pos', 'Place of supply', { type: 'state', hint: 'Usually the buyer’s state. It decides CGST + SGST or IGST.' }) +
        field('d-ref', T.ref, {}) +
        '<div class="f"><label class="chk"><input id="d-rc" type="checkbox"> Tax payable on reverse charge</label></div>' +
      '</div></fieldset>' +

      '<fieldset class="card"><legend>Bill to</legend><div class="fg">' +
        field('b-name', 'Customer name', { ph: 'Type the customer’s name', wide: true, hint: 'Saved customers appear as you type.' }) +
        field('b-addr', 'Address', { type: 'textarea', wide: true }) +
        field('b-state', 'State', { type: 'state' }) +
        field('b-gstin', 'GSTIN (if registered)', { max: 15 }) +
        field('b-phone', 'Phone', { type: 'tel', mode: 'tel' }) +
        '<div class="f"><label class="chk"><input id="b-ship" type="checkbox"> Ship to a different address</label></div>' +
      '</div><div class="fg" id="ship-box" hidden>' +
        field('sh-name', 'Ship to name', { wide: true }) + field('sh-addr', 'Ship to address', { type: 'textarea', wide: true }) + field('sh-state', 'Ship to state', { type: 'state' }) +
      '</div></fieldset>' +

      '<fieldset class="card"><legend>Items</legend><div id="items" class="items"></div>' +
        '<button type="button" class="btn" id="add-item">+ Add item</button>' +
        '<datalist id="dl-units">' + UNITS.map(function (u) { return '<option value="' + u + '">'; }).join('') + '</datalist>' +
        '<datalist id="dl-rates">' + RATES.map(function (u) { return '<option value="' + u + '">'; }).join('') + '</datalist>' +
        '<div class="sums" id="ed-sums" aria-live="polite"></div>' +
      '</fieldset>' +

      '<fieldset class="card"><legend>Notes and look</legend><div class="fg">' +
        field('d-notes', 'Notes', { type: 'textarea', wide: true, ph: 'For example: Thank you for your business.' }) +
        field('d-terms', 'Terms and conditions', { type: 'textarea', wide: true, ph: 'For example: Payment within 15 days. Interest at 18% a year after the due date.' }) +
        '<div class="f"><label for="d-lang">Language on the ' + T.name.toLowerCase() + '</label><select id="d-lang"><option value="en">English</option><option value="hi">हिंदी (Hindi)</option><option value="pa">ਪੰਜਾਬੀ (Punjabi)</option></select></div>' +
        (T.copy ? '<div class="f"><label for="d-copy">Copy label</label><select id="d-copy"><option value="orig">Original for recipient</option><option value="dup">Duplicate for transporter</option><option value="trip">Triplicate for supplier</option><option value="">No label</option></select></div>' : '') +
        '<div class="f"><span class="lbl" id="acc-lbl">Colour</span><div class="swatches" role="radiogroup" aria-labelledby="acc-lbl">' + ACCENTS.map(function (c, i) { return '<button type="button" role="radio" class="sw" data-accent="' + c + '" style="--c:' + c + '" aria-label="Colour ' + (i + 1) + '"></button>'; }).join('') + '</div></div>' +
        '<div class="f"><label class="chk"><input id="d-round" type="checkbox"> Round off the total</label></div>' +
        '<div class="f"><label for="d-status">Payment</label><select id="d-status"><option value="unpaid">Not paid yet</option><option value="paid">Paid</option></select></div>' +
      '</div></fieldset>';

    $$('select[id$="state"], #d-pos', ed).forEach(function (s) { s.innerHTML = stateOptions(''); });
    $('#d-pos', ed).innerHTML = stateOptions('').replace('Choose state', 'Same as buyer’s state');
    ed.addEventListener('input', onInput);
    ed.addEventListener('change', onInput);
    $('#add-item', ed).addEventListener('click', function () { doc.items.push({ desc: '', hsn: '', qty: 1, unit: 'Nos', rate: '', disc: '', gst: doc.items.length ? doc.items[doc.items.length - 1].gst : 18 }); renderItems(); var d = $$('#items .it-desc', ed); d[d.length - 1].focus(); });
    $$('[data-accent]', ed).forEach(function (b) { b.addEventListener('click', function () { doc.accent = b.getAttribute('data-accent'); fillForm(true); draw(); }); });
    ['logo', 'sign'].forEach(function (k) {
      $('#s-' + k, ed).addEventListener('change', function (e) { var f = e.target.files[0]; if (f) shrink(f, k === 'logo' ? 360 : 420).then(function (u) { doc.seller[k] = u; fillForm(true); draw(); }); });
      $('[data-clear="' + k + '"]', ed).addEventListener('click', function () { doc.seller[k] = ''; $('#s-' + k, ed).value = ''; fillForm(true); draw(); });
    });

    NS.suggest($('#s-name', ed), function () { return NSStore.list('biz'); }, function (x) { return x.name; }, function (b) {
      var keep = { logo: b.logo || '', sign: b.sign || '' };
      doc.seller = Object.assign(blank().seller, b, keep); delete doc.seller.id; delete doc.seller.created; delete doc.seller.updated;
      fillForm(); suggestNumber(true); draw();
    });
    NS.suggest($('#b-name', ed), function () { return NSStore.list('party'); }, function (x) { return x.name; }, function (p) {
      doc.buyer = { name: p.name, addr: p.addr || '', state: p.state || '', gstin: p.gstin || '', phone: p.phone || '' };
      if (!doc.pos) doc.pos = '';
      fillForm(); draw();
    });
  }

  function renderItems() {
    var box = $('#items', root);
    box.innerHTML = doc.items.map(function (it, i) {
      return '<div class="it" data-i="' + i + '"><div class="it-head"><span>Item ' + (i + 1) + '</span>' + (doc.items.length > 1 ? '<button type="button" class="link" data-del="' + i + '" aria-label="Remove item ' + (i + 1) + '">Remove</button>' : '') + '</div>' +
        '<div class="it-grid">' +
        '<div class="f it-d"><label for="it-desc-' + i + '">Description</label><input id="it-desc-' + i + '" class="it-desc" data-k="desc" value="' + esc(it.desc) + '" placeholder="Item or service"></div>' +
        '<div class="f"><label for="it-hsn-' + i + '">HSN/SAC</label><input id="it-hsn-' + i + '" data-k="hsn" inputmode="numeric" maxlength="8" value="' + esc(it.hsn) + '"></div>' +
        '<div class="f"><label for="it-qty-' + i + '">Qty</label><input id="it-qty-' + i + '" data-k="qty" inputmode="decimal" value="' + esc(it.qty) + '"></div>' +
        '<div class="f"><label for="it-unit-' + i + '">Unit</label><input id="it-unit-' + i + '" data-k="unit" list="dl-units" value="' + esc(it.unit) + '"></div>' +
        '<div class="f"><label for="it-rate-' + i + '">Rate (₹)</label><input id="it-rate-' + i + '" data-k="rate" inputmode="decimal" value="' + esc(it.rate) + '"></div>' +
        '<div class="f"><label for="it-disc-' + i + '">Disc. %</label><input id="it-disc-' + i + '" data-k="disc" inputmode="decimal" value="' + esc(it.disc) + '"></div>' +
        '<div class="f it-gst"><label for="it-gst-' + i + '">GST %</label><input id="it-gst-' + i + '" data-k="gst" inputmode="decimal" list="dl-rates" value="' + esc(it.gst) + '"></div>' +
        '</div></div>';
    }).join('');
    $$('[data-del]', box).forEach(function (b) { b.addEventListener('click', function () { doc.items.splice(+b.getAttribute('data-del'), 1); renderItems(); draw(); }); });
    $$('.it-desc', box).forEach(function (inp) {
      var i = +inp.closest('.it').getAttribute('data-i');
      NS.suggest(inp, function () { return NSStore.list('item'); }, function (x) { return x.desc; }, function (m) {
        var it = doc.items[i];
        it.desc = m.desc; it.hsn = m.hsn || ''; it.unit = m.unit || it.unit; it.rate = m.rate != null ? m.rate : it.rate; if (m.gst != null && m.gst !== '') it.gst = m.gst;
        renderItems(); draw();
      });
    });
    $$('.it-gst', box).forEach(function (f) { f.hidden = doc.kind !== 'tax'; });
  }

  var SMAP = { 's-name': 'name', 's-addr': 'addr', 's-state': 'state', 's-gstin': 'gstin', 's-phone': 'phone', 's-email': 'email', 's-bankName': 'bankName', 's-bankAcc': 'bankAcc', 's-bankIfsc': 'bankIfsc', 's-bankBranch': 'bankBranch', 's-upi': 'upi' };
  var BMAP = { 'b-name': 'name', 'b-addr': 'addr', 'b-state': 'state', 'b-gstin': 'gstin', 'b-phone': 'phone' };
  var SHMAP = { 'sh-name': 'name', 'sh-addr': 'addr', 'sh-state': 'state' };
  var DMAP = { 'd-kind': 'kind', 'd-no': 'no', 'd-date': 'date', 'd-due': 'due', 'd-pos': 'pos', 'd-ref': 'ref', 'd-notes': 'notes', 'd-terms': 'terms', 'd-lang': 'lang', 'd-status': 'status', 'd-copy': 'copyLabel' };

  function fillForm(onlyLook) {
    var ed = $('#ed', root);
    if (!onlyLook) {
      Object.keys(SMAP).forEach(function (id) { var e = $('#' + id, ed); if (e) e.value = doc.seller[SMAP[id]] || ''; });
      Object.keys(BMAP).forEach(function (id) { $('#' + id, ed).value = doc.buyer[BMAP[id]] || ''; });
      Object.keys(DMAP).forEach(function (id) { var e = $('#' + id, ed); if (e) e.value = doc[DMAP[id]] == null ? '' : doc[DMAP[id]]; });
      $('#d-rc', ed).checked = !!doc.rc; $('#d-round', ed).checked = !!doc.round; $('#d-comp', ed).checked = doc.comp !== false;
      $('#b-ship', ed).checked = !!doc.ship; $('#ship-box', ed).hidden = !doc.ship;
      if (doc.ship) Object.keys(SHMAP).forEach(function (id) { $('#' + id, ed).value = doc.ship[SHMAP[id]] || ''; });
      renderItems();
      ['s-gstin', 'b-gstin'].forEach(checkGstin);
    }
    $$('[data-accent]', ed).forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-accent') === doc.accent)); });
    $('[data-clear="logo"]', ed).hidden = !doc.seller.logo; $('[data-clear="sign"]', ed).hidden = !doc.seller.sign;
    $('#kind-hint', ed).textContent = doc.kind === 'tax' ? 'For GST-registered sellers charging GST.' : doc.kind === 'supply' ? 'For composition dealers, or for goods and services exempt from GST. No tax is charged.' : 'For sellers who are not registered under GST. No tax is charged.';
    $$('.it-gst', ed).forEach(function (f) { f.hidden = doc.kind !== 'tax'; });
    $('#comp-box', ed).hidden = doc.kind !== 'supply';
  }

  function checkGstin(id) {
    var inp = $('#' + id, root), err = $('#' + id + '-err', root), r = NS.gstinCheck(inp.value);
    err.hidden = r.ok; err.textContent = r.ok ? '' : r.msg;
    inp.setAttribute('aria-invalid', String(!r.ok));
    return r;
  }

  function onInput(e) {
    var t = e.target, id = t.id;
    if (SMAP[id]) doc.seller[SMAP[id]] = t.value;
    else if (BMAP[id]) doc.buyer[BMAP[id]] = t.value;
    else if (SHMAP[id]) { doc.ship = doc.ship || {}; doc.ship[SHMAP[id]] = t.value; }
    else if (DMAP[id]) doc[DMAP[id]] = t.value;
    else if (id === 'd-rc') doc.rc = t.checked;
    else if (id === 'd-round') doc.round = t.checked;
    else if (id === 'd-comp') doc.comp = t.checked;
    else if (id === 'b-ship') { doc.ship = t.checked ? (doc.ship || { name: '', addr: '', state: '' }) : null; $('#ship-box', root).hidden = !t.checked; }
    else if (t.getAttribute('data-k')) { var i = +t.closest('.it').getAttribute('data-i'); doc.items[i][t.getAttribute('data-k')] = t.value; }
    if (id === 's-gstin' || id === 'b-gstin') {
      t.value = t.value.toUpperCase();
      var who = id[0] === 's' ? doc.seller : doc.buyer; who.gstin = t.value;
      var r = checkGstin(id);
      if (r.ok && r.state && !who.state && e.type === 'change') { who.state = r.state; $('#' + id[0] + '-state', root).value = r.state; }
    }
    if (id === 'd-kind') fillForm(true);
    if (id === 'd-date' && e.type === 'change') suggestNumber(false);
    if (id === 'd-lang') loadScriptFont(doc.lang);
    draw(); saveDraft();
  }

  /* ---------- numbering: prefix/FY/serial, one series per business and financial year ---------- */
  function suggestNumber(force) {
    if (editingId && !force) return Promise.resolve();
    var fy = NS.fy(doc.date), short = fy.slice(2, 4) + '-' + fy.slice(5);
    var prefix = T.prefix + '/' + short + '/';
    return NSStore.list('doc').then(function (all) {
      var key = (doc.seller.name || '').trim().toLowerCase(), max = 0;
      all.forEach(function (d) {
        if (d.type !== doc.type || d.id === editingId || NS.fy(d.date) !== fy) return;
        if ((d.seller && d.seller.name || '').trim().toLowerCase() !== key) return;
        var m = String(d.no || '').match(/(\d+)\s*$/);
        if (m) max = Math.max(max, +m[1]);
      });
      if (force || !doc.no || /^[A-Z]+\/\d\d-\d\d\/\d+$/.test(doc.no)) {
        doc.no = prefix + String(max + 1).padStart(3, '0');
        var n = $('#d-no', root); if (n) n.value = doc.no;
        draw();
      }
    });
  }

  /* ---------- preview ---------- */
  var UT = { '04': 1, '26': 1, '31': 1, '35': 1, '38': 1 }; /* Union Territories without a legislature charge UTGST */
  function L_(k) {
    if (k === 'sgst' && UT[doc.seller.state] && totals(doc).intra) return 'UTGST';
    return (L[doc.lang] || L.en)[k] || L.en[k];
  }
  function party(p, title) {
    if (!p || !(p.name || p.addr)) return '<div class="pt"><h4>' + title + '</h4><p class="ph">Customer name and address</p></div>';
    return '<div class="pt"><h4>' + title + '</h4><b>' + esc(p.name) + '</b>' + (p.addr ? '<p>' + esc(p.addr).replace(/\n/g, '<br>') + '</p>' : '') +
      (p.state ? '<p>' + esc(NS.stateName(p.state)) + ' (' + p.state + ')</p>' : '') +
      (p.gstin ? '<p>' + L_('gstin') + ': <b class="mono">' + esc(p.gstin) + '</b></p>' : '') +
      (p.phone ? '<p>' + L_('ph') + ': ' + esc(p.phone) + '</p>' : '') + '</div>';
  }
  function draw() {
    if (!sheet) return;
    var d = doc, s = d.seller, t = totals(d), tax = d.kind === 'tax';
    var posCode = d.pos || d.buyer.state;
    var cols = tax ? 9 : 7;
    var h = '<div class="sh" style="--ac:' + esc(d.accent) + '" lang="' + (d.lang === 'en' ? 'en-IN' : d.lang) + '">' +
      (d.status === 'paid' ? '<div class="stamp">' + L_('paid') + '</div>' : '') +
      '<header class="sh-top"><div class="sh-from">' + (s.logo ? '<img class="logo" src="' + s.logo + '" alt="">' : '') +
        '<div><h2>' + (s.name ? esc(s.name) : '<span class="ph">Your business name</span>') + '</h2>' +
        (s.addr ? '<p>' + esc(s.addr).replace(/\n/g, '<br>') + '</p>' : '<p class="ph">Address</p>') +
        (s.state ? '<p>' + esc(NS.stateName(s.state)) + ' (' + s.state + ')</p>' : '') +
        (s.gstin ? '<p>' + L_('gstin') + ': <b class="mono">' + esc(s.gstin) + '</b></p>' : '') +
        ((s.phone || s.email) ? '<p>' + [s.phone ? L_('ph') + ': ' + esc(s.phone) : '', esc(s.email)].filter(Boolean).join(' · ') + '</p>' : '') +
      '</div></div><div class="sh-title"><h1>' + L_(d.kind) + '</h1>' + (d.copyLabel ? '<p class="copy">' + L_(d.copyLabel) + '</p>' : '') + '</div></header>' +
      '<table class="meta"><tr><th>' + L_('no') + '</th><td class="mono">' + esc(d.no) + '</td><th>' + L_('date') + '</th><td>' + NS.fmtDate(d.date) + '</td></tr>' +
        '<tr>' + (T.due ? '<th>' + L_('due') + '</th><td>' + NS.fmtDate(d.due) + '</td>' : '') + '<th>' + L_('pos') + '</th><td' + (T.due ? '' : ' colspan="3"') + '>' + (posCode ? esc(NS.stateName(posCode)) + ' (' + posCode + ')' : '') + '</td></tr>' +
        (tax || d.ref ? '<tr>' + (tax ? '<th>' + L_('rc') + '</th><td>' + (d.rc ? L_('yes') : L_('no2')) + '</td>' : '') + '<th>' + L_('ref') + '</th><td' + (tax ? '' : ' colspan="3"') + '>' + esc(d.ref) + '</td></tr>' : '') +
      '</table>' +
      '<div class="parties">' + party(d.buyer, L_('billto')) + (d.ship ? party(d.ship, L_('shipto')) : '') + '</div>' +
      '<table class="lines"><thead><tr><th>#</th><th class="l">' + L_('item') + '</th><th>' + L_('hsn') + '</th><th class="n">' + L_('qty') + '</th><th class="n">' + L_('rate') + '</th><th class="n">' + L_('disc') + '</th><th class="n">' + L_('taxable') + '</th>' + (tax ? '<th class="n">' + L_('gst') + '</th>' : '') + (tax ? '<th class="n">' + L_('amount') + '</th>' : '') + '</tr></thead><tbody>' +
      (t.rows.length ? t.rows.map(function (r, i) {
        return '<tr><td>' + (i + 1) + '</td><td class="l">' + esc(r.it.desc) + '</td><td class="mono">' + esc(r.it.hsn) + '</td><td class="n">' + NS.qty(num(r.it.qty)) + ' ' + esc(r.it.unit) + '</td><td class="n">' + NS.money(num(r.it.rate), false) + '</td><td class="n">' + (num(r.it.disc) ? num(r.it.disc) + '%' : '') + '</td><td class="n">' + NS.money(r.taxable, false) + '</td>' +
          (tax ? '<td class="n">' + r.g + '%</td><td class="n">' + NS.money(r.amount, false) + '</td>' : '') + '</tr>';
      }).join('') : '<tr><td colspan="' + cols + '" class="ph">Items you add appear here</td></tr>') +
      '</tbody></table>' +
      '<div class="foot"><div class="foot-l">' +
        '<p class="words"><span>' + L_('words') + ':</span> <b>' + NS.inWords(t.grand) + '</b></p>' +
        (tax && Object.keys(t.sum).length ? summaryTable(t) : '') +
        (d.kind === 'supply' && d.comp !== false ? '<p class="small">' + L_('supplynote') + '</p>' : '') +
        (s.bankAcc || s.bankName ? '<div class="bank"><h4>' + L_('bank') + '</h4><p>' + esc(s.bankName) + (s.bankAcc ? '<br>' + L_('acc') + ' <b class="mono">' + esc(s.bankAcc) + '</b>' : '') + (s.bankIfsc ? '<br>' + L_('ifsc') + ' <b class="mono">' + esc(s.bankIfsc) + '</b>' : '') + (s.bankBranch ? '<br>' + L_('branch') + ': ' + esc(s.bankBranch) : '') + '</p></div>' : '') +
      '</div><div class="foot-r"><table class="tot"><tr><th>' + L_('subtotal') + '</th><td>' + NS.money(t.taxable) + '</td></tr>' +
        (tax ? (t.intra ? '<tr><th>' + L_('cgst') + '</th><td>' + NS.money(t.cgst) + '</td></tr><tr><th>' + L_('sgst') + '</th><td>' + NS.money(t.sgst) + '</td></tr>' : '<tr><th>' + L_('igst') + '</th><td>' + NS.money(t.igst) + '</td></tr>') : '') +
        (t.roundOff ? '<tr><th>' + L_('round') + '</th><td>' + (t.roundOff > 0 ? '+' : '−') + NS.money(Math.abs(t.roundOff)) + '</td></tr>' : '') +
        '<tr class="grand"><th>' + L_('total') + '</th><td>' + NS.money(t.grand) + '</td></tr></table>' +
        (s.upi && t.grand > 0 && d.status !== 'paid' ? '<div class="qr"><div class="qr-img" data-qr></div><small>' + L_('upi') + '<br><b class="mono">' + esc(s.upi) + '</b></small></div>' : '') +
      '</div></div>' +
      (d.notes || d.terms ? '<div class="nt">' + (d.notes ? '<div><h4>' + L_('notes') + '</h4><p>' + esc(d.notes).replace(/\n/g, '<br>') + '</p></div>' : '') + (d.terms ? '<div><h4>' + L_('terms') + '</h4><p>' + esc(d.terms).replace(/\n/g, '<br>') + '</p></div>' : '') + '</div>' : '') +
      '<div class="signbox"><p>' + L_('for') + ' <b>' + esc(s.name || '') + '</b></p>' + (s.sign ? '<img src="' + s.sign + '" alt="">' : '<div class="sp"></div>') + '<p>' + L_('sign') + '</p></div>' +
      '<p class="made">Made free at ' + esc(location.hostname.replace(/^www\./, '') || 'billing.niveshsahayak.in') + '</p>' +
      '</div>';
    sheet.innerHTML = h;
    var q = $('[data-qr]', sheet);
    if (q) drawQr(q, s, d, t.grand);
    var es = $('#ed-sums', root);
    if (es) es.innerHTML = '<span>' + t.rows.length + ' item' + (t.rows.length === 1 ? '' : 's') + '</span><span>Taxable ' + NS.money(t.taxable) + '</span>' + (tax ? '<span>GST ' + NS.money(t.cgst + t.sgst + t.igst) + (t.intra ? ' (CGST + ' + L_('sgst') + ')' : ' (IGST)') + '</span>' : '') + '<b>Total ' + NS.money(t.grand) + '</b>';
    fit();
  }
  function summaryTable(t) {
    var rows = Object.keys(t.sum).map(function (k) { return t.sum[k]; });
    return '<table class="sum"><caption>' + L_('summary') + '</caption><thead><tr><th>' + L_('hsn') + '</th><th class="n">' + L_('taxable') + '</th><th class="n">' + L_('gst') + '</th>' +
      (t.intra ? '<th class="n">' + L_('cgst') + '</th><th class="n">' + L_('sgst') + '</th>' : '<th class="n">' + L_('igst') + '</th>') + '</tr></thead><tbody>' +
      rows.map(function (s) { return '<tr><td class="mono">' + esc(s.hsn) + '</td><td class="n">' + NS.money(s.taxable, false) + '</td><td class="n">' + s.g + '%</td>' + (t.intra ? '<td class="n">' + NS.money(s.tax / 2, false) + '</td><td class="n">' + NS.money(s.tax / 2, false) + '</td>' : '<td class="n">' + NS.money(s.tax, false) + '</td>') + '</tr>'; }).join('') +
      '</tbody></table>';
  }
  function drawQr(box, s, d, amount) {
    if (!window.qrcode) return;
    var link = 'upi://pay?pa=' + encodeURIComponent(s.upi.trim()) + '&pn=' + encodeURIComponent((s.name || '').slice(0, 40)) + '&am=' + amount.toFixed(2) + '&cu=INR&tn=' + encodeURIComponent((T.name + ' ' + d.no).slice(0, 40));
    try { var qr = qrcode(0, 'M'); qr.addData(link); qr.make(); box.innerHTML = qr.createSvgTag({ cellSize: 3, margin: 0, scalable: true }); } catch (e) { box.hidden = true; }
  }
  function fit() {
    var wrap = $('.pv', root), sc = $('.pv-scale', root);
    if (!wrap || !sc) return;
    var w = wrap.clientWidth, k = Math.min(1, w / 794);
    sc.style.transform = 'scale(' + k + ')';
    sc.style.height = 'auto';
    wrap.style.height = (sheet.offsetHeight * k) + 'px';
  }

  /* ---------- images: shrink before storing ---------- */
  function shrink(file, max) {
    return new Promise(function (res) {
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var k = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        res(c.toDataURL('image/png'));
      };
      img.onerror = function () { NS.toast('That picture could not be read.', 'bad'); res(''); };
      img.src = url;
    });
  }
  var fontLoaded = {};
  function loadScriptFont(lang) {
    var fam = { hi: 'Noto+Sans+Devanagari', pa: 'Noto+Sans+Gurmukhi' }[lang];
    if (!fam || fontLoaded[lang]) return;
    fontLoaded[lang] = true;
    document.head.appendChild(NS.el('link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=' + fam + ':wght@400;600;700&display=swap' }));
  }

  /* ---------- draft (so a reload never loses typing) ---------- */
  var dkey;
  function saveDraft() { try { localStorage.setItem(dkey, JSON.stringify({ doc: doc, id: editingId })); } catch (e) {} }
  function loadDraft() { try { var j = JSON.parse(localStorage.getItem(dkey) || 'null'); return j && j.doc ? j : null; } catch (e) { return null; } }
  function clearDraft() { try { localStorage.removeItem(dkey); } catch (e) {} }

  /* ---------- save, masters ---------- */
  function key(s) { return String(s || '').trim().toLowerCase(); }
  function upsert(store, match, obj) {
    return NSStore.list(store).then(function (all) {
      var hit = all.filter(match)[0];
      return NSStore.put(store, Object.assign(hit || {}, obj));
    });
  }
  function validate() {
    var t = totals(doc), probs = [];
    if (!doc.seller.name.trim()) probs.push(['s-name', 'Type your business name.']);
    if (!t.rows.length) probs.push(['it-desc-0', 'Add at least one item with a rate.']);
    if (!String(doc.no).trim()) probs.push(['d-no', 'Give this ' + T.name.toLowerCase() + ' a number.']);
    if (String(doc.no).length > 16) probs.push(['d-no', 'GST rules allow up to 16 characters in the number.']);
    if (/[^A-Za-z0-9\/\-]/.test(doc.no)) probs.push(['d-no', 'Use only letters, numbers, / and - in the number.']);
    if (!NS.gstinCheck(doc.seller.gstin).ok) probs.push(['s-gstin', 'Your GSTIN looks wrong.']);
    if (!NS.gstinCheck(doc.buyer.gstin).ok) probs.push(['b-gstin', 'The customer’s GSTIN looks wrong.']);
    if (doc.kind === 'tax' && !doc.seller.gstin) probs.push(['s-gstin', 'A tax invoice needs your GSTIN. If you are not registered, choose "Invoice (not GST registered)" as the type.']);
    return probs;
  }
  function save() {
    var probs = validate();
    if (probs.length) {
      var p = probs[0], f = $('#' + p[0], root);
      NS.toast(p[1], 'bad');
      if (f) { var det = f.closest('details'); if (det) det.open = true; showTab('edit'); f.focus(); }
      return Promise.reject(new Error(p[1]));
    }
    return NSStore.list('doc').then(function (all) {
      var dup = all.filter(function (d) { return d.id !== editingId && d.type === doc.type && key(d.no) === key(doc.no) && NS.fy(d.date) === NS.fy(doc.date) && key(d.seller && d.seller.name) === key(doc.seller.name); })[0];
      if (dup && !confirm('There is already a saved ' + T.name.toLowerCase() + ' ' + doc.no + ' for this business in this financial year. GST rules need a different number for every bill. Save anyway?')) throw new Error('cancel');
    }).then(function () {
      var s = doc.seller, b = doc.buyer, jobs = [];
      jobs.push(upsert('biz', function (x) { return key(x.name) === key(s.name); }, JSON.parse(JSON.stringify(s))));
      if (b.name.trim()) jobs.push(upsert('party', function (x) { return key(x.name) === key(b.name); }, { name: b.name.trim(), addr: b.addr, state: b.state, gstin: b.gstin, phone: b.phone }));
      doc.items.forEach(function (it) {
        if (!it.desc.trim()) return;
        jobs.push(upsert('item', function (x) { return key(x.desc) === key(it.desc); }, { desc: it.desc.trim(), hsn: it.hsn, unit: it.unit, rate: it.rate, gst: it.gst }));
      });
      return Promise.all(jobs);
    }).then(function () {
      var rec = JSON.parse(JSON.stringify(doc));
      rec.total = totals(doc).grand;
      if (editingId) rec.id = editingId;
      return NSStore.put('doc', rec);
    }).then(function (rec) {
      editingId = rec.id; saveDraft();
      NS.toast(T.name + ' ' + doc.no + ' saved.');
      NS.folderWrite(false);
      NS.checkReminder();
      setStatus();
      return rec;
    }).catch(function (e) { if (e.message !== 'cancel') { NS.toast('Could not save: ' + e.message, 'bad'); } throw e; });
  }
  function setStatus() {
    var st = $('#tool-status', root);
    if (st) st.textContent = editingId ? 'Editing saved ' + T.name.toLowerCase() + ' ' + doc.no : 'New ' + T.name.toLowerCase() + ' (not saved yet)';
  }

  function startNew(keepSeller) {
    var seller = keepSeller ? doc.seller : null;
    doc = blank(); editingId = null;
    if (seller) doc.seller = seller;
    fillForm(); suggestNumber(true); draw(); saveDraft(); setStatus();
  }
  function openDoc(rec, asCopy) {
    doc = Object.assign(blank(), JSON.parse(JSON.stringify(rec)));
    delete doc.id; delete doc.created; delete doc.updated; delete doc.total;
    editingId = asCopy ? null : rec.id;
    if (asCopy) { doc.date = NS.today(); doc.due = ''; doc.status = 'unpaid'; }
    fillForm(); if (asCopy) suggestNumber(true); draw(); saveDraft(); setStatus(); showTab('edit');
    window.scrollTo({ top: root.offsetTop - 10, behavior: 'smooth' });
  }

  /* ---------- history ---------- */
  function openHistory() {
    var dlg = $('#ns-history'); if (!dlg) return;
    var list = $('[data-hist-list]', dlg), q = $('[data-hist-q]', dlg);
    function render() {
      NSStore.list('doc').then(function (all) {
        var v = key(q.value);
        var rows = all.filter(function (d) { return d.type === doc.type; }).filter(function (d) {
          return !v || [d.no, d.buyer && d.buyer.name, d.seller && d.seller.name].join(' ').toLowerCase().indexOf(v) >= 0;
        }).sort(function (a, b) { return (b.date || '').localeCompare(a.date || '') || (b.updated || 0) - (a.updated || 0); });
        list.innerHTML = rows.length ? rows.map(function (d) {
          return '<li><div><b class="mono">' + esc(d.no) + '</b> · ' + NS.fmtDate(d.date) + '<br><span>' + esc(d.buyer && d.buyer.name || 'No customer') + '</span> · <b>' + NS.money(d.total || 0) + '</b> <span class="pill ' + (d.status === 'paid' ? 'ok' : '') + '">' + (d.status === 'paid' ? 'Paid' : 'Not paid') + '</span></div>' +
            '<div class="row"><button type="button" class="btn sm" data-h="open" data-id="' + d.id + '">Open</button><button type="button" class="btn sm" data-h="copy" data-id="' + d.id + '">Copy as new</button>' +
            '<button type="button" class="btn sm" data-h="paid" data-id="' + d.id + '">' + (d.status === 'paid' ? 'Mark not paid' : 'Mark paid') + '</button><button type="button" class="btn sm danger" data-h="del" data-id="' + d.id + '">Delete</button></div></li>';
        }).join('') : '<li class="empty">' + (v ? 'Nothing matches your search.' : 'No saved ' + T.name.toLowerCase() + 's yet. Press Save after making one.') + '</li>';
      });
    }
    if (!dlg._wired) {
      dlg._wired = true;
      q.addEventListener('input', render);
      list.addEventListener('click', function (e) {
        var b = e.target.closest('[data-h]'); if (!b) return;
        var id = b.getAttribute('data-id'), act = b.getAttribute('data-h');
        NSStore.get('doc', id).then(function (rec) {
          if (!rec) return;
          if (act === 'open' || act === 'copy') { dlg.close(); openDoc(rec, act === 'copy'); }
          else if (act === 'paid') { rec.status = rec.status === 'paid' ? 'unpaid' : 'paid'; return NSStore.put('doc', rec).then(function () { if (editingId === id) { doc.status = rec.status; fillForm(); draw(); } render(); }); }
          else if (act === 'del' && confirm('Delete ' + T.name.toLowerCase() + ' ' + rec.no + '? This cannot be undone (unless you have a backup file).')) {
            return NSStore.del('doc', id).then(function () { if (editingId === id) { editingId = null; setStatus(); } render(); NS.toast('Deleted.'); });
          }
        });
      });
    }
    render();
    dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', '');
  }

  /* ---------- print, share ---------- */
  function printDoc() {
    var old = document.title;
    document.title = T.name + ' ' + (doc.no || '') + (doc.buyer.name ? ' - ' + doc.buyer.name : '');
    showTab('preview', true);
    fit();
    setTimeout(function () { window.print(); document.title = old; }, 60);
  }
  function shareDoc() {
    var t = totals(doc);
    var txt = T.name + ' ' + doc.no + ' from ' + (doc.seller.name || '') + '\nDate: ' + NS.fmtDate(doc.date) + (doc.due ? '\nDue: ' + NS.fmtDate(doc.due) : '') + '\nAmount: ' + NS.money(t.grand) +
      (doc.seller.upi ? '\nPay by UPI: ' + doc.seller.upi : '') + (doc.seller.bankAcc ? '\nBank: ' + doc.seller.bankName + ' A/c ' + doc.seller.bankAcc + ' IFSC ' + doc.seller.bankIfsc : '');
    if (navigator.share) navigator.share({ title: T.name + ' ' + doc.no, text: txt }).catch(function () {});
    else window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank', 'noopener');
  }

  /* ---------- phone tabs ---------- */
  function showTab(which, quiet) {
    root.setAttribute('data-tab', which);
    $$('[data-tab-btn]', root).forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-tab-btn') === which)); });
    if (!quiet && which === 'preview') fit();
  }

  /* ---------- start ---------- */
  function init() {
    root = $('#tool');
    if (!root) return;
    T = TYPES[root.getAttribute('data-doc')] || TYPES.invoice;
    sheet = $('#sheet', root);
    dkey = 'ns-draft-' + root.getAttribute('data-doc');
    doc = blank();
    buildEditor();
    var dr = loadDraft();
    if (dr) { doc = Object.assign(blank(), dr.doc); editingId = dr.id || null; }
    fillForm(); draw(); setStatus();
    loadScriptFont(doc.lang);
    NSStore.ready().then(function () {
      if (!dr) {
        /* first visit: offer the last business used, as a suggestion only */
        suggestNumber(true);
      }
      NS.checkReminder();
      NSStore.persist().catch(function () {});
      root.classList.add('live');
    });
    $$('[data-tab-btn]', root).forEach(function (b) { b.addEventListener('click', function () { showTab(b.getAttribute('data-tab-btn')); }); });
    $$('[data-do]').forEach(function (b) {
      b.addEventListener('click', function () {
        var a = b.getAttribute('data-do');
        if (a === 'save') save().catch(function () {});
        else if (a === 'print') printDoc();
        else if (a === 'share') shareDoc();
        else if (a === 'new') { if (!editingId && totals(doc).rows.length && !confirm('Start a new ' + T.name.toLowerCase() + '? This one is not saved yet.')) return; startNew(true); }
        else if (a === 'history') openHistory();
      });
    });
    NS.onRestore = function () { if (!editingId) suggestNumber(true); };
    window.addEventListener('resize', fit);
    if (window.ResizeObserver) new ResizeObserver(fit).observe($('.pv', root));
    window.addEventListener('beforeprint', fit);
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save().catch(function () {}); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') { e.preventDefault(); printDoc(); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
